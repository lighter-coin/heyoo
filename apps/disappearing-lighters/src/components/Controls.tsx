'use client'

import { BackgroundAudio } from '@/components/BackgroundAudio'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

interface ControlsProps {
  audioSrc: string
}

export const Controls = ({ audioSrc }: ControlsProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 z-[9999] flex -translate-x-1/2 items-center gap-3">
      <LanguageSwitcher />
      <BackgroundAudio src={audioSrc} />
    </div>
  )
}
