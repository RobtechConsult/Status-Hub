import { useEffect, useState } from 'react'
import type { Area } from '../types'
import { formatEuro } from '../lib/ui'
import { loadList } from '../lib/localStore'

type Item = { icon: string; text: string; urgent: boolean }

function daysSinceISO(iso: string): number {
  const now = new Date()
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const then = new Date(iso + 'T00:00:00').getTime()
  return Math.max(0, Math.round((t0 - then) / 86400000))
}

function buildItems(areas: Area[]): Item[] {
  const urgent: Item[] = []
  const focus: Item[] = []
  const urgentAreas = new Set<string>() // Bereiche mit Alarm bekommen keinen Fokus-Doppler

  // Beziehung: überfällige Pflege-Bausteine (aus lokalem „zuletzt erledigt")
  const bez = areas.find((a) => a.id === 'beziehung')
  if (bez?.detail.buildingBlocks) {
    const stored = loadList<{ id: string; date: string }>('sh_rel_done_v1', [])
    const map: Record<string, string> = {}
    stored.forEach((e) => (map[e.id] = e.date))
    bez.detail.buildingBlocks.forEach((b) => {
      const iso = b.id ? map[b.id] : undefined
      const days = iso ? daysSinceISO(iso) : b.daysSince ?? 0
      if (b.targetDays != null && days > b.targetDays) {
        urgent.push({ icon: '❤️', text: `${b.label} ist überfällig (${days} Tage)`, urgent: true })
        urgentAreas.add('beziehung')
      }
    })
  }

  // Finanzen: überfällige Rechnungen
  const fin = areas.find((a) => a.id === 'finanzen')
  ;(fin?.detail.bills ?? [])
    .filter((b) => b.status === 'overdue')
    .forEach((b) => {
      urgent.push({ icon: '💰', text: `${b.name} überfällig · ${formatEuro(b.amount)}`, urgent: true })
      urgentAreas.add('finanzen')
    })

  // Fokus je Bereich (nächster Schritt) — außer der Bereich hat schon einen Alarm
  areas.forEach((a) => {
    if (!urgentAreas.has(a.id)) focus.push({ icon: a.icon, text: a.nextStep, urgent: false })
  })

  return [...urgent, ...focus].slice(0, 6)
}

export function MorningBriefing({ areas }: { areas: Area[] }) {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    setItems(buildItems(areas))
  }, [areas])

  const urgentCount = items.filter((i) => i.urgent).length

  return (
    <div className="glass mb-4 rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span>🌅</span> Dein Tag heute
        </div>
        <div className="text-[11px] text-slate-400">
          {urgentCount > 0 ? `${urgentCount} brauchen Aufmerksamkeit` : 'alles im grünen Bereich'}
        </div>
      </div>

      {urgentCount === 0 && (
        <div className="mb-2 rounded-xl bg-white/5 px-3 py-2 text-[12px] text-slate-300">
          Nichts überfällig — schöner Tag, halte den Schwung. 🌤️
        </div>
      )}

      <div className="space-y-1.5">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2"
            style={{ background: it.urgent ? 'rgba(248,113,113,0.10)' : 'rgba(255,255,255,0.05)' }}
          >
            <span className="text-base">{it.icon}</span>
            <span className={`text-[13px] ${it.urgent ? 'text-red-200' : 'text-slate-200'}`}>{it.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
