import type { SeriesPoint } from '../types'

// ── Sparkline: kompakte Mini-Linie für Kacheln ───────────────────────────────
export function Sparkline({
  data,
  accent,
  width = 120,
  height = 36,
}: {
  data: SeriesPoint[]
  accent: string
  width?: number
  height?: number
}) {
  if (data.length < 2) return null
  const values = data.map((d) => d.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const stepX = width / (data.length - 1)
  const pts = values.map((v, i) => {
    const x = i * stepX
    const y = height - ((v - min) / span) * (height - 4) - 2
    return [x, y] as const
  })
  const path = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [lx, ly] = pts[pts.length - 1]
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={path} fill="none" stroke={accent} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
      <circle cx={lx} cy={ly} r={2.6} fill={accent} />
    </svg>
  )
}

// ── LineChart: große Verlaufskurve mit Verlaufsfüllung ───────────────────────
export function LineChart({
  data,
  accent,
  unit = '',
  height = 180,
  goalLine,
}: {
  data: SeriesPoint[]
  accent: string
  unit?: string
  height?: number
  goalLine?: number
}) {
  const width = 320
  const padX = 6
  const padTop = 14
  const padBottom = 24
  const values = data.map((d) => d.value)
  // Zielline in die Skala einbeziehen, damit sie sichtbar bleibt.
  const scaleVals = goalLine != null ? [...values, goalLine] : values
  const min = Math.min(...scaleVals)
  const max = Math.max(...scaleVals)
  const span = max - min || 1
  const innerW = width - padX * 2
  const innerH = height - padTop - padBottom
  const stepX = innerW / (data.length - 1)
  const yOf = (v: number) => padTop + innerH - ((v - min) / span) * innerH
  const pts = values.map((v, i) => [padX + i * stepX, yOf(v)] as const)
  const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1][0]},${padTop + innerH} L${pts[0][0]},${padTop + innerH} Z`
  const gid = `grad-${accent.replace('#', '')}`
  const showEvery = Math.ceil(data.length / 8) // Labels ausdünnen bei vielen Punkten
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} stopOpacity="0.35" />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {goalLine != null && (
        <>
          <line
            x1={padX}
            x2={width - padX}
            y1={yOf(goalLine)}
            y2={yOf(goalLine)}
            stroke="#ffffff"
            strokeOpacity="0.35"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
          <text x={width - padX} y={yOf(goalLine) - 3} fontSize="8" fill="#b8c0d0" textAnchor="end">
            Ziel {goalLine.toLocaleString('de-DE')}
            {unit}
          </text>
        </>
      )}
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === pts.length - 1 ? 4 : 2.5} fill={accent} />
      ))}
      {data.map((d, i) =>
        i % showEvery === 0 || i === data.length - 1 ? (
          <text key={i} x={pts[i][0]} y={height - 6} fontSize="9" fill="#8892a6" textAnchor="middle">
            {d.label}
          </text>
        ) : null,
      )}
      <text x={padX} y={11} fontSize="9" fill="#8892a6">
        {max.toLocaleString('de-DE')}
        {unit}
      </text>
    </svg>
  )
}

// ── ProgressRing: Fortschrittsring ───────────────────────────────────────────
export function ProgressRing({
  value,
  accent,
  size = 108,
  label,
  sub,
}: {
  value: number // 0..1
  accent: string
  size?: number
  label: string
  sub?: string
}) {
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, value))
  const offset = c * (1 - clamped)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease', filter: `drop-shadow(0 0 6px ${accent}88)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold">{label}</span>
        {sub && <span className="text-[10px] text-slate-400">{sub}</span>}
      </div>
    </div>
  )
}

// ── ProgressBar: schlanker Fortschrittsbalken ────────────────────────────────
export function ProgressBar({ value, accent }: { value: number; accent: string }) {
  const pct = Math.max(0, Math.min(1, value)) * 100
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: accent, boxShadow: `0 0 10px ${accent}aa` }}
      />
    </div>
  )
}
