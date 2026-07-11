import { describe, it, expect, beforeEach } from 'vitest'
import { getTheme, setTheme, applyTheme, toggleTheme, isTheme } from './theme'

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  it('defaults to light when unset', () => {
    expect(getTheme()).toBe('light')
  })

  it('ignores a garbage stored value and returns light', () => {
    localStorage.setItem('kid-games:theme', 'rainbow')
    expect(getTheme()).toBe('light')
  })

  it('persists and reads back the chosen theme', () => {
    setTheme('dark')
    expect(getTheme()).toBe('dark')
  })

  it('applies the theme to the document root', () => {
    setTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('toggles between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark')
    expect(toggleTheme('dark')).toBe('light')
  })

  it('guards theme values', () => {
    expect(isTheme('dark')).toBe(true)
    expect(isTheme('nope')).toBe(false)
  })
})
