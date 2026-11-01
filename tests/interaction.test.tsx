import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { I18nProvider, useI18n } from '@/app/i18n-context'
import { MobileMenu } from '@/components/layout/MobileMenu'

function LocaleProbe() {
  const { locale, toggleLocale } = useI18n()
  return (
    <button type="button" onClick={toggleLocale}>
      {locale}
    </button>
  )
}

describe('mobile menu', () => {
  it('is absent from the DOM when closed', () => {
    render(
      <I18nProvider>
        <MobileMenu open={false} onClose={vi.fn()} activeSection="home" />
      </I18nProvider>,
    )
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('exposes a modal dialog with every nav destination when open', () => {
    render(
      <I18nProvider>
        <MobileMenu open onClose={vi.fn()} activeSection="about" />
      </I18nProvider>,
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(screen.getAllByRole('link', { name: /home|about|service|experience|portfolio|contact/i }))
      .toHaveLength(6)
  })

  it('closes on Escape', () => {
    const onClose = vi.fn()
    render(
      <I18nProvider>
        <MobileMenu open onClose={onClose} activeSection="home" />
      </I18nProvider>,
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

describe('language toggle', () => {
  it('defaults to Indonesian and flips to English', () => {
    render(
      <I18nProvider>
        <LocaleProbe />
      </I18nProvider>,
    )
    const button = screen.getByRole('button', { name: 'id' })
    fireEvent.click(button)
    expect(screen.getByRole('button', { name: 'en' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')
  })
})
