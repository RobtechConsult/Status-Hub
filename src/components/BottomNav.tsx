export type Tab = 'dashboard' | 'nextsteps'

export function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Übersicht', icon: '◱' },
    { id: 'nextsteps', label: 'Next Steps', icon: '✓' },
  ]
  return (
    <nav className="pb-safe fixed inset-x-0 bottom-0 z-20 flex justify-center">
      <div className="glass mb-3 flex gap-1 rounded-full p-1.5">
        {items.map((it) => {
          const on = active === it.id
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className="flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all"
              style={{
                background: on ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: on ? '#fff' : '#94a3b8',
              }}
            >
              <span>{it.icon}</span>
              {it.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
