import { useEffect, useRef, useState, type RefObject } from 'react'

/**
 * Fire once when the element first enters the viewport (DESIGN.md §9.2 M5).
 *
 * When IntersectionObserver is missing the element counts as already seen,
 * which is resolved in the state initialiser rather than by an effect.
 */
export function useInViewOnce<T extends Element>(
  options: { rootMargin?: string; threshold?: number } = {},
): [RefObject<T | null>, boolean] {
  const { rootMargin = '0px 0px -15% 0px', threshold = 0 } = options
  const ref = useRef<T | null>(null)
  const [seen, setSeen] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const node = ref.current
    if (!node || seen) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true)
            observer.disconnect()
          }
        }
      },
      { rootMargin, threshold },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [rootMargin, threshold, seen])

  return [ref, seen]
}
