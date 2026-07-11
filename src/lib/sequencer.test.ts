import { describe, it, expect } from 'vitest'
import { createSequencer } from './sequencer'

describe('createSequencer', () => {
  it('always returns the only item for a single-item pool', () => {
    const next = createSequencer(['a'])
    for (let i = 0; i < 20; i++) expect(next()).toBe('a')
  })

  it('never repeats the same item back-to-back (pool > 1)', () => {
    const next = createSequencer([1, 2, 3, 4, 5])
    let prev = next()
    for (let i = 0; i < 2000; i++) {
      const cur = next()
      expect(cur).not.toBe(prev)
      prev = cur
    }
  })

  it('yields every item exactly once before repeating (one full bag)', () => {
    const items = ['a', 'b', 'c', 'd', 'e']
    const next = createSequencer(items)
    const firstCycle = new Set([next(), next(), next(), next(), next()])
    expect(firstCycle).toEqual(new Set(items))
  })

  it('covers all items evenly across many cycles', () => {
    const items = ['a', 'b', 'c']
    const next = createSequencer(items)
    const counts: Record<string, number> = { a: 0, b: 0, c: 0 }
    for (let i = 0; i < 300; i++) counts[next()]++
    // each seen 100 times (300 draws / 3 items), bag guarantees exact balance
    expect(counts.a).toBe(100)
    expect(counts.b).toBe(100)
    expect(counts.c).toBe(100)
  })

  it('throws on an empty pool', () => {
    expect(() => createSequencer([])).toThrow()
  })
})
