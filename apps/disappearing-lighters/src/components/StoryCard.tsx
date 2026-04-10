'use client'

import type { CSSProperties, ReactNode } from 'react'

import { useI18n } from '@/i18n/useI18n'

import styles from '@/components/StoryCard.module.css'

interface StoryCardProps {
  stanza1DelaySec: number
  stanza2DelaySec: number
  stanza3DelaySec: number
  stanzaFadeDurationSec: number
}

interface StoryTextBlockProps {
  containerClassName?: string
  copyClassName?: string
  delaySec: number
  fadeDurationSec: number
  text: string
}

interface FadeCSSProperties extends CSSProperties {
  '--stanza-delay': string
  '--stanza-fade-duration': string
}

const renderBold = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*.*?\*\*)/g)

  return parts.filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }

    return part
  })
}

const getFadeStyle = (
  delaySec: number,
  fadeDurationSec: number,
): FadeCSSProperties => ({
  '--stanza-delay': `${delaySec}s`,
  '--stanza-fade-duration': `${fadeDurationSec}s`,
})

const StoryTextBlock = ({
  containerClassName,
  copyClassName,
  delaySec,
  fadeDurationSec,
  text,
}: StoryTextBlockProps) => {
  const fadeStyle = getFadeStyle(delaySec, fadeDurationSec)
  const blockClassName = containerClassName
    ? `${styles.textBlock} ${containerClassName}`
    : styles.textBlock
  const textClassName = copyClassName ? `${styles.copy} ${copyClassName}` : styles.copy

  return (
    <section
      aria-label={text}
      style={fadeStyle}
      className={blockClassName}>
      <p className={textClassName}>{renderBold(text)}</p>
    </section>
  )
}

export const StoryCard = ({
  stanza1DelaySec,
  stanza2DelaySec,
  stanza3DelaySec,
  stanzaFadeDurationSec,
}: StoryCardProps) => {
  const { dict } = useI18n()
  const { stanzas } = dict.genesis

  return (
    <div className={styles.card}>
      <div className={styles.disc}>
        <StoryTextBlock
          text={stanzas.fatyhu}
          containerClassName={styles.textTop}
          delaySec={stanza2DelaySec}
          fadeDurationSec={stanzaFadeDurationSec} />
        <StoryTextBlock
          text={stanzas.visitor}
          copyClassName={styles.copyCenter}
          containerClassName={styles.textCenter}
          delaySec={stanza3DelaySec}
          fadeDurationSec={stanzaFadeDurationSec} />
        <StoryTextBlock
          text={stanzas.auau}
          containerClassName={styles.textBottom}
          delaySec={stanza1DelaySec}
          fadeDurationSec={stanzaFadeDurationSec} />
      </div>
    </div>
  )
}
