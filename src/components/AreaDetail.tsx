import type { Area, ProgressGoal } from '../types'
import { statusColor, statusLabel, trendGlyph, trendColor, formatEuro } from '../lib/ui'
import { LineChart, ProgressBar, ProgressRing } from './charts'
import { RangeTracker } from './RangeTracker'
import { DailyGoalCard } from './DailyGoalCard'
import { FinanceGate } from './FinanceGate'

function goalProgress(g: ProgressGoal): number {
  if (g.invert && g.start != null) {
    // Schuldenabbau: von start → target(0)
    const total = g.start - g.target
    return total <= 0 ? 1 : (g.start - g.current) / total
  }
  return g.target === 0 ? 0 : g.current / g.target
}

export function AreaDetail({
  area,
  unlocked,
  onBack,
  onUnlock,
}: {
  area: Area
  unlocked: boolean
  onBack: () => void
  onUnlock: () => void
}) {
  const { detail } = area
  const gated = area.locked && !unlocked

  return (
    <div className="pt-safe px-4">
      {/* Header */}
      <div className="mb-4 mt-2 flex items-center gap-3">
        <button
          onClick={onBack}
          className="glass flex h-9 w-9 items-center justify-center rounded-full text-lg active:scale-95"
          aria-label="Zurück"
        >
          ‹
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{area.icon}</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">{area.name}</h1>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: statusColor[area.status] }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: statusColor[area.status] }} />
              {statusLabel[area.status]}
            </div>
          </div>
        </div>
      </div>

      {gated ? (
        <div className="glass rounded-2xl">
          <FinanceGate accent={area.accent} onUnlock={onUnlock} />
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {/* Next Step Banner */}
          <div className="glass flex items-center gap-3 rounded-2xl p-4">
            <span className="text-lg" style={{ color: area.accent }}>
              ➜
            </span>
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">Nächster Schritt</div>
              <div className="text-sm font-medium">{area.nextStep}</div>
            </div>
          </div>

          {/* Streak + Goals Ring */}
          {(detail.streak || detail.goals?.length) && (
            <div className="grid grid-cols-2 gap-3">
              {detail.streak && (
                <div className="glass flex flex-col items-center justify-center rounded-2xl p-4">
                  <div className="text-3xl">🔥</div>
                  <div className="mt-1 text-2xl font-bold">{detail.streak.days}</div>
                  <div className="text-[11px] text-slate-400">Tage {detail.streak.label}</div>
                </div>
              )}
              {detail.goals?.[0] && (
                <div className="glass flex flex-col items-center justify-center rounded-2xl p-4">
                  <ProgressRing
                    value={goalProgress(detail.goals[0])}
                    accent={area.accent}
                    label={`${Math.round(goalProgress(detail.goals[0]) * 100)}%`}
                    sub={detail.goals[0].label}
                  />
                </div>
              )}
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {detail.metrics.map((m, i) => (
              <div key={i} className="glass rounded-2xl p-3.5">
                <div className="text-[11px] uppercase tracking-wide text-slate-400">{m.label}</div>
                <div className="mt-0.5 text-lg font-bold">{m.value}</div>
                {m.hint && <div className="text-[11px] text-slate-500">{m.hint}</div>}
              </div>
            ))}
          </div>

          {/* Mess-Tracker mit Zeitraum-Umschaltung (z. B. Gewicht) */}
          {detail.trackers?.map((t) => (
            <RangeTracker key={t.id} tracker={t} accent={area.accent} />
          ))}

          {/* Tagesziele (z. B. Schritte) */}
          {detail.dailyGoals?.map((g) => (
            <DailyGoalCard key={g.id} goal={g} accent={area.accent} />
          ))}

          {/* Verlaufs-Graph */}
          {detail.series && (
            <div className="glass rounded-2xl p-4">
              <div className="mb-1 flex items-center justify-between">
                <div className="text-sm font-medium">{detail.series.title}</div>
                <div className="text-[11px]" style={{ color: trendColor(area.trend) }}>
                  {trendGlyph(area.trend)} {area.trendLabel}
                </div>
              </div>
              <LineChart data={detail.series.data} accent={area.accent} unit={detail.series.unit} />
            </div>
          )}

          {/* Alle Ziele als Balken */}
          {detail.goals && detail.goals.length > 0 && (
            <div className="glass space-y-3 rounded-2xl p-4">
              <div className="text-sm font-medium">Ziele</div>
              {detail.goals.map((g, i) => (
                <div key={i}>
                  <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                    <span>{g.label}</span>
                    <span>
                      {g.invert && g.start != null
                        ? `${formatEuro(g.current)} von ${formatEuro(g.start)}`
                        : `${g.current} / ${g.target}${g.unit ? ' ' + g.unit : ''}`}
                    </span>
                  </div>
                  <ProgressBar value={goalProgress(g)} accent={area.accent} />
                </div>
              ))}
            </div>
          )}

          {/* Beziehung: Pflege-Bausteine */}
          {detail.buildingBlocks && (
            <div className="glass rounded-2xl p-4">
              <div className="mb-3 text-sm font-medium">Bausteine der Beziehung</div>
              <div className="grid grid-cols-2 gap-3">
                {detail.buildingBlocks.map((b, i) => (
                  <div key={i} className="rounded-xl bg-white/5 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{b.icon}</span>
                      <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: statusColor[b.status] }} />
                    </div>
                    <div className="mt-2 text-sm font-medium">{b.label}</div>
                    <div className="text-[11px] text-slate-400">{b.lastLabel}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Finanzen: offene Rechnungen */}
          {detail.bills && (
            <div className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-medium">Offene Rechnungen</div>
                <div className="text-[11px] text-slate-400">
                  {detail.bills.filter((b) => b.status !== 'paid').length} offen
                </div>
              </div>
              <div className="space-y-2">
                {detail.bills.map((b, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
                    <div>
                      <div className="text-sm">{b.name}</div>
                      <div className="text-[11px] text-slate-500">fällig {b.due}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{formatEuro(b.amount)}</span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: b.status === 'overdue' ? '#f8717122' : '#38bdf822',
                          color: b.status === 'overdue' ? '#f87171' : '#38bdf8',
                        }}
                      >
                        {b.status === 'overdue' ? 'überfällig' : b.status === 'paid' ? 'bezahlt' : 'offen'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
