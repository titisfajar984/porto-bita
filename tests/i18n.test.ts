import { describe, expect, it } from 'vitest'

import { en } from '@/content/i18n/en'
import { id } from '@/content/i18n/id'
import type { Dictionary } from '@/content/i18n/types'

function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, shape(nested)]),
    )
  }
  return typeof value
}

describe('i18n dictionaries', () => {
  it('id and en expose exactly the same key structure', () => {
    expect(shape(id)).toEqual(shape(en))
  })

  it('has no empty strings', () => {
    const walk = (node: unknown, path: string): void => {
      if (typeof node === 'string') {
        expect(node.trim(), `empty string at ${path}`).not.toBe('')
        return
      }
      if (Array.isArray(node)) {
        node.forEach((item, index) => walk(item, `${path}[${index}]`))
        return
      }
      if (node && typeof node === 'object') {
        for (const [key, nested] of Object.entries(node)) walk(nested, `${path}.${key}`)
      }
    }
    walk(id, 'id')
    walk(en, 'en')
  })

  it('keeps the hero headline identical in both languages', () => {
    expect(id.hero.headlineTop).toBe(en.hero.headlineTop)
    expect(id.hero.headlineBottom).toBe(en.hero.headlineBottom)
  })

  it('satisfies the Dictionary contract', () => {
    const dictionaries: Dictionary[] = [id, en]
    expect(dictionaries).toHaveLength(2)
  })
})
