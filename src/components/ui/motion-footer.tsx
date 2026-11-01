import { ArrowUp, Link2, Mail } from 'lucide-react'
import { useCallback, useRef } from 'react'

import { useI18n } from '@/app/i18n-context'
import { Magnetic } from '@/components/motion/Magnetic'
import { Marquee } from '@/components/motion/Marquee'
import { GithubIcon, InstagramIcon } from '@/components/ui/brand-icons'
import { SITE } from '@/content/site'
import { useGsapContext } from '@/hooks/useGsapContext'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { EASE, STAGGER } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

/**
 * CinematicFooter — the navy "curtain" footer.
 *
 * PROVENANCE: AGENT.md §5.1 asks for an adaptation of `reference/motion-footer.tsx`.
 * That file was not supplied with the project, so this is an independent build
 * of the same design rather than a copy. The adaptations §5.1 calls for are all
 * honoured: real copy instead of the demo strings, the owner's links, the navy
 * token override, and the curtain restricted to large fine-pointer viewports.
 *
 * Curtain rules (AGENT.md §5.1 #7): `fixed` + clip-path only on
 * `(min-width: 1024px) and (min-height: 700px)` with a fine pointer. Everything
 * else — phones, tablets, short windows — gets a static, fully scrollable
 * footer using `svh` units.
 */
export function CinematicFooter() {
  const { t } = useI18n()
  const isWide = useMediaQuery('(min-width: 1024px) and (min-height: 700px)')
  const isTouch = useIsTouch()
  const reduced = useReducedMotion()
  const curtain = isWide && !isTouch
  const spacerRef = useRef<HTMLDivElement | null>(null)

  const scopeRef = useGsapContext(
    (scope) => {
      const giant = scope.querySelector<HTMLElement>('[data-footer-giant]')
      const heading = scope.querySelector<HTMLElement>('[data-footer-heading]')
      const actions = scope.querySelectorAll<HTMLElement>('[data-footer-action]')
      const trigger = curtain ? spacerRef.current : scope
      if (!trigger) return

      if (prefersReducedMotion()) {
        gsap.set([giant, heading, ...actions].filter(Boolean), { opacity: 1, y: 0, scale: 1 })
        return
      }

      if (giant) {
        gsap.fromTo(
          giant,
          { yPercent: 12, scale: 0.82, opacity: 0 },
          {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger, start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
          },
        )
      }

      gsap.fromTo(
        [heading, ...actions].filter(Boolean),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: EASE.outExpo,
          stagger: STAGGER.base,
          scrollTrigger: { trigger, start: 'top 85%', once: true },
        },
      )
    },
    [curtain],
  )

  const backToTop = useCallback(() => {
    const target = document.getElementById('home')
    if (!target) return
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [])

  const content = (
    <div className="relative flex h-full min-h-[100svh] flex-col justify-between overflow-hidden px-5 pb-6 pt-14 md:px-8 lg:px-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10"
      />

      <Marquee
        duration={44}
        ariaLabel={t.footer.heading}
        className="pointer-events-none -mx-8 rotate-[-2deg]"
      >
        {t.footer.marquee.map((word) => (
          <span
            key={word}
            className="mx-4 inline-flex items-center gap-4 whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.16em] text-[color:var(--muted-foreground)]"
          >
            {word}
            <span aria-hidden="true" className="text-primary">
              ✦
            </span>
          </span>
        ))}
      </Marquee>

      <div className="relative mt-10 flex flex-1 flex-col justify-center">
        <p
          data-footer-giant
          aria-hidden="true"
          className="select-none bg-gradient-to-b from-white to-white/25 bg-clip-text text-[clamp(72px,17vw,240px)] font-light uppercase leading-[0.86] tracking-[-0.05em] text-transparent"
        >
          {t.footer.giant}
        </p>

        <h2
          data-footer-heading
          className="mt-6 max-w-[16ch] text-[clamp(28px,3.6vw,52px)] font-light leading-[1.08] tracking-[-0.02em] text-[color:var(--foreground)]"
        >
          {t.footer.heading}
        </h2>

        <ul className="mt-8 flex flex-wrap items-center gap-3">
          <li data-footer-action>
            <Magnetic>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-[13.5px] font-medium text-[color:var(--foreground)] backdrop-blur-md transition-colors hover:bg-white/[0.12]"
              >
                <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
                {t.footer.email}
              </a>
            </Magnetic>
          </li>
          <li data-footer-action>
            <Magnetic>
              <a
                href="https://linktr.ee/iamzahrabit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-[13.5px] font-medium text-[color:var(--foreground)] backdrop-blur-md transition-colors hover:bg-white/[0.12]"
              >
                <Link2 aria-hidden="true" size={16} strokeWidth={1.5} />
                {t.footer.linktree}
              </a>
            </Magnetic>
          </li>
          <li data-footer-action>
            <Magnetic>
              <a
                href="https://github.com/zhrbit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-5 text-[13.5px] font-medium text-[color:var(--foreground)] backdrop-blur-md transition-colors hover:bg-white/[0.12]"
              >
                <GithubIcon aria-hidden="true" size={16} />
                {t.footer.github}
              </a>
            </Magnetic>
          </li>
        </ul>
      </div>

      <div className="relative mt-10 flex flex-col gap-4 border-t border-[color:var(--border)] pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-[12px] text-[color:var(--muted-foreground)]">{t.footer.rights}</p>

        <ul className="flex flex-wrap items-center gap-4">
          <li>
            <a
              href="https://www.instagram.com/zhrbit_"
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.footer.crafted} — Instagram`}
              className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
            >
              <InstagramIcon aria-hidden="true" size={14} />
              Instagram
            </a>
          </li>
          <li>
            <a
              href="https://github.com/zhrbit"
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.footer.crafted} — GitHub`}
              className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
            >
              <GithubIcon aria-hidden="true" size={14} />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linktr.ee/iamzahrabit"
              target="_blank"
              rel="noreferrer"
              aria-label={`${t.footer.crafted} — Linktree`}
              className="inline-flex items-center gap-1.5 text-[12px] text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--foreground)]"
            >
              <Link2 aria-hidden="true" size={14} strokeWidth={1.5} />
              Linktree
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-[color:var(--border)] bg-white/[0.04] px-3 py-1.5 text-[11.5px] text-[color:var(--muted-foreground)]">
            {t.footer.crafted}
          </span>
          <button
            type="button"
            onClick={backToTop}
            aria-label={t.footer.backToTopAria}
            className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--border)] bg-white/[0.06] text-[color:var(--foreground)] transition-colors hover:bg-[color:var(--primary)] hover:text-[color:var(--primary-foreground)]"
          >
            <ArrowUp aria-hidden="true" size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <footer
      ref={scopeRef as React.RefObject<HTMLElement>}
      aria-label={t.footer.ariaLabel}
      className={cn('footer-dark bg-background', curtain ? 'relative z-0' : 'relative')}
      data-footer-mode={curtain ? 'curtain' : 'static'}
      data-motion={reduced ? 'reduced' : 'full'}
    >
      {curtain ? (
        <>
          <div className="fixed inset-x-0 bottom-0 z-0 h-[100svh] bg-background">{content}</div>
          <div ref={spacerRef} aria-hidden="true" className="h-[100svh] w-full" />
        </>
      ) : (
        content
      )}
    </footer>
  )
}
