import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { PROJECTS, PROJECT_CATEGORIES } from '@/content/projects'
import { SERVICES } from '@/content/services'
import { SOCIALS, STATS } from '@/content/site'

/** Vitest runs from the project root, so cwd is the reliable anchor here. */
const publicDir = resolve(process.cwd(), 'public')

describe('project catalogue', () => {
  it('has six projects with unique slugs', () => {
    expect(PROJECTS).toHaveLength(6)
    expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(PROJECTS.length)
  })

  it('uses only declared categories', () => {
    for (const project of PROJECTS) {
      expect(PROJECT_CATEGORIES).toContain(project.category)
    }
  })

  it('ships a real cover file for every project', () => {
    for (const project of PROJECTS) {
      const file = resolve(publicDir, project.cover.replace(/^\//, ''))
      expect(existsSync(file), `missing cover for ${project.slug}: ${file}`).toBe(true)
    }
  })

  it('never emits a link button without an href', () => {
    for (const project of PROJECTS) {
      for (const link of project.links) {
        expect(link.href).toMatch(/^https?:\/\//)
        expect(link.label.length).toBeGreaterThan(0)
      }
    }
  })

  it('writes both locales for context and summary', () => {
    for (const project of PROJECTS) {
      expect(project.context.id.length).toBeGreaterThan(0)
      expect(project.context.en.length).toBeGreaterThan(0)
      expect(project.summary.id.length).toBeGreaterThan(0)
      expect(project.summary.en.length).toBeGreaterThan(0)
    }
  })

  it('flags unconfirmed content instead of inventing it', () => {
    const flagged = PROJECTS.filter((project) => (project.needsConfirm?.length ?? 0) > 0)
    expect(flagged.map((project) => project.slug).sort()).toEqual(['absentku', 'laundry-spatu'])
  })
})

describe('services and identity', () => {
  it('lists five services numbered 01-05', () => {
    expect(SERVICES).toHaveLength(5)
    expect(SERVICES.map((service) => service.index)).toEqual(['01', '02', '03', '04', '05'])
  })

  it('exposes four stats and four social links', () => {
    expect(STATS).toHaveLength(4)
    expect(SOCIALS).toHaveLength(4)
  })

  it('points every social link at a real destination', () => {
    for (const social of SOCIALS) {
      expect(social.href).toMatch(/^(https?:\/\/|mailto:)/)
    }
  })
})
