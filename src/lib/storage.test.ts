import { describe, it, expect, beforeEach } from 'vitest'
import { getStars, recordStars } from './storage'

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
