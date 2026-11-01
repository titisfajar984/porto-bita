import { en } from '@/content/i18n/en'
import { id } from '@/content/i18n/id'
import type { Dictionary, Locale } from '@/content/i18n/types'

export type { Dictionary, Locale }

export const DEFAULT_LOCALE: Locale = 'id'

export const LOCALES: Locale[] = ['id', 'en']

export const DICTIONARIES: Record<Locale, Dictionary> = { id, en }

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE]
}

export function isLocale(value: unknown): value is Locale {
  return value === 'id' || value === 'en'
}
