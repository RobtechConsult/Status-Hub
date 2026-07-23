import type { Status, Trend } from '../types'

export const statusColor: Record<Status, string> = {
  green: '#34d399',
  yellow: '#fbbf24',
  red: '#f87171',
}

export const statusDot: Record<Status, string> = {
  green: '🟢',
  yellow: '🟡',
  red: '🔴',
}

export const statusLabel: Record<Status, string> = {
  green: 'On Track',
  yellow: 'Achtung',
  red: 'Vernachlässigt',
}

export function trendGlyph(trend: Trend): string {
  return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
}

/**
 * Farbe eines Trends — je nach Bereich kann "runter" gut sein (invert),
 * z. B. sinkende Restschuld.
 */
export function trendColor(trend: Trend, invert = false): string {
  const good = '#34d399'
  const bad = '#f87171'
  const neutral = '#94a3b8'
  if (trend === 'flat') return neutral
  const isGood = invert ? trend === 'down' : trend === 'up'
  return isGood ? good : bad
}

export function formatEuro(n: number): string {
  return n.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €'
}
