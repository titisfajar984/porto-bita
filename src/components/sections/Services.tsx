import { ArrowUpRight } from 'lucide-react'

import { useI18n } from '@/app/i18n-context'
import { Marquee } from '@/components/motion/Marquee'
import { Reveal } from '@/components/motion/Reveal'
import { TechOrbit } from '@/components/three/TechOrbit'
import { ORBIT_LABELS, SERVICES, TECH_CHIPS } from '@/content/services'

/** Services card (DESIGN.md §7.3) — numbered list + Tech Orbit 3D + tech marquee. */
export function Services() {
  const { t, locale } = useI18n()

  return (
    <section
      id="service"
      aria-labelledby="services-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] bg-card card-shadow"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end md:gap-10">
          <Reveal className="md:col-span-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
              {t.services.eyebrow}
            </p>
            <h2
              id="services-heading"
              className="mt-4 text-[clamp(28px,3.4vw,48px)] font-medium leading-[1.12] tracking-[-0.02em] text-foreground"
            >
              {t.services.heading}
            </h2>
          </Reveal>
          <Reveal className="md:col-span-5" delay={0.08}>
            <p className="text-[14px] leading-relaxed text-muted-foreground">{t.services.lead}</p>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <ul className="divide-y divide-border border-t border-border">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <div className="group flex items-start gap-5 py-5 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] hover:translate-x-2 lg:py-6">
                    <span className="mt-1 text-[12px] font-medium tabular-nums text-muted-foreground transition-colors group-hover:text-primary">
                      {service.index}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-[19px] font-medium leading-snug text-foreground lg:text-[20px]">
                        {service.title[locale]}
                      </h3>
                      <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-muted-foreground">
                        {service.description[locale]}
                      </p>
                    </div>
                    <ArrowUpRight
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="relative overflow-hidden rounded-[28px] bg-brand-50 p-2">
              <div className="pointer-events-none absolute inset-0 grid-lines" aria-hidden="true" />
              <div className="relative h-[280px] w-full md:h-[360px] lg:h-[520px]">
                <TechOrbit labels={ORBIT_LABELS} />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-10 space-y-3">
          <Marquee duration={40} ariaLabel="Teknologi yang dipakai">
            {TECH_CHIPS.slice(0, 6).map((chip) => (
              <span
                key={chip}
                className="mx-1.5 inline-flex h-8 shrink-0 items-center rounded-full border border-border bg-brand-50 px-3 text-[12px] font-medium text-foreground"
              >
                {chip}
              </span>
            ))}
          </Marquee>
          <Marquee duration={34} reverse ariaLabel="Teknologi yang dipakai (lanjutan)">
            {TECH_CHIPS.slice(6).map((chip) => (
              <span
                key={chip}
                className="mx-1.5 inline-flex h-8 shrink-0 items-center rounded-full border border-border bg-card px-3 text-[12px] font-medium text-foreground"
              >
                {chip}
              </span>
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
