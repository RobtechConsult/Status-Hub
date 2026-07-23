import { useEffect, useMemo, useRef, useState } from 'react'
import type { MonthlyBudget, SideIncomeEntry } from '../types'
import { formatEuro } from '../lib/ui'
import { BarChart, ProgressBar } from './charts'
import {
  loadSideIncome,
  saveSideIncome,
  newId,
  monthlyBuckets,
  currentMonthTotal,
} from '../lib/sideIncome'

const SOURCES = ['YouTube', 'Suno', 'Freelance', 'Sonstiges']

export function MonthlyFinance({
  budget,
  seed,
  accent,
}: {
  budget: MonthlyBudget
  seed: SideIncomeEntry[]
  accent: string
}) {
  const [entries, setEntries] = useState<SideIncomeEntry[]>([])
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState(SOURCES[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  // Beim ersten Rendern aus dem lokalen Speicher laden (nur im Browser).
  useEffect(() => {
    setEntries(loadSideIncome(seed))
  }, [seed])

  const now = new Date()
  const buckets = useMemo(() => monthlyBuckets(entries, now, 6), [entries, now])
  const sideThisMonth = useMemo(() => currentMonthTotal(entries, now), [entries, now])

  const income = budget.baseIncome + sideThisMonth
  const expenses = budget.fixedExpenses
  const left = income - expenses
  const expenseRatio = income > 0 ? expenses / income : 0

  // Balken-Graph ans Ende (aktueller Monat) scrollen
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [buckets])

  function addEntry() {
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value <= 0) return
    const entry: SideIncomeEntry = {
      id: newId(),
      dateISO: new Date().toISOString().slice(0, 10),
      amount: Math.round(value * 100) / 100,
      source,
    }
    const next = [entry, ...entries]
    setEntries(next)
    saveSideIncome(next)
    setAmount('')
  }

  function removeEntry(id: string) {
    const next = entries.filter((e) => e.id !== id)
    setEntries(next)
    saveSideIncome(next)
  }

  const recent = entries.slice(0, 6)

  return (
    <div className="space-y-4">
      {/* ── Monatsbilanz ─────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">Monatsbilanz</div>
          <div className="text-[11px] text-slate-400">
            {now.toLocaleDateString('de-DE', { month: 'long' })}
          </div>
        </div>

        {/* Übrig — der Star */}
        <div className="rounded-xl bg-white/5 p-4 text-center">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Übrig diesen Monat</div>
          <div
            className="mt-1 text-3xl font-bold"
            style={{ color: left >= 0 ? accent : '#f87171' }}
          >
            {left >= 0 ? '+' : ''}
            {formatEuro(left)}
          </div>
        </div>

        {/* Einnahmen vs. Ausgaben */}
        <div className="mt-3 space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-slate-400">Einnahmen</span>
              <span className="font-semibold" style={{ color: '#34d399' }}>
                {formatEuro(income)}
              </span>
            </div>
            <ProgressBar value={1} accent="#34d399" />
            <div className="mt-1 text-[10px] text-slate-500">
              Lohn {formatEuro(budget.baseIncome)} + Nebenverdienst {formatEuro(sideThisMonth)}
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-slate-400">Ausgaben</span>
              <span className="font-semibold" style={{ color: '#f87171' }}>
                {formatEuro(expenses)}
              </span>
            </div>
            <ProgressBar value={expenseRatio} accent="#f87171" />
          </div>
        </div>
      </div>

      {/* ── Nebenverdienst ───────────────────────────────────────── */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span>💶</span> Nebenverdienst
          </div>
          <div className="text-[11px] text-slate-400">
            diesen Monat <span className="font-semibold text-slate-200">{formatEuro(sideThisMonth)}</span>
          </div>
        </div>

        {/* Monats-Graph */}
        <div ref={scrollRef} className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <BarChart data={buckets} accent={accent} unit="€" />
        </div>

        {/* Eingabe */}
        <div className="mt-3 rounded-xl bg-white/5 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
                style={{
                  background: s === source ? accent : 'rgba(255,255,255,0.06)',
                  color: s === source ? '#08111e' : '#94a3b8',
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEntry()}
                placeholder="Betrag"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-3 pr-7 text-sm outline-none focus:border-white/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">€</span>
            </div>
            <button
              onClick={addEntry}
              className="rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform active:scale-95"
              style={{ background: accent }}
            >
              + Hinzufügen
            </button>
          </div>
        </div>

        {/* Letzte Einträge */}
        {recent.length > 0 && (
          <div className="mt-3 space-y-1.5">
            {recent.map((e) => (
              <div key={e.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{e.source}</span>
                  <span className="text-[11px] text-slate-500">
                    {new Date(e.dateISO).toLocaleDateString('de-DE', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold" style={{ color: accent }}>
                    +{formatEuro(e.amount)}
                  </span>
                  <button
                    onClick={() => removeEntry(e.id)}
                    className="text-slate-500 hover:text-red-400"
                    aria-label="Eintrag löschen"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 text-center text-[10px] text-slate-500">
          🔒 Lokal auf deinem Gerät gespeichert · noch keine Cloud
        </div>
      </div>
    </div>
  )
}
