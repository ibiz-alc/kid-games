import { describe, it, expect, beforeEach } from 'vitest'
import { getStars, recordStars, getSetting, setSetting } from './storage'

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns 0 for an unknown game', () => {
    expect(getStars('numbers')).toBe(0)
  })

  it('records and reads back stars', () => {
    recordStars('numbers', 2)
    expect(getStars('numbers')).toBe(2)
  })

  it('keeps the highest value and ignores a lower one', () => {
    recordStars('numbers', 3)
    recordStars('numbers', 1)
    expect(getStars('numbers')).toBe(3)
  })

  it('keeps stars separate per game', () => {
    recordStars('numbers', 3)
    recordStars('colors', 1)
    expect(getStars('numbers')).toBe(3)
    expect(getStars('colors')).toBe(1)
  })
})

describe('settings', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns the fallback when unset', () => {
    expect(getSetting('k2-seconds', 15)).toBe(15)
  })

  it('writes and reads back a value', () => {
    setSetting('k2-seconds', 20)
    expect(getSetting('k2-seconds', 15)).toBe(20)
  })

  it('returns the fallback for a non-numeric stored value', () => {
    localStorage.setItem('kid-games:setting:k2-seconds', 'oops')
    expect(getSetting('k2-seconds', 15)).toBe(15)
  })
})
