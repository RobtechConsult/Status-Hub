// Generischer lokaler Speicher (nur auf dem Gerät) für editierbare Listen.
// Real eingegebene Daten bleiben so lokal und landen NICHT im öffentlichen Repo.

export function loadList<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw) as T[]
    if (seed.length) localStorage.setItem(key, JSON.stringify(seed))
    return seed
  } catch {
    return seed
  }
}

export function saveList<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items))
  } catch {
    /* localStorage nicht verfügbar */
  }
}

export function newId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return 'id-' + Date.now() + '-' + Math.floor(Math.random() * 1e6)
  }
}
