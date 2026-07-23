import type { Area } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1: Alle Daten sind BEISPIEL-DATEN. Zentrale Quelle, damit die UI-Schicht
// nichts davon weiß, "woher" die Daten kommen. In Phase 2/3 wird diese Datei
// durch manuelle Eingabe bzw. echte Schnittstellen ersetzt — die Komponenten
// bleiben unverändert.
// ─────────────────────────────────────────────────────────────────────────────

// 🔒 Passwort für den Finanzen-Bereich (Sichtschutz, KEINE echte Verschlüsselung).
// Das echte Passwort wird NICHT im Code hinterlegt, damit es nicht in ein
// (ggf. öffentliches) Repository gelangt. Es kommt zur Build-Zeit aus der
// Umgebungsvariable VITE_FINANCE_PASSWORD. Ist keine gesetzt (z. B. im
// öffentlichen Test-Build), gilt das harmlose Demo-Passwort "demo".
// Siehe docs/PROJECT_KNOWLEDGE.md Abschnitt 6.2.
export const FINANCE_PASSWORD = import.meta.env.VITE_FINANCE_PASSWORD || 'demo'

export const areas: Area[] = [
  // ── 🏋️ TRAINING ────────────────────────────────────────────────────────────
  {
    id: 'training',
    name: 'Training',
    icon: '🏋️',
    accent: '#34d399',
    status: 'green',
    kpiLabel: 'Workouts diese Woche',
    kpiValue: '3 / 4',
    trend: 'up',
    trendLabel: '+1 vs. Vorwoche',
    nextStep: 'Heute: Beine & Core – 18:00',
    detail: {
      streak: { label: 'Streak', days: 12 },
      metrics: [
        { label: 'Diese Woche', value: '3 / 4', hint: 'Workouts' },
        { label: 'Ø pro Woche', value: '3,4', hint: 'letzte 8 Wochen' },
        { label: 'Bestleistung Kniebeuge', value: '95 kg', hint: '+5 kg diesen Monat' },
        { label: 'Aktive Minuten', value: '210', hint: 'diese Woche' },
      ],
      goals: [
        { label: 'Wochenziel Workouts', current: 3, target: 4, unit: '' },
        { label: 'Monatsziel', current: 11, target: 16, unit: '' },
      ],
      series: {
        title: 'Workouts pro Woche',
        data: [
          { label: 'KW1', value: 2 },
          { label: 'KW2', value: 3 },
          { label: 'KW3', value: 3 },
          { label: 'KW4', value: 4 },
          { label: 'KW5', value: 2 },
          { label: 'KW6', value: 4 },
          { label: 'KW7', value: 4 },
          { label: 'Jetzt', value: 3 },
        ],
      },
    },
  },

  // ── ❤️ BEZIEHUNG ───────────────────────────────────────────────────────────
  {
    id: 'beziehung',
    name: 'Beziehung',
    icon: '❤️',
    accent: '#f472b6',
    status: 'yellow',
    kpiLabel: 'Beziehungs-Score',
    kpiValue: '78',
    trend: 'down',
    trendLabel: '−6 vs. Vorwoche',
    nextStep: 'Date Night für Freitag planen',
    detail: {
      metrics: [
        { label: 'Beziehungs-Score', value: '78 / 100', hint: 'gesunde Balance = 85+' },
        { label: 'Letzte Date Night', value: 'vor 12 Tagen', hint: 'Ziel: alle 10 Tage' },
        { label: 'Zeit mit Kind', value: 'gestern', hint: 'Spielplatz' },
        { label: 'Letzte Geste', value: 'vor 3 Tagen', hint: 'Kaffee ans Bett' },
      ],
      buildingBlocks: [
        { icon: '🍷', label: 'Date Night', lastLabel: 'vor 12 Tagen', status: 'yellow' },
        { icon: '🎁', label: 'Gesten', lastLabel: 'vor 3 Tagen', status: 'green' },
        { icon: '🧸', label: 'Zeit mit Kind', lastLabel: 'gestern', status: 'green' },
        { icon: '💬', label: 'Qualitätszeit', lastLabel: 'vor 2 Tagen', status: 'green' },
      ],
      series: {
        title: 'Beziehungs-Score (Wochen)',
        data: [
          { label: 'KW1', value: 72 },
          { label: 'KW2', value: 80 },
          { label: 'KW3', value: 85 },
          { label: 'KW4', value: 88 },
          { label: 'KW5', value: 84 },
          { label: 'KW6', value: 82 },
          { label: 'KW7', value: 84 },
          { label: 'Jetzt', value: 78 },
        ],
      },
    },
  },

  // ── 💰 FINANZEN (passwortgeschützt) ─────────────────────────────────────────
  {
    id: 'finanzen',
    name: 'Finanzen',
    icon: '💰',
    accent: '#38bdf8',
    status: 'green',
    kpiLabel: 'Voraussichtlich schuldenfrei',
    kpiValue: 'Aug 2027',
    trend: 'up',
    trendLabel: '3 Monate früher als geplant',
    nextStep: 'Rechnung Stadtwerke (fällig 28.07.) begleichen',
    locked: true,
    detail: {
      metrics: [
        { label: 'Restschuld', value: '14.200 €', hint: 'Start: 24.000 €' },
        { label: 'Schuldenfrei in', value: '13 Monaten', hint: 'bei aktueller Tilgung' },
        { label: 'Tilgung / Monat', value: '750 €', hint: 'Ø letzte 3 Monate' },
        { label: 'Saldo diesen Monat', value: '+310 €', hint: 'Einnahmen − Ausgaben' },
      ],
      goals: [
        {
          label: 'Schuldenabbau',
          current: 14200,
          target: 0,
          start: 24000,
          unit: '€',
          invert: true,
        },
      ],
      series: {
        title: 'Restschuld-Verlauf',
        unit: '€',
        invert: true,
        data: [
          { label: 'Jan', value: 24000 },
          { label: 'Feb', value: 22600 },
          { label: 'Mär', value: 21100 },
          { label: 'Apr', value: 19400 },
          { label: 'Mai', value: 17800 },
          { label: 'Jun', value: 16050 },
          { label: 'Jul', value: 14200 },
        ],
      },
      bills: [
        { name: 'Stadtwerke (Strom)', amount: 89, due: '28.07.', status: 'open' },
        { name: 'Internet & Mobil', amount: 55, due: '01.08.', status: 'open' },
        { name: 'Kreditrate', amount: 750, due: '05.08.', status: 'open' },
        { name: 'Versicherung', amount: 42, due: '15.07.', status: 'overdue' },
        { name: 'Miete', amount: 1180, due: '01.08.', status: 'open' },
      ],
    },
  },
]
