import type { Area } from '../types'
import { AreaCard } from './AreaCard'
import { BackupPanel } from './BackupPanel'
import { MorningBriefing } from './MorningBriefing'

export function Dashboard({
  areas,
  unlocked,
  onOpen,
}: {
  areas: Area[]
  unlocked: Record<string, boolean>
  onOpen: (id: string) => void
}) {
  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const greenCount = areas.filter((a) => a.status === 'green').length

  return (
    <div className="pt-safe px-4">
      <header className="mb-5 mt-2">
        <div className="text-xs uppercase tracking-widest text-slate-400">{today}</div>
        <h1 className="mt-1 text-2xl font-bold">
          Guten Morgen 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          {greenCount} von {areas.length} Bereichen on track. Dein Cockpit auf einen Blick.
        </p>
      </header>

      <MorningBriefing areas={areas} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {areas.map((area, i) => (
          <div key={area.id} className="animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <AreaCard area={area} unlocked={!!unlocked[area.id]} onOpen={() => onOpen(area.id)} />
          </div>
        ))}
      </div>

      <div className="mt-3">
        <BackupPanel accent="#38bdf8" />
      </div>
    </div>
  )
}
