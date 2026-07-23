import { useState } from 'react'
import type { MetricTracker } from '../types'
import { LineChart } from './charts'

// Mess-Tracker mit umschaltbaren Zeiträumen (z. B. Gewicht: 7 Tage / 4 Wochen / Monate)
export function RangeTracker({ tracker, accent }: { tracker: MetricTracker; accent: string }) {
  const [active, setActive] = useState(0)
  const range = tracker.ranges[active] ?? tracker.ranges[0]

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium">
            {tracker.icon && <span>{tracker.icon}</span>}
            {tracker.title}
          </div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold">{tracker.current}</span>
            {tracker.sub && <span className="text-[11px] text-slate-400">{tracker.sub}</span>}
          </div>
        </div>
        {tracker.source && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
            {tracker.source}
          </span>
        )}
      </div>

      {/* Zeitraum-Umschalter */}
      <div className="mb-2 inline-flex rounded-lg bg-white/5 p-0.5 text-[11px]">
        {tracker.ranges.map((r, i) => (
          <button
            key={r.key}
            onClick={() => setActive(i)}
            className="rounded-md px-2.5 py-1 font-medium transition-colors"
            style={{
              background: i === active ? accent : 'transparent',
              color: i === active ? '#08111e' : '#94a3b8',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      <LineChart data={range.data} accent={accent} unit={tracker.unit} goalLine={tracker.goalLine} />
    </div>
  )
}
