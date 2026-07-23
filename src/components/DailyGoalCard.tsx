import type { DailyGoal } from '../types'
import { ProgressBar } from './charts'

function fmt(n: number) {
  return n.toLocaleString('de-DE')
}

// Tagesziel mit Fortschritt (heute) + Vergleichszeiträume (z. B. Schritte)
export function DailyGoalCard({ goal, accent }: { goal: DailyGoal; accent: string }) {
  const pct = goal.goal > 0 ? goal.today / goal.goal : 0
  const reached = pct >= 1
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          {goal.icon && <span>{goal.icon}</span>}
          {goal.title}
        </div>
        {goal.source && (
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">{goal.source}</span>
        )}
      </div>

      {/* Heute */}
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[11px] uppercase tracking-wide text-slate-400">Heute</span>
        <span className="text-[11px] text-slate-400">
          {fmt(goal.today)} / {fmt(goal.goal)} {goal.unit}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <ProgressBar value={pct} accent={accent} />
        </div>
        <span className="w-12 text-right text-sm font-bold" style={{ color: reached ? accent : '#e5e9f2' }}>
          {Math.round(pct * 100)}%
        </span>
      </div>

      {/* Vergleichszeiträume */}
      {goal.periods.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {goal.periods.map((p, i) => (
            <div key={i} className="rounded-xl bg-white/5 p-2.5">
              <div className="text-[11px] text-slate-400">{p.label}</div>
              <div className="text-base font-semibold">
                {fmt(p.value)} <span className="text-[10px] font-normal text-slate-500">{goal.unit}</span>
              </div>
              {p.goal != null && (
                <div className="mt-1">
                  <ProgressBar value={p.goal > 0 ? p.value / p.goal : 0} accent={accent} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
