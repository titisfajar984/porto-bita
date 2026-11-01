/** Shape of every locale file. `id` is the default language (PRD G-02). */

export type Locale = 'id' | 'en'

export interface Dictionary {
  common: {
    skipToContent: string
    loading: string
    viewProject: string
    close: string
    copied: string
    copyEmail: string
    openInNewTab: string
  }
  nav: {
    items: Record<'home' | 'about' | 'service' | 'experience' | 'portfolio' | 'contact', string>
    cta: string
    openMenu: string
    closeMenu: string
    menuLabel: string
    switchTo: string
    switchAria: string
    brandAria: string
  }
  hero: {
    eyebrow: string
    headlineTop: string
    headlineBottom: string
    roleLines: [string, string, string]
    ghost: string
    intro: string
    followLabel: string
    followDescription: string
    cta: string
    hintTouch: string
    hintPointer: string
    scrollHint: string
    portraitAlt: string
    chipGpa: string
    chipProgram: string
    chipField: string
  }
  about: {
    eyebrow: string
    heading: string
    body: string
    readMore: string
    downloadCv: string
    photoAlt: string
    photoChip: string
    modalTitle: string
    modalBody: string[]
  }
  stats: {
    gpa: string
    credits: string
    certificates: string
    languages: string
    languagesNote: string
  }
  services: {
    eyebrow: string
    heading: string
    lead: string
  }
  experience: {
    eyebrow: string
    heading: string
    periodPending: string
  }
  portfolio: {
    eyebrow: string
    heading: string
    lead: string
    filterAll: string
    contextLabel: string
    linksLabel: string
    emptyCategory: string
  }
  credentials: {
    eyebrow: string
    languagesTitle: string
    languagesNote: string
    certificatesTitle: string
    certificatesValue: string
    certificatesBody: string
    learningPathTitle: string
    learningPathBody: string
  }
  cta: {
    heading: string
    body: string
    email: string
    linktree: string
    thanks: string
  }
  footer: {
    ariaLabel: string
    giant: string
    marquee: string[]
    heading: string
    email: string
    linktree: string
    github: string
    crafted: string
    rights: string
    backToTop: string
    backToTopAria: string
  }
}
