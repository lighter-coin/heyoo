'use client'

import { createContext, useCallback, useMemo, useSyncExternalStore } from 'react'

import { DEFAULT_LOCALE, locales } from '@/i18n/locales'

import type { ReactNode } from 'react'
import type { Dictionary, Locale } from '@/i18n/types'

const STORAGE_KEY = 'disappearing-lighters:locale'
const LOCALE_EVENT = 'disappearing-lighters:locale-change'

let inMemoryLocale: Locale = DEFAULT_LOCALE

interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  dict: Dictionary
}

export const I18nContext = createContext<I18nContextValue | null>(null)

interface I18nProviderProps {
  children: ReactNode
}

const isKnownLocale = (value: string): value is Locale => {
  return Object.prototype.hasOwnProperty.call(locales, value)
}

const readStoredLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return inMemoryLocale
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)

    if (stored && isKnownLocale(stored)) {
      inMemoryLocale = stored
      return stored
    }
  } catch (error) {
    console.warn('I18nProvider: failed to read locale from storage', error)
  }

  return inMemoryLocale
}

const subscribeToLocale = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleLocaleChange = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== STORAGE_KEY) {
      return
    }

    callback()
  }

  window.addEventListener('storage', handleLocaleChange)
  window.addEventListener(LOCALE_EVENT, handleLocaleChange)

  return () => {
    window.removeEventListener('storage', handleLocaleChange)
    window.removeEventListener(LOCALE_EVENT, handleLocaleChange)
  }
}

const persistLocale = (next: Locale) => {
  inMemoryLocale = next

  if (typeof window === 'undefined') {
    return
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch (error) {
    console.warn('I18nProvider: failed to persist locale', error)
  }
}

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    readStoredLocale,
    () => DEFAULT_LOCALE,
  )

  const setLocale = useCallback((next: Locale) => {
    persistLocale(next)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(LOCALE_EVENT))
    }
  }, [])

  const value = useMemo<I18nContextValue>(() => {
    return {
      locale,
      setLocale,
      dict: locales[locale],
    }
  }, [locale, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
