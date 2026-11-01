import { Link2, Mail } from 'lucide-react'

import { useI18n } from '@/app/i18n-context'
import { Magnetic } from '@/components/motion/Magnetic'
import { Parallax } from '@/components/motion/Parallax'
import { Reveal } from '@/components/motion/Reveal'
import { SITE } from '@/content/site'

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")"

/** Blue CTA card (DESIGN.md §7.7). */
export function CtaCard() {
  const { t } = useI18n()

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] grad-cta card-shadow-lg"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: NOISE }}
      />
      <Parallax distance={40} className="pointer-events-none absolute inset-0" >
        <span
          aria-hidden="true"
          className="absolute -right-24 -top-24 h-[380px] w-[380px] rounded-full border border-white/15"
        />
        <span
          aria-hidden="true"
          className="absolute -bottom-32 left-[-4rem] h-[300px] w-[300px] rounded-full border border-white/12"
        />
      </Parallax>

      <div className="relative mx-auto w-full max-w-[1360px] px-5 py-14 md:px-8 md:py-20 lg:px-12 lg:py-24">
        <Reveal>
          <h2
            id="cta-heading"
            className="max-w-[18ch] text-[clamp(32px,4.6vw,64px)] font-light leading-[1.05] tracking-[-0.03em] text-white"
          >
            {t.cta.heading}
          </h2>
          <p className="mt-5 max-w-[46ch] text-[14.5px] leading-relaxed text-white/75">
            {t.cta.body}
          </p>
        </Reveal>

        <Reveal className="mt-8" delay={0.1}>
          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[13.5px] font-medium text-primary transition-colors hover:bg-brand-50"
              >
                <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
                {t.cta.email}
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="https://linktr.ee/iamzahrabit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[13.5px] font-medium text-white transition-colors hover:bg-white/10"
              >
                <Link2 aria-hidden="true" size={16} strokeWidth={1.5} />
                {t.cta.linktree}
              </a>
            </Magnetic>
            <span className="text-[12px] uppercase tracking-[0.12em] text-white/55">
              {t.cta.thanks}
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
