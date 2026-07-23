// ── Kern-Typen des Status Hub ────────────────────────────────────────────────
// Bewusst generisch gehalten, damit neue Lebensbereiche (Karriere, YouTube, ...)
// später ohne Änderung am Kern-Code andocken können.

export type Trend = 'up' | 'flat' | 'down'
export type Status = 'green' | 'yellow' | 'red'

export interface Metric {
  label: string
  value: string
  hint?: string
}

export interface SeriesPoint {
  label: string
  value: number
}

export interface Series {
  title: string
  unit?: string
  data: SeriesPoint[]
  /** true = niedriger ist besser (z. B. Restschuld) */
  invert?: boolean
}

export interface ProgressGoal {
  label: string
  current: number
  target: number
  start?: number
  unit?: string
  /** true = Fortschritt bedeutet Sinken (z. B. Schuldenabbau) */
  invert?: boolean
}

export interface BuildingBlock {
  icon: string
  label: string
  lastLabel: string
  status: Status
}

export interface Bill {
  name: string
  amount: number
  due: string
  status: 'open' | 'paid' | 'overdue'
}

export interface AreaDetail {
  metrics: Metric[]
  series?: Series
  goals?: ProgressGoal[]
  streak?: { label: string; days: number }
  /** Für Beziehung: einzelne Pflege-Bausteine */
  buildingBlocks?: BuildingBlock[]
  /** Für Finanzen: offene Rechnungen */
  bills?: Bill[]
}

export interface Area {
  id: string
  name: string
  icon: string
  /** Akzentfarbe (hex) — treibt Glow, Graphen, Fortschritt */
  accent: string
  status: Status
  kpiLabel: string
  kpiValue: string
  trend: Trend
  trendLabel: string
  nextStep: string
  /** true = passwortgeschützt (Sichtschutz) */
  locked?: boolean
  detail: AreaDetail
}
