import { useEffect, useState } from 'react'
import type { BuildingBlock, Status } from '../types'
import { statusColor } from '../lib/ui'
import { ProgressBar } from './charts'
import { loadList, saveList } from '../lib/localStore'

const KEY = 'sh_rel_done_v1'

function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysSinceISO(iso: string): number {
  const now = new Date()
  const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const then = new Date(iso + 'T00:00:00').getTime()
  return Math.max(0, Math.round((t0 - then) / 86400000))
}

function label(n: number): string {
  if (n <= 0) return 'heute'
  if (n === 1) return 'gestern'
  return `vor ${n} Tagen`
}

function cadence(days: number, target?: number): { status: Status; overdue: boolean; ratio: number } {
  if (target == null) return { status: 'green', overdue: false, ratio: 0 }
  const ratio = days / target
  return {
    status: ratio <= 0.75 ? 'green' : ratio <= 1 ? 'yellow' : 'red',
    overdue: days > target,
    ratio: Math.min(ratio, 1),
  }
}

export function BuildingBlocks({ blocks, accent }: { blocks: BuildingBlock[]; accent: string }) {
  const [done, setDone] = useState<Record<string, string>>({})

  // Laden + fehlende Bausteine aus den Startwerten (daysSince) initialisieren
  useEffect(() => {
    const stored = loadList<{ id: string; date: string }>(KEY, [])
    const map: Record<string, string> = {}
    stored.forEach((e) => (map[e.id] = e.date))
    let changed = false
    blocks.forEach((b) => {
      if (b.id && map[b.id] == null) {
        const d = new Date()
        d.setDate(d.getDate() - (b.daysSince ?? 0))
        map[b.id] = d.toISOString().slice(0, 10)
        changed = true
      }
    })
    if (changed) saveList(KEY, Object.entries(map).map(([id, date]) => ({ id, date })))
    setDone(map)
  }, [blocks])

  function markDone(id: string) {
    const next = { ...done, [id]: todayISO() }
    setDone(next)
    saveList(KEY, Object.entries(next).map(([id, date]) => ({ id, date })))
  }

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Pflege-Bausteine</div>
        <div className="text-[11px] text-slate-400">tippen, wenn erledigt</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {blocks.map((b, i) => {
          const iso = b.id ? done[b.id] : undefined
          const days = iso ? daysSinceISO(iso) : b.daysSince ?? 0
          const { status, overdue, ratio } = cadence(days, b.targetDays)
          return (
            <div key={b.id ?? i} className="flex flex-col rounded-xl bg-white/5 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xl">{b.icon}</span>
                {overdue ? (
                  <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-medium text-red-300">fällig</span>
                ) : (
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[status] }} />
                )}
              </div>
              <div className="mt-2 text-sm font-medium">{b.label}</div>
              <div className="text-[11px] text-slate-400">{label(days)}</div>
              {b.targetDays != null && (
                <div className="mt-2">
                  <ProgressBar value={overdue ? 1 : ratio} accent={overdue ? '#f87171' : accent} />
                  <div className="mt-1 text-[10px] text-slate-500">Ziel: alle {b.targetDays} Tage</div>
                </div>
              )}
              <button
                onClick={() => b.id && markDone(b.id)}
                className="mt-2.5 rounded-lg py-1.5 text-[12px] font-semibold transition-transform active:scale-95"
                style={{ background: days <= 0 ? 'rgba(255,255,255,0.08)' : `${accent}22`, color: days <= 0 ? '#94a3b8' : accent }}
              >
                {days <= 0 ? '✓ heute erledigt' : '✓ Erledigt'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
