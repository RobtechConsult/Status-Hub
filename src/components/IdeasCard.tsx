import { useState } from 'react'
import type { IdeaCategory } from '../types'

// Ideen-Motor: kuratierter Pool mit Kategorie-Auswahl + „Nächste Idee".
// Architektur bewusst so, dass die Quelle später gegen KI-Generierung
// (Claude-API) getauscht werden kann — die Bedienung bleibt gleich.
export function IdeasCard({ categories, accent }: { categories: IdeaCategory[]; accent: string }) {
  const [catIdx, setCatIdx] = useState(0)
  const [ideaIdx, setIdeaIdx] = useState(0)
  const cat = categories[catIdx] ?? categories[0]
  const idea = cat.ideas[ideaIdx % cat.ideas.length]

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <span>💡</span> Ideen
        </div>
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
          kuratiert · bald KI-generiert
        </span>
      </div>

      {/* Kategorie-Auswahl */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {categories.map((c, i) => (
          <button
            key={c.key}
            onClick={() => {
              setCatIdx(i)
              setIdeaIdx(0)
            }}
            className="rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors"
            style={{
              background: i === catIdx ? accent : 'rgba(255,255,255,0.06)',
              color: i === catIdx ? '#08111e' : '#94a3b8',
            }}
          >
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {/* Aktuelle Idee */}
      <div className="rounded-xl bg-white/5 p-4 text-center">
        <div className="text-base font-medium">{idea}</div>
      </div>

      <button
        onClick={() => setIdeaIdx((n) => n + 1)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-transform active:scale-95"
        style={{ background: `${accent}22`, color: accent }}
      >
        ↻ Nächste Idee
      </button>
    </div>
  )
}
