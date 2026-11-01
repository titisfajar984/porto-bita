import { useSyncExternalStore } from 'react'

export interface WebGLCapability {
  /** WebGL2 context could be created. */
  webgl2: boolean
  /** Float render targets are renderable — the particle sim needs this. */
  floatTargets: boolean
  /** Navigator reports Save-Data; we then prefer the static fallback. */
  saveData: boolean
  /** False until the browser-side probe has actually run. */
  probed: boolean
}

const UNSUPPORTED: WebGLCapability = {
  webgl2: false,
  floatTargets: false,
  saveData: false,
  probed: false,
}

function probe(): WebGLCapability {
  if (typeof document === 'undefined') return UNSUPPORTED

  const saveData =
    typeof navigator !== 'undefined' &&
    'connection' in navigator &&
    Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)

  const canvas = document.createElement('canvas')
  let gl: WebGL2RenderingContext | null
  try {
    gl = canvas.getContext('webgl2', { antialias: false, alpha: true, depth: false })
  } catch {
    gl = null
  }
  if (!gl) return { webgl2: false, floatTargets: false, saveData, probed: true }

  let floatTargets: boolean
  try {
    floatTargets = Boolean(gl.getExtension('EXT_color_buffer_float'))
  } catch {
    floatTargets = false
  }

  const lose = gl.getExtension('WEBGL_lose_context')
  lose?.loseContext()

  return { webgl2: true, floatTargets, saveData, probed: true }
}

let cached: WebGLCapability | null = null

function readCapability(): WebGLCapability {
  cached ??= probe()
  return cached
}

function subscribe(): () => void {
  // Hardware capabilities never change during a session, so there is nothing to listen to.
  return () => undefined
}

/**
 * Capability probe, run once per page load and cached at module scope.
 * Exposed through `useSyncExternalStore` so consumers read the real value on
 * their very first render instead of waiting for an effect to push it in.
 */
export function useWebGL2(): WebGLCapability {
  return useSyncExternalStore(subscribe, readCapability, () => UNSUPPORTED)
}
