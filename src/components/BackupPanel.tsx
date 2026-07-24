import { useRef, useState } from 'react'

// Lokale Daten sichern/wiederherstellen, solange es noch keine Cloud gibt.
// Exportiert/importiert alle 'sh_*'-Schlüssel aus dem localStorage als JSON-Datei.
export function BackupPanel({ accent }: { accent: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState<string | null>(null)

  function collect(): Record<string, string> {
    const data: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k.startsWith('sh_')) {
        const v = localStorage.getItem(k)
        if (v != null) data[k] = v
      }
    }
    return data
  }

  function exportData() {
    const payload = { app: 'status-hub', version: 1, data: collect() }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const d = new Date()
    a.download = `status-hub-backup-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('Backup heruntergeladen ✓')
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const data = parsed?.data ?? {}
        const keys = Object.keys(data).filter((k) => k.startsWith('sh_'))
        if (!keys.length) {
          setMsg('Keine Status-Hub-Daten in der Datei gefunden.')
          return
        }
        if (!window.confirm(`${keys.length} Datensätze importieren? Deine aktuellen lokalen Daten werden überschrieben.`)) return
        keys.forEach((k) => localStorage.setItem(k, data[k]))
        setMsg('Import erfolgreich – App wird neu geladen …')
        setTimeout(() => location.reload(), 800)
      } catch {
        setMsg('Ungültige Datei.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const count = Object.keys(collect()).length

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-1 flex items-center gap-1.5 text-sm font-medium">
        <span>🛟</span> Daten sichern
      </div>
      <p className="mb-3 text-[11px] text-slate-400">
        Deine Eingaben liegen nur auf diesem Gerät. Sichere sie regelmäßig als Datei – bis die Cloud kommt.
        {count > 0 && <> ({count} gespeichert)</>}
      </p>
      <div className="flex gap-2">
        <button
          onClick={exportData}
          className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-black transition-transform active:scale-95"
          style={{ background: accent }}
        >
          ⬇ Exportieren
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 rounded-xl bg-white/10 py-2.5 text-sm font-semibold text-slate-200 transition-transform active:scale-95"
        >
          ⬆ Importieren
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" onChange={onFile} className="hidden" />
      </div>
      {msg && <div className="mt-2 text-center text-[11px] text-slate-400">{msg}</div>}
    </div>
  )
}
