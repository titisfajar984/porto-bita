/**
 * LiquidEngine — WebGL2 GPGPU particle engine.
 *
 * NOTE ON PROVENANCE: AGENT.md §5.2 asks for the engine from
 * `reference/liquid-sculpture-hero.tsx`. That file was not supplied with the
 * project, so this is an independent implementation of the same idea rather
 * than an adaptation of the original. The public surface follows §5.2 exactly:
 * it exports `LiquidEngine`, `EngineOptions` and `Rect`.
 *
 * How it works
 *  1. The portrait is rasterised to an offscreen canvas and every opaque pixel
 *     becomes one particle (home position + source colour).
 *  2. Particle state (position + velocity) lives in a pair of RGBA32F textures
 *     that are ping-ponged through a fragment shader — one texel per particle.
 *  3. A second program draws the particles as GL points, or as short GL lines
 *     along their velocity when `streaks` is on.
 *
 * Everything is transform-free and allocation-free per frame.
 */

export interface Rect {
  width: number
  height: number
}

export interface EngineOptions {
  image: HTMLImageElement
  /** Canvas aspect ratio (width / height) at construction time. */
  aspect: number
  /** Hex colour of the card behind the portrait — used for the flat-key fallback. */
  background: string
  interactive: boolean
  strength: number
  radius: number
  particleDensity: number
  particleSpread: number
  turbulence: number
  liquid: number
  streaks: boolean
  intro: boolean
  ambient: boolean
  onContextLost?: () => void
}

interface ParticleData {
  count: number
  texSize: number
  /** Per slot: u, vFromTop, seed, valid. Home positions are derived from this. */
  uv: Float32Array
  color: Float32Array
  initial: Float32Array
}

/**
 * Map image UVs into simulation space, replicating `object-fit: contain;
 * object-position: bottom center` so the particles line up exactly with the
 * static `<img>` fallback instead of stretching across the canvas.
 */
function mapHome(uv: Float32Array, home: Float32Array, aspect: number, imageAspect: number): void {
  let height = 1
  let width = imageAspect
  if (width > aspect) {
    width = aspect
    height = aspect / imageAspect
  }
  const offsetX = (aspect - width) / 2

  for (let slot = 0; slot < uv.length / 4; slot += 1) {
    const o = slot * 4
    if (uv[o + 3] <= 0) {
      home[o] = -10
      home[o + 1] = -10
      home[o + 2] = 0
      home[o + 3] = 0
      continue
    }
    home[o] = offsetX + uv[o] * width
    home[o + 1] = (1 - uv[o + 1]) * height
    home[o + 2] = uv[o + 2]
    home[o + 3] = 1
  }
}

const SIM_VERT = `#version 300 es
in vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

const SIM_FRAG = `#version 300 es
precision highp float;

uniform sampler2D uPosition;
uniform sampler2D uHome;
uniform sampler2D uColor;
uniform float uTime;
uniform float uDt;
uniform vec2 uPointer;
uniform float uPointerActive;
uniform float uPointerDown;
uniform float uRadius;
uniform float uStrength;
uniform float uTurbulence;
uniform float uLiquid;
uniform float uReturn;
uniform float uSpread;
uniform float uIntro;

out vec4 outState;

void main() {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  vec4 state = texelFetch(uPosition, coord, 0);
  vec4 home = texelFetch(uHome, coord, 0);
  vec4 color = texelFetch(uColor, coord, 0);

  if (color.a <= 0.001) {
    outState = vec4(-10.0, -10.0, 0.0, 0.0);
    return;
  }

  vec2 pos = state.xy;
  vec2 vel = state.zw;
  vec2 homePos = home.xy;
  float seed = home.z;

  // Spring back to the sampled pixel.
  vec2 acc = (homePos - pos) * uReturn;

  // Layered sine flow — cheap stand-in for curl noise, seeded per particle.
  float t = uTime * 0.55 + seed * 6.2831853;
  vec2 flow = vec2(
    sin(pos.y * 7.0 + t) + 0.5 * sin(pos.y * 17.3 - t * 1.7),
    cos(pos.x * 6.3 + t * 1.3) + 0.5 * cos(pos.x * 15.1 + t * 1.1)
  );
  acc += flow * 0.0022 * uTurbulence * (0.35 + seed);

  // Intro assemble: a gentle extra pull while the field is still settling.
  // Kept small on purpose — a large multiplier makes the explicit integrator
  // unstable and the particle state diverges to NaN within a few frames.
  if (uIntro > 0.0) {
    acc += (homePos - pos) * uIntro * 0.16;
  }

  // Pointer: outward push + swirl (the "melting" read).
  if (uPointerActive > 0.5) {
    vec2 d = pos - uPointer;
    float dist = length(d);
    if (dist < uRadius) {
      float falloff = 1.0 - dist / uRadius;
      falloff *= falloff;
      vec2 dir = dist > 0.0001 ? d / dist : vec2(0.0, 1.0);
      vec2 swirl = vec2(-dir.y, dir.x);
      acc += (dir * 0.85 + swirl * 0.6 * uLiquid) * falloff * uStrength * 0.075;
      if (uPointerDown > 0.5) {
        acc += dir * falloff * uStrength * 0.06;
      }
    }
  }

  vel += acc * uDt;
  vel *= 0.935;
  // Hard clamps keep the explicit integrator bounded even if the frame rate
  // collapses or a pointer force spikes; without them the state can reach
  // Infinity and every particle renders at NaN.
  vel = clamp(vel, vec2(-0.5), vec2(0.5));
  pos += vel * uDt;
  pos = clamp(pos, vec2(-0.5), vec2(1.5));

  outState = vec4(pos, vel);
}`

const DRAW_VERT = `#version 300 es
in vec2 aParticle;   // x = index, y = 0 head / 1 tail
uniform sampler2D uPosition;
uniform sampler2D uColor;
uniform float uTexSize;
uniform float uAspect;
uniform float uPointSize;
uniform float uStreakScale;
uniform float uMinStreak;
uniform float uOpacity;
out vec4 vColor;

void main() {
  int idx = int(aParticle.x);
  ivec2 coord = ivec2(idx % int(uTexSize), idx / int(uTexSize));
  vec4 state = texelFetch(uPosition, coord, 0);
  vec4 color = texelFetch(uColor, coord, 0);

  vec2 p = state.xy;
  if (aParticle.y > 0.5) {
    // Streaks must never degenerate to a zero-length line — GL implementations
    // are allowed to drop those, which would make the whole portrait vanish
    // once the particles settle.
    vec2 v = state.zw * uStreakScale;
    float len = length(v);
    vec2 dir = len > 0.000001 ? v / len : vec2(0.0, 1.0);
    p -= dir * max(len, uMinStreak);
  }

  gl_Position = vec4(p.x / uAspect * 2.0 - 1.0, p.y * 2.0 - 1.0, 0.0, 1.0);
  gl_PointSize = uPointSize;
  vColor = vec4(color.rgb, color.a * uOpacity);
}`

const DRAW_FRAG = `#version 300 es
precision mediump float;
uniform float uRoundMask;
in vec4 vColor;
out vec4 outColor;

void main() {
  float a = vColor.a;
  // gl_PointCoord is undefined for LINES — masking there would discard the whole
  // streak pass, so the round mask is only applied when drawing points.
  if (uRoundMask > 0.5) {
    vec2 d = gl_PointCoord - 0.5;
    float r = length(d);
    if (r > 0.5) discard;
    // Wide flat core with a short feather. A gradual falloff across the whole
    // sprite leaves only a tiny opaque centre, which reads as a sparse dot
    // cloud instead of the source image.
    a *= smoothstep(0.5, 0.34, r);
  }
  // Premultiplied output — the canvas is created with premultipliedAlpha: true.
  outColor = vec4(vColor.rgb * a, a);
}`

const MAX_DT = 1 / 30
const TARGET_PARTICLES = 90_000

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim()
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0')
  const value = Number.parseInt(full.slice(0, 6), 16)
  if (Number.isNaN(value)) return [1, 1, 1]
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Unable to create shader')
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader) ?? 'unknown shader error'
    gl.deleteShader(shader)
    throw new Error(log)
  }
  return shader
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Rasterise the portrait and turn its opaque pixels into particle attributes. */
function sampleParticles(image: HTMLImageElement, options: EngineOptions): ParticleData {
  const naturalW = image.naturalWidth || image.width
  const naturalH = image.naturalHeight || image.height
  const ratio = naturalW / Math.max(1, naturalH)

  const density = clamp(options.particleDensity, 0.1, 1.5)
  // The sampling grid is deliberately close to the on-screen size of the
  // portrait. A much finer grid would be decimated by `stride` below, which
  // turns the rest state into a sparse dot cloud instead of the photo.
  const gridH = density <= 0.45 ? 380 : density <= 0.75 ? 440 : 500
  const gridW = Math.max(1, Math.round(gridH * ratio))

  const canvas = document.createElement('canvas')
  canvas.width = gridW
  canvas.height = gridH
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) throw new Error('2D context unavailable for particle sampling')

  ctx.clearRect(0, 0, gridW, gridH)
  ctx.drawImage(image, 0, 0, gridW, gridH)
  const { data } = ctx.getImageData(0, 0, gridW, gridH)

  // Does the image carry real transparency, or do we need a flat-key?
  let transparent = 0
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 250) transparent += 1
  }
  const alphaMode = transparent > (data.length / 4) * 0.02
  const [bgR, bgG, bgB] = hexToRgb(options.background)
  const keyTolerance = 0.09

  const xs: number[] = []
  const ys: number[] = []
  for (let y = 0; y < gridH; y += 1) {
    for (let x = 0; x < gridW; x += 1) {
      const i = (y * gridW + x) * 4
      const r = data[i] / 255
      const g = data[i + 1] / 255
      const b = data[i + 2] / 255
      const a = data[i + 3] / 255

      if (alphaMode) {
        if (a < 0.35) continue
      } else {
        const dr = r - bgR
        const dg = g - bgG
        const db = b - bgB
        if (Math.sqrt(dr * dr + dg * dg + db * db) < keyTolerance) continue
        // Also drop near-white studio backdrops.
        if (r > 0.94 && g > 0.94 && b > 0.94) continue
      }
      xs.push(x)
      ys.push(y)
    }
  }

  const available = xs.length
  if (available === 0) throw new Error('No opaque pixels found in the portrait')

  const cap = clamp(Math.round(TARGET_PARTICLES * density), 6_000, 120_000)
  const stride = Math.max(1, Math.floor(available / cap))
  const count = Math.ceil(available / stride)
  const texSize = Math.max(1, Math.ceil(Math.sqrt(count)))

  const home = new Float32Array(texSize * texSize * 4)
  const color = new Float32Array(texSize * texSize * 4)
  const initial = new Float32Array(texSize * texSize * 4)
  const uv = new Float32Array(texSize * texSize * 4)

  for (let slot = 0; slot < count; slot += 1) {
    const src = slot * stride
    const px = xs[src]
    const py = ys[src]
    const i = (py * gridW + px) * 4

    const u = (px + 0.5) / gridW
    const v = (py + 0.5) / gridH

    const o = slot * 4
    uv[o] = u
    uv[o + 1] = v
    uv[o + 2] = Math.random()
    uv[o + 3] = 1

    color[o] = data[i] / 255
    color[o + 1] = data[i + 1] / 255
    color[o + 2] = data[i + 2] / 255
    color[o + 3] = alphaMode ? Math.min(1, data[i + 3] / 220) : 1
  }

  mapHome(uv, home, options.aspect, ratio)

  for (let slot = 0; slot < count; slot += 1) {
    const o = slot * 4
    const spread = options.particleSpread
    const angle = Math.random() * Math.PI * 2
    const dist = Math.random() * 0.35 * spread
    initial[o] = home[o] + Math.cos(angle) * dist
    initial[o + 1] = home[o + 1] + Math.sin(angle) * dist
    initial[o + 2] = 0
    initial[o + 3] = 0
  }

  return { count, texSize, uv, color, initial }
}

export class LiquidEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly options: EngineOptions
  private gl: WebGL2RenderingContext | null = null

  private simProgram: WebGLProgram | null = null
  private drawProgram: WebGLProgram | null = null
  private quadBuffer: WebGLBuffer | null = null
  private pointBuffer: WebGLBuffer | null = null
  private lineBuffer: WebGLBuffer | null = null

  private textures: WebGLTexture[] = []
  private homeTexture: WebGLTexture | null = null
  private colorTexture: WebGLTexture | null = null
  private fbos: WebGLFramebuffer[] = []
  private source = 0

  private particles: ParticleData | null = null
  private simUniforms: Record<string, WebGLUniformLocation | null> = {}
  private drawUniforms: Record<string, WebGLUniformLocation | null> = {}

  private rect: Rect = { width: 1, height: 1 }
  private aspect = 1
  private imageAspect = 1
  private dpr = 1
  private pointSize = 2.2

  private rafId = 0
  private lastTime = 0
  private elapsed = 0
  private running = false
  private visible = true
  private destroyed = false

  private pointer = { x: -10, y: -10 }
  private pointerActive = false
  private pointerDown = false

  private introProgress = 0
  private readonly introDuration = 3

  private onLost: ((event: Event) => void) | null = null

  constructor(canvas: HTMLCanvasElement, options: EngineOptions) {
    this.canvas = canvas
    this.options = options

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })

    if (!gl) throw new Error('WebGL2 is not available')
    this.gl = gl
    this.aspect = options.aspect > 0 ? options.aspect : 1

    this.onLost = (event: Event) => {
      event.preventDefault()
      this.stop()
      this.options.onContextLost?.()
    }
    canvas.addEventListener('webglcontextlost', this.onLost)

    this.setup(gl)
  }

  // ---------------------------------------------------------------- setup

  private setup(gl: WebGL2RenderingContext): void {
    if (!this.options.image.complete || this.options.image.naturalWidth === 0) {
      throw new Error('Portrait image is not loaded yet')
    }

    // Float render targets are the whole point of the simulation, and the
    // extension is per-context — requesting it on a probe context does nothing
    // for this one.
    if (!gl.getExtension('EXT_color_buffer_float')) {
      throw new Error('EXT_color_buffer_float is unavailable')
    }

    this.particles = sampleParticles(this.options.image, this.options)
    const { texSize } = this.particles
    this.imageAspect = this.options.image.naturalWidth / Math.max(1, this.options.image.naturalHeight)

    this.simProgram = this.createProgram(gl, SIM_VERT, SIM_FRAG)
    this.drawProgram = this.createProgram(gl, DRAW_VERT, DRAW_FRAG)

    const quad = new Float32Array([-1, -1, 3, -1, -1, 3])
    this.quadBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW)

    const pointData = new Float32Array(this.particles.count * 2)
    for (let i = 0; i < this.particles.count; i += 1) {
      pointData[i * 2] = i
      pointData[i * 2 + 1] = 0
    }
    this.pointBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, pointData, gl.STATIC_DRAW)

    if (this.options.streaks) {
      const lineData = new Float32Array(this.particles.count * 4)
      for (let i = 0; i < this.particles.count; i += 1) {
        lineData[i * 4] = i
        lineData[i * 4 + 1] = 0
        lineData[i * 4 + 2] = i
        lineData[i * 4 + 3] = 1
      }
      this.lineBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, lineData, gl.STATIC_DRAW)
    }

    const homeData = new Float32Array(texSize * texSize * 4)
    mapHome(this.particles.uv, homeData, this.aspect, this.imageAspect)
    this.homeTexture = this.createFloatTexture(gl, texSize, homeData)
    this.colorTexture = this.createFloatTexture(gl, texSize, this.particles.color)

    const initialA = this.particles.initial.slice()
    const initialB = this.particles.initial.slice()
    this.textures = [
      this.createFloatTexture(gl, texSize, initialA),
      this.createFloatTexture(gl, texSize, initialB),
    ]
    this.fbos = this.textures.map((texture) => {
      const fbo = gl.createFramebuffer()
      if (!fbo) throw new Error('Unable to create framebuffer')
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        texture,
        0,
      )
      const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
      if (status !== gl.FRAMEBUFFER_COMPLETE) {
        throw new Error(`Incomplete framebuffer (0x${status.toString(16)})`)
      }
      return fbo
    })
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    this.simUniforms = {
      position: gl.getUniformLocation(this.simProgram, 'uPosition'),
      home: gl.getUniformLocation(this.simProgram, 'uHome'),
      color: gl.getUniformLocation(this.simProgram, 'uColor'),
      time: gl.getUniformLocation(this.simProgram, 'uTime'),
      dt: gl.getUniformLocation(this.simProgram, 'uDt'),
      pointer: gl.getUniformLocation(this.simProgram, 'uPointer'),
      pointerActive: gl.getUniformLocation(this.simProgram, 'uPointerActive'),
      pointerDown: gl.getUniformLocation(this.simProgram, 'uPointerDown'),
      radius: gl.getUniformLocation(this.simProgram, 'uRadius'),
      strength: gl.getUniformLocation(this.simProgram, 'uStrength'),
      turbulence: gl.getUniformLocation(this.simProgram, 'uTurbulence'),
      liquid: gl.getUniformLocation(this.simProgram, 'uLiquid'),
      returnSpeed: gl.getUniformLocation(this.simProgram, 'uReturn'),
      spread: gl.getUniformLocation(this.simProgram, 'uSpread'),
      intro: gl.getUniformLocation(this.simProgram, 'uIntro'),
    }

    this.drawUniforms = {
      position: gl.getUniformLocation(this.drawProgram, 'uPosition'),
      color: gl.getUniformLocation(this.drawProgram, 'uColor'),
      texSize: gl.getUniformLocation(this.drawProgram, 'uTexSize'),
      aspect: gl.getUniformLocation(this.drawProgram, 'uAspect'),
      pointSize: gl.getUniformLocation(this.drawProgram, 'uPointSize'),
      streakScale: gl.getUniformLocation(this.drawProgram, 'uStreakScale'),
      minStreak: gl.getUniformLocation(this.drawProgram, 'uMinStreak'),
      opacity: gl.getUniformLocation(this.drawProgram, 'uOpacity'),
      roundMask: gl.getUniformLocation(this.drawProgram, 'uRoundMask'),
    }

    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
  }

  private createProgram(
    gl: WebGL2RenderingContext,
    vertexSource: string,
    fragmentSource: string,
  ): WebGLProgram {
    const program = gl.createProgram()
    if (!program) throw new Error('Unable to create program')
    const vs = compile(gl, gl.VERTEX_SHADER, vertexSource)
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragmentSource)
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.deleteShader(vs)
    gl.deleteShader(fs)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(program) ?? 'unknown link error'
      gl.deleteProgram(program)
      throw new Error(log)
    }
    return program
  }

  private createFloatTexture(
    gl: WebGL2RenderingContext,
    size: number,
    data: Float32Array,
  ): WebGLTexture {
    const texture = gl.createTexture()
    if (!texture) throw new Error('Unable to create texture')
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      size,
      size,
      0,
      gl.RGBA,
      gl.FLOAT,
      data,
    )
    return texture
  }

  // ------------------------------------------------------------- public API

  /** Resize the drawing buffer. `rect` is the CSS size of the canvas host. */
  resize(rect: Rect, dpr = 1): void {
    const gl = this.gl
    if (!gl || this.destroyed) return
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (this.canvas.width === width && this.canvas.height === height) return
    this.canvas.width = width
    this.canvas.height = height
    this.rect = rect
    this.dpr = dpr
    const nextAspect = rect.width / Math.max(1, rect.height)
    if (Math.abs(nextAspect - this.aspect) > 0.01) {
      this.aspect = nextAspect
      this.refreshHome()
    } else {
      this.aspect = nextAspect
    }
    // Scale the point sprite to the actual drawing-buffer area per particle so
    // the field reads as the source image at rest instead of a sparse dot
    // cloud — and stays solid on high-DPI screens.
    const count = this.particles?.count ?? 1
    this.pointSize = clamp(Math.sqrt((width * height) / count) * 2.1, 2, 10)
    gl.viewport(0, 0, width, height)
  }

  setVisible(visible: boolean): void {
    this.visible = visible
    if (visible) this.start()
    else this.stop()
  }

  /** Re-derive every particle's home position after the canvas aspect changes. */
  private refreshHome(): void {
    const gl = this.gl
    const particles = this.particles
    if (!gl || !particles || !this.homeTexture) return
    const home = new Float32Array(particles.texSize * particles.texSize * 4)
    mapHome(particles.uv, home, this.aspect, this.imageAspect)
    gl.bindTexture(gl.TEXTURE_2D, this.homeTexture)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA32F,
      particles.texSize,
      particles.texSize,
      0,
      gl.RGBA,
      gl.FLOAT,
      home,
    )
  }

  /** Pointer position in CSS pixels, relative to the canvas host. */
  setPointer(x: number, y: number): void {
    if (!this.rect.height) return
    this.pointer.x = x / this.rect.width
    this.pointer.y = 1 - y / this.rect.height
    this.pointerActive = this.options.interactive
  }

  setPointerDown(down: boolean): void {
    this.pointerDown = down
  }

  clearPointer(): void {
    this.pointerActive = false
    this.pointerDown = false
  }

  start(): void {
    if (this.running || this.destroyed || !this.visible) return
    this.running = true
    this.lastTime = 0
    this.rafId = requestAnimationFrame(this.frame)
  }

  stop(): void {
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  /** Restore a lost context by rebuilding every GL resource. */
  restore(): void {
    const canvas = this.canvas
    this.disposeResources()
    this.destroyed = false
    const gl = canvas.getContext('webgl2')
    if (!gl) return
    this.gl = gl
    this.setup(gl)
    this.resize(this.rect, this.dpr)
    this.start()
  }

  destroy(): void {
    this.stop()
    this.destroyed = true
    if (this.onLost) {
      this.canvas.removeEventListener('webglcontextlost', this.onLost)
      this.onLost = null
    }
    this.disposeResources()
    this.gl = null
  }

  private disposeResources(): void {
    const gl = this.gl
    if (!gl) return
    for (const texture of this.textures) gl.deleteTexture(texture)
    if (this.homeTexture) gl.deleteTexture(this.homeTexture)
    if (this.colorTexture) gl.deleteTexture(this.colorTexture)
    for (const fbo of this.fbos) gl.deleteFramebuffer(fbo)
    if (this.quadBuffer) gl.deleteBuffer(this.quadBuffer)
    if (this.pointBuffer) gl.deleteBuffer(this.pointBuffer)
    if (this.lineBuffer) gl.deleteBuffer(this.lineBuffer)
    if (this.simProgram) gl.deleteProgram(this.simProgram)
    if (this.drawProgram) gl.deleteProgram(this.drawProgram)
    this.textures = []
    this.fbos = []
    this.homeTexture = null
    this.colorTexture = null
    this.quadBuffer = null
    this.pointBuffer = null
    this.lineBuffer = null
    this.simProgram = null
    this.drawProgram = null
  }

  // ----------------------------------------------------------------- frame

  private frame = (time: number): void => {
    if (!this.running || this.destroyed) return
    const gl = this.gl
    if (!gl || !this.particles) return

    const seconds = time / 1000
    const dt = this.lastTime ? Math.min(MAX_DT, Math.max(0.0005, seconds - this.lastTime)) : 1 / 60
    this.lastTime = seconds
    this.elapsed += dt

    if (this.options.intro && this.introProgress < 1) {
      this.introProgress = Math.min(1, this.introProgress + dt / this.introDuration)
    }

    this.simulate(gl, dt)
    this.draw(gl)

    this.rafId = requestAnimationFrame(this.frame)
  }

  private simulate(gl: WebGL2RenderingContext, dt: number): void {
    const particles = this.particles
    if (!particles || !this.simProgram) return
    const { texSize } = particles

    const target = 1 - this.source
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbos[target])
    gl.viewport(0, 0, texSize, texSize)
    gl.useProgram(this.simProgram)

    // The simulation pass is a pure replace, not a composite. Leaving the
    // render blend state on would make every frame add its result to the
    // previous state (the alpha channel of the state vector is a velocity, so
    // ONE_MINUS_SRC_ALPHA is ~1) and the particle field explodes.
    gl.disable(gl.BLEND)

    const quadLocation = gl.getAttribLocation(this.simProgram, 'aPos')
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    gl.enableVertexAttribArray(quadLocation)
    gl.vertexAttribPointer(quadLocation, 2, gl.FLOAT, false, 0, 0)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures[this.source])
    gl.uniform1i(this.simUniforms.position, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.homeTexture)
    gl.uniform1i(this.simUniforms.home, 1)

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture)
    gl.uniform1i(this.simUniforms.color, 2)

    const introEase = this.options.intro ? 1 - this.introProgress : 0

    gl.uniform1f(this.simUniforms.time, this.elapsed)
    gl.uniform1f(this.simUniforms.dt, Math.min(1.5, dt * 60))
    gl.uniform2f(
      this.simUniforms.pointer,
      this.pointerActive ? this.pointer.x * this.aspect : -99,
      this.pointerActive ? this.pointer.y : -99,
    )
    gl.uniform1f(this.simUniforms.pointerActive, this.pointerActive ? 1 : 0)
    gl.uniform1f(this.simUniforms.pointerDown, this.pointerDown ? 1 : 0)
    gl.uniform1f(this.simUniforms.radius, this.radiusInSimSpace())
    gl.uniform1f(this.simUniforms.strength, this.options.strength)
    // DESIGN.md §10 wants the portrait to resolve back into the sharp source
    // image when nothing is touching it. A permanent flow field never lets the
    // particles settle — at rest it is damped almost to zero and only comes
    // alive while the pointer is over the portrait.
    const flow = this.options.ambient
      ? this.options.turbulence
      : this.pointerActive
        ? this.options.turbulence
        : this.options.turbulence * 0.05
    gl.uniform1f(this.simUniforms.turbulence, flow)
    gl.uniform1f(this.simUniforms.liquid, this.options.liquid)
    gl.uniform1f(this.simUniforms.returnSpeed, 0.028)
    gl.uniform1f(this.simUniforms.spread, this.options.particleSpread)
    gl.uniform1f(this.simUniforms.intro, introEase)

    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    this.source = target
  }

  private draw(gl: WebGL2RenderingContext): void {
    const particles = this.particles
    if (!particles || !this.drawProgram) return
    const { texSize, count } = particles

    gl.viewport(0, 0, this.canvas.width, this.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(this.drawProgram)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, this.textures[this.source])
    gl.uniform1i(this.drawUniforms.position, 0)

    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, this.colorTexture)
    gl.uniform1i(this.drawUniforms.color, 1)

    gl.uniform1f(this.drawUniforms.texSize, texSize)
    gl.uniform1f(this.drawUniforms.aspect, this.aspect)
    gl.uniform1f(this.drawUniforms.streakScale, 0.35)
    gl.uniform1f(this.drawUniforms.minStreak, 0.0016)
    gl.uniform1f(this.drawUniforms.opacity, 0.95)
    gl.uniform1f(this.drawUniforms.pointSize, this.pointSize)

    const location = gl.getAttribLocation(this.drawProgram, 'aParticle')
    gl.enableVertexAttribArray(location)

    // Points are the base layer and always drawn — a line-only pass can vanish
    // entirely once the particles settle, because a zero-length GL_LINES
    // primitive is allowed to produce no fragments at all.
    if (this.pointBuffer) {
      gl.uniform1f(this.drawUniforms.roundMask, 1)
      gl.uniform1f(this.drawUniforms.opacity, 1)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.pointBuffer)
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.POINTS, 0, count)
    }

    // Optional motion streaks on top (DESIGN.md §10).
    if (this.options.streaks && this.lineBuffer) {
      gl.uniform1f(this.drawUniforms.roundMask, 0)
      gl.uniform1f(this.drawUniforms.opacity, 0.32)
      gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer)
      gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.LINES, 0, count * 2)
    }
  }

  /** The interaction radius is authored in CSS px (DESIGN.md §10) — convert to sim units. */
  private radiusInSimSpace(): number {
    const height = Math.max(1, this.rect.height)
    return clamp(this.options.radius / height, 0.02, 2)
  }

  /** Exposed for the debug panel / tests. */
  get particleCount(): number {
    return this.particles?.count ?? 0
  }

  /** Current point sprite size in drawing-buffer pixels. */
  get pointSizePx(): number {
    return this.pointSize
  }
}
