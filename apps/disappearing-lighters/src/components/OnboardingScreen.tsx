'use client'

interface OnboardingScreenProps {
  visible: boolean
  exiting: boolean
}

const steps = [
  {
    icon: '🔥',
    text: '$LIGHTER — kaybolmak üzere olan alevlerin hikâyesi',
  },
  {
    icon: '📍',
    text: 'Her çakmak bir koordinat. Her koordinat bir sır.',
  },
  {
    icon: '⛓️',
    text: 'TON blockchain üzerinde dijital alev sahipliği',
  },
]

export default function OnboardingScreen({ visible, exiting }: OnboardingScreenProps) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center px-6 z-10 transition-all duration-800 ease-in-out bg-void
        ${!visible && !exiting ? 'opacity-0 pointer-events-none scale-[1.02]' : ''}
        ${exiting ? 'opacity-0 pointer-events-none scale-[0.98]' : ''}
        ${visible && !exiting ? 'opacity-100 scale-100' : ''}
      `}
    >
      <div className="flex flex-col items-center text-center max-w-[420px] z-[2]">
        {/* Welcome text */}
        <h2
          className="font-display font-bold text-light mb-6 animate-[fadeInUp_0.8s_ease_forwards]"
          style={{ fontSize: 'clamp(28px, 7vw, 40px)' }}
        >
          Hoş geldin, gezgin.
        </h2>

        {/* Description */}
        <p className="font-body font-light text-[15px] leading-[1.8] text-ash mb-8 opacity-0 animate-[fadeInUp_0.8s_ease_0.3s_forwards]">
          Ateşi buldun. Artık hikâyenin bir parçasısın.
        </p>

        {/* Steps */}
        <ul className="list-none text-left w-full max-w-[320px] mb-8 opacity-0 animate-[fadeInUp_0.8s_ease_0.6s_forwards]">
          {steps.map((step, i) => (
            <li
              key={i}
              className="font-body text-sm text-ash py-3 border-b border-mist/30 flex items-center gap-3"
            >
              <span className="text-lg flex-shrink-0">{step.icon}</span>
              <span>{step.text}</span>
            </li>
          ))}
        </ul>

        {/* Telegram button */}
        <a
          href="https://t.me/lighter_heyoo_bot"
          className="btn-base btn-telegram max-w-[300px] no-underline opacity-0 animate-[fadeInUp_0.8s_ease_0.9s_forwards]"
        >
          Heyoo&apos;ya Geç →
        </a>
      </div>
    </div>
  )
}
