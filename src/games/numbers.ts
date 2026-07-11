import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'
import { NUMBER_WORDS, numberWord } from './words'

export const numbersGame: GameDefinition = {
  id: 'numbers',
  title: 'นับเลข',
  icon: '🔢',
  itemKeys: NUMBER_WORDS.map((_, i) => String(i + 1)),
  generateQuestion(key?: string) {
    const value = key ? Number(key) : randInt(1, 10)
    const correctWord = numberWord(value)
    const distractors = pickDistinct(NUMBER_WORDS, 3, [correctWord])
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
