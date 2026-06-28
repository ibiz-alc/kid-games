import { describe, it, expect } from 'vitest'
import { randInt, shuffle, pickDistinct } from './random'

describe('randInt', () => {
  it('stays within inclusive bounds over many runs', () => {
    for (let i = 0; i < 500; i++) {
      const n = randInt(1, 10)
      expect(n).toBeGreaterThanOrEqual(1)
      expect(n).toBeLessThanOrEqual(10)
      expect(Number.isInteger(n)).toBe(true)
    }
  })

  it('can return both endpoints', () => {
    const seen = new Set<number>()
    for (let i = 0; i < 500; i++) seen.add(randInt(1, 2))
    expect(seen.has(1)).toBe(true)
    expect(seen.has(2)).toBe(true)
  })
})

describe('shuffle', () => {
  it('keeps the same multiset of items', () => {
    const input = [1, 2, 3, 4, 5]
    const out = shuffle(input)
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('does not mutate the input array', () => {
    const input = [1, 2, 3]
    shuffle(input)
    expect(input).toEqual([1, 2, 3])
  })
})

describe('pickDistinct', () => {
  it('returns the requested count of distinct items', () => {
    const out = pickDistinct(['a', 'b', 'c', 'd', 'e'], 3)
    expect(out).toHaveLength(3)
    expect(new Set(out).size).toBe(3)
  })

  it('excludes the given items', () => {
    for (let i = 0; i < 200; i++) {
      const out = pickDistinct(['a', 'b', 'c', 'd'], 2, ['a'])
      expect(out).not.toContain('a')
      expect(out).toHaveLength(2)
    }
  })
})
