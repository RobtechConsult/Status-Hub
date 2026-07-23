import type { ImportantDate } from '../types'

// Countdown-Farbe: je näher, desto wärmer
function urgencyColor(days: number, accent: string): string {
  if (days <= 7) return '#fbbf24'
  if (days <= 21) return accent
  return '#94a3b8'
}

export function ImportantDates({ dates, accent }: { dates: ImportantDate[]; accent: string }) {
  const sorted = [...dates].sort((a, b) => a.daysUntil - b.daysUntil)
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-1.5 text-sm font-medium">
        <span>🗓️</span> Wichtige Termine
      </div>
      <div className="space-y-2">
        {sorted.map((d, i) => {
          const color = urgencyColor(d.daysUntil, accent)
          return (
            <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{d.icon ?? '🎉'}</span>
                <div>
                  <div className="text-sm">{d.label}</div>
                  <div className="text-[11px] text-slate-500">{d.when}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold leading-none" style={{ color }}>
                  {d.daysUntil}
                </div>
                <div className="text-[10px] text-slate-500">Tage</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
