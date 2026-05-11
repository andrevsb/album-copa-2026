import { useState } from 'react'

const STEPS = [
  {
    icon: '👆',
    title: 'Toque uma vez',
    desc: 'A figurinha fica verde — você a tem no álbum.',
    preview: 'owned',
  },
  {
    icon: '🔁',
    title: 'Toque de novo',
    desc: 'Badge laranja aparece — você tem repetidas para trocar.',
    preview: 'duplicate',
  },
  {
    icon: '↩️',
    title: 'Toque até sumir',
    desc: 'Continue tocando para remover do álbum.',
    preview: 'missing',
  },
]

function PreviewCard({ type }) {
  const base = 'relative flex flex-col items-center justify-center rounded-xl w-16 h-16 select-none'
  if (type === 'missing') return (
    <div className={`${base} bg-gray-700 text-gray-500`}>
      <span className="text-[10px] opacity-60 font-medium">BRA</span>
      <span className="text-sm font-bold mt-0.5">1</span>
    </div>
  )
  if (type === 'owned') return (
    <div className={`${base} bg-green-600 text-white shadow-lg shadow-green-900/40`}>
      <span className="text-[10px] opacity-70 font-medium">BRA</span>
      <span className="text-sm font-bold mt-0.5">1</span>
      <span className="absolute -top-1 -right-1 text-green-300 text-xs font-black">✓</span>
    </div>
  )
  return (
    <div className={`${base} bg-green-600 text-white shadow-lg shadow-green-900/40`}>
      <span className="text-[10px] opacity-70 font-medium">BRA</span>
      <span className="text-sm font-bold mt-0.5">1</span>
      <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[9px] shadow">
        +1
      </span>
    </div>
  )
}

export default function Onboarding({ onDone }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center p-4 sm:items-center">
      <div className="bg-gray-800 rounded-2xl w-full max-w-sm p-6 space-y-6 animate-slide-up">
        {/* Progress dots */}
        <div className="flex gap-1.5 justify-center">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                i <= step ? 'bg-amber-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="text-5xl">{current.icon}</div>
          <div>
            <h3 className="text-white text-xl font-bold mb-1">{current.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{current.desc}</p>
          </div>
          <div className="flex justify-center py-2">
            <PreviewCard type={current.preview} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {step > 0 ? (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 text-gray-400 hover:text-gray-200 text-sm rounded-xl border border-gray-700 transition-colors"
            >
              Voltar
            </button>
          ) : (
            <button
              onClick={onDone}
              className="flex-1 py-3 text-gray-500 hover:text-gray-300 text-sm rounded-xl transition-colors"
            >
              Pular
            </button>
          )}
          <button
            onClick={() => (isLast ? onDone() : setStep(s => s + 1))}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-gray-900 font-bold rounded-xl transition-colors"
          >
            {isLast ? 'Começar!' : 'Próximo'}
          </button>
        </div>
      </div>
    </div>
  )
}
