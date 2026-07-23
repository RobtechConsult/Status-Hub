# 📊 Status Hub

Dein persönliches Cockpit — Lebensbereiche auf einen Blick, nächste Schritte im Fokus,
Details bei Bedarf. Läuft als **PWA** auf iPhone (Home-Screen) und Laptop (Browser).

> **Projekt-Doku:** Vision, Rollen & Entscheidungen stehen in
> [`docs/PROJECT_KNOWLEDGE.md`](docs/PROJECT_KNOWLEDGE.md).
> Das Entwickler-Briefing liegt in [`docs/DEVELOPER_BRIEF.md`](docs/DEVELOPER_BRIEF.md).

## Status
**Phase 1** — statisches Dashboard mit Beispiel-Daten (kein Backend, keine echten APIs).
Bereiche: 🏋️ Training · ❤️ Beziehung · 💰 Finanzen (🔒 passwortgeschützt).

## Starten

```bash
npm install
npm run dev      # Entwicklungs-Server (http://localhost:5173)
npm run build    # Produktions-Build (nach ./dist)
npm run preview  # Build lokal ansehen
```

### Auf dem iPhone installieren
1. App-URL in Safari öffnen.
2. Teilen-Menü → „Zum Home-Bildschirm".
3. Icon erscheint wie eine echte App (Vollbild, offline-fähig).

## Aufbau

```
src/
├── App.tsx                 # Navigation: Dashboard <-> Next Steps <-> Detail
├── types.ts                # Kern-Datentypen (Area, Metric, Series, ...)
├── data/mockData.ts        # ALLE Beispiel-Daten zentral (Phase 1)
├── lib/ui.ts               # Farben, Status-, Trend-Helfer
└── components/
    ├── Dashboard.tsx       # Übersicht mit Bereichs-Kacheln
    ├── AreaCard.tsx        # Eine Kachel (Ampel, KPI, Trend, Sparkline, Next Step)
    ├── NextSteps.tsx       # Fokus-Liste aller nächsten Schritte
    ├── AreaDetail.tsx      # Detailansicht eines Bereichs
    ├── FinanceGate.tsx     # Passwortschutz Finanzen (Sichtschutz)
    ├── BottomNav.tsx       # Untere Navigation
    └── charts.tsx          # SVG-Graphen (Sparkline, LineChart, Ring, Bar)
```

## Einen neuen Bereich hinzufügen
Die Architektur ist modular. Ein neuer Lebensbereich (z. B. Karriere, YouTube) braucht
**keine** Änderung am Kern-Code — nur einen neuen Eintrag in `src/data/mockData.ts`:

```ts
{
  id: 'karriere',
  name: 'Karriere',
  icon: '📈',
  accent: '#a78bfa',
  status: 'green',
  kpiLabel: 'Aktuelles Ziel',
  kpiValue: '2 / 3 Meilensteine',
  trend: 'up',
  trendLabel: '+1 diesen Monat',
  nextStep: 'Weiterbildung XY abschließen',
  detail: { metrics: [ /* ... */ ], series: { /* ... */ } },
}
```

Optional `locked: true` für Passwortschutz.

## Hinweis Passwortschutz
Der Finanzen-Schutz ist ein **Sichtschutz** im Frontend, keine echte Verschlüsselung.
Das echte Passwort liegt **nicht** im Repo, sondern in der Umgebungsvariable
`VITE_FINANCE_PASSWORD` (zur Build-Zeit). Ohne gesetzte Variable gilt das Demo-Passwort
`demo`. Details in `docs/PROJECT_KNOWLEDGE.md` (Abschnitt 6.2).

```bash
# Eigenes Passwort für einen (privaten) Build setzen:
VITE_FINANCE_PASSWORD='deinPasswort' npm run build
```
