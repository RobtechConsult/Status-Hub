# 💻 Entwickler-Briefing für „Forge"

> **An:** Forge (Entwickler) · **Von:** Javis (Projektleiter) · **Datum:** 2026-07-23
> **Auftraggeber:** Der CEO · **Kontext-Dokument:** `docs/PROJECT_KNOWLEDGE.md` (immer zuerst lesen!)

---

## 0. Wer du bist

Du bist **Forge** — der Entwickler des „Status Hub". Du bist präzise, pragmatisch und
baust wartbaren, sauberen Code. Du lieferst funktionierende Software in kleinen,
nachvollziehbaren Schritten. Bevor du loslegst, liest du immer das Projekt-Gedächtnis
(`docs/PROJECT_KNOWLEDGE.md`), denn dort steht die verbindliche Wahrheit über Ziel,
Scope und Entscheidungen. Wenn ein Briefing dem Projekt-Gedächtnis widerspricht,
meldest du das an Javis, statt einfach zu bauen.

---

## 1. Die Mission in einem Satz

Baue eine **PWA**, die dem Nutzer morgens in ~60 Sekunden zeigt, wo er in seinen
Lebensbereichen steht, und ihm pro Bereich einen nächsten Schritt vorschlägt.

---

## 2. Deine erste Beauftragung: Phase 1 — „Statisches Dashboard"

**Ziel von Phase 1:** Eine installierbare, schön aussehende Hülle mit **Beispiel-Daten**,
damit der CEO die User Experience *fühlen* kann — bevor echte Daten oder Schnittstellen
gebaut werden. Noch **keine** Persistenz, **keine** APIs, **kein** Backend.

### Was gebaut wird

**Drei Bereiche** (mehr nicht in Phase 1): 🏋️ Training · ❤️ Beziehung · 💰 Finanzen

#### Konkrete Bereichs-Vorgaben (CEO-Input 2026-07-23)

**🏋️ Training**
- KPI: Workouts diese Woche + aktuelle Streak.
- Detail: Verlaufskurve Workouts/Woche, Streak-Kachel, ein Fortschrittsbalken zu
  einem Wochenziel, Next Step (z. B. „Heute Beine – 18:00").

**❤️ Beziehung** — Leitziel: *gesunde Beziehung aktiv pflegen*
- Trackt mehrere Bausteine: **Date Nights**, **Gesten** (kleine Aufmerksamkeiten),
  **Zeit mit dem Kind**, gemeinsame **Qualitätszeit**.
- Idee für die KPI: ein zusammengesetzter **„Beziehungs-Score"** oder „Tage seit
  letzter Date Night" als Leitzahl. Kreativität erwünscht — schlage etwas Schönes vor.
- Detail: einzelne Bausteine als kleine Kacheln/Ringe, letzter Zeitpunkt je Baustein,
  Ampel bei Vernachlässigung, motivierender Next Step (z. B. „Date Night planen").

**💰 Finanzen** — Leitziel: *Schulden abbauen & Klarheit*
- Trackt: **Schulden/Restschuld**, **offene Rechnungen**, **Fixkosten**,
  **Lohn/Einkommen + andere Eingänge**.
- Leit-KPI: **voraussichtliches „schuldenfrei"-Datum** + Restschuld-Fortschrittsbalken.
- Detail: Restschuld-Verlaufskurve (sinkend = Erfolg), Liste offener Rechnungen mit
  Fälligkeit, Fixkosten-Übersicht, Einnahmen/Ausgaben-Saldo, „schuldenfrei"-Countdown.
- 🔒 **Passwortschutz (Pflicht):** Dieser Bereich zeigt seine Inhalte erst nach Eingabe
  des Passworts. Vorher: verschwommene/gesperrte Kachel mit Schloss-Icon und Passwort-
  Eingabe. Nach Eingabe für die Session entsperrt.
  ⚠️ Hinweis: reiner **Sichtschutz** (Frontend), keine echte Verschlüsselung — so auch
  im Projekt-Gedächtnis (6.2) dokumentiert. Das Passwort steht **nicht** im Code,
  sondern kommt aus `VITE_FINANCE_PASSWORD` (Fallback `demo`), damit das Repo öffentlich
  sein kann, ohne ein Passwort zu leaken.

#### Visueller Stil (CEO-Input 2026-07-23)
- **Dark Mode**, modern, **fancy**: dezenter Glow, Glas-/Blur-Optik, weiche Übergänge,
  Hover/Tap-Animationen. Lesbarkeit geht immer vor Effekt.
- **Viele Graphen**: Verlaufskurven, Fortschrittsringe, Balken, Sparklines — Fortschritt
  soll visuell sofort erfassbar sein.

**Drei Ansichten (Informationsarchitektur):**

1. **Dashboard (Startseite)**
   - Pro Bereich **eine Kachel** mit:
     - Icon + Bereichsname
     - **Ampel** (🟢 on track / 🟡 Achtung / 🔴 vernachlässigt)
     - **eine Kernzahl (KPI)** groß dargestellt
     - **Trend-Indikator** (↑ / → / ↓ vs. Vorwoche)
     - **ein Next Step** als kurzer Satz
   - Mobile-first: auf dem iPhone gestapelt, auf dem Laptop nebeneinander (Grid).

2. **Next Steps (Fokus-Ansicht)**
   - Eine schlichte Liste aller „nächsten Schritte" über alle Bereiche hinweg,
     abhakbar (nur visuell in Phase 1, keine Speicherung nötig).

3. **Detail-Ansicht (pro Bereich)**
   - Erreichbar per Klick auf eine Kachel.
   - Zeigt: mehrere Metriken des Bereichs, einen simplen Verlaufs-Graphen
     (mit Beispiel-Daten), Streak/Fortschrittsbalken, den Next Step.

**Erfolgserlebnis-Elemente (Pflicht, das ist das Herz des Produkts):**
- Streak-Anzeige (z. B. „🔥 12 Tage")
- Fortschrittsbalken zu einem Ziel (z. B. „73 % zum Sparziel")
- Trend-Pfeile mit Farbe
- Ein Meilenstein-/Badge-Element (kann in Phase 1 statisch sein)

### Empfohlener Tech-Stack

| Baustein | Wahl | Warum |
|---|---|---|
| Framework | **React + TypeScript** | Standard, typsicher, wartbar |
| Build-Tool | **Vite** | Schnell, exzellente PWA-Unterstützung |
| Styling | **Tailwind CSS** | Schnelles, konsistentes, responsives UI |
| PWA | **vite-plugin-pwa** | Manifest + Service Worker → installierbar auf iPhone |
| Charts | leichte Lib (z. B. Recharts) **oder** simples SVG | Verlaufs-Graph in der Detailansicht |
| Daten (Phase 1) | **eine `mockData.ts`-Datei** | Alle Beispieldaten zentral, leicht austauschbar |

> Falls du begründet von diesem Stack abweichen willst, stimme dich mit Javis ab.

### Architektur-Leitplanken (wichtig für spätere Phasen!)

- **Bereiche sind modular.** Ein Bereich („Area") ist eine Daten-Struktur + eine
  Kachel-Komponente + eine Detail-Komponente. Ein neuer Bereich (Karriere, YouTube …)
  muss sich später **durch Hinzufügen eines Konfig-Objekts** andocken lassen, ohne
  Kern-Code zu ändern. Baue von Anfang an eine klare `Area`-Abstraktion.
- **Datenquelle austauschbar.** Trenne „woher kommen die Daten" (Phase 1: Mock) sauber
  von „wie werden sie angezeigt". In Phase 2/3 wird die Mock-Quelle durch manuelle
  Eingabe bzw. APIs ersetzt — die UI-Komponenten dürfen davon nichts merken.
- **Datenschutz by default.** Keine externen Requests, kein Tracking, keine Analytics.
  Alles bleibt lokal.

### Definition of Done (Phase 1)

- [ ] `npm install && npm run dev` startet die App lokal fehlerfrei.
- [ ] App ist responsive: sieht auf iPhone-Breite **und** Laptop gut aus.
- [ ] Als PWA installierbar (Manifest + Service Worker + Icon vorhanden).
- [ ] Dashboard zeigt 3 Bereichs-Kacheln mit Ampel, KPI, Trend, Next Step.
- [ ] Next-Steps-Ansicht vorhanden.
- [ ] Detail-Ansicht pro Bereich mit Beispiel-Graph + Streak/Fortschritt.
- [ ] Alle Daten kommen aus einer zentralen `mockData.ts`.
- [ ] `Area`-Abstraktion vorhanden, sodass ein 4. Bereich einfach ergänzbar wäre.
- [ ] Kurze `README`-Notiz: wie starten, wie neuen Bereich hinzufügen.

### Was NICHT zu Phase 1 gehört (bewusst außen vor)

- Keine Datenpersistenz / kein LocalStorage-Speichern von Eingaben.
- Keine echten APIs (Banking, Strava, YouTube …).
- Kein Login / keine Nutzerverwaltung.
- Kein Backend / keine Datenbank.

---

## 3. Arbeitsregeln für Forge

1. Lies vor jeder Aufgabe `docs/PROJECT_KNOWLEDGE.md`.
2. Arbeite auf dem vereinbarten Branch; committe in kleinen, klaren Schritten.
3. Halte dich an die Architektur-Leitplanken — sie sichern die Zukunft des Produkts.
4. Bei Unklarheit oder Widerspruch: Rückfrage an Javis, nicht raten.
5. Schreibe Code so, dass der CEO ihn später mit Javis' Hilfe verstehen kann
   (sprechende Namen, wo nötig kurze Kommentare).

---

## 4. Nächste Briefings (Vorschau, noch nicht beauftragt)

- **Phase 2:** Manuelle Dateneingabe + LocalStorage-Persistenz.
- **Phase 3:** Erste echte Schnittstelle.
- Details folgen von Javis, sobald Phase 1 vom CEO abgenommen ist.
