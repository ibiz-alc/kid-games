import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'

const WORDS = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN']

export const numbersGame: GameDefinition = {
  id: 'numbers',
  title: 'นับเลข',
  icon: '🔢',
  generateQuestion() {
    const value = randInt(1, 10)
    const correctWord = WORDS[value - 1]
    const distractors = pickDistinct(WORDS, 3, [correctWord])
    const choices: Choice[] = shuffle([
      { id: correctWord, label: correctWord, correct: true },
      ...distractors.map((w) => ({ id: w, label: w, correct: false })),
    ])
    return {
      prompt: { kind: 'number', value },
      speakText: correctWord.toLowerCase(),
      choices,
    }
  },
}
