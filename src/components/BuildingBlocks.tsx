import type { BuildingBlock, Status } from '../types'
import { statusColor } from '../lib/ui'
import { ProgressBar } from './charts'

// Ampel aus Rhythmus ableiten: wie weit ist das Ziel-Intervall aufgebraucht?
function cadenceStatus(b: BuildingBlock): { status: Status; overdue: boolean; ratio: number } {
  if (b.daysSince == null || b.targetDays == null) {
    return { status: b.status, overdue: false, ratio: 0 }
  }
  const ratio = b.daysSince / b.targetDays
  const overdue = b.daysSince > b.targetDays
  const status: Status = ratio <= 0.75 ? 'green' : ratio <= 1 ? 'yellow' : 'red'
  return { status, overdue, ratio: Math.min(ratio, 1) }
}

export function BuildingBlocks({ blocks, accent }: { blocks: BuildingBlock[]; accent: string }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Pflege-Bausteine</div>
        <div className="text-[11px] text-slate-400">deine Fürsorge-Konstanz</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {blocks.map((b, i) => {
          const { status, overdue, ratio } = cadenceStatus(b)
          return (
            <div key={i} className="rounded-xl bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xl">{b.icon}</span>
                {overdue ? (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-300">
                    fällig
                  </span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[status] }} />
                )}
              </div>
              <div className="mt-2 text-sm font-medium">{b.label}</div>
              <div className="text-[11px] text-slate-400">{b.lastLabel}</div>
              {b.targetDays != null && (
                <div className="mt-2">
                  <ProgressBar value={overdue ? 1 : ratio} accent={overdue ? '#f87171' : accent} />
                  <div className="mt-1 text-[10px] text-slate-500">Ziel: alle {b.targetDays} Tage</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
