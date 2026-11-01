import { useI18n } from '@/app/i18n-context'
import { Reveal } from '@/components/motion/Reveal'
import { SITE } from '@/content/site'
import { TESTIMONIALS } from '@/content/testimonials'

/**
 * Credentials card (DESIGN.md §7.6).
 *
 * Testimonials only render when there is real data — PRD §6.5 is explicit that
 * inventing quotes is not allowed, so with the empty default this section shows
 * languages, certificates and the learning path instead.
 */
export function Credentials() {
  const { t } = useI18n()
  const hasTestimonials = TESTIMONIALS.length > 0

  return (
    <section
      aria-labelledby="credentials-heading"
      className="anchor-offset relative overflow-hidden rounded-[var(--radius-card)] bg-card card-shadow"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 py-12 md:px-8 md:py-16 lg:px-12 lg:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
          {t.credentials.eyebrow}
        </p>
        <h2 id="credentials-heading" className="sr-only">
          {t.credentials.eyebrow}
        </h2>

        {hasTestimonials ? null : (
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-4">
              <h3 className="text-[16px] font-medium text-foreground">
                {t.credentials.languagesTitle}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SITE.languages.map((language) => (
                  <li
                    key={language}
                    className="inline-flex h-8 items-center rounded-full border border-border bg-brand-50 px-3.5 text-[12.5px] font-medium text-foreground"
                  >
                    {language}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                {t.credentials.languagesNote}
              </p>
            </Reveal>

            <Reveal className="md:col-span-4" delay={0.08}>
              <h3 className="text-[16px] font-medium text-foreground">
                {t.credentials.certificatesTitle}
              </h3>
              <p className="mt-2 text-[clamp(48px,6vw,84px)] font-light leading-none tracking-[-0.03em] text-foreground tabular-nums">
                {t.credentials.certificatesValue}
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
                {t.credentials.certificatesBody}
              </p>
            </Reveal>

            <Reveal className="md:col-span-4" delay={0.16}>
              <h3 className="text-[16px] font-medium text-foreground">
                {t.credentials.learningPathTitle}
              </h3>
              <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-[13.5px] leading-relaxed text-muted-foreground">
                {t.credentials.learningPathBody}
              </p>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  )
}
