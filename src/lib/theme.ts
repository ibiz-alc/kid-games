export type Theme = 'light' | 'dark'

const KEY = 'kid-games:theme'

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark'
}

export function getTheme(): Theme {
  const raw = localStorage.getItem(KEY)
  return isTheme(raw) ? raw : 'light'
}

export function applyTheme(theme: Theme): void {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme
  }
}

export function setTheme(theme: Theme): void {
  localStorage.setItem(KEY, theme)
  applyTheme(theme)
}

export function toggleTheme(current: Theme): Theme {
  return current === 'light' ? 'dark' : 'light'
}
