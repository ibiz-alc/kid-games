import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'

export const mathGame: GameDefinition = {
  id: 'math',
  title: 'บวกเลข',
  icon: '➕',
  generateQuestion() {
    const a = randInt(1, 9)
    const b = randInt(1, 10 - a)
    const sum = a + b
    const pool = Array.from({ length: 11 }, (_, i) => i).filter((n) => n !== sum)
    const distractors = pickDistinct(pool, 3)
    const choices: Choice[] = shuffle([
      { id: String(sum), label: String(sum), correct: true },
      ...distractors.map((n) => ({ id: String(n), label: String(n), correct: false })),
    ])
    return {
      prompt: { kind: 'math', a, b },
      speakText: String(sum),
      choices,
    }
  },
}
