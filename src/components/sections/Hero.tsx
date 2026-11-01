import { Mail } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useI18n } from '@/app/i18n-context'
import { LiquidPortrait } from '@/components/liquid/LiquidPortrait'
import { Navbar } from '@/components/layout/Navbar'
import { Magnetic } from '@/components/motion/Magnetic'
import { Parallax } from '@/components/motion/Parallax'
import { SplitText } from '@/components/motion/SplitText'
import {
  GithubIcon,
  InstagramIcon,
  LinktreeIcon,
} from '@/components/ui/brand-icons'
import { SOCIALS } from '@/content/site'
import { useIsTouch } from '@/hooks/useIsTouch'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const ICONS = {
  instagram: InstagramIcon,
  github: GithubIcon,
  linktree: LinktreeIcon,
  email: Mail,
} as const

export interface HeroProps {
  activeSection: string
  onOpenMenu: () => void
}

/**
 * Hero card (DESIGN.md §7.1).
 *
 * Layer order is load-bearing: gradient + grid + aurora (z0), ghost text (z1),
 * LiquidPortrait (z2), floating chips (z3), copy/nav/social (z4).
 */
export function Hero({ activeSection, onOpenMenu }: HeroProps) {
  const { t } = useI18n()
  const isTouch = useIsTouch()
  const showChips = useMediaQuery('(min-width: 768px)')
  const [interacted, setInteracted] = useState(false)
  const chipHostRef = useRef<HTMLDivElement | null>(null)

  const markInteracted = useCallback(() => setInteracted(true), [])

  // 2.5D chip parallax (DESIGN.md §9.2 M4) — pointer-fine only.
  useEffect(() => {
    const host = chipHostRef.current
    if (!host || isTouch || !showChips) return

    const chips = Array.from(host.querySelectorAll<HTMLElement>('[data-chip-depth]'))
    let frame = 0

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect()
      const px = (event.clientX - rect.left) / rect.width - 0.5
      const py = (event.clientY - rect.top) / rect.height - 0.5
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        for (const chip of chips) {
          const depth = Number(chip.dataset.chipDepth ?? '16')
          chip.style.transform = `translate3d(${(-px * depth).toFixed(1)}px, ${(-py * depth).toFixed(1)}px, 0)`
        }
      })
    }

    host.addEventListener('pointermove', onMove)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      host.removeEventListener('pointermove', onMove)
    }
  }, [isTouch, showChips])

  const density = isTouch ? 0.35 : showChips ? 1 : 0.6

  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] grad-hero card-shadow"
    >
      <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-[18%] h-[420px] w-[420px] rounded-full bg-secondary/45 blur-[80px]"
        style={{ animation: 'hm-breathe 8s ease-in-out infinite' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-[8%] h-[320px] w-[320px] rounded-full bg-brand-200/50 blur-[70px]"
        style={{ animation: 'hm-breathe 11s ease-in-out infinite reverse' }}
      />

      <div className="relative z-30 px-5 pt-5 md:px-8 md:pt-6 lg:px-10">
        <Navbar activeSection={activeSection} onOpenMenu={onOpenMenu} />
      </div>

      <div className="relative z-20 px-5 pb-8 md:px-8 lg:px-10 lg:pb-12">
        {/* Ghost text sits behind the portrait (DESIGN.md §7.1 layer 1). */}
        <Parallax
          distance={70}
          xPercent={6}
          className="pointer-events-none absolute left-1/2 top-[16%] z-0 -translate-x-1/2 lg:top-[12%]"
        >
          <span
            aria-hidden="true"
            className="block whitespace-nowrap text-[clamp(74px,12.4vw,198px)] font-semibold uppercase leading-none tracking-[-0.03em] text-[rgba(11,12,16,.045)] lg:text-[clamp(120px,20vw,320px)]"
          >
            {t.hero.ghost}
          </span>
        </Parallax>

        <div className="relative mx-auto flex w-full max-w-[1360px] flex-col lg:block lg:min-h-[560px]">
          {/* Headline */}
          <h1
            id="hero-heading"
            className="relative z-20 mt-8 text-[clamp(56px,19vw,88px)] font-light uppercase leading-[0.92] tracking-[-0.045em] text-foreground md:mt-10 md:text-[clamp(72px,14vw,128px)] lg:absolute lg:left-0 lg:top-[12%] lg:mt-0 lg:text-[clamp(64px,12.5vw,176px)]"
          >
            <span className="sr-only">
              {t.hero.headlineTop} {t.hero.headlineBottom} — {t.hero.ghost}
            </span>
            <SplitText
              ariaHidden
              lines={[t.hero.headlineTop, t.hero.headlineBottom]}
              immediate
            />
          </h1>

          {/* Portrait — layer 2 */}
          <div className="relative z-10 -mt-4 h-[52svh] min-h-[320px] w-full md:h-[58svh] lg:absolute lg:left-1/2 lg:top-[4%] lg:mt-0 lg:h-[92%] lg:w-[52%] lg:-translate-x-[52%]">
            {/*
              Mobile only: feather the portrait's bottom edge so it dissolves
              into the hero gradient instead of ending on a hard cut
              (DESIGN.md §7.1 mobile, item 3). A mask is used rather than a
              colour-matched overlay so it stays correct over any background.
            */}
            <div className="h-full w-full [-webkit-mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)] lg:[-webkit-mask-image:linear-gradient(to_bottom,#000_90%,transparent_100%)] lg:[mask-image:linear-gradient(to_bottom,#000_90%,transparent_100%)]">
              <LiquidPortrait
                src="/images/adinda-hero.webp"
                mobileSrc="/images/adinda-hero-mobile.webp"
                alt={t.hero.portraitAlt}
                background="#DCE9FF"
                interactive
                strength={isTouch ? 0.8 : 1}
                radius={isTouch ? 120 : 200}
                particleDensity={density}
                particleSpread={isTouch ? 0.8 : 1}
                turbulence={isTouch ? 0.8 : 1}
                liquid={1}
                streaks={!isTouch}
                intro={!isTouch}
                ambient={false}
                onInteract={markInteracted}
              />
            </div>

            {/* Floating chips — layer 3, tablet and up only */}
            {showChips ? (
              <div ref={chipHostRef} className="pointer-events-none absolute inset-0 hidden md:block">
                <span
                  data-chip-depth="18"
                  className="absolute left-[54%] top-[44%] rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-card backdrop-blur"
                >
                  {t.hero.chipGpa}
                </span>
                <span
                  data-chip-depth="28"
                  className="absolute right-[0%] top-[44%] rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-card backdrop-blur"
                >
                  {t.hero.chipProgram}
                </span>
                <span
                  data-chip-depth="12"
                  className="absolute left-[56%] top-[70%] rounded-full border border-white/70 bg-white/70 px-3 py-1.5 text-[11.5px] font-medium text-foreground shadow-card backdrop-blur"
                >
                  {t.hero.chipField}
                </span>
              </div>
            ) : null}

            {/* Interaction hint (PRD H-07) */}
            {!interacted ? (
              <p className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground md:bottom-3">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                  style={{ animation: 'hm-pulse-dot 1.8s ease-in-out infinite' }}
                />
                {isTouch ? t.hero.hintTouch : t.hero.hintPointer}
              </p>
            ) : null}
          </div>

          {/* Role block */}
          <div className="relative z-20 mt-6 lg:absolute lg:bottom-[6%] lg:right-0 lg:mt-0 lg:text-right">
            <p className="text-[clamp(26px,3.4vw,52px)] font-bold uppercase leading-[1.02] tracking-[-0.02em] text-foreground">
              {t.hero.roleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
          </div>

          {/* CTA + intro */}
          <div className="relative z-20 mt-6 flex flex-col gap-5 lg:absolute lg:bottom-[6%] lg:left-0 lg:mt-0 lg:max-w-[340px]">
            <Magnetic className="self-start">
              <a
                href="#contact"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                {t.hero.cta}
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M3 11L11 3M11 3H5M11 3v6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>
            <p className="max-w-[340px] text-[13.5px] leading-relaxed text-muted-foreground">
              {t.hero.intro}
            </p>
          </div>

          {/* Follow Me */}
          <div className="relative z-20 mt-6 lg:absolute lg:right-0 lg:top-0 lg:mt-0 lg:w-[230px]">
            <p className="text-[13px] font-semibold text-foreground">{t.hero.followLabel}</p>
            <p className="mt-1.5 hidden text-[12px] leading-relaxed text-muted-foreground lg:block">
              {t.hero.followDescription}
            </p>
            <ul className="mt-3 flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = ICONS[social.id]
                const external = social.id !== 'email'
                return (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <p className="relative z-20 mt-8 hidden text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground lg:block">
          {t.hero.scrollHint}
        </p>
      </div>
    </section>
  )
}
