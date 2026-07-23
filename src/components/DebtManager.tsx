import { useEffect, useState } from 'react'
import type { Debt } from '../types'
import { formatEuro } from '../lib/ui'
import { ProgressBar } from './charts'
import { loadList, saveList, newId } from '../lib/localStore'

const KEY = 'sh_debts_v1'

export function DebtManager({ seed, accent }: { seed: Debt[]; accent: string }) {
  const [debts, setDebts] = useState<Debt[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [balance, setBalance] = useState('')
  const [rate, setRate] = useState('')
  const [monthly, setMonthly] = useState('')

  useEffect(() => {
    setDebts(loadList(KEY, seed))
  }, [seed])

  // Avalanche: höchster Zins zuerst
  const sorted = [...debts].sort((a, b) => b.rate - a.rate)
  const totalBalance = debts.reduce((s, d) => s + d.balance, 0)
  const totalMonthly = debts.reduce((s, d) => s + d.monthly, 0)
  const target = sorted[0]
  // Grobe Restlaufzeit (ohne Zinseszins) — nur Orientierung
  const months = totalMonthly > 0 ? Math.ceil(totalBalance / totalMonthly) : null

  function num(s: string) {
    return parseFloat(s.replace(',', '.'))
  }

  function add() {
    const b = num(balance)
    const r = num(rate)
    const m = num(monthly)
    if (!name.trim() || !b || b <= 0) return
    const entry: Debt = {
      id: newId(),
      name: name.trim(),
      balance: b,
      rate: isNaN(r) ? 0 : r,
      monthly: isNaN(m) ? 0 : m,
    }
    const next = [...debts, entry]
    setDebts(next)
    saveList(KEY, next)
    setName('')
    setBalance('')
    setRate('')
    setMonthly('')
    setOpen(false)
  }

  function remove(id: string) {
    const next = debts.filter((d) => d.id !== id)
    setDebts(next)
    saveList(KEY, next)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span>🎯</span> Schulden & Tilgung
        </div>
        <div className="text-[11px] text-slate-400">Avalanche · höchster Zins zuerst</div>
      </div>

      {/* Zusammenfassung */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Restschuld</div>
          <div className="text-base font-bold">{formatEuro(totalBalance)}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Rate / Monat</div>
          <div className="text-base font-bold">{formatEuro(totalMonthly)}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Schuldenfrei in</div>
          <div className="text-base font-bold">{months != null ? `~${months} Mon.` : '—'}</div>
        </div>
      </div>

      {/* Auto-Next-Step (Avalanche) */}
      {target && (
        <div
          className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5"
          style={{ background: `${accent}18` }}
        >
          <span>💡</span>
          <span className="text-xs text-slate-200">
            Extra-Tilgung? Zuerst <b>{target.name}</b> — höchster Zins ({target.rate.toLocaleString('de-DE')}%)
          </span>
        </div>
      )}

      {/* Kredit-Liste (nach Zins-Priorität) */}
      <div className="mt-3 space-y-2">
        {sorted.map((d, i) => {
          const progress =
            d.startBalance && d.startBalance > 0
              ? (d.startBalance - d.balance) / d.startBalance
              : null
          const isTarget = i === 0
          return (
            <div
              key={d.id}
              className="rounded-xl p-3"
              style={{
                background: isTarget ? `${accent}12` : 'rgba(255,255,255,0.05)',
                border: isTarget ? `1px solid ${accent}44` : '1px solid transparent',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
                    style={{ background: isTarget ? accent : 'rgba(255,255,255,0.1)', color: isTarget ? '#08111e' : '#94a3b8' }}
                  >
                    Prio {i + 1}
                  </span>
                  <span className="text-sm font-medium">{d.name}</span>
                </div>
                <button onClick={() => remove(d.id)} className="text-slate-500 hover:text-red-400" aria-label="Löschen">
                  ✕
                </button>
              </div>
              <div className="mt-1.5 flex items-end justify-between">
                <div>
                  <div className="text-lg font-bold">{formatEuro(d.balance)}</div>
                  <div className="text-[11px] text-slate-400">
                    {d.rate.toLocaleString('de-DE')}% · {formatEuro(d.monthly)}/Mon.
                    {d.endLabel ? ` · bis ${d.endLabel}` : ''}
                  </div>
                </div>
              </div>
              {progress != null && (
                <div className="mt-2">
                  <ProgressBar value={progress} accent={accent} />
                  <div className="mt-1 text-[10px] text-slate-500">
                    {Math.round(progress * 100)}% getilgt (Start {formatEuro(d.startBalance!)})
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hinzufügen */}
      {open ? (
        <div className="mt-3 space-y-2 rounded-xl bg-white/5 p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (z. B. Bank-Kredit)"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30"
          />
          <div className="grid grid-cols-3 gap-2">
            <input value={balance} onChange={(e) => setBalance(e.target.value)} inputMode="decimal" placeholder="Restschuld €" className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
            <input value={rate} onChange={(e) => setRate(e.target.value)} inputMode="decimal" placeholder="Zins %" className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
            <input value={monthly} onChange={(e) => setMonthly(e.target.value)} inputMode="decimal" placeholder="Rate €" className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="flex-1 rounded-lg py-2 text-sm font-semibold text-black" style={{ background: accent }}>
              Speichern
            </button>
            <button onClick={() => setOpen(false)} className="rounded-lg bg-white/10 px-4 py-2 text-sm text-slate-300">
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition-transform active:scale-95"
          style={{ background: `${accent}22`, color: accent }}
        >
          + Schuld hinzufügen
        </button>
      )}
      <div className="mt-2 text-center text-[10px] text-slate-500">🔒 Lokal gespeichert · deine echten Werte bleiben auf dem Gerät</div>
    </div>
  )
}
