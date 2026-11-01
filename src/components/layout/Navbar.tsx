import { useEffect, useRef, useState } from 'react'

import { useI18n } from '@/app/i18n-context'
import { NAV_ITEMS, SITE } from '@/content/site'
import { cn } from '@/lib/utils'

export interface NavbarProps {
  activeSection: string
  onOpenMenu: () => void
  className?: string
}

function LanguageToggle({ className }: { className?: string }) {
  const { locale, t, toggleLocale } = useI18n()
  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={`${locale === 'id' ? 'ID' : 'EN'} — ${t.nav.switchAria}`}
      className={cn(
        'inline-flex h-9 items-center rounded-full border border-border bg-card/70 px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground',
        className,
      )}
    >
      <span aria-hidden="true">{locale === 'id' ? 'ID' : 'EN'}</span>
    </button>
  )
}

function NavLinks({
  activeSection,
  className,
  onNavigate,
}: {
  activeSection: string
  className?: string
  onNavigate?: () => void
}) {
  const { t } = useI18n()
  return (
    <ul className={cn('flex items-center gap-6', className)}>
      {NAV_ITEMS.map((item) => {
        const active = activeSection === item.id
        return (
          <li key={item.id}>
            <a
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'group relative inline-block py-1 text-[12.5px] font-medium transition-opacity',
                active ? 'opacity-100' : 'opacity-75 hover:opacity-100',
              )}
            >
              {t.nav.items[item.id as keyof typeof t.nav.items]}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -bottom-0.5 left-0 h-px w-full origin-left bg-primary transition-transform duration-300',
                  active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                )}
              />
            </a>
          </li>
        )
      })}
    </ul>
  )
}

/** Primary navigation rendered inside the hero card (PRD N-01). */
export function Navbar({ activeSection, onOpenMenu, className }: NavbarProps) {
  const { t } = useI18n()

  return (
    <header className={cn('relative z-30 flex items-center justify-between gap-4', className)}>
      <a
        href="#home"
        className="text-sm font-semibold tracking-tight text-foreground md:text-[15px]"
      >
        {SITE.displayName}
      </a>

      <nav aria-label={t.nav.menuLabel} className="hidden lg:block">
        <NavLinks activeSection={activeSection} />
      </nav>

      <div className="flex items-center gap-2">
        <LanguageToggle />
        <a
          href="#contact"
          className="hidden h-9 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary-deep md:inline-flex"
        >
          {t.nav.cta}
        </a>
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label={t.nav.openMenu}
          aria-expanded={false}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card/70 text-foreground backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground lg:hidden"
        >
          <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
            <path
              d="M1 1h16M1 6h16M1 11h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

/**
 * Floating nav pill (PRD N-02 / DESIGN.md §9.2 M18): appears once the hero has
 * scrolled past, hides while scrolling down, returns while scrolling up.
 */
export function NavbarPill({ activeSection }: { activeSection: string }) {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let frame = 0

    const measure = () => {
      frame = 0
      const y = window.scrollY
      const threshold = window.innerHeight * 0.85
      const goingUp = y < lastY.current - 4
      const goingDown = y > lastY.current + 4

      if (y < threshold) {
        setVisible(false)
      } else if (goingUp) {
        setVisible(true)
      } else if (goingDown) {
        setVisible(false)
      }

      lastY.current = y
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 top-4 z-50 hidden justify-center px-4 transition-transform duration-500 lg:flex',
        visible ? 'translate-y-0' : '-translate-y-24',
      )}
      aria-hidden={!visible}
    >
      <nav
        aria-label={t.nav.menuLabel}
        className="flex items-center gap-6 rounded-full border border-white/70 bg-white/70 py-2 pl-6 pr-2 shadow-card backdrop-blur-xl"
      >
        <NavLinks activeSection={activeSection} />
        <a
          href="#contact"
          className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary-deep"
          tabIndex={visible ? 0 : -1}
        >
          {t.nav.cta}
        </a>
      </nav>
    </div>
  )
}
