# 🧠 Status Hub — Projekt-Gedächtnis

> **Zweck dieses Dokuments:** Das lebende Gehirn des Projekts. Javis (Projektleiter)
> pflegt es kontinuierlich. Jede getroffene Entscheidung, jedes gewonnene Wissen und
> jede offene Frage landet hier — damit nichts verloren geht und jeder Beteiligte
> (CEO, Javis, Forge) jederzeit denselben Wissensstand hat.
>
> **Regel:** Dieses Dokument ist die *Single Source of Truth*. Bei Widersprüchen gilt,
> was hier steht.

**Letzte Aktualisierung:** 2026-07-23 · **Gepflegt von:** Javis (Projektleiter)

---

## 1. Das Unternehmen „Status Hub"

Wir betreiben dieses Projekt bewusst wie eine kleine Firma mit klaren Rollen.

| Rolle | Name | Verantwortung |
|---|---|---|
| 👔 **CEO** | *(der Nutzer)* | Vision, Richtung, Entscheidungen, Kontrolle, Freigaben |
| 📋 **Projektleiter** | **Javis** | Konzeption, Planung, Roadmap, Beauftragung, Pflege dieses Wissens, Qualitätssicherung |
| 💻 **Entwickler** | **Forge** | Technische Umsetzung; arbeitet nach den Briefings in `docs/DEVELOPER_BRIEF.md` |

**Arbeitsweise:**
- Der CEO gibt Richtung & Freigaben.
- Javis übersetzt die Richtung in konkrete, umsetzbare Briefings (`.md`) für Forge.
- Forge baut. Javis reviewt gegen die Briefings & dieses Dokument.
- Nichts Größeres wird gebaut, ohne dass es hier als Entscheidung festgehalten ist.

---

## 2. Vision & Ziel

> **Vision:** Ein persönliches Cockpit, das dem CEO jeden Morgen in **~60 Sekunden**
> zeigt, wo er in seinem Leben steht — und ihm sagt, was heute der **eine nächste
> Schritt** in jedem Lebensbereich ist.

**Warum wir das bauen (die Kern-Motivation des CEO):**
1. **Besser tracken** — Fortschritt sichtbar machen.
2. **Erfolgserlebnisse haben** — Motivation durch sichtbare Fortschritte.
3. **Morgens Standort-Check** — täglicher Blick „Wo stehe ich?".

**Drei Nutzungs-Modi (informationsarchitektur):**
1. **Alles auf einen Blick** (Dashboard / Glanceable)
2. **Next Steps im Auge behalten** (Fokus / Actionable)
3. **Detaillierter reinschauen** (Drill-down)

---

## 3. Leitprinzipien (Design-Regeln)

| Prinzip | Bedeutung | Konsequenz für den Bau |
|---|---|---|
| **Glanceable** | In Sekunden erfassbar | 1 Bereich = 1 Kachel mit 1 Ampel + 1 Kernzahl |
| **Actionable** | Immer ein nächster Schritt | Jede Kachel zeigt genau *einen* Next Step |
| **Drill-down** | Bei Bedarf in die Tiefe | Klick auf Kachel → volle Detailansicht |
| **Low-Maintenance** | Darf nicht in Arbeit ausarten | Manuelle Eingabe muss < 2 Min/Tag bleiben, sonst automatisieren |
| **Erfolg feiern** | Emotion ist der Motor | Streaks, Fortschrittsbalken, Trend-Pfeile, Meilenstein-Badges |

---

## 4. Scope — Womit wir starten

**Anker-Bereiche für den Prototyp (CEO-Entscheidung 2026-07-23):**
1. 🏋️ **Training**
2. ❤️ **Beziehung**
3. 💰 **Finanzen**

**Bewusst später (nicht im ersten Prototyp):**
- 📈 Karriere
- 🎬 Side-Hustle YouTube
- 🎵 Side-Hustle Suno / Musik

> Grund: Modularer Aufbau. Erst mit 3 Bereichen ein rundes, nutzbares Produkt,
> dann Bereich für Bereich erweitern. Die Architektur wird von Anfang an so gebaut,
> dass neue Bereiche einfach andocken (siehe Forge-Briefing).

---

## 5. Die Lebensbereiche im Detail

Jeder Bereich braucht: **eine Kernzahl (KPI)**, **ein Erfolgs-Signal**, **einen Next Step**.

| Bereich | Kern-KPI | Erfolgs-Signal | Datenquelle (Start → Ziel) |
|---|---|---|---|
| 🏋️ Training | Workouts/Woche · Streak | Streak + neue Bestleistung | manuell → Strava/Apple Health API |
| ❤️ Beziehung | siehe 5.1 | gepflegte, gesunde Beziehung | **bewusst manuell** (Check-in) |
| 💰 Finanzen | Voraussichtl. schuldenfrei-Datum | Restschuld ↓ / Fortschritt zur Schuldenfreiheit | manuell/CSV → Banking-Aggregator-API |

### 5.1 Beziehung — Ziel & Metriken (CEO-Input 2026-07-23)

**Leitziel:** Eine **gesunde Beziehung aktiv aufrechterhalten** — nicht nur „nicht vergessen",
sondern bewusst pflegen.

Zu trackende Bausteine:
- **Date Nights** — z. B. Tage seit letzter / Anzahl pro Monat
- **Gesten** — kleine Aufmerksamkeiten (Blumen, Nachricht, Überraschung)
- **Zeit mit dem Kind** — bewusste gemeinsame Zeit / Aktivitäten
- **Gemeinsame Qualitätszeit** als Paar
- Raum für weitere Ideen (Javis darf kreativ mitdenken: z. B. „Beziehungs-Score"
  aus mehreren Signalen, Erinnerungs-Impulse, kleine Rituale)

Erfolgs-Signal: sichtbar gepflegte Balance über alle Bausteine (grüne Ampel, wenn
regelmäßig Date/Geste/Kind-Zeit stattfindet; gelb/rot bei Vernachlässigung).

### 5.2 Finanzen — Ziel & Metriken (CEO-Input 2026-07-23)

**Leitziel (Phase 1):** **Schulden abbauen** und finanzielle Klarheit gewinnen.

Zu trackende Bausteine:
- **Schulden** (Restschuld gesamt, ggf. mehrere Posten)
- **Offene Rechnungen** (was steht noch aus, Fälligkeiten)
- **Fixkosten** (monatlich wiederkehrend)
- **Lohn / Einkommen** und **andere Eingänge**
- Daraus abgeleitet: ein **Tilgungs-/Finanzplan** und ein
  **voraussichtliches „schuldenfrei"-Datum** als motivierendes Leitziel
- Erfolgs-Signal: Restschuld-Kurve sinkt, „schuldenfrei"-Datum rückt näher

> 🔒 **Passwortschutz:** Der Finanzen-Bereich ist erst nach Eingabe eines Passworts
> einsehbar. Das echte Passwort ist dem CEO bekannt und wird **nicht** im Repository
> gespeichert (Umgebungsvariable zur Build-Zeit). Siehe Abschnitt 6.2.

---

## 6. Technische Grundsatz-Entscheidungen

| Thema | Entscheidung | Datum | Begründung |
|---|---|---|---|
| **Plattform** | **PWA** (Progressive Web App) | 2026-07-23 | Ein Codebase → läuft auf Laptop (Browser) **und** iPhone (Home-Screen-Installation). Kein App Store, kein Apple-Dev-Account nötig. Native iOS-App bleibt späteres Upgrade. |
| **Ansatz Phase 1** | Frontend-only, lokale Datenhaltung | 2026-07-23 | Schnell ein fühlbares Produkt ohne Backend-Komplexität. Kein Server, keine Cloud, maximale Privatsphäre am Anfang. |
| Empf. Tech-Stack | React + TypeScript + Vite + Tailwind, PWA | 2026-07-23 | Moderner Standard, gute PWA-Unterstützung, schnell, wartbar. (Details im Forge-Briefing.) |

**Wichtige technische Leitplanke:** Datenschutz. Es geht um höchst persönliche Daten
(Finanzen, Beziehung). Default = alles bleibt lokal auf dem Gerät, bis der CEO
bewusst etwas anderes freigibt.

### 6.1 Look & Feel (CEO-Input 2026-07-23)

- **Dark Mode** als Grundton, **moderner** Look.
- Gerne **„fancy"**: dezente Effekte (Glow, Glas-/Blur-Optik, weiche Übergänge,
  Hover-/Tap-Animationen), aber nie auf Kosten der Lesbarkeit.
- **Viele Graphen / Visualisierungen** — der Fortschritt soll visuell sofort
  erfassbar sein (Verlaufskurven, Fortschrittsringe, Balken, Sparklines).

### 6.2 Sicherheits-Hinweis: Passwortschutz Finanzen

- Der Finanzen-Bereich wird durch ein Passwort geschützt: Inhalte sind erst nach
  Eingabe sichtbar. Das echte Passwort ist dem CEO bekannt und wird **nicht** im
  Repository gespeichert — es kommt zur Build-Zeit aus der Umgebungsvariable
  `VITE_FINANCE_PASSWORD`. Ohne gesetzte Variable (öffentlicher Test-Build) gilt das
  harmlose Demo-Passwort `demo`.
- ⚠️ **Wichtig & ehrlich:** In einer reinen Frontend-PWA ist das ein **Sichtschutz**
  (verhindert zufälliges Mitlesen), **keine echte Verschlüsselung**. Wer den Code
  liest, käme theoretisch dran. Für echten Schutz sensibler Finanzdaten bräuchte es
  später ein Backend mit serverseitiger Authentifizierung.
- Für Phase 1 (nur Beispiel-Daten) ist der Sichtschutz ausreichend. Sobald echte
  Finanzdaten gepflegt werden (Phase 2+), bewertet Javis, ob ein stärkerer Schutz
  nötig ist (Backend + serverseitige Authentifizierung).
- ✅ **Umgesetzt:** Das echte Passwort liegt nicht mehr im Code/Repo, sondern in
  einer Umgebungsvariable. So kann das Repo öffentlich gemacht werden (für iPhone-
  Tests mit Fake-Daten), ohne ein Passwort zu leaken.

---

## 7. Roadmap / Phasen

```
Phase 0  Konzept & Scope          ← ABGESCHLOSSEN (dieses Dokument + Forge-Briefing)
Phase 1  Statisches Dashboard     Hülle + Beispiel-Daten, UX fühlbar machen  ← NÄCHSTER SCHRITT
Phase 2  Manuelle Dateneingabe    CEO pflegt echte Werte → echte Erfolgserlebnisse
Phase 3  Erste Automatisierung    Leichteste API zuerst
Phase 4  Weitere Schnittstellen   Finanzen, Training-APIs, weitere Bereiche
Phase 5  Intelligenz              Trends, Erinnerungen, „Javis spricht mit dir"
```

**Aktueller Stand:** Ende Phase 0. Forge kann mit Phase 1 beauftragt werden, sobald
der CEO die KPIs (Abschnitt 5) und den Entwickler-Namen bestätigt.

---

## 8. Entscheidungs-Logbuch

| Datum | Entscheidung | Von |
|---|---|---|
| 2026-07-23 | Projekt wird wie eine Firma geführt (CEO / Javis / Forge) | CEO |
| 2026-07-23 | Start-Bereiche: Training, Beziehung, Finanzen | CEO |
| 2026-07-23 | Plattform = PWA (iPhone + Laptop aus einem Codebase) | CEO bestätigt |
| 2026-07-23 | Entwickler heißt „Forge" | **CEO bestätigt** |
| 2026-07-23 | Beziehung: Fokus gesunde Beziehung (Date Nights, Gesten, Zeit mit Kind, Qualitätszeit) | CEO |
| 2026-07-23 | Finanzen: Fokus Schuldenabbau, Plan, „schuldenfrei"-Datum | CEO |
| 2026-07-23 | Finanzen-Bereich passwortgeschützt (Sichtschutz; echtes PW via Umgebungsvariable, nicht im Repo) | CEO |
| 2026-07-23 | Look: Dark, modern, fancy mit Effekten, viele Graphen | CEO |
| 2026-07-23 | Forge offiziell mit Phase 1 beauftragt | Javis |

---

## 9. Offene Fragen / To Confirm (CEO)

- [x] ~~Entwickler-Name „Forge"~~ → **bestätigt**
- [x] ~~Beziehung: Erfolgs-Signal~~ → Date Nights, Gesten, Zeit mit Kind, Qualitätszeit (siehe 5.1)
- [x] ~~Finanzen: eine oder mehrere Zahlen~~ → Schuldenabbau-Fokus, mehrere Bausteine (siehe 5.2)
- [x] ~~Look & Feel~~ → Dark, modern, fancy, viele Graphen (siehe 6.1)
- [ ] Training: konkrete KPIs bestätigen (Workouts/Woche + Streak als Start?)
- [ ] Tägliches Zeit-Budget für Pflege/Eingabe — wie viel ist realistisch?
- [ ] Finanzen: Nach Phase 1 über stärkeren Schutz als reinen Sichtschutz entscheiden.

---

## 10. Glossar

- **PWA** — Progressive Web App; Web-App, die sich auf dem Handy wie eine native App installieren lässt.
- **KPI** — Key Performance Indicator; die eine Kennzahl, die den Zustand eines Bereichs zusammenfasst.
- **Glanceable** — in Sekunden erfassbar, ohne lesen zu müssen.
- **Streak** — Serie ununterbrochener Erfolge (z. B. „12 Tage in Folge trainiert").
- **Drill-down** — von der Übersicht in die Detailtiefe eines Bereichs navigieren.
