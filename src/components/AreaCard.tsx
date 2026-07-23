import type { Area } from '../types'
import { statusColor, statusLabel, trendGlyph, trendColor } from '../lib/ui'
import { Sparkline } from './charts'

export function AreaCard({
  area,
  unlocked,
  onOpen,
}: {
  area: Area
  unlocked: boolean
  onOpen: () => void
}) {
  const isHidden = area.locked && !unlocked
  return (
    <button
      onClick={onOpen}
      className="glass group relative w-full rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99]"
      style={{ boxShadow: `0 0 0 0 ${area.accent}` }}
    >
      {/* Akzent-Glow oben */}
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-70"
        style={{ background: `linear-gradient(90deg, transparent, ${area.accent}, transparent)` }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl" aria-hidden>
            {area.icon}
          </span>
          <div>
            <div className="font-semibold leading-tight">{area.name}</div>
            <div className="flex items-center gap-1.5 text-[11px]" style={{ color: statusColor[area.status] }}>
              <span className="inline-block h-2 w-2 rounded-full" style={{ background: statusColor[area.status] }} />
              {statusLabel[area.status]}
            </div>
          </div>
        </div>
        {area.locked && (
          <span className="text-xs text-slate-400" title="Passwortgeschützt">
            {unlocked ? '🔓' : '🔒'}
          </span>
        )}
      </div>

      {isHidden ? (
        <div className="mt-4 flex flex-col items-center justify-center gap-1 py-3 text-center">
          <span className="text-2xl">🔒</span>
          <span className="text-sm text-slate-300">Passwortgeschützt</span>
          <span className="text-[11px] text-slate-500">Tippen zum Entsperren</span>
        </div>
      ) : (
        <>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-slate-400">{area.kpiLabel}</div>
              <div className="text-2xl font-bold">{area.kpiValue}</div>
              <div className="mt-0.5 text-[11px] font-medium" style={{ color: trendColor(area.trend) }}>
                {trendGlyph(area.trend)} {area.trendLabel}
              </div>
            </div>
            {area.detail.series && (
              <Sparkline data={area.detail.series.data} accent={area.accent} />
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
            <span className="text-xs" style={{ color: area.accent }}>
              ➜
            </span>
            <span className="text-xs text-slate-200">{area.nextStep}</span>
          </div>
        </>
      )}
    </button>
  )
}
