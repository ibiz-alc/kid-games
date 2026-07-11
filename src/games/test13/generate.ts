import type { LetterTile } from '../spelling/types'
import type { ShapeName } from './content'
import { TEST13_SHAPES } from './content'
import { shuffle, pickDistinct } from '../../lib/random'

export const DISTRACTOR_COUNT = 4

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export type ChooseChoice = { id: string; label: string; correct: boolean }

export function chooseChoices(correct: ShapeName): ChooseChoice[] {
  return shuffle(
    TEST13_SHAPES.map((w) => ({ id: w, label: w, correct: w === correct })),
  )
}

export function letterBankFor(word: string): LetterTile[] {
  const needed = word.split('')
  const distractors = pickDistinct(ALPHABET, DISTRACTOR_COUNT, needed)
  const letters = shuffle([...needed, ...distractors])
  return letters.map((letter, i) => ({ id: `t${i}-${letter}`, letter }))
}
