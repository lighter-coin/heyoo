'use client'

import { useState, useRef } from 'react'

interface QuestionScreenProps {
  onSubmit: () => void
  visible: boolean
  exiting: boolean
}

export default function QuestionScreen({ onSubmit, visible, exiting }: QuestionScreenProps) {
  const [answer, setAnswer] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = () => {
    if (!answer.trim()) {
      textareaRef.current?.focus()
      return
    }
    onSubmit()
  }

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center px-6 z-10 transition-all duration-800 ease-in-out bg-void
        ${!visible && !exiting ? 'opacity-0 pointer-events-none scale-[1.02]' : ''}
        ${exiting ? 'opacity-0 pointer-events-none scale-[0.98]' : ''}
        ${visible && !exiting ? 'opacity-100 scale-100' : ''}
      `}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      {/* Smoke background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(42, 50, 80, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(42, 50, 80, 0.1) 0%, transparent 50%)
          `,
          animation: 'smokeDrift 12s ease-in-out infinite alternate',
        }}
      />

      <div className="flex flex-col items-center text-center max-w-[420px] z-[2]">
        {/* Question */}
        <p
          className="font-display italic text-light text-glow-fire mb-8 animate-[fadeInUp_0.8s_ease_forwards]"
          style={{
            fontSize: 'clamp(22px, 5.5vw, 30px)',
            lineHeight: 1.5,
            textShadow: '0 0 30px rgba(255, 147, 41, 0.1)',
          }}
        >
          &ldquo;En son ne zaman
          <br />
          birine aşık oldun?&rdquo;
        </p>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Düşün... acele etme."
          rows={4}
          className="w-full max-w-[360px] min-h-[120px] p-4 bg-night/80 border border-mist/50 rounded-lg text-light font-display italic text-[15px] leading-relaxed resize-none outline-none transition-all duration-300 placeholder:text-smoke placeholder:italic focus:border-flame-bright focus:shadow-[0_0_20px_rgba(255,179,0,0.08)] opacity-0 animate-[fadeInUp_0.8s_ease_0.3s_forwards]"
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="btn-base btn-flame mt-6 max-w-[300px] opacity-0 animate-[fadeInUp_0.8s_ease_0.6s_forwards]"
        >
          Cevabını Ateşe Ver
        </button>
      </div>
    </div>
  )
}
