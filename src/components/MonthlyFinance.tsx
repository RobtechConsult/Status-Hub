import { useEffect, useMemo, useRef, useState } from 'react'
import type { BudgetItem, SideIncomeEntry } from '../types'
import { formatEuro } from '../lib/ui'
import { BarChart, ProgressBar } from './charts'
import { loadList, saveList, newId } from '../lib/localStore'
import {
  loadSideIncome,
  saveSideIncome,
  newId as sideId,
  monthlyBuckets,
  currentMonthTotal,
} from '../lib/sideIncome'

const SOURCES = ['YouTube', 'Suno', 'Freelance', 'Sonstiges']
const INCOME_KEY = 'sh_income_v1'
const EXPENSE_KEY = 'sh_expenses_v1'

// ── Wiederverwendbare Kategorie-Liste (Einnahmen/Ausgaben) ───────────────────
function CategoryList({
  title,
  icon,
  storageKey,
  seed,
  accent,
  withKind,
  onChange,
}: {
  title: string
  icon: string
  storageKey: string
  seed: BudgetItem[]
  accent: string
  withKind: boolean
  onChange: (items: BudgetItem[]) => void
}) {
  const [items, setItems] = useState<BudgetItem[]>([])
  const [expanded, setExpanded] = useState(false)
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [kind, setKind] = useState<'fix' | 'variabel'>('fix')

  useEffect(() => {
    const loaded = loadList(storageKey, seed)
    setItems(loaded)
    onChange(loaded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, storageKey])

  function commit(next: BudgetItem[]) {
    setItems(next)
    saveList(storageKey, next)
    onChange(next)
  }

  function add() {
    const a = parseFloat(amount.replace(',', '.'))
    if (!label.trim() || !a || a <= 0) return
    commit([...items, { id: newId(), label: label.trim(), amount: a, kind: withKind ? kind : 'fix' }])
    setLabel('')
    setAmount('')
  }

  const total = items.reduce((s, i) => s + i.amount, 0)

  return (
    <div className="rounded-xl bg-white/5 p-3">
      <button onClick={() => setExpanded((e) => !e)} className="flex w-full items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium">
          <span>{icon}</span> {title}
        </span>
        <span className="flex items-center gap-2">
          <span className="text-sm font-semibold">{formatEuro(total)}</span>
          <span className="text-slate-500">{expanded ? '▲' : '▼'}</span>
        </span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-1.5">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="text-sm">{it.label}</span>
                {withKind && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-medium"
                    style={{
                      background: it.kind === 'fix' ? 'rgba(148,163,184,0.18)' : `${accent}22`,
                      color: it.kind === 'fix' ? '#94a3b8' : accent,
                    }}
                  >
                    {it.kind}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{formatEuro(it.amount)}</span>
                <button
                  onClick={() => commit(items.filter((x) => x.id !== it.id))}
                  className="text-slate-500 hover:text-red-400"
                  aria-label="Löschen"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Eingabe */}
          <div className="flex flex-wrap gap-2 pt-1">
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Bezeichnung"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-white/30"
            />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="€"
              className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm outline-none focus:border-white/30"
            />
            {withKind && (
              <button
                onClick={() => setKind((k) => (k === 'fix' ? 'variabel' : 'fix'))}
                className="rounded-lg px-2 py-1.5 text-[11px] font-medium"
                style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
              >
                {kind}
              </button>
            )}
            <button onClick={add} className="rounded-lg px-3 py-1.5 text-sm font-semibold text-black" style={{ background: accent }}>
              +
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Hauptkomponente: Monatsbilanz + Kategorien + Nebenverdienst ──────────────
export function MonthlyFinance({
  incomeSeed,
  expenseSeed,
  sideSeed,
  accent,
}: {
  incomeSeed: BudgetItem[]
  expenseSeed: BudgetItem[]
  sideSeed: SideIncomeEntry[]
  accent: string
}) {
  const [income, setIncome] = useState<BudgetItem[]>([])
  const [expenses, setExpenses] = useState<BudgetItem[]>([])
  const [entries, setEntries] = useState<SideIncomeEntry[]>([])
  const [amount, setAmount] = useState('')
  const [source, setSource] = useState(SOURCES[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setEntries(loadSideIncome(sideSeed))
  }, [sideSeed])

  const now = new Date()
  const buckets = useMemo(() => monthlyBuckets(entries, now, 6), [entries, now])
  const sideThisMonth = useMemo(() => currentMonthTotal(entries, now), [entries, now])

  const baseIncome = income.reduce((s, i) => s + i.amount, 0)
  const totalIncome = baseIncome + sideThisMonth
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const fixExpenses = expenses.filter((e) => e.kind === 'fix').reduce((s, e) => s + e.amount, 0)
  const varExpenses = totalExpenses - fixExpenses
  const left = totalIncome - totalExpenses
  const expenseRatio = totalIncome > 0 ? totalExpenses / totalIncome : 0

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [buckets])

  function addSide() {
    const value = parseFloat(amount.replace(',', '.'))
    if (!value || value <= 0) return
    const entry: SideIncomeEntry = {
      id: sideId(),
      dateISO: new Date().toISOString().slice(0, 10),
      amount: Math.round(value * 100) / 100,
      source,
    }
    const next = [entry, ...entries]
    setEntries(next)
    saveSideIncome(next)
    setAmount('')
  }

  function removeSide(id: string) {
    const next = entries.filter((e) => e.id !== id)
    setEntries(next)
    saveSideIncome(next)
  }

  const recent = entries.slice(0, 5)

  return (
    <div className="space-y-4">
      {/* ── Monatsbilanz (aus Kategorien berechnet) ───────────────── */}
      <div className="glass rounded-2xl p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-medium">Monatsbilanz</div>
          <div className="text-[11px] text-slate-400">{now.toLocaleDateString('de-DE', { month: 'long' })}</div>
        </div>

        <div className="rounded-xl bg-white/5 p-4 text-center">
          <div className="text-[11px] uppercase tracking-wide text-slate-400">Übrig diesen Monat</div>
          <div className="mt-1 text-3xl font-bold" style={{ color: left >= 0 ? accent : '#f87171' }}>
            {left >= 0 ? '+' : ''}
            {formatEuro(left)}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <div>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-slate-400">Einnahmen</span>
              <span className="font-semibold" style={{ color: '#34d399' }}>{formatEuro(totalIncome)}</span>
            </div>
            <ProgressBar value={1} accent="#34d399" />
            <div className="mt-1 text-[10px] text-slate-500">
              Kategorien {formatEuro(baseIncome)} + Nebenverdienst {formatEuro(sideThisMonth)}
            </div>
          </div>
          <div>
            <div className="mb-1 flex justify-between text-[11px]">
              <span className="text-slate-400">Ausgaben</span>
              <span className="font-semibold" style={{ color: '#f87171' }}>{formatEuro(totalExpenses)}</span>
            </div>
            <ProgressBar value={expenseRatio} accent="#f87171" />
            <div className="mt-1 text-[10px] text-slate-500">
              Fix {formatEuro(fixExpenses)} · Variabel {formatEuro(varExpenses)}
            </div>
          </div>
        </div>

        {/* Kategorien */}
        <div className="mt-3 space-y-2">
          <CategoryList title="Einnahmen" icon="🟢" storageKey={INCOME_KEY} seed={incomeSeed} accent="#34d399" withKind={false} onChange={setIncome} />
          <CategoryList title="Ausgaben" icon="🔴" storageKey={EXPENSE_KEY} seed={expenseSeed} accent="#f87171" withKind onChange={setExpenses} />
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

        <div ref={scrollRef} className="no-scrollbar -mx-1 overflow-x-auto px-1">
          <BarChart data={buckets} accent={accent} unit="€" />
        </div>

        <div className="mt-3 rounded-xl bg-white/5 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
                style={{ background: s === source ? accent : 'rgba(255,255,255,0.06)', color: s === source ? '#08111e' : '#94a3b8' }}
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
                onKeyDown={(e) => e.key === 'Enter' && addSide()}
                placeholder="Betrag"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-3 pr-7 text-sm outline-none focus:border-white/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">€</span>
            </div>
            <button onClick={addSide} className="rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform active:scale-95" style={{ background: accent }}>
              + Hinzufügen
            </button>
          </div>
        </div>

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
                  <span className="text-sm font-semibold" style={{ color: accent }}>+{formatEuro(e.amount)}</span>
                  <button onClick={() => removeSide(e.id)} className="text-slate-500 hover:text-red-400" aria-label="Löschen">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-2 text-center text-[10px] text-slate-500">🔒 Lokal auf deinem Gerät gespeichert · noch keine Cloud</div>
      </div>
    </div>
  )
}
