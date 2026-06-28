import type { SpellCategory, SpellQuestion, SpellPrompt, LetterTile } from './types'
import { randInt, shuffle, pickDistinct } from '../../lib/random'
import { NUMBER_WORDS } from '../words'
import { COLOR_PALETTE } from '../palette'
import { VOCAB } from './content'

export const DISTRACTOR_COUNT = 4

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function makeQuestion(target: string, prompt: SpellPrompt): SpellQuestion {
  const revealedIndex = randInt(0, target.length - 1)

  const needed: string[] = []
  for (let i = 0; i < target.length; i++) {
    if (i !== revealedIndex) needed.push(target[i])
  }

  const distractors = pickDistinct(ALPHABET, DISTRACTOR_COUNT)
  const letters = shuffle([...needed, ...distractors])
  const bank: LetterTile[] = letters.map((letter, i) => ({ id: `t${i}-${letter}`, letter }))

  return { target, prompt, revealedIndex, bank }
}

export function generateSpellQuestion(category: SpellCategory): SpellQuestion {
  if (category === 'vocab') {
    const item = VOCAB[randInt(0, VOCAB.length - 1)]
    return makeQuestion(item.word, { kind: 'picture', emoji: item.emoji })
  }
  if (category === 'numbers') {
    const value = randInt(1, 10)
    return makeQuestion(NUMBER_WORDS[value - 1], { kind: 'number', value })
  }
  const color = COLOR_PALETTE[randInt(0, COLOR_PALETTE.length - 1)]
  return makeQuestion(color.name, { kind: 'color', hex: color.hex, name: color.name })
}
