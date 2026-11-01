import { useI18n } from '@/app/i18n-context'
import { Reveal } from '@/components/motion/Reveal'
import { EXPERIENCE } from '@/content/experience'
import { useGsapContext } from '@/hooks/useGsapContext'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

/** Experience card (DESIGN.md §7.4) — sticky heading + scrubbed timeline. */
export function Experience() {
  const { t, locale } = useI18n()

  const scopeRef = useGsapContext((scope) => {
    const line = scope.querySelector<HTMLElement>('[data-timeline-line]')
    const dots = scope.querySelectorAll<HTMLElement>('[data-timeline-dot]')
    if (!line) return

    if (prefersReducedMotion()) {
      gsap.set(line, { scaleY: 1 })
      gsap.set(dots, { backgroundColor: 'var(--primary)' })
      return
    }

    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        transformOrigin: 'top center',
        scrollTrigger: {
          trigger: scope,
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: true,
        },
      },
    )

    for (const dot of dots) {
      gsap.to(dot, {
        backgroundColor: 'var(--primary)',
        scale: 1.35,
        duration: 0.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: dot, start: 'top 75%', toggleActions: 'play none none reverse' },
      })
    }
  }, [])

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] bg-card card-shadow"
    >
      <div
        ref={scopeRef as React.RefObject<HTMLDivElement>}
        className="mx-auto w-full max-w-[1360px] px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20"
      >
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
                {t.experience.eyebrow}
              </p>
              <h2
                id="experience-heading"
                className="mt-4 text-[clamp(28px,3.4vw,48px)] font-medium leading-[1.12] tracking-[-0.02em] text-foreground"
              >
                {t.experience.heading}
              </h2>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative pl-6 md:pl-8">
              <span
                aria-hidden="true"
                className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px bg-border md:left-1"
              />
              <span
                aria-hidden="true"
                data-timeline-line
                className="absolute left-0 top-2 h-[calc(100%-1rem)] w-px origin-top bg-primary md:left-1"
              />
              <ol className="space-y-10">
                {EXPERIENCE.map((item) => (
                  <li key={item.id} className="relative">
                    <span
                      aria-hidden="true"
                      data-timeline-dot
                      className="absolute -left-6 top-2 h-2.5 w-2.5 rounded-full bg-border md:-left-8"
                    />
                    <Reveal>
                      <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                        {item.period ?? t.experience.periodPending}
                      </p>
                      <h3 className="mt-2 text-[18px] font-medium leading-snug text-foreground">
                        {item.institution}
                      </h3>
                      <p className="mt-1 text-[14px] font-medium text-primary">
                        {item.role[locale]}
                      </p>
                      <p className="mt-2 max-w-[60ch] text-[14px] leading-relaxed text-muted-foreground">
                        {item.description[locale]}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {item.chips.map((chip) => (
                          <li
                            key={chip}
                            className="inline-flex h-7 items-center rounded-full border border-border bg-brand-50 px-3 text-[11.5px] font-medium text-foreground"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
