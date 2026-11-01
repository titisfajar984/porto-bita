import { SITE } from '@/content/site'

export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://adinda-portfolio.example'

export const PAGE_TITLE = `${SITE.fullName} — ${SITE.tagline} Portfolio`

export const META_DESCRIPTION: Record<'id' | 'en', string> = {
  id: 'Portofolio Adinda Wira Zahra Tsabitah, lulusan S1 Sistem Informasi — UI/UX, web, mobile, cloud computing, dan keamanan informasi.',
  en: 'Portfolio of Adinda Wira Zahra Tsabitah, an Information Systems graduate — UI/UX, web, mobile, cloud computing and information security.',
}

/** Absolute URL for an asset path, used by the OG/canonical tags. */
export function absoluteUrl(path: string): string {
  return `${SITE_URL.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

/** Keep <html lang>, the document title and the description in sync with the active locale. */
export function applyDocumentLocale(locale: 'id' | 'en'): void {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale
  document.title = PAGE_TITLE
  const description = document.querySelector('meta[name="description"]')
  if (description) description.setAttribute('content', META_DESCRIPTION[locale])
}
