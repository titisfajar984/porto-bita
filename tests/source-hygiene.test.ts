import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

/** Vitest runs from the project root, so cwd is the reliable anchor here. */
const srcDir = resolve(process.cwd(), 'src')

function collect(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry)
    return statSync(full).isDirectory() ? collect(full) : [full]
  })
}

/**
 * PRD §12 acceptance #8 / AGENT.md §5.1 #1: no leftover sample copy from the
 * source components may survive into the delivered code.
 */
const FORBIDDEN = [
  'SOBERS',
  'Volvox',
  'Forma®',
  'Download iOS',
  'Download Android',
  'Ready to begin?',
  'Plus Jakarta Sans',
  'Ethan',
  'bg-background]',
  'shadow-m]',
]

describe('source hygiene', () => {
  const files = collect(srcDir)

  it('finds source files to scan', () => {
    expect(files.length).toBeGreaterThan(20)
  })

  for (const needle of FORBIDDEN) {
    it(`never contains the sample string "${needle}"`, () => {
      const offenders = files.filter((file) => readFileSync(file, 'utf8').includes(needle))
      expect(offenders, `${needle} found in:\n${offenders.join('\n')}`).toEqual([])
    })
  }

  it('leaves no console.log behind', () => {
    const offenders = files
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .filter((file) => /console\.log\(/.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })

  it('does not suppress type or lint errors inline', () => {
    const offenders = files
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .filter((file) => /@ts-ignore|@ts-nocheck|eslint-disable(?!-next-line react-hooks\/exhaustive-deps)/.test(readFileSync(file, 'utf8')))
    expect(offenders).toEqual([])
  })
})
