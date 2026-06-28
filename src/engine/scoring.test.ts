import { describe, it, expect } from 'vitest'
import { starsFor } from './scoring'

describe('starsFor', () => {
  it('gives 3 stars for 8-10 correct', () => {
    expect(starsFor(8)).toBe(3)
    expect(starsFor(10)).toBe(3)
  })
  it('gives 2 stars for 5-7 correct', () => {
    expect(starsFor(5)).toBe(2)
    expect(starsFor(7)).toBe(2)
  })
  it('gives 1 star for 1-4 correct', () => {
    expect(starsFor(1)).toBe(1)
    expect(starsFor(4)).toBe(1)
  })
  it('gives 0 stars for 0 correct', () => {
    expect(starsFor(0)).toBe(0)
  })
})
