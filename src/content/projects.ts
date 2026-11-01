/**
 * Project catalogue (PRD §6.4). Text is taken verbatim in substance from
 * `reference/PORTO_BITI.md`; `needsConfirm` entries are open questions, never
 * invented facts.
 */

export type ProjectCategory = 'UI/UX' | 'Web' | 'Mobile' | 'Desktop'

export interface ProjectLink {
  label: string
  href: string
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  context: { id: string; en: string }
  summary: { id: string; en: string }
  links: ProjectLink[]
  cover: string
  year?: number
  needsConfirm?: string[]
}

export const PROJECTS: Project[] = [
  {
    slug: 'skego-mobile',
    title: 'SKEGO Mobile',
    category: 'Mobile',
    context: {
      id: 'Capstone — MSIB Bangkit Academy',
      en: 'Capstone — MSIB Bangkit Academy',
    },
    summary: {
      id: 'Aplikasi mobile pengelola tugas cerdas yang membantu pelajar memprioritaskan tugas, merencanakan secara cerdas, dan tetap produktif tanpa membuang waktu.',
      en: 'A smart task-management mobile app that helps students prioritise work, plan intelligently and stay productive without wasting time.',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/Capstone-Project-SKEGO-App' }],
    cover: '/projects/skego-mobile.webp',
  },
  {
    slug: 'catering-nabila',
    title: 'Catering Nabila',
    category: 'UI/UX',
    context: {
      id: 'Mata Kuliah Analisis Desain Sistem Informasi',
      en: 'Course: Information Systems Design Analysis',
    },
    summary: {
      id: 'Aplikasi pesan antar makanan dengan fitur inovatif perhitungan nutrisi dan rekomendasi menu berbasis aplikasi mobile.',
      en: 'A food-delivery app with innovative nutrition calculation and menu recommendation features, designed for mobile.',
    },
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/BMzt1LtcW9bsnrMkGVueI7/Catering-Nabila?node-id=0-1&t=pjEV8lYwLYYa7kHk-1',
      },
    ],
    cover: '/projects/catering-nabila.webp',
  },
  {
    slug: 'repair-ranger',
    title: 'Repair Ranger',
    category: 'UI/UX',
    context: { id: 'Mata Kuliah E-Business', en: 'Course: E-Business' },
    summary: {
      id: 'Platform praktis dan hemat biaya yang menghubungkan pengguna dengan penyedia jasa tukang di Indonesia; memudahkan pencarian tukang sesuai kategori.',
      en: 'A practical, low-cost platform connecting users with handyman service providers in Indonesia; makes finding a handyman by category easy.',
    },
    links: [
      {
        label: 'Figma',
        href: 'https://www.figma.com/design/MU6QhcJgsOdxhLO1n9aFFG/E-BUSS-TUKANG?node-id=0-1&t=ZRQDeD62kZyN8A5y-1',
      },
    ],
    cover: '/projects/repair-ranger.webp',
  },
  {
    slug: 'tap-on-mi',
    title: 'Tap-On Mi',
    category: 'Web',
    context: { id: 'Mata Kuliah Pemrograman Website', en: 'Course: Web Programming' },
    summary: {
      id: 'Website game Tower Block yang dirancang ulang dengan menu penjelas game dan tampilan yang senada dengan menu.',
      en: 'A Tower Block game website redesigned with an explanatory menu and a visual style that matches it.',
    },
    links: [{ label: 'GitHub', href: 'https://github.com/zhrbit/Tap-On-Mi-Game' }],
    cover: '/projects/tap-on-mi.webp',
  },
  {
    slug: 'absentku',
    title: 'AbsentKu',
    category: 'Desktop',
    context: {
      id: 'Mata Kuliah Interaksi Manusia Komputer',
      en: 'Course: Human-Computer Interaction',
    },
    summary: {
      id: 'Aplikasi absensi TK dengan akses untuk guru dan wali murid; wali murid dapat memantau perkembangan anak di sekolah secara real-time.',
      en: 'A kindergarten attendance app with separate access for teachers and parents; parents can follow their child’s progress at school in real time.',
    },
    links: [],
    cover: '/projects/absentku.webp',
    needsConfirm: [
      'Kategori: PRD §6.4 menyebut Desktop, deck hal. 7 menandainya UI/UX.',
      'Tautan Figma belum tersedia di sumber.',
    ],
  },
  {
    slug: 'laundry-spatu',
    title: "Laundry S'patu",
    category: 'Desktop',
    context: { id: 'TODO(confirm)', en: 'TODO(confirm)' },
    summary: {
      id: 'Aplikasi desktop untuk mengelola layanan laundry — pendataan layanan, absensi teknisi, kasir, dan laporan transaksi.',
      en: 'A desktop application for running a laundry service — service records, technician attendance, cashier and transaction reports.',
    },
    links: [],
    cover: '/projects/laundry-spatu.webp',
    needsConfirm: [
      'Deskripsi dan konteks mata kuliah belum ada di sumber; ringkasan di atas diturunkan dari tangkapan layar aplikasi di deck hal. 6.',
    ],
  },
]

export const PROJECT_CATEGORIES: ProjectCategory[] = ['UI/UX', 'Web', 'Mobile', 'Desktop']

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug)
}
