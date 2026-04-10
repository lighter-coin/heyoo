'use client'

import { LighterSpark } from '@/components/LighterSpark'
import { StoryCard } from '@/components/StoryCard'
import { TargetedArm } from '@/components/TargetedArm'
import { useI18n } from '@/i18n/useI18n'
import {
  ARM_PULSE_DURATION_SEC,
  ARM_PULSE_SCALE,
  AUAU_ENTRY_DELAY_SEC,
  AUAU_ENTRY_DURATION_SEC,
  FATYHU_ENTRY_DELAY_SEC,
  FATYHU_ENTRY_DURATION_SEC,
  STANZA_1_DELAY_SEC,
  STANZA_2_DELAY_SEC,
  STANZA_3_DELAY_SEC,
  STANZA_FADE_DURATION_SEC,
  SUN_EXPAND_DURATION_SEC,
  SUN_EXPAND_START_SEC,
} from '@/lib/genesis-timing'

const AUAU_GLOW = 'drop-shadow(0 0 30px rgba(255,140,0,0.3))'
const FATYHU_GLOW = 'drop-shadow(0 0 30px rgba(255,180,60,0.35))'

export const Genesis = () => {
  const { dict } = useI18n()
  const { altText } = dict.genesis

  return (
    <>
      <TargetedArm
        src="/auau-arm.png"
        alt={altText.auauArm}
        corner="bottom-left"
        entryEasing="linear"
        filterDropShadow={AUAU_GLOW}
        pulseScale={ARM_PULSE_SCALE}
        pulseDelaySec={STANZA_1_DELAY_SEC}
        entryDelaySec={AUAU_ENTRY_DELAY_SEC}
        pulseDurationSec={ARM_PULSE_DURATION_SEC}
        entryDurationSec={AUAU_ENTRY_DURATION_SEC} />

      <LighterSpark
        expandDelaySec={SUN_EXPAND_START_SEC}
        expandDurationSec={SUN_EXPAND_DURATION_SEC} />

      <StoryCard
        stanza2DelaySec={STANZA_2_DELAY_SEC}
        stanza1DelaySec={STANZA_1_DELAY_SEC}
        stanza3DelaySec={STANZA_3_DELAY_SEC}
        stanzaFadeDurationSec={STANZA_FADE_DURATION_SEC} />

      <TargetedArm
        src="/fatyhu-arm.png"
        alt={altText.fatyhuArm}
        corner="top-right"
        entryEasing="linear"
        pulseScale={ARM_PULSE_SCALE}
        filterDropShadow={FATYHU_GLOW}
        pulseDelaySec={STANZA_2_DELAY_SEC}
        entryDelaySec={FATYHU_ENTRY_DELAY_SEC}
        pulseDurationSec={ARM_PULSE_DURATION_SEC}
        entryDurationSec={FATYHU_ENTRY_DURATION_SEC} />
    </>
  )
}
