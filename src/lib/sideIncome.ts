import type { SideIncomeEntry } from '../types'

// Lokale Speicherung des Nebenverdiensts (nur auf dem Gerät, keine Cloud).
// Erster Schritt Richtung „echte Daten" (Phase 2).
const KEY = 'sh_side_income_v1'

export function loadSideIncome(seed: SideIncomeEntry[] = []): SideIncomeEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as SideIncomeEntry[]
    // Erststart: mit Beispieldaten befüllen, damit der Graph lebt.
    if (seed.length) localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  } catch {
    return seed
  }
}

export function saveSideIncome(entries: SideIncomeEntry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    /* localStorage nicht verfügbar – im Zweifel ignorieren */
  }
}

export function newId(): string {
  // crypto.randomUUID ist in modernen Browsern verfügbar; sonst Fallback.
  try {
    return crypto.randomUUID()
  } catch {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e6)
  }
}

/** Summiert Beträge je Monat (YYYY-MM) für die letzten `monthsBack` Monate ab `now`. */
export function monthlyBuckets(
  entries: SideIncomeEntry[],
  now: Date,
  monthsBack = 6,
): { key: string; label: string; value: number }[] {
  const months: { key: string; label: string; value: number }[] = []
  const fmt = new Intl.DateTimeFormat('de-DE', { month: 'short' })
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    months.push({ key, label: fmt.format(d), value: 0 })
  }
  for (const e of entries) {
    const key = e.dateISO.slice(0, 7)
    const bucket = months.find((m) => m.key === key)
    if (bucket) bucket.value += e.amount
  }
  return months
}

export function currentMonthTotal(entries: SideIncomeEntry[], now: Date): number {
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return entries.filter((e) => e.dateISO.slice(0, 7) === key).reduce((s, e) => s + e.amount, 0)
}
