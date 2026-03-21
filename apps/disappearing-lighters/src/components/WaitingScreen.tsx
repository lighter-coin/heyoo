'use client'

import { useEffect, useRef } from 'react'
import FlameAnimation from './FlameAnimation'

interface WaitingScreenProps {
  onComplete: () => void
  visible: boolean
  exiting: boolean
}

export default function WaitingScreen({ onComplete, visible, exiting }: WaitingScreenProps) {
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!visible) {
      startRef.current = null
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    startRef.current = Date.now()

    const tick = () => {
      if (!startRef.current || !fillRef.current) return
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / 10000) * 100, 100)
      fillRef.current.style.width = `${pct}%`

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setTimeout(onComplete, 500)
      }
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [visible, onComplete])

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center px-6 z-10 transition-all duration-800 ease-in-out bg-void
        ${!visible && !exiting ? 'opacity-0 pointer-events-none scale-[1.02]' : ''}
        ${exiting ? 'opacity-0 pointer-events-none scale-[0.98]' : ''}
        ${visible && !exiting ? 'opacity-100 scale-100' : ''}
      `}
    >
      <div className="flex flex-col items-center text-center max-w-[420px] z-[2]">
        {/* Large flame */}
        <div className="relative w-[40px] h-[80px] mb-8">
          <FlameAnimation size="lg" />
        </div>

        {/* Waiting text */}
        <p
          className="font-display italic text-ash mb-12 animate-[fadeInUp_0.8s_ease_forwards]"
          style={{ fontSize: 'clamp(18px, 4.5vw, 24px)' }}
        >
          Ateş cevabını
          <br />
          dinliyor...
        </p>

        {/* Progress bar */}
        <div className="w-[200px] h-[2px] bg-mist rounded-[1px] overflow-hidden mt-6">
          <div
            ref={fillRef}
            className="h-full rounded-[1px]"
            style={{
              width: '0%',
              backgroundImage: 'var(--gradient-flame)',
              transition: 'width 0.1s linear',
            }}
          />
        </div>
      </div>
    </div>
  )
}
