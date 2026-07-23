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
  /** Tage seit dem letzten Mal */
  daysSince?: number
  /** Ziel-Intervall in Tagen (z. B. Date Night alle 10 Tage) */
  targetDays?: number
}

/** Wichtiger Termin mit Countdown (z. B. Jahrestag, Geburtstag). */
export interface ImportantDate {
  label: string
  when: string
  daysUntil: number
  icon?: string
}

/** Ideen-Kategorie für den Vorschlags-Motor (kuratiert; später KI-generiert). */
export interface IdeaCategory {
  key: string
  label: string
  icon?: string
  ideas: string[]
}

export interface Bill {
  name: string
  amount: number
  due: string
  status: 'open' | 'paid' | 'overdue'
}

/** Ein Nebenverdienst-Eintrag (wird lokal gespeichert). */
export interface SideIncomeEntry {
  id: string
  dateISO: string
  amount: number
  source: string
}

/** Grundwerte für die Monatsbilanz (Lohn/feste Ausgaben). */
export interface MonthlyBudget {
  baseIncome: number
  fixedExpenses: number
  currency?: string
}

/** Ein einzelner Kredit/Schuldenposten (Avalanche-Tilgung nach Zins). */
export interface Debt {
  id: string
  name: string
  balance: number // aktuelle Restschuld
  rate: number // Zins % p.a.
  monthly: number // Rate €/Monat
  startBalance?: number // Startschuld (für Fortschritt)
  endLabel?: string // z. B. "Mai 2033"
}

/** Eine anstehende Einmal-Zahlung / Rücklage. */
export interface UpcomingPayment {
  id: string
  name: string
  amount: number
  saved?: number // bereits zurückgelegt
  dueLabel?: string // z. B. "Sep 2026"
}

/** Eine umschaltbare Zeitraum-Ansicht innerhalb eines Trackers. */
export interface RangeSeries {
  key: string
  label: string
  data: SeriesPoint[]
}

/**
 * Ein Mess-Tracker mit umschaltbaren Zeiträumen (z. B. Gewicht: 7 Tage /
 * 4 Wochen / monatsweise). Optional mit Zielline.
 */
export interface MetricTracker {
  id: string
  title: string
  icon?: string
  current: string
  sub?: string
  unit?: string
  /** true = niedriger ist besser (z. B. Körpergewicht Richtung Ziel) */
  invert?: boolean
  /** optionale horizontale Ziellinie im Graphen (Rohwert) */
  goalLine?: number
  ranges: RangeSeries[]
  /** Datenquelle-Label, z. B. "YAZIO (geplant)" */
  source?: string
}

/**
 * Ein Tagesziel mit Fortschritt (heute) plus Vergleichszeiträumen
 * (z. B. Schritte: heute, Ø letzte Woche, Ø Monat).
 */
export interface DailyGoal {
  id: string
  title: string
  icon?: string
  unit?: string
  today: number
  goal: number
  periods: { label: string; value: number; goal?: number }[]
  source?: string
}

export interface AreaDetail {
  metrics: Metric[]
  series?: Series
  goals?: ProgressGoal[]
  streak?: { label: string; days: number }
  /** Mess-Tracker mit Zeitraum-Umschaltung (z. B. Gewicht) */
  trackers?: MetricTracker[]
  /** Tagesziele mit Fortschritt (z. B. Schritte) */
  dailyGoals?: DailyGoal[]
  /** Für Beziehung: einzelne Pflege-Bausteine */
  buildingBlocks?: BuildingBlock[]
  /** Für Beziehung: wichtige Termine mit Countdown */
  importantDates?: ImportantDate[]
  /** Für Beziehung: Ideen-Motor (kuratiert; später KI-generiert) */
  ideas?: IdeaCategory[]
  /** Für Finanzen: offene Rechnungen */
  bills?: Bill[]
  /** Für Finanzen: Grundwerte der Monatsbilanz */
  monthlyBudget?: MonthlyBudget
  /** Für Finanzen: Start-Beispieleinträge Nebenverdienst (falls noch nichts gespeichert) */
  sideIncomeSeed?: SideIncomeEntry[]
  /** Für Finanzen: Start-Beispiel-Schulden (Avalanche) */
  debtsSeed?: Debt[]
  /** Für Finanzen: Start-Beispiel anstehende Zahlungen */
  upcomingSeed?: UpcomingPayment[]
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
