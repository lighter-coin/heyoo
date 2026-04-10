import { en } from '@/i18n/locales/en'
import type { Dictionary } from '@/i18n/locales/en'

export const locales = { en } satisfies Record<string, Dictionary>

export type Locale = keyof typeof locales

export const DEFAULT_LOCALE: Locale = 'en'
