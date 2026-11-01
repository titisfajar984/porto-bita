import { useState } from 'react'

import { useI18n } from '@/app/i18n-context'
import { CountUp } from '@/components/motion/CountUp'
import { Reveal } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { SITE, STATS } from '@/content/site'
import { TODO_ASSET } from '@/content/site'
import { cn } from '@/lib/utils'

/** About card (DESIGN.md §7.2) — photo with clip reveal + tilt, copy, stats. */
export function About() {
  const { t } = useI18n()
  const [profileOpen, setProfileOpen] = useState(false)

  const hasCv = false // TODO(asset): no CV file supplied yet.

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] grad-about card-shadow"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <Reveal className="md:col-span-12 lg:col-span-5">
            <TiltCard className="relative">
              <div className="relative overflow-hidden rounded-[24px] bg-brand-100 shadow-card">
                <img
                  src="/images/adinda-about-1024.webp"
                  srcSet="/images/adinda-about-640.webp 640w, /images/adinda-about-1024.webp 1024w, /images/adinda-about-1600.webp 1600w"
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 90vw, 92vw"
                  alt={t.about.photoAlt}
                  width={1024}
                  height={819}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <span className="absolute bottom-3 left-3 rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur">
                  {t.about.photoChip}
                </span>
              </div>
            </TiltCard>
          </Reveal>

          <div className="md:col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
                {t.about.eyebrow}
              </p>
              <h2
                id="about-heading"
                className="mt-4 text-[clamp(28px,3.4vw,48px)] font-medium leading-[1.12] tracking-[-0.02em] text-foreground"
              >
                {t.about.heading}
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground">
                {t.about.body}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button type="button" onClick={() => setProfileOpen(true)}>
                  {t.about.readMore}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={!hasCv}
                  title={hasCv ? undefined : TODO_ASSET[1]}
                >
                  {t.about.downloadCv}
                </Button>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-12 lg:mt-16">
          <dl className="grid grid-cols-2 gap-y-8 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.labelKey}
                className={cn(
                  'flex flex-col-reverse',
                  index > 0 && 'md:border-l md:border-border md:pl-6 lg:pl-8',
                )}
              >
                <dt className="mt-2 text-[12px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {t.stats[stat.labelKey]}
                </dt>
                <dd className="text-[clamp(48px,6vw,84px)] font-light leading-none tracking-[-0.03em] text-foreground">
                  {stat.value === null ? (
                    <span className="inline-flex items-baseline tabular-nums">
                      {stat.display}
                      {stat.suffix ? <span aria-hidden="true">{stat.suffix}</span> : null}
                    </span>
                  ) : (
                    <CountUp
                      to={stat.value}
                      decimals={stat.decimals ?? 0}
                      suffix={stat.suffix ?? ''}
                    />
                  )}
                  {stat.labelKey === 'languages' ? (
                    <span className="mt-1 block text-[12px] font-normal text-muted-foreground">
                      {t.stats.languagesNote}
                    </span>
                  ) : null}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="p-6 md:p-8">
          <DialogTitle>{t.about.modalTitle}</DialogTitle>
          <DialogDescription className="sr-only">{t.about.heading}</DialogDescription>
          <div className="mt-4 max-h-[60svh] space-y-4 overflow-y-auto pr-1 text-[14.5px] leading-relaxed text-muted-foreground">
            {t.about.modalBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="text-[13px]">
              <span className="font-medium text-foreground">{SITE.fullName}</span> ·{' '}
              {SITE.education.degree} · {SITE.education.university}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
