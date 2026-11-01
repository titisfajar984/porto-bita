import { useCallback, useEffect, useRef, useState } from 'react'

import { LiquidEngine } from '@/components/liquid/liquid-engine'
import { useLowPower } from '@/hooks/useLowPower'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useWebGL2 } from '@/hooks/useWebGL2'
import { CROSSFADE } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

export interface LiquidPortraitProps {
  src: string
  /** Optional dark-theme source (used when an ancestor carries the `dark` class). */
  darkSrc?: string
  /** Narrower/lighter file for phones. */
  mobileSrc?: string
  alt: string
  /** Hex colour of the card behind the portrait — drives the flat-key fallback. */
  background: string
  interactive?: boolean
  strength?: number
  radius?: number
  particleDensity?: number
  particleSpread?: number
  turbulence?: number
  liquid?: number
  streaks?: boolean
  intro?: boolean
  ambient?: boolean
  /** The engine always settles back into the source image (AGENT.md §5.2 #4). */
  restStyle?: 'image'
  className?: string
  /** Fired on the first real pointer/touch interaction (PRD H-07). */
  onInteract?: () => void
}

/**
 * LiquidPortrait — the hero portrait that melts into GPU particles.
 *
 * Fallback ladder (AGENT.md §5.2 #5): no WebGL2 → no float render targets →
 * Save-Data → low-power device → reduced motion → context lost. Any of those
 * ends at a static `<img>` with a light CSS parallax, and never at a console
 * error. `status` is derived rather than stored, so the effect body never has
 * to push a synchronous state update.
 */
export function LiquidPortrait({
  src,
  darkSrc,
  mobileSrc,
  alt,
  background,
  interactive = true,
  strength = 1,
  radius = 200,
  particleDensity = 1,
  particleSpread = 1,
  turbulence = 1,
  liquid = 1,
  streaks = true,
  intro = true,
  ambient = false,
  restStyle = 'image',
  className,
  onInteract,
}: LiquidPortraitProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const engineRef = useRef<LiquidEngine | null>(null)
  const intersectRef = useRef(true)

  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [engineFailed, setEngineFailed] = useState(false)
  const [engineError, setEngineError] = useState<string | null>(null)

  const capability = useWebGL2()
  const reduced = useReducedMotion()
  const lowPower = useLowPower()
  const isPhone = useMediaQuery('(max-width: 767px)')

  const resolvedSrc = isPhone && mobileSrc ? mobileSrc : src
  /** `darkSrc` wins only when the footer/`.dark` token scope actually wraps the hero. */
  const [darkActive] = useState(
    () => typeof document !== 'undefined' && document.querySelector('.dark') !== null,
  )
  const source = darkSrc && darkActive ? darkSrc : resolvedSrc
  const loaded = loadedSrc === source

  const gpuAllowed =
    capability.probed &&
    capability.webgl2 &&
    capability.floatTargets &&
    !capability.saveData &&
    !reduced &&
    !lowPower

  const status = !gpuAllowed || !loaded || engineFailed ? 'off' : 'on'

  // Preload the exact file the engine will sample, then hand it over.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const image = new Image()
    image.decoding = 'async'
    image.src = source
    imageRef.current = image

    if (image.complete && image.naturalWidth > 0) {
      // Deferred so the effect body never performs a synchronous state update.
      queueMicrotask(() => setLoadedSrc(source))
      return
    }

    const onLoad = () => setLoadedSrc(source)
    const onError = () => setEngineFailed(true)
    image.addEventListener('load', onLoad)
    image.addEventListener('error', onError)
    return () => {
      image.removeEventListener('load', onLoad)
      image.removeEventListener('error', onError)
    }
  }, [source])

  // Engine lifecycle.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    const image = imageRef.current
    if (!gpuAllowed || !loaded || !canvas || !wrapper || !image) return

    let engine: LiquidEngine
    try {
      const initialRect = wrapper.getBoundingClientRect()
      if (initialRect.width === 0 || initialRect.height === 0) return
      engine = new LiquidEngine(canvas, {
        image,
        aspect: initialRect.width / initialRect.height,
        background,
        interactive,
        strength,
        radius,
        particleDensity,
        particleSpread,
        turbulence,
        liquid,
        streaks,
        intro,
        ambient,
        onContextLost: () => setEngineFailed(true),
      })
    } catch (error) {
      // No console noise (AGENT.md §14): the reason is surfaced on the wrapper
      // as `data-gl-error` so it stays inspectable.
      const reason = error instanceof Error ? error.message : 'unknown engine error'
      queueMicrotask(() => {
        setEngineError(reason)
        setEngineFailed(true)
      })
      return
    }

    engineRef.current = engine

    const measure = () => {
      const rect = wrapper.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      engine.resize(
        { width: rect.width, height: rect.height },
        Math.min(window.devicePixelRatio || 1, 2),
      )
      wrapper.dataset.particles = String(engine.particleCount)
      wrapper.dataset.pointSize = engine.pointSizePx.toFixed(2)
    }
    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(wrapper)

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          intersectRef.current = entry.isIntersecting
          engine.setVisible(entry.isIntersecting && !document.hidden)
        }
      },
      { rootMargin: '120px 0px' },
    )
    intersectionObserver.observe(wrapper)

    const onVisibility = () => {
      engine.setVisible(!document.hidden && intersectRef.current)
    }
    document.addEventListener('visibilitychange', onVisibility)

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotionChange = () => {
      if (motionQuery.matches) setEngineFailed(true)
    }
    motionQuery.addEventListener('change', onMotionChange)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      motionQuery.removeEventListener('change', onMotionChange)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      engine.destroy()
      engineRef.current = null
    }
  }, [
    gpuAllowed,
    loaded,
    background,
    interactive,
    strength,
    radius,
    particleDensity,
    particleSpread,
    turbulence,
    liquid,
    streaks,
    intro,
    ambient,
  ])

  const interactedRef = useRef(false)
  const markInteraction = useCallback(() => {
    if (interactedRef.current) return
    interactedRef.current = true
    onInteract?.()
  }, [onInteract])

  const pointerPosition = (event: React.PointerEvent<HTMLDivElement>) => {
    const wrapper = wrapperRef.current
    if (!wrapper) return null
    const rect = wrapper.getBoundingClientRect()
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const engine = engineRef.current
    if (!engine || !interactive) return
    const point = pointerPosition(event)
    if (!point) return
    engine.setPointer(point.x, point.y)
    markInteraction()
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const engine = engineRef.current
    if (!engine || !interactive) return
    const point = pointerPosition(event)
    if (point) engine.setPointer(point.x, point.y)
    engine.setPointerDown(true)
    markInteraction()
  }

  const handlePointerUp = () => {
    engineRef.current?.setPointerDown(false)
  }

  const handlePointerLeave = () => {
    engineRef.current?.clearPointer()
    engineRef.current?.setPointerDown(false)
  }

  return (
    <div
      ref={wrapperRef}
      className={cn('relative isolate h-full w-full', className)}
      data-gl={status}
      data-gl-error={engineError ?? undefined}
      data-rest-style={restStyle}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerLeave}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: 'pan-y' }}
    >
      {/*
        The accessible copy of the portrait lives here and stays in the DOM in
        every state (DESIGN.md §10). The canvas above it is aria-hidden.
      */}
      <img
        src={source}
        alt={alt}
        width={1120}
        height={1400}
        decoding="async"
        fetchPriority="high"
        draggable={false}
        className={cn(
          'pointer-events-none absolute inset-0 h-full w-full select-none object-contain object-bottom transition-opacity',
          status === 'on' ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          transitionDuration: `${CROSSFADE}s`,
          transform: 'translate3d(0, var(--liquid-parallax, 0px), 0)',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 h-full w-full transition-opacity',
          status === 'on' ? 'opacity-100' : 'opacity-0',
        )}
        style={{ transitionDuration: `${CROSSFADE}s` }}
      />
    </div>
  )
}
