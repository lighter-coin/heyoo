'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 2500),
      setTimeout(() => setPhase(3), 5000),
      setTimeout(() => setPhase(4), 6500),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <main className="relative w-full h-dvh overflow-hidden bg-black">
      {/* Central Spark / Ember */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        style={{
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 2s ease-in',
        }}
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: phase >= 3 ? '120px' : '60px',
            height: phase >= 3 ? '120px' : '60px',
            background: 'radial-gradient(circle, rgba(255,180,0,0.25) 0%, rgba(255,120,0,0.08) 50%, transparent 70%)',
            transition: 'width 3s ease, height 3s ease',
            animation: 'glowPulse 3s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: phase >= 3 ? '60px' : '30px',
            height: phase >= 3 ? '60px' : '30px',
            background: 'radial-gradient(circle, rgba(255,200,50,0.5) 0%, rgba(255,140,0,0.2) 60%, transparent 100%)',
            transition: 'width 3s ease, height 3s ease',
            animation: 'emberPulse 2s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: phase >= 3 ? '18px' : '8px',
            height: phase >= 3 ? '18px' : '8px',
            background: 'radial-gradient(circle, #fff8e1 0%, #ffb300 40%, #e8832a 80%)',
            boxShadow: phase >= 3
              ? '0 0 20px #ffb300, 0 0 40px rgba(255,140,0,0.5), 0 0 80px rgba(255,100,0,0.3)'
              : '0 0 10px #ffb300, 0 0 20px rgba(255,140,0,0.4)',
            transition: 'all 3s ease',
            animation: 'sparkFlicker 1.5s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* 
        Auau's arm: image naturally points from bottom-left to upper-right (~40°)
        Position: bottom-left corner, fingers reaching toward center
        NO rotation needed - the image is already on the correct diagonal
      */}
      <div
        className="absolute z-10"
        style={{
          width: '50vmin',
          maxWidth: '480px',
          /* Slide from off-screen bottom-left to final position */
          bottom: phase >= 2 ? '3%' : '-55%',
          left: phase >= 2 ? '25%' : '-45%',
          transition: 'bottom 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), left 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <img
          src="/auau-arm.png"
          alt="Auau's arm"
          className="w-full h-auto"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(255,140,0,0.3))',
          }}
          draggable={false}
        />
      </div>

      {/* 
        Fat-yhu's arm: image naturally points from upper-right to lower-left (~55°)
        Position: top-right corner, fingers reaching toward center
        NO rotation needed - the image is already on the correct diagonal
      */}
      <div
        className="absolute z-10"
        style={{
          width: '50vmin',
          maxWidth: '480px',
          /* Slide from off-screen top-right to final position */
          top: phase >= 4 ? '3%' : '-55%',
          right: phase >= 4 ? '25%' : '-45%',
          transition: 'top 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), right 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        <img
          src="/faythu-arm.png"
          alt="Fat-yhu's arm"
          className="w-full h-auto"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(100,150,255,0.3))',
          }}
          draggable={false}
        />
      </div>

      {phase >= 1 && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-0"
          style={{
            width: '80vw',
            height: '30vh',
            background: 'radial-gradient(ellipse at center top, rgba(255,140,0,0.06) 0%, transparent 70%)',
            opacity: phase >= 3 ? 0.8 : 0.4,
            transition: 'opacity 3s ease',
          }}
        />
      )}

      <style jsx>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
        @keyframes emberPulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes sparkFlicker {
          0% { opacity: 0.85; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </main>
  )
}
