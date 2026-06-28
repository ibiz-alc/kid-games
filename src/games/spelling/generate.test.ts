import { describe, it, expect } from 'vitest'
import { generateSpellQuestion, DISTRACTOR_COUNT } from './generate'
import type { SpellCategory } from './types'

const CATEGORIES: SpellCategory[] = ['vocab', 'numbers', 'colors']

describe('generateSpellQuestion', () => {
  it('produces valid questions for every category over many runs', () => {
    for (const category of CATEGORIES) {
      for (let i = 0; i < 200; i++) {
        const q = generateSpellQuestion(category)

        expect(q.target.length).toBeGreaterThan(0)
        expect(q.revealedIndex).toBeGreaterThanOrEqual(0)
        expect(q.revealedIndex).toBeLessThan(q.target.length)

        // prompt matches the category
        if (category === 'vocab') expect(q.prompt.kind).toBe('picture')
        if (category === 'numbers') expect(q.prompt.kind).toBe('number')
        if (category === 'colors') expect(q.prompt.kind).toBe('color')

        // bank size = letters to fill (target length - 1 revealed) + distractors
        expect(q.bank).toHaveLength(q.target.length - 1 + DISTRACTOR_COUNT)

        // every tile id is unique
        const ids = q.bank.map((t) => t.id)
        expect(new Set(ids).size).toBe(q.bank.length)

        // the bank contains the exact letters needed to fill the non-revealed slots
        const needed = q.target
          .split('')
          .filter((_, idx) => idx !== q.revealedIndex)
          .sort()
        const bankLetters = q.bank.map((t) => t.letter).sort()
        // every needed letter must be coverable; remove needed from bank and ensure none missing
        const remaining = [...bankLetters]
        for (const letter of needed) {
          const pos = remaining.indexOf(letter)
          expect(pos).toBeGreaterThanOrEqual(0)
          remaining.splice(pos, 1)
        }
        // leftover are the distractors
        expect(remaining).toHaveLength(DISTRACTOR_COUNT)
      }
    }
  })
})
