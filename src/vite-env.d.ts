/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Passwort für den Finanzen-Sichtschutz (nur zur Build-Zeit, nicht im Repo). */
  readonly VITE_FINANCE_PASSWORD?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
