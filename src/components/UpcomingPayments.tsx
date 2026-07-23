import { useEffect, useState } from 'react'
import type { UpcomingPayment } from '../types'
import { formatEuro } from '../lib/ui'
import { ProgressBar } from './charts'
import { loadList, saveList, newId } from '../lib/localStore'

const KEY = 'sh_upcoming_v1'

export function UpcomingPayments({ seed, accent }: { seed: UpcomingPayment[]; accent: string }) {
  const [items, setItems] = useState<UpcomingPayment[]>([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [saved, setSaved] = useState('')
  const [due, setDue] = useState('')

  useEffect(() => {
    setItems(loadList(KEY, seed))
  }, [seed])

  const totalAmount = items.reduce((s, e) => s + e.amount, 0)
  const totalSaved = items.reduce((s, e) => s + (e.saved ?? 0), 0)
  const remaining = Math.max(0, totalAmount - totalSaved)

  function num(s: string) {
    return parseFloat(s.replace(',', '.'))
  }

  function add() {
    const a = num(amount)
    if (!name.trim() || !a || a <= 0) return
    const s = num(saved)
    const entry: UpcomingPayment = {
      id: newId(),
      name: name.trim(),
      amount: a,
      saved: isNaN(s) ? 0 : s,
      dueLabel: due.trim() || undefined,
    }
    const next = [...items, entry]
    setItems(next)
    saveList(KEY, next)
    setName('')
    setAmount('')
    setSaved('')
    setDue('')
    setOpen(false)
  }

  function remove(id: string) {
    const next = items.filter((e) => e.id !== id)
    setItems(next)
    saveList(KEY, next)
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span>📌</span> Anstehende Zahlungen
        </div>
        <div className="text-[11px] text-slate-400">Rücklagen aufbauen</div>
      </div>

      {/* Zusammenfassung */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Gesamt</div>
          <div className="text-base font-bold">{formatEuro(totalAmount)}</div>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Angespart</div>
          <div className="text-base font-bold" style={{ color: accent }}>
            {formatEuro(totalSaved)}
          </div>
        </div>
        <div className="rounded-xl bg-white/5 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-slate-400">Fehlt noch</div>
          <div className="text-base font-bold" style={{ color: remaining > 0 ? '#f87171' : accent }}>
            {formatEuro(remaining)}
          </div>
        </div>
      </div>

      {/* Auto-Next-Step */}
      {remaining > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2.5" style={{ background: `${accent}18` }}>
          <span>💡</span>
          <span className="text-xs text-slate-200">
            Noch <b>{formatEuro(remaining)}</b> zurücklegen für anstehende Zahlungen.
          </span>
        </div>
      )}

      {/* Liste */}
      <div className="mt-3 space-y-2">
        {items.map((e) => {
          const p = e.amount > 0 ? (e.saved ?? 0) / e.amount : 0
          return (
            <div key={e.id} className="rounded-xl bg-white/5 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium">{e.name}</div>
                  {e.dueLabel && <div className="text-[11px] text-slate-500">fällig {e.dueLabel}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formatEuro(e.amount)}</span>
                  <button onClick={() => remove(e.id)} className="text-slate-500 hover:text-red-400" aria-label="Löschen">
                    ✕
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar value={p} accent={accent} />
                <div className="mt-1 text-[10px] text-slate-500">
                  {formatEuro(e.saved ?? 0)} von {formatEuro(e.amount)} zurückgelegt ({Math.round(p * 100)}%)
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hinzufügen */}
      {open ? (
        <div className="mt-3 space-y-2 rounded-xl bg-white/5 p-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Wofür? (z. B. Neue Küche)" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-white/30" />
          <div className="grid grid-cols-3 gap-2">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder="Betrag €" className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
            <input value={saved} onChange={(e) => setSaved(e.target.value)} inputMode="decimal" placeholder="schon € " className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
            <input value={due} onChange={(e) => setDue(e.target.value)} placeholder="fällig" className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm outline-none focus:border-white/30" />
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
        <button onClick={() => setOpen(true)} className="mt-3 w-full rounded-xl py-2.5 text-sm font-semibold transition-transform active:scale-95" style={{ background: `${accent}22`, color: accent }}>
          + Zahlung hinzufügen
        </button>
      )}
      <div className="mt-2 text-center text-[10px] text-slate-500">🔒 Lokal gespeichert · deine echten Werte bleiben auf dem Gerät</div>
    </div>
  )
}
