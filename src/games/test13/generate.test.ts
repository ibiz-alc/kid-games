import { describe, it, expect } from 'vitest'
import { chooseChoices, letterBankFor, DISTRACTOR_COUNT } from './generate'
import { TEST13_SHAPES } from './content'

describe('chooseChoices', () => {
  it('offers all five shapes with exactly one correct', () => {
    for (const shape of TEST13_SHAPES) {
      const choices = chooseChoices(shape)
      expect(choices).toHaveLength(5)
      expect(choices.filter((c) => c.correct)).toHaveLength(1)
      expect(choices.find((c) => c.correct)!.label).toBe(shape)
      expect(new Set(choices.map((c) => c.id)).size).toBe(5)
      expect(new Set(choices.map((c) => c.label))).toEqual(new Set(TEST13_SHAPES))
    }
  })
})

describe('letterBankFor', () => {
  it('contains every letter of the word plus distractors, with unique ids', () => {
    for (const word of TEST13_SHAPES) {
      for (let i = 0; i < 100; i++) {
        const bank = letterBankFor(word)
        expect(bank).toHaveLength(word.length + DISTRACTOR_COUNT)
        expect(new Set(bank.map((t) => t.id)).size).toBe(bank.length)

        // every needed letter is present (counting multiplicity)
        const remaining = bank.map((t) => t.letter)
        for (const letter of word.split('')) {
          const pos = remaining.indexOf(letter)
          expect(pos).toBeGreaterThanOrEqual(0)
          remaining.splice(pos, 1)
        }
        // leftovers are the distractors and none of them is a letter of the word
        expect(remaining).toHaveLength(DISTRACTOR_COUNT)
        remaining.forEach((letter) => expect(word).not.toContain(letter))
      }
    }
  })
})
