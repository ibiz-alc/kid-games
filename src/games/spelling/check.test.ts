import { describe, it, expect } from 'vitest'
import { isComplete, isCorrect } from './check'
import type { SlotState } from './types'

function slots(letters: (string | null)[]): SlotState {
  return letters.map((l, i) => (l === null ? null : { id: `s${i}`, letter: l }))
}

describe('isComplete', () => {
  it('is false when any slot is empty', () => {
    expect(isComplete(slots(['F', null, 'S', 'H']))).toBe(false)
  })
  it('is true when every slot is filled', () => {
    expect(isComplete(slots(['F', 'I', 'S', 'H']))).toBe(true)
  })
})

describe('isCorrect', () => {
  it('is true only when every slot matches the target by position', () => {
    expect(isCorrect(slots(['F', 'I', 'S', 'H']), 'FISH')).toBe(true)
  })
  it('is false when a letter is in the wrong slot', () => {
    expect(isCorrect(slots(['F', 'S', 'I', 'H']), 'FISH')).toBe(false)
  })
  it('is false when not yet complete', () => {
    expect(isCorrect(slots(['F', null, 'S', 'H']), 'FISH')).toBe(false)
  })
  it('handles repeated letters correctly', () => {
    expect(isCorrect(slots(['B', 'A', 'L', 'L']), 'BALL')).toBe(true)
    expect(isCorrect(slots(['B', 'L', 'A', 'L']), 'BALL')).toBe(false)
  })
})
