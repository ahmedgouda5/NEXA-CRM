import { AVATAR_COLORS } from '@/shared/theme/theme'

/** Deterministic brand color for an avatar/logo chip from any string seed. */
export function colorFor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function initials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function fmtMoney(value: number): string {
  return `$${value.toLocaleString('en-US')}`
}

export function fmtPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}
