import { describe, it, expect } from 'vitest'
import { fillinGame, WORD_BANK_SIZE } from './fillin'
import { numberWord } from './words'

describe('fillinGame', () => {
  it('has the expected identity and uses the word-bank answer mode', () => {
    expect(fillinGame.id).toBe('fillin')
    expect(fillinGame.answerMode).toBe('wordbank')
  })

  it('produces valid picture questions over many runs', () => {
    for (let i = 0; i < 300; i++) {
      const q = fillinGame.generateQuestion()
      expect(q.prompt.kind).toBe('picture')
      const prompt = q.prompt as { kind: 'picture'; count: number; emoji: string }
      expect(prompt.count).toBeGreaterThanOrEqual(1)
      expect(prompt.count).toBeLessThanOrEqual(10)
      expect(prompt.emoji.length).toBeGreaterThan(0)

      expect(q.choices).toHaveLength(WORD_BANK_SIZE)
      const correct = q.choices.filter((c) => c.correct)
      expect(correct).toHaveLength(1)
      expect(correct[0].label).toBe(numberWord(prompt.count))

      const ids = q.choices.map((c) => c.id)
      expect(new Set(ids).size).toBe(WORD_BANK_SIZE)

      expect(q.speakText).toBe(numberWord(prompt.count).toLowerCase())
    }
  })
})
