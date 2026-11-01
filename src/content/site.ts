/**
 * Identity + contact facts. Every value here comes from `reference/PORTO_BITI.md`
 * (the owner's own source document). Nothing is invented — see AGENT.md §12.
 */

export interface Stat {
  /** Numeric target for the count-up; `null` means "render as-is". */
  value: number | null
  /** Literal fallback for non-numeric stats such as "10+". */
  display: string
  suffix?: string
  decimals?: number
  labelKey: 'gpa' | 'credits' | 'certificates' | 'languages'
}

export interface SocialLink {
  id: 'instagram' | 'github' | 'linktree' | 'email'
  label: string
  href: string
}

export const SITE = {
  fullName: 'Adinda Wira Zahra Tsabitah',
  displayName: 'Adinda Tsabitah',
  shortName: 'Adinda',
  tagline: 'IT Enthusiast',
  education: {
    degree: 'S1 Sistem Informasi',
    university: 'Universitas Pembangunan Nasional "Veteran" Jawa Timur',
  },
  email: 'iamzahrabit@gmail.com',
  /** TODO(confirm): owner approval required before publishing the phone number. */
  phone: '0812 3323 1554',
  location: 'Jawa Timur, Indonesia',
  languages: ['Indonesia', 'English', '한국어'],
} as const

export const SOCIALS: SocialLink[] = [
  { id: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/zhrbit_' },
  { id: 'github', label: 'GitHub', href: 'https://github.com/zhrbit' },
  { id: 'linktree', label: 'Linktree', href: 'https://linktr.ee/iamzahrabit' },
  { id: 'email', label: 'Email', href: `mailto:${SITE.email}` },
]

export const STATS: Stat[] = [
  { value: 3.82, display: '3,82', decimals: 2, labelKey: 'gpa' },
  { value: 149, display: '149', labelKey: 'credits' },
  { value: null, display: '10', suffix: '+', labelKey: 'certificates' },
  { value: 3, display: '3', labelKey: 'languages' },
]

export interface NavItem {
  id: string
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', href: '#home' },
  { id: 'about', href: '#about' },
  { id: 'service', href: '#service' },
  { id: 'experience', href: '#experience' },
  { id: 'portfolio', href: '#portfolio' },
  { id: 'contact', href: '#contact' },
]

/**
 * Open questions that still need the owner's answer (PRD §10, §14). Rendered
 * nowhere in the UI — collected here so the final report can list them.
 */
export const TODO_CONFIRM: string[] = [
  'Periode kuliah, MSIB Bangkit Academy, dan magang Diskominfo Jawa Timur.',
  'Deskripsi & konteks proyek "Laundry S\'patu" (sumber hanya mencantumkan label Desktop).',
  'Kategori proyek AbsentKu — PRD §6.4 menyebut Desktop, deck hal. 7 menandainya UI/UX + Figma (tanpa tautan).',
  'Daftar teknologi per proyek.',
  'Izin menampilkan nomor telepon 0812 3323 1554.',
  'Stat ke-4 pada deck (hal. 4) berlabel TOOLS, sedangkan PRD §6.2 memakai "Bahasa".',
]

export const TODO_ASSET: string[] = [
  'Foto hero cut-out transparan beresolusi tinggi (versi sekarang di-key-out otomatis dari foto studio berlatar putih di PORTO BITI.pdf hal. 1).',
  'File CV PDF untuk tombol "Unduh CV" (belum diaktifkan).',
]
