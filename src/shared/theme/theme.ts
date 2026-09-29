export const THEME_STORAGE_KEY = 'nexa.theme'

export type Theme = 'dark' | 'light'

export const THEMES: readonly Theme[] = ['dark', 'light'] as const

export const DEFAULT_THEME: Theme = 'dark'

/**
 * JS mirror of the primitives in `palette.css`. Needed where a color must be
 * handed to a library that reads JS (SVG chart strokes, avatar backgrounds).
 * Anything styleable from CSS should use the Tailwind token instead.
 */
export const BRAND = {
  accentBlue: '#4C7DFF',
  accentViolet: '#8B6CFF',
  success: '#2FD498',
  warning: '#F5B94A',
  danger: '#F2555F',
} as const

export const AVATAR_COLORS: readonly string[] = [
  BRAND.accentBlue,
  BRAND.accentViolet,
  BRAND.success,
  BRAND.warning,
  BRAND.danger,
  '#3FB8D9',
  '#E06AC4',
] as const
