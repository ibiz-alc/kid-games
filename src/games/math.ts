import type { GameDefinition, Choice } from '../types'
import { randInt, pickDistinct, shuffle } from '../lib/random'

export const MAX_SUM = 30
export const MAX_DIFF = 10

/** All addition pairs with sum <= 30 and |a - b| <= 10 (two-digit friendly). */
function buildPairs(): [number, number][] {
  const pairs: [number, number][] = []
  for (let a = 1; a < MAX_SUM; a++) {
    for (let b = 1; b <= MAX_SUM - a; b++) {
      if (Math.abs(a - b) <= MAX_DIFF) pairs.push([a, b])
    }
  }
  return pairs
}

const PAIRS = buildPairs()

export const mathGame: GameDefinition = {
  id: 'math',
  title: 'บวกเลข',
  icon: '➕',
  itemKeys: PAIRS.map(([a, b]) => `${a}+${b}`),
  generateQuestion(key?: string) {
    let a: number
    let b: number
    if (key) {
      ;[a, b] = key.split('+').map(Number)
    } else {
      ;[a, b] = PAIRS[randInt(0, PAIRS.length - 1)]
    }
    const sum = a + b

    // distractors: distinct numbers near the answer, within [0, MAX_SUM], excluding the sum
    const lo = Math.max(0, sum - 8)
    const hi = Math.min(MAX_SUM, sum + 8)
    const nearby: number[] = []
    for (let n = lo; n <= hi; n++) if (n !== sum) nearby.push(n)
    const distractors = pickDistinct(nearby, 3)

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
