import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'
import { NUMBER_WORDS, numberWord } from './words'

/** Number of words shown in the word bank (1 correct + distractors). */
export const WORD_BANK_SIZE = 6

const EMOJIS = ['🍎', '🍌', '🍓', '🍊', '🍇', '⭐', '🐶', '🐱', '🚗', '🎈', '🌸', '🐟']

export const fillinGame: GameDefinition = {
  id: 'fillin',
  title: 'เติมคำ',
  icon: '🖼️',
  answerMode: 'wordbank',
  itemKeys: NUMBER_WORDS.map((_, i) => String(i + 1)),
  generateQuestion(key?: string) {
    const count = key ? Number(key) : randInt(1, 10)
    const emoji = EMOJIS[randInt(0, EMOJIS.length - 1)]
    const correctWord = numberWord(count)
    const distractors = pickDistinct(NUMBER_WORDS, WORD_BANK_SIZE - 1, [correctWord])
    const choices: Choice[] = shuffle([
      { id: correctWord, label: correctWord, correct: true },
      ...distractors.map((w) => ({ id: w, label: w, correct: false })),
    ])
    return {
      prompt: { kind: 'picture', count, emoji },
      speakText: correctWord.toLowerCase(),
      choices,
    }
  },
}
