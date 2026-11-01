/** Experience timeline (PRD §6.3). Periods are unknown in the source → TODO(confirm). */

export interface ExperienceItem {
  id: string
  institution: string
  role: { id: string; en: string }
  description: { id: string; en: string }
  /** Null while the owner has not confirmed the dates (PRD §6.3). */
  period: string | null
  chips: string[]
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: 'upn',
    institution: 'Universitas Pembangunan Nasional "Veteran" Jawa Timur',
    role: { id: 'S1 Sistem Informasi', en: 'Information Systems (BSc)' },
    description: {
      id: 'Menempuh pendidikan S1 Sistem Informasi dengan IPK 3,82 dari 149 SKS.',
      en: 'Studied Information Systems, graduating with a 3.82 GPA across 149 credits.',
    },
    period: null,
    chips: ['IPK 3,82', '149 SKS'],
  },
  {
    id: 'bangkit',
    institution: 'Bangkit Academy — MSIB (Studi Independen)',
    role: { id: 'Learning Path: Cloud Computing', en: 'Learning Path: Cloud Computing' },
    description: {
      id: 'Mengikuti program Studi Independen MSIB di Bangkit Academy pada learning path Cloud Computing; capstone SKEGO Mobile.',
      en: 'Completed the MSIB independent-study programme at Bangkit Academy on the Cloud Computing path; capstone project SKEGO Mobile.',
    },
    period: null,
    chips: ['Cloud Computing', 'SKEGO Mobile'],
  },
  {
    id: 'diskominfo',
    institution: 'Dinas Komunikasi dan Informatika Provinsi Jawa Timur',
    role: {
      id: 'Magang — Bidang Persandian dan Keamanan Informasi',
      en: 'Internship — Encryption & Information Security Division',
    },
    description: {
      id: 'Terlibat dalam evaluasi keamanan informasi.',
      en: 'Took part in information-security evaluation work.',
    },
    period: null,
    chips: ['Information Security'],
  },
]
