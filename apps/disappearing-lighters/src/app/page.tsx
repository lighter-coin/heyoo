'use client'

import { useState, useCallback } from 'react'
import WelcomeScreen from '@/components/WelcomeScreen'
import QuestionScreen from '@/components/QuestionScreen'
import WaitingScreen from '@/components/WaitingScreen'
import OnboardingScreen from '@/components/OnboardingScreen'
import SoundToggle from '@/components/SoundToggle'
import AmbientGlow from '@/components/AmbientGlow'

type Screen = 'welcome' | 'question' | 'waiting' | 'onboard'

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome')
  const [exitingScreen, setExitingScreen] = useState<Screen | null>(null)

  const transitionTo = useCallback(
    (next: Screen) => {
      setExitingScreen(currentScreen)
      setTimeout(() => {
        setCurrentScreen(next)
        setExitingScreen(null)
      }, 800)
    },
    [currentScreen],
  )

  const handleWaitingComplete = useCallback(() => {
    transitionTo('onboard')
  }, [transitionTo])

  return (
    <main className="relative w-full h-dvh overflow-hidden">
      {/* Sound Toggle */}
      <SoundToggle />

      {/* Ambient Background Glow */}
      <AmbientGlow />

      {/* Prevent scroll on touch */}
      <div
        className="fixed inset-0"
        onTouchMove={(e) => {
          const target = e.target as HTMLElement
          if (!target.closest('textarea')) {
            e.preventDefault()
          }
        }}
      />

      {/* Screens */}
      <WelcomeScreen
        visible={currentScreen === 'welcome'}
        exiting={exitingScreen === 'welcome'}
        onEnterFire={() => transitionTo('question')}
        onExplore={() => transitionTo('question')}
      />

      <QuestionScreen
        visible={currentScreen === 'question'}
        exiting={exitingScreen === 'question'}
        onSubmit={() => transitionTo('waiting')}
      />

      <WaitingScreen
        visible={currentScreen === 'waiting'}
        exiting={exitingScreen === 'waiting'}
        onComplete={handleWaitingComplete}
      />

      <OnboardingScreen
        visible={currentScreen === 'onboard'}
        exiting={exitingScreen === 'onboard'}
      />
    </main>
  )
}
