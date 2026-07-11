import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'
import { COLOR_PALETTE } from './palette'

export const colorsGame: GameDefinition = {
  id: 'colors',
  title: 'สีอะไร',
  icon: '🎨',
  itemKeys: COLOR_PALETTE.map((c) => c.name),
  generateQuestion(key?: string) {
    const target = key
      ? COLOR_PALETTE.find((c) => c.name === key)!
      : COLOR_PALETTE[randInt(0, COLOR_PALETTE.length - 1)]
    const names = COLOR_PALETTE.map((c) => c.name)
    const distractors = pickDistinct(names, 3, [target.name])
    const choices: Choice[] = shuffle([
      { id: target.name, label: target.name, correct: true },
      ...distractors.map((n) => ({ id: n, label: n, correct: false })),
    ])
    return {
      prompt: { kind: 'color', hex: target.hex, name: target.name },
      speakText: target.name.toLowerCase(),
      choices,
    }
  },
}
