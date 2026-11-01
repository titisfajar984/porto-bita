/**
 * The five services (PRD §6.3). Each one is derived from real experience listed
 * in `reference/PORTO_BITI.md` — no invented capabilities. Descriptions are at
 * most two sentences.
 */

export interface Service {
  id: string
  index: string
  title: { id: string; en: string }
  description: { id: string; en: string }
  /** Short label used by the 3D orbit and the tech marquee. */
  tag: string
}

export const SERVICES: Service[] = [
  {
    id: 'uiux',
    index: '01',
    title: { id: 'UI/UX Design', en: 'UI/UX Design' },
    description: {
      id: 'Merancang antarmuka aplikasi di Figma — Catering Nabila dan Repair Ranger.',
      en: 'Designing application interfaces in Figma — Catering Nabila and Repair Ranger.',
    },
    tag: 'UI/UX',
  },
  {
    id: 'web',
    index: '02',
    title: { id: 'Web Development', en: 'Web Development' },
    description: {
      id: 'Membangun website dan game berbasis web, seperti Tap-On Mi.',
      en: 'Building websites and web-based games, such as Tap-On Mi.',
    },
    tag: 'Web',
  },
  {
    id: 'mobile',
    index: '03',
    title: { id: 'Mobile & Desktop Apps', en: 'Mobile & Desktop Apps' },
    description: {
      id: 'Mengembangkan aplikasi Android dan desktop: SKEGO Mobile, AbsentKu, dan Laundry S’patu.',
      en: 'Developing Android and desktop applications: SKEGO Mobile, AbsentKu and Laundry S’patu.',
    },
    tag: 'Mobile',
  },
  {
    id: 'data',
    index: '04',
    title: { id: 'Data Mining', en: 'Data Mining' },
    description: {
      id: 'Eksplorasi dan analisis data untuk menggali pola yang berguna.',
      en: 'Exploring and analysing data to surface useful patterns.',
    },
    tag: 'Data',
  },
  {
    id: 'cloud',
    index: '05',
    title: { id: 'Cloud & Information Security', en: 'Cloud & Information Security' },
    description: {
      id: 'Learning path Cloud Computing di Bangkit Academy dan keterlibatan dalam evaluasi keamanan informasi saat magang.',
      en: 'Cloud Computing learning path at Bangkit Academy, plus hands-on information-security evaluation during the internship.',
    },
    tag: 'Cloud',
  },
]

/** Labels shown on the 3D orbit — one per orbiting object (DESIGN.md §11). */
export const ORBIT_LABELS = ['UI/UX', 'Web', 'Mobile', 'Desktop', 'Data', 'Cloud', 'Security'] as const

/** Marquee chips under the orbit (PRD §7.5 S-04). */
export const TECH_CHIPS = [
  'Figma',
  'React',
  'TypeScript',
  'Kotlin',
  'Java',
  'Cloud Computing',
  'Data Mining',
  'UI/UX',
  'Web',
  'Android',
  'Desktop',
  'Information Security',
] as const
