import { useEffect, useMemo, useRef, useState } from 'react'
import type { WeightEntry } from '../types'
import { LineChart } from './charts'
import { loadWeight, saveWeight, latestWeight, buildWeightRanges } from '../lib/weight'
import { newId } from '../lib/localStore'

export function WeightTracker({ goal, accent }: { goal?: number; accent: string }) {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [active, setActive] = useState(0)
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const now = new Date()
    setEntries(loadWeight(now))
    setDate(now.toISOString().slice(0, 10))
  }, [])

  const ranges = useMemo(() => buildWeightRanges(entries), [entries])
  const range = ranges[active] ?? ranges[0]
  const current = latestWeight(entries)
  const delta = current && goal != null ? Math.round((current.weight - goal) * 10) / 10 : null

  const scrollable = range.data.length > 8
  const chartWidth = scrollable ? Math.max(320, range.data.length * 48) : undefined

  useEffect(() => {
    if (scrollable && scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [active, scrollable, entries])

  function add() {
    const w = parseFloat(value.replace(',', '.'))
    if (!w || w <= 0) return
    const day = date || new Date().toISOString().slice(0, 10)
    // bestehenden Eintrag desselben Tages ersetzen
    const rest = entries.filter((e) => e.dateISO !== day)
    const next = [...rest, { id: newId(), dateISO: day, weight: Math.round(w * 10) / 10 }]
    setEntries(next)
    saveWeight(next)
    setValue('')
    setActive(0) // zurück auf „7 Tage", damit der neue Wert sichtbar ist
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            <span>⚖️</span> Körpergewicht
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold">
              {current ? current.weight.toLocaleString('de-DE') : '—'} kg
            </span>
            {delta != null && (
              <span className="text-[11px] text-slate-400">
                Ziel {goal} kg ({delta > 0 ? '+' : ''}
                {delta.toLocaleString('de-DE')})
              </span>
            )}
          </div>
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">manuell · YAZIO später</span>
      </div>

      {/* Zeitraum-Umschalter */}
      <div className="mb-2 inline-flex rounded-lg bg-white/5 p-0.5 text-[11px]">
        {ranges.map((r, i) => (
          <button
            key={r.key}
            onClick={() => setActive(i)}
            className="rounded-md px-2.5 py-1 font-medium transition-colors"
            style={{ background: i === active ? accent : 'transparent', color: i === active ? '#08111e' : '#94a3b8' }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {scrollable ? (
        <>
          <div ref={scrollRef} className="no-scrollbar overflow-x-auto">
            <LineChart data={range.data} accent={accent} unit=" kg" goalLine={goal} fixedWidthPx={chartWidth} />
          </div>
          <div className="mt-1 text-center text-[10px] text-slate-500">← wischen für frühere Werte · Punkt antippen für Wert</div>
        </>
      ) : (
        <LineChart data={range.data} accent={accent} unit=" kg" goalLine={goal} />
      )}

      {/* Eingabe */}
      <div className="mt-3 rounded-xl bg-white/5 p-3">
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/5 px-2 py-2 text-sm text-slate-300 outline-none focus:border-white/30"
          />
          <div className="relative flex-1">
            <input
              type="number"
              inputMode="decimal"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="Gewicht"
              className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-3 pr-9 text-sm outline-none focus:border-white/30"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">kg</span>
          </div>
          <button onClick={add} className="rounded-lg px-4 py-2 text-sm font-semibold text-black transition-transform active:scale-95" style={{ background: accent }}>
            Eintragen
          </button>
        </div>
      </div>
      <div className="mt-2 text-center text-[10px] text-slate-500">🔒 Lokal gespeichert · später automatisch aus YAZIO</div>
    </div>
  )
}
