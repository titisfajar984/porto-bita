import { Suspense, lazy, useEffect, useRef, useState } from 'react'

import { OrbitFallback } from '@/components/three/orbit-fallback'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useLowPower } from '@/hooks/useLowPower'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useWebGL2 } from '@/hooks/useWebGL2'
import { cn } from '@/lib/utils'

const TechOrbitScene = lazy(() =>
  import('@/components/three/TechOrbitScene').then((module) => ({
    default: module.TechOrbitScene,
  })),
)

export interface TechOrbitProps {
  labels: readonly string[]
  className?: string
}

/**
 * Tech Orbit 3D (PRD §7.5 S-02/S-03).
 *
 * three.js only loads when the section is within 200 px of the viewport, and the
 * canvas unmounts again once the section is more than 600 px away so mobile
 * WebGL contexts are released (AGENT.md §8). Everything else falls through to
 * the static SVG illustration.
 */
export function TechOrbit({ labels, className }: TechOrbitProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const [mount, setMount] = useState(false)
  const [active, setActive] = useState(false)

  const capability = useWebGL2()
  const reduced = useReducedMotion()
  const lowPower = useLowPower()
  const isTouch = useIsTouch()
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  const { ref: progressHostRef, progress } = useScrollProgress<HTMLDivElement>()

  const gpuAllowed = capability.probed && capability.webgl2 && capability.floatTargets && !reduced
  const usable = gpuAllowed && !lowPower && !capability.saveData

  const objectCount = isDesktop ? 8 : isTablet ? 6 : 4
  const visibleLabels = labels.slice(0, objectCount)

  useEffect(() => {
    const host = hostRef.current
    if (!host || !usable) {
      setMount(false)
      return
    }

    const near = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setMount(entry.isIntersecting)
          setActive(entry.isIntersecting)
        }
      },
      { rootMargin: '200px 0px' },
    )
    const far = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) setMount(false)
        }
      },
      { rootMargin: '600px 0px' },
    )

    near.observe(host)
    far.observe(host)

    const onVisibility = () => {
      if (document.hidden) setActive(false)
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      near.disconnect()
      far.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [usable])

  return (
    <div ref={hostRef} className={cn('relative h-full w-full', className)}>
      <div ref={progressHostRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
      {usable && mount ? (
        <Suspense fallback={<OrbitFallback labels={visibleLabels} />}>
          <TechOrbitScene
            labels={visibleLabels}
            quality={isDesktop ? 'high' : 'low'}
            showLabels={isDesktop && !isTouch}
            progress={progress}
            active={active}
          />
        </Suspense>
      ) : (
        <OrbitFallback labels={visibleLabels} />
      )}
    </div>
  )
}
