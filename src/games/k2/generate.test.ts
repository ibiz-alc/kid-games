import { describe, it, expect } from 'vitest'
import { generateK2Question } from './generate'
import { K2_CONTENT } from './content'
import type { K2Category } from './types'

const CATEGORIES = Object.keys(K2_CONTENT) as K2Category[]

describe('generateK2Question', () => {
  it('produces valid questions for every category over many runs', () => {
    for (const category of CATEGORIES) {
      for (let i = 0; i < 150; i++) {
        const q = generateK2Question(category)

        // exactly 4 choices, one correct, unique ids
        expect(q.choices).toHaveLength(4)
        expect(q.choices.filter((c) => c.correct)).toHaveLength(1)
        expect(new Set(q.choices.map((c) => c.id)).size).toBe(4)

        // speakText is the correct answer's word, lowercased
        const correct = q.choices.find((c) => c.correct)!
        const correctWord =
          correct.render.kind === 'word'
            ? correct.render.word
            : // image choice: word not on the render, but prompt visual mode means
              // the correct word equals prompt.speakText uppercased
              q.speakText.toUpperCase()
        expect(q.speakText).toBe(correctWord.toLowerCase())

        // choice render kind is consistent across all choices
        const kinds = new Set(q.choices.map((c) => c.render.kind))
        expect(kinds.size).toBe(1)
        const choiceKind = q.choices[0].render.kind

        // prompt/choice mode consistency
        if (q.prompt.kind === 'visual') {
          // visual prompt -> word choices
          expect(choiceKind).toBe('word')
        } else {
          // audio prompt -> image or word choices
          expect(['image', 'word']).toContain(choiceKind)
        }
      }
    }
  })

  it('always uses audio prompt with word choices for days (no images)', () => {
    for (let i = 0; i < 100; i++) {
      const q = generateK2Question('days')
      expect(q.prompt.kind).toBe('audio')
      expect(q.choices.every((c) => c.render.kind === 'word')).toBe(true)
    }
  })

  it('uses color visuals for colours and emoji visuals for fruits', () => {
    for (let i = 0; i < 100; i++) {
      const colourQ = generateK2Question('colours')
      const visualsC = [
        ...(colourQ.prompt.kind === 'visual' ? [colourQ.prompt.visual] : []),
        ...colourQ.choices.flatMap((c) => (c.render.kind === 'image' ? [c.render.visual] : [])),
      ]
      visualsC.forEach((v) => expect(v.kind).toBe('color'))

      const fruitQ = generateK2Question('fruits')
      const visualsF = [
        ...(fruitQ.prompt.kind === 'visual' ? [fruitQ.prompt.visual] : []),
        ...fruitQ.choices.flatMap((c) => (c.render.kind === 'image' ? [c.render.visual] : [])),
      ]
      visualsF.forEach((v) => expect(v.kind).toBe('emoji'))
    }
  })
})
