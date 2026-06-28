import { describe, it, expect } from 'vitest'
import { colorsGame } from './colors'

describe('colorsGame', () => {
  it('has the expected identity', () => {
    expect(colorsGame.id).toBe('colors')
  })

  it('produces valid questions over many runs', () => {
    for (let i = 0; i < 300; i++) {
      const q = colorsGame.generateQuestion()
      expect(q.prompt.kind).toBe('color')
      const prompt = q.prompt as { kind: 'color'; hex: string; name: string }
      expect(prompt.hex).toMatch(/^#[0-9a-fA-F]{6}$/)

      expect(q.choices).toHaveLength(4)
      const correct = q.choices.filter((c) => c.correct)
      expect(correct).toHaveLength(1)
      expect(correct[0].label).toBe(prompt.name)

      const ids = q.choices.map((c) => c.id)
      expect(new Set(ids).size).toBe(4)

      expect(q.speakText).toBe(prompt.name.toLowerCase())
    }
  })
})
