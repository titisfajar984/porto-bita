import { useEffect, useRef } from 'react'

import { useI18n } from '@/app/i18n-context'
import { NAV_ITEMS, SITE, SOCIALS } from '@/content/site'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import { useFocusTrap } from '@/hooks/useFocusTrap'
import { gsap, prefersReducedMotion, registerGsap } from '@/lib/gsap'
import { EASE, STAGGER } from '@/lib/motion-tokens'
import { cn } from '@/lib/utils'

export interface MobileMenuProps {
  open: boolean
  onClose: () => void
  activeSection: string
}

/**
 * Full-screen mobile menu (PRD N-04): focus trap, Esc to close, body scroll
 * locked, links staggered in. Rendered as a modal dialog so assistive tech
 * announces it correctly (AGENT.md §11).
 */
export function MobileMenu({ open, onClose, activeSection }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const { t } = useI18n()

  useBodyScrollLock(open)
  useFocusTrap(panelRef, open)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    const panel = panelRef.current
    if (!panel || !open) return
    registerGsap()

    const ctx = gsap.context(() => {
      const links = panel.querySelectorAll('[data-menu-item]')
      if (prefersReducedMotion()) {
        gsap.fromTo(links, { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.03 })
        return
      }
      gsap.fromTo(
        links,
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: EASE.outExpo, stagger: STAGGER.tight },
      )
    }, panel)

    return () => ctx.revert()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[80] lg:hidden">
      <button
        type="button"
        aria-label={t.nav.closeMenu}
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-card/40 backdrop-blur-sm"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.nav.menuLabel}
        className="absolute inset-x-0 top-0 max-h-[100svh] overflow-y-auto rounded-b-[32px] bg-brand-50 px-6 pb-10 pt-6 shadow-card-lg"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {SITE.displayName}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.nav.closeMenu}
            className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8" aria-label={t.nav.menuLabel}>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.id
              return (
                <li key={item.id} data-menu-item>
                  <a
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? 'true' : undefined}
                    className={cn(
                      'flex items-center gap-3 py-2 text-4xl font-light tracking-tight transition-colors',
                      active ? 'text-primary' : 'text-foreground hover:text-primary',
                    )}
                  >
                    {t.nav.items[item.id as keyof typeof t.nav.items]}
                    {active ? (
                      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-primary" />
                    ) : null}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div data-menu-item className="mt-8 space-y-3 border-t border-border pt-6">
          <a
            href={`mailto:${SITE.email}`}
            className="block text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            {SITE.email}
          </a>
          <ul className="flex flex-wrap gap-2">
            {SOCIALS.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target={social.id === 'email' ? undefined : '_blank'}
                  rel={social.id === 'email' ? undefined : 'noreferrer'}
                  className="inline-flex h-9 items-center rounded-full border border-border bg-card/70 px-3 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
