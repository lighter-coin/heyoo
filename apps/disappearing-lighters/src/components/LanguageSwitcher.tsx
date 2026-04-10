'use client'

import { useState } from 'react'

import { locales } from '@/i18n/locales'
import { useI18n } from '@/i18n/useI18n'

import type { Locale } from '@/i18n/types'

const localeKeys = Object.keys(locales) as Locale[]

const baseChipClass =
  'inline-flex items-center justify-center h-14 px-5 rounded-full text-ash font-body text-xs tracking-[0.18em] uppercase bg-night/40 border border-mist/40 backdrop-blur-md'

export const LanguageSwitcher = () => {
  const { locale, setLocale, dict } = useI18n()
  const [isOpen, setIsOpen] = useState(false)

  const onlyOne = localeKeys.length === 1

  if (onlyOne) {
    return (
      <div
        aria-label={`${dict.language.label}: ${dict.language.name}`}
        className={baseChipClass}>
        {dict.language.code}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={dict.language.label}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`${baseChipClass} cursor-pointer transition-all duration-300 hover:text-light hover:bg-night/60`}>
        {locales[locale].language.code}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 min-w-[8rem] rounded-2xl bg-night/80 border border-mist/40 backdrop-blur-md py-2 shadow-2xl">
          {localeKeys.map((key) => {
            const isActive = key === locale

            return (
              <li
                key={key}
                role="option"
                aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    setLocale(key)
                    setIsOpen(false)
                  }}
                  className={`block w-full px-4 py-2 text-left font-body text-xs tracking-[0.18em] uppercase transition-colors duration-200 ${
                    isActive ? 'text-light' : 'text-ash hover:text-light'
                  }`}>
                  {locales[key].language.name}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
