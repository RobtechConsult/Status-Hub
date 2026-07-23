import { useState } from 'react'
import { FINANCE_PASSWORD } from '../data/mockData'

// 🔒 Sichtschutz-Gate (KEINE echte Verschlüsselung — siehe PROJECT_KNOWLEDGE.md 6.2)
export function FinanceGate({ accent, onUnlock }: { accent: string; onUnlock: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === FINANCE_PASSWORD) {
      onUnlock()
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-3xl"
        style={{ background: `${accent}22`, boxShadow: `0 0 30px ${accent}33` }}
      >
        🔒
      </div>
      <h2 className="text-lg font-semibold">Finanzen geschützt</h2>
      <p className="mt-1 max-w-xs text-sm text-slate-400">
        Bitte Passwort eingeben, um deine Finanzübersicht zu sehen.
      </p>

      <form onSubmit={submit} className="mt-6 w-full max-w-xs">
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => {
            setPw(e.target.value)
            setError(false)
          }}
          placeholder="Passwort"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center text-base outline-none transition-colors focus:border-white/30"
          style={{ borderColor: error ? '#f87171' : undefined }}
        />
        {error && <p className="mt-2 text-xs text-red-400">Falsches Passwort. Versuch es nochmal.</p>}
        <button
          type="submit"
          className="mt-3 w-full rounded-xl px-4 py-3 text-base font-semibold text-black transition-transform active:scale-95"
          style={{ background: accent, boxShadow: `0 0 24px ${accent}55` }}
        >
          Entsperren
        </button>
      </form>
    </div>
  )
}
