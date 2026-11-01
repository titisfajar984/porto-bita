import { ArrowUpRight } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useI18n } from '@/app/i18n-context'
import { Reveal } from '@/components/motion/Reveal'
import { TiltCard } from '@/components/motion/TiltCard'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog'
import { PROJECTS, PROJECT_CATEGORIES, type Project, type ProjectCategory } from '@/content/projects'
import { cn } from '@/lib/utils'

type Filter = ProjectCategory | 'all'

/** Portfolio block (DESIGN.md §7.5) — dark project cards + detail dialog. */
export function Portfolio() {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<Project | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((project) => project.category === filter)),
    [filter],
  )

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-heading"
      className="anchor-offset relative rounded-[var(--radius-card)] bg-page py-12 md:py-16 lg:py-20"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 md:px-8 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary">
              {t.portfolio.eyebrow}
            </p>
            <h2
              id="portfolio-heading"
              className="mt-4 max-w-[20ch] text-[clamp(28px,3.4vw,48px)] font-medium leading-[1.12] tracking-[-0.02em] text-foreground"
            >
              {t.portfolio.heading}
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[38ch] text-[13px] leading-relaxed text-muted-foreground md:text-right">
              {t.portfolio.lead}
            </p>
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {(['all', ...PROJECT_CATEGORIES] as Filter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              aria-pressed={filter === item}
              className={cn(
                'inline-flex h-9 items-center rounded-full border px-4 text-[12.5px] font-medium transition-colors',
                filter === item
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-foreground hover:border-primary/40 hover:text-primary',
              )}
            >
              {item === 'all' ? t.portfolio.filterAll : item}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="mt-10 text-[14px] text-muted-foreground">{t.portfolio.emptyCategory}</p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
            {visible.map((project, index) => (
              <li key={project.slug}>
                <Reveal delay={(index % 2) * 0.12}>
                  <TiltCard>
                    <button
                      type="button"
                      data-cursor="project"
                      onClick={() => setSelected(project)}
                      className="group relative block w-full overflow-hidden rounded-[22px] bg-ink-card text-left"
                    >
                      <span className="relative block aspect-4/3 overflow-hidden">
                        <img
                          src={project.cover}
                          alt={`Pratinjau proyek ${project.title}`}
                          width={1200}
                          height={900}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105"
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 project-overlay opacity-90 transition-opacity duration-500 group-hover:opacity-100"
                        />
                      </span>

                      <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur transition-transform duration-500 -rotate-45 group-hover:rotate-0 group-hover:-translate-y-0.5">
                        <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.5} />
                      </span>

                      <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
                        <span className="min-w-0">
                          <span className="block truncate text-[16px] font-medium text-white lg:text-[18px]">
                            {project.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-white/70">
                            {project.category}
                          </span>
                        </span>
                        <span className="shrink-0 text-right text-[12.5px] text-white/75">
                          {project.context[locale]}
                        </span>
                      </span>
                    </button>
                  </TiltCard>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => (open ? undefined : setSelected(null))}>
        <DialogContent className="p-0">
          {selected ? (
            <div className="flex max-h-[92svh] flex-col overflow-y-auto">
              <img
                src={selected.cover}
                alt={`Pratinjau proyek ${selected.title}`}
                width={1200}
                height={900}
                className="w-full object-cover"
              />
              <div className="p-6 md:p-8">
                <DialogTitle>{selected.title}</DialogTitle>
                <DialogDescription className="sr-only">
                  {selected.summary[locale]}
                </DialogDescription>
                <p className="mt-2 text-[12px] font-medium uppercase tracking-[0.1em] text-primary">
                  {selected.category} · {selected.context[locale]}
                </p>
                <p className="mt-4 text-[14.5px] leading-relaxed text-muted-foreground">
                  {selected.summary[locale]}
                </p>

                {selected.links.length > 0 ? (
                  <div className="mt-6">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {t.portfolio.linksLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {selected.links.map((link) => (
                        <Button key={link.href} asChild size="sm">
                          <a href={link.href} target="_blank" rel="noreferrer">
                            {link.label}
                            <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.5} />
                            <span className="sr-only"> ({t.common.openInNewTab})</span>
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : null}

                {selected.needsConfirm && selected.needsConfirm.length > 0 ? (
                  <ul className="mt-6 space-y-1.5 rounded-2xl bg-brand-50 p-4 text-[12.5px] leading-relaxed text-muted-foreground">
                    {selected.needsConfirm.map((note) => (
                      <li key={note}>TODO(confirm) — {note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
