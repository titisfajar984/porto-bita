import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'

import { I18nProvider } from '@/app/i18n-context'
import { OrbitFallback } from '@/components/three/orbit-fallback'
import { About } from '@/components/sections/About'
import { Credentials } from '@/components/sections/Credentials'
import { Portfolio } from '@/components/sections/Portfolio'
import { ORBIT_LABELS } from '@/content/services'

function renderWithProviders(node: ReactNode) {
  return render(<I18nProvider>{node}</I18nProvider>)
}

describe('section rendering', () => {
  it('renders the About heading and all four stat labels', () => {
    renderWithProviders(<About />)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/rasa ingin tahu/i)
    for (const label of ['IPK', 'SKS', 'Sertifikat', 'Bahasa']) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('renders six project cards with an accessible name each', () => {
    renderWithProviders(<Portfolio />)
    const cards = screen.getAllByRole('button', { name: /pratinjau proyek/i })
    expect(cards).toHaveLength(6)
  })

  it('does not render a testimonials block while the data set is empty', () => {
    renderWithProviders(<Credentials />)
    expect(screen.queryByText(/testimonial/i)).not.toBeInTheDocument()
    expect(screen.getByText('10+')).toBeInTheDocument()
  })

  it('renders every orbit label in the static fallback', () => {
    renderWithProviders(<OrbitFallback labels={ORBIT_LABELS.slice(0, 6)} />)
    for (const label of ORBIT_LABELS.slice(0, 6)) {
      expect(screen.getByText(label.toUpperCase())).toBeInTheDocument()
    }
  })
})
