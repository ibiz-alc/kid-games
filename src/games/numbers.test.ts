import { describe, it, expect } from 'vitest'
import { numbersGame } from './numbers'

const WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN']

describe('numbersGame', () => {
  it('has the expected identity', () => {
    expect(numbersGame.id).toBe('numbers')
  })

  it('produces valid questions over many runs', () => {
    for (let i = 0; i < 300; i++) {
      const q = numbersGame.generateQuestion()
      expect(q.prompt.kind).toBe('number')
      const value = (q.prompt as { kind: 'number'; value: number }).value
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(10)

      expect(q.choices).toHaveLength(4)
      const correct = q.choices.filter((c) => c.correct)
      expect(correct).toHaveLength(1)
      expect(correct[0].label).toBe(WORDS[value - 1])

      const ids = q.choices.map((c) => c.id)
      expect(new Set(ids).size).toBe(4)
      q.choices.forEach((c) => expect(WORDS).toContain(c.label))

      expect(q.speakText).toBe(WORDS[value - 1].toLowerCase())
    }
  })
})
