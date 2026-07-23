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
        { label: 'Workouts diese Woche', value: '3 / 4', hint: 'Ziel 4×' },
        { label: 'Bankdrücken (6 Wdh.)', value: '82,5 kg', hint: 'konstanteste Übung · +2,5 kg/Monat' },
        { label: 'Körpergewicht', value: '82,4 kg', hint: 'Ziel: 78,0 kg' },
        { label: 'Schritte heute', value: '7.412', hint: 'Ziel 10.000' },
      ],
      // Mess-Tracker mit umschaltbaren Zeiträumen (7 Tage / 4 Wochen-Ø / Monate)
      trackers: [
        {
          id: 'gewicht',
          title: 'Körpergewicht',
          icon: '⚖️',
          current: '82,4 kg',
          sub: 'Ziel: 78,0 kg (−4,4 kg)',
          unit: ' kg',
          invert: true, // abnehmen = gut
          goalLine: 78,
          source: 'YAZIO (geplant)',
          ranges: [
            {
              key: '7d',
              label: '7 Tage',
              data: [
                { label: 'Mo', value: 83.1 },
                { label: 'Di', value: 82.9 },
                { label: 'Mi', value: 83.0 },
                { label: 'Do', value: 82.6 },
                { label: 'Fr', value: 82.7 },
                { label: 'Sa', value: 82.5 },
                { label: 'So', value: 82.4 },
              ],
            },
            {
              key: 'wochen',
              label: 'Wochen',
              data: [
                { label: 'KW20', value: 85.4 },
                { label: 'KW21', value: 85.0 },
                { label: 'KW22', value: 84.7 },
                { label: 'KW23', value: 84.4 },
                { label: 'KW24', value: 84.1 },
                { label: 'KW25', value: 83.8 },
                { label: 'KW26', value: 83.5 },
                { label: 'KW27', value: 83.2 },
                { label: 'KW28', value: 83.0 },
                { label: 'KW29', value: 82.8 },
                { label: 'KW30', value: 82.6 },
                { label: 'Jetzt', value: 82.5 },
              ],
            },
            {
              key: 'monat',
              label: 'Monate',
              data: [
                { label: 'Aug', value: 91.5 },
                { label: 'Sep', value: 90.8 },
                { label: 'Okt', value: 90.0 },
                { label: 'Nov', value: 89.2 },
                { label: 'Dez', value: 88.5 },
                { label: 'Jan', value: 88.0 },
                { label: 'Feb', value: 87.2 },
                { label: 'Mär', value: 86.7 },
                { label: 'Apr', value: 85.4 },
                { label: 'Mai', value: 84.3 },
                { label: 'Jun', value: 83.2 },
                { label: 'Jul', value: 82.4 },
              ],
            },
          ],
        },
        {
          id: 'bankdruecken',
          title: 'Bankdrücken (6 Wdh.)',
          icon: '💪',
          current: '82,5 kg',
          sub: 'Arbeitsgewicht · Ziel 90 kg',
          unit: ' kg',
          goalLine: 90,
          source: 'AlphaProgression (geplant)',
          ranges: [
            {
              key: 'saetze',
              label: 'Letzte Sätze',
              data: [
                { label: '', value: 75 },
                { label: '', value: 77.5 },
                { label: '', value: 77.5 },
                { label: '', value: 80 },
                { label: '', value: 80 },
                { label: '', value: 82.5 },
                { label: '', value: 80 },
                { label: 'Heute', value: 82.5 },
              ],
            },
            {
              key: 'monat',
              label: 'Monate',
              data: [
                { label: 'Aug', value: 60 },
                { label: 'Sep', value: 62.5 },
                { label: 'Okt', value: 65 },
                { label: 'Nov', value: 65 },
                { label: 'Dez', value: 67.5 },
                { label: 'Jan', value: 67.5 },
                { label: 'Feb', value: 70 },
                { label: 'Mär', value: 72.5 },
                { label: 'Apr', value: 75 },
                { label: 'Mai', value: 77.5 },
                { label: 'Jun', value: 80 },
                { label: 'Jul', value: 82.5 },
              ],
            },
          ],
        },
      ],
      // Tagesziel Schritte (heute + Vergleichszeiträume)
      dailyGoals: [
        {
          id: 'schritte',
          title: 'Schritte',
          icon: '👟',
          unit: 'Schritte',
          today: 7412,
          goal: 10000,
          source: 'Health (geplant)',
          periods: [
            { label: 'Ø letzte Woche', value: 9120, goal: 10000 },
            { label: 'Ø diesen Monat', value: 8760, goal: 10000 },
          ],
        },
      ],
      goals: [
        { label: 'Wochenziel Workouts', current: 3, target: 4, unit: '' },
        { label: 'Monatsziel Workouts', current: 11, target: 16, unit: '' },
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
    kpiLabel: 'Pflege-Index',
    kpiValue: '78',
    trend: 'down',
    trendLabel: '−6 vs. Vorwoche',
    nextStep: 'Date Night ist überfällig – Idee: Freitag Italiener',
    detail: {
      metrics: [
        { label: 'Pflege-Index', value: '78 / 100', hint: 'deine Fürsorge-Konstanz' },
        { label: 'Letzte Date Night', value: 'vor 12 Tagen', hint: 'Ziel: alle 10 Tage' },
        { label: 'Zeit mit Kind', value: 'gestern', hint: 'Spielplatz' },
        { label: 'Letzte Geste', value: 'vor 3 Tagen', hint: 'Kaffee ans Bett' },
      ],
      // Bausteine mit Ziel-Intervall (Rhythmus) → Ampel & „fällig" abgeleitet
      buildingBlocks: [
        { icon: '🍷', label: 'Date Night', lastLabel: 'vor 12 Tagen', status: 'red', daysSince: 12, targetDays: 10 },
        { icon: '🎁', label: 'Gesten', lastLabel: 'vor 3 Tagen', status: 'green', daysSince: 3, targetDays: 4 },
        { icon: '🧸', label: 'Zeit mit Kind', lastLabel: 'gestern', status: 'green', daysSince: 1, targetDays: 2 },
        { icon: '💬', label: 'Qualitätszeit', lastLabel: 'vor 2 Tagen', status: 'green', daysSince: 2, targetDays: 3 },
      ],
      // Wichtige Termine mit Countdown
      importantDates: [
        { icon: '💍', label: 'Jahrestag', when: '26. Aug', daysUntil: 34 },
        { icon: '🎂', label: 'Geburtstag Partnerin', when: '4. Aug', daysUntil: 12 },
        { icon: '💕', label: 'Kennenlern-Tag', when: '19. Okt', daysUntil: 88 },
      ],
      // Ideen-Motor (kuratiert; später KI-generiert)
      ideas: [
        {
          key: 'date',
          label: 'Date Night',
          icon: '🍷',
          ideas: [
            'Essen im neuen Italiener',
            'Kino-Abend mit Lieblingssnacks',
            'Sonnenuntergang-Spaziergang + Eis',
            'Zuhause zusammen kochen & Wein',
            'Minigolf oder Bowling',
            'Live-Musik / kleines Konzert',
          ],
        },
        {
          key: 'geste',
          label: 'Gesten',
          icon: '🎁',
          ideas: [
            'Kaffee ans Bett bringen',
            'Lieblingssnack mitbringen',
            'Ehrliche Komplimentsnachricht schreiben',
            'Kleinen Zettel in die Tasche legen',
            'Eine lästige Aufgabe abnehmen',
          ],
        },
        {
          key: 'kind',
          label: 'Zeit mit Kind',
          icon: '🧸',
          ideas: [
            'Zusammen etwas backen',
            'Ausflug zum Spielplatz',
            'Schwimmbad-Nachmittag',
            'Bilderbuch-Abend',
            'Kleine Fahrrad-Tour',
          ],
        },
      ],
      series: {
        title: 'Pflege-Index (Wochen)',
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
        { label: 'Fixkosten / Monat', value: '2.490 €', hint: 'Miete, Kredit, ...' },
      ],
      // Grundwerte für die Monatsbilanz (Lohn & feste Ausgaben)
      monthlyBudget: { baseIncome: 2800, fixedExpenses: 2490, currency: '€' },
      // Beispiel-Nebenverdienst (nur beim allerersten Start; danach lokal gespeichert)
      sideIncomeSeed: [
        { id: 'seed-1', dateISO: '2026-07-05', amount: 120, source: 'YouTube' },
        { id: 'seed-2', dateISO: '2026-07-18', amount: 45, source: 'Suno' },
        { id: 'seed-3', dateISO: '2026-06-10', amount: 90, source: 'YouTube' },
        { id: 'seed-4', dateISO: '2026-05-22', amount: 300, source: 'Freelance' },
        { id: 'seed-5', dateISO: '2026-04-14', amount: 30, source: 'Suno' },
        { id: 'seed-6', dateISO: '2026-03-02', amount: 75, source: 'YouTube' },
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
