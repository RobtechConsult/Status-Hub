import type { WeightEntry, RangeSeries } from '../types'
import { loadList, saveList } from './localStore'

const KEY = 'sh_weight_v1'

// ISO-Kalenderwoche einer Date bestimmen
function isoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  return 1 + Math.round((d.getTime() - firstThursday.getTime()) / 86400000 / 7)
}

// Beispiel-Gewichtsverlauf (nur beim allerersten Start; relativ zu heute).
// Letzte 14 Tage täglich, davor alle 3 Tage — trend 89 → 82,4 kg.
export function generateExampleWeights(now: Date): WeightEntry[] {
  const startW = 89.0
  const endW = 82.4
  const span = 180
  const offsets: number[] = []
  for (let o = span; o > 14; o -= 3) offsets.push(o)
  for (let o = 14; o >= 0; o--) offsets.push(o)
  return offsets.map((o, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - o)
    const w = endW + (startW - endW) * (o / span) + Math.sin(o * 0.6) * 0.2
    return { id: 'seed-w-' + i, dateISO: d.toISOString().slice(0, 10), weight: Math.round(w * 10) / 10 }
  })
}

export function loadWeight(now: Date): WeightEntry[] {
  return loadList(KEY, generateExampleWeights(now))
}

export function saveWeight(entries: WeightEntry[]): void {
  saveList(KEY, entries)
}

export function latestWeight(entries: WeightEntry[]): WeightEntry | null {
  if (!entries.length) return null
  return [...entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO))[entries.length - 1]
}

function avg(nums: number[]): number {
  return Math.round((nums.reduce((s, n) => s + n, 0) / nums.length) * 10) / 10
}

// Aus den Einträgen die drei Zeitraum-Ansichten bauen (7 Tage / Wochen / Monate).
export function buildWeightRanges(entries: WeightEntry[]): RangeSeries[] {
  const asc = [...entries].sort((a, b) => a.dateISO.localeCompare(b.dateISO))

  // 7 Tage: die letzten 7 Einträge
  const last7 = asc.slice(-7).map((e) => ({
    label: new Date(e.dateISO).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }),
    value: e.weight,
  }))

  // Wochen: Wochen-Durchschnitt, letzte 12
  const weekMap = new Map<string, number[]>()
  for (const e of asc) {
    const d = new Date(e.dateISO)
    const key = `${d.getFullYear()}-KW${String(isoWeek(d)).padStart(2, '0')}`
    if (!weekMap.has(key)) weekMap.set(key, [])
    weekMap.get(key)!.push(e.weight)
  }
  const weeks = Array.from(weekMap.entries())
    .slice(-12)
    .map(([key, vals]) => ({ label: key.split('-')[1], value: avg(vals) }))

  // Monate: Monats-Durchschnitt, letzte 12
  const monthMap = new Map<string, number[]>()
  for (const e of asc) {
    const key = e.dateISO.slice(0, 7)
    if (!monthMap.has(key)) monthMap.set(key, [])
    monthMap.get(key)!.push(e.weight)
  }
  const fmt = new Intl.DateTimeFormat('de-DE', { month: 'short' })
  const months = Array.from(monthMap.entries())
    .slice(-12)
    .map(([key, vals]) => {
      const [y, m] = key.split('-').map(Number)
      return { label: fmt.format(new Date(y, m - 1, 1)), value: avg(vals) }
    })

  return [
    { key: '7d', label: '7 Tage', data: last7 },
    { key: 'wochen', label: 'Wochen', data: weeks },
    { key: 'monate', label: 'Monate', data: months },
  ]
}
