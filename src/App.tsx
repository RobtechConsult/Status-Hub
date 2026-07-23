import { useState } from 'react'
import { areas } from './data/mockData'
import { Dashboard } from './components/Dashboard'
import { NextSteps } from './components/NextSteps'
import { AreaDetail } from './components/AreaDetail'
import { BottomNav, type Tab } from './components/BottomNav'

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [openAreaId, setOpenAreaId] = useState<string | null>(null)
  // Entsperrte Bereiche (nur für diese Session, kein Speichern in Phase 1)
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>({})

  const openArea = openAreaId ? areas.find((a) => a.id === openAreaId) ?? null : null

  return (
    <div className="mx-auto min-h-full max-w-2xl pb-28">
      {openArea ? (
        <AreaDetail
          area={openArea}
          unlocked={!!unlocked[openArea.id]}
          onBack={() => setOpenAreaId(null)}
          onUnlock={() => setUnlocked((u) => ({ ...u, [openArea.id]: true }))}
        />
      ) : tab === 'dashboard' ? (
        <Dashboard areas={areas} unlocked={unlocked} onOpen={setOpenAreaId} />
      ) : (
        <NextSteps areas={areas} onOpen={setOpenAreaId} />
      )}

      {!openArea && <BottomNav active={tab} onChange={setTab} />}
    </div>
  )
}
