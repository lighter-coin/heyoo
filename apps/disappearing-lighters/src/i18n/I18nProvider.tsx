'use client'

import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { DEFAULT_LOCALE, locales } from '@/i18n/locales'

import type { ReactNode } from 'react'
import type { Dictionary, Locale } from '@/i18n/types'

const STORAGE_KEY = 'disappearing-lighters:locale'

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

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)

      if (stored && isKnownLocale(stored)) {
        setLocaleState(stored)
      }
    } catch (error) {
      console.warn('I18nProvider: failed to read locale from storage', error)
    }
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)

    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch (error) {
      console.warn('I18nProvider: failed to persist locale', error)
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
