import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'

type ColorDef = { name: string; hex: string }

const COLORS: ColorDef[] = [
  { name: 'RED', hex: '#e53935' },
  { name: 'ORANGE', hex: '#fb8c00' },
  { name: 'YELLOW', hex: '#fdd835' },
  { name: 'GREEN', hex: '#43a047' },
  { name: 'BLUE', hex: '#1e88e5' },
  { name: 'PURPLE', hex: '#8e24aa' },
  { name: 'PINK', hex: '#ec407a' },
  { name: 'BROWN', hex: '#6d4c41' },
  { name: 'BLACK', hex: '#212121' },
  { name: 'WHITE', hex: '#fafafa' },
]

export const colorsGame: GameDefinition = {
  id: 'colors',
  title: 'สีอะไร',
  icon: '🎨',
  generateQuestion() {
    const target = COLORS[randInt(0, COLORS.length - 1)]
    const names = COLORS.map((c) => c.name)
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
