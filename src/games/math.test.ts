import { describe, it, expect } from 'vitest'
import { mathGame } from './math'

describe('mathGame', () => {
  it('has the expected identity', () => {
    expect(mathGame.id).toBe('math')
  })

  it('produces valid addition questions with sum <= 10 over many runs', () => {
    for (let i = 0; i < 300; i++) {
      const q = mathGame.generateQuestion()
      expect(q.prompt.kind).toBe('math')
      const { a, b } = q.prompt as { kind: 'math'; a: number; b: number }
      expect(a).toBeGreaterThanOrEqual(1)
      expect(b).toBeGreaterThanOrEqual(1)
      expect(a + b).toBeLessThanOrEqual(10)

      expect(q.choices).toHaveLength(4)
      const correct = q.choices.filter((c) => c.correct)
      expect(correct).toHaveLength(1)
      expect(correct[0].label).toBe(String(a + b))

      const ids = q.choices.map((c) => c.id)
      expect(new Set(ids).size).toBe(4)

      expect(q.speakText).toBe(String(a + b))
    }
  })
})
