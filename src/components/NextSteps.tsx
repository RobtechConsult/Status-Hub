import { useState } from 'react'
import type { Area } from '../types'
import { statusColor } from '../lib/ui'

export function NextSteps({ areas, onOpen }: { areas: Area[]; onOpen: (id: string) => void }) {
  // Nur visuell in Phase 1 — kein Speichern.
  const [done, setDone] = useState<Record<string, boolean>>({})
  const doneCount = Object.values(done).filter(Boolean).length

  return (
    <div className="pt-safe px-4">
      <header className="mb-5 mt-2">
        <h1 className="text-2xl font-bold">Next Steps</h1>
        <p className="mt-1 text-sm text-slate-400">
          {doneCount} / {areas.length} erledigt — dein Fokus für heute.
        </p>
      </header>

      <div className="space-y-3">
        {areas.map((area) => {
          const isDone = !!done[area.id]
          return (
            <div key={area.id} className="glass flex items-center gap-3 rounded-2xl p-3.5">
              <button
                onClick={() => setDone((d) => ({ ...d, [area.id]: !d[area.id] }))}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                style={{
                  borderColor: isDone ? area.accent : 'rgba(255,255,255,0.25)',
                  background: isDone ? area.accent : 'transparent',
                }}
                aria-label="Als erledigt markieren"
              >
                {isDone && <span className="text-xs text-black">✓</span>}
              </button>

              <div className="min-w-0 flex-1" onClick={() => onOpen(area.id)}>
                <div className="flex items-center gap-1.5 text-[11px]" style={{ color: statusColor[area.status] }}>
                  <span>{area.icon}</span>
                  <span className="text-slate-400">{area.name}</span>
                </div>
                <div className={`truncate text-sm ${isDone ? 'text-slate-500 line-through' : 'text-slate-100'}`}>
                  {area.nextStep}
                </div>
              </div>

              <button onClick={() => onOpen(area.id)} className="shrink-0 text-slate-500 hover:text-slate-300">
                ›
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
