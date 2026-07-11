import { describe, it, expect } from 'vitest'
import { mathGame, MAX_SUM, MAX_DIFF } from './math'

describe('mathGame', () => {
  it('has the expected identity', () => {
    expect(mathGame.id).toBe('math')
  })

  it('produces valid addition questions (sum <= 30, |a-b| <= 10) over many runs', () => {
    for (let i = 0; i < 500; i++) {
      const q = mathGame.generateQuestion()
      expect(q.prompt.kind).toBe('math')
      const { a, b } = q.prompt as { kind: 'math'; a: number; b: number }
      expect(a).toBeGreaterThanOrEqual(1)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(a + b).toBeLessThanOrEqual(MAX_SUM)
      expect(Math.abs(a - b)).toBeLessThanOrEqual(MAX_DIFF)

      expect(q.choices).toHaveLength(4)
      const correct = q.choices.filter((c) => c.correct)
      expect(correct).toHaveLength(1)
      expect(correct[0].label).toBe(String(a + b))

      const ids = q.choices.map((c) => c.id)
      expect(new Set(ids).size).toBe(4)

      // every choice is a number within [0, MAX_SUM]
      q.choices.forEach((c) => {
        const n = Number(c.label)
        expect(Number.isInteger(n)).toBe(true)
        expect(n).toBeGreaterThanOrEqual(0)
        expect(n).toBeLessThanOrEqual(MAX_SUM)
      })

      expect(q.speakText).toBe(String(a + b))
    }
  })

  it('builds the exact question requested by a key', () => {
    const q = mathGame.generateQuestion('11+9')
    const { a, b } = q.prompt as { kind: 'math'; a: number; b: number }
    expect([a, b]).toEqual([11, 9])
    expect(q.choices.find((c) => c.correct)!.label).toBe('20')
  })

  it('includes two-digit addends among the item keys', () => {
    expect(mathGame.itemKeys).toContain('10+10')
    expect(mathGame.itemKeys).toContain('20+10')
  })
})
