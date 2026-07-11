import { describe, it, expect } from 'vitest'
import { starsFor, starsForScore } from './scoring'

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

describe('starsForScore', () => {
  it('scales to the round length', () => {
    expect(starsForScore(5, 5)).toBe(3)
    expect(starsForScore(4, 5)).toBe(3) // 0.8
    expect(starsForScore(3, 5)).toBe(2) // 0.6
    expect(starsForScore(2, 5)).toBe(1) // 0.4
    expect(starsForScore(1, 5)).toBe(1)
    expect(starsForScore(0, 5)).toBe(0)
  })
  it('matches starsFor for a 10-question round', () => {
    for (let c = 0; c <= 10; c++) {
      expect(starsForScore(c, 10)).toBe(starsFor(c))
    }
  })
})
