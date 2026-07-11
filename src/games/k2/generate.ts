import type { K2Category, K2Item, K2Question, K2Choice, K2Visual } from './types'
import { K2_CONTENT } from './content'
import { randInt, shuffle, pickDistinct } from '../../lib/random'

function visualOf(item: K2Item): K2Visual | null {
  if (item.hex) return { kind: 'color', hex: item.hex }
  if (item.emoji) return { kind: 'emoji', emoji: item.emoji }
  return null
}

export function generateK2Question(category: K2Category): K2Question {
  const items = K2_CONTENT[category]
  const correct = items[randInt(0, items.length - 1)]
  const distractors = pickDistinct(items, 3, [correct])
  const pool = [correct, ...distractors]

  const hasVisual = visualOf(correct) !== null
  // has visual: randomly visual->word or audio->image; no visual: audio->word
  const mode: 'visual-word' | 'audio-image' | 'audio-word' = !hasVisual
    ? 'audio-word'
    : randInt(0, 1) === 0
      ? 'visual-word'
      : 'audio-image'

  const choiceKind: 'word' | 'image' = mode === 'audio-image' ? 'image' : 'word'

  const choices: K2Choice[] = shuffle(
    pool.map((item) => ({
      id: item.word,
      correct: item.word === correct.word,
      render:
        choiceKind === 'image'
          ? ({ kind: 'image', visual: visualOf(item)! } as const)
          : ({ kind: 'word', word: item.word } as const),
    })),
  )

  const speakText = correct.word.toLowerCase()
  const prompt =
    mode === 'visual-word'
      ? ({ kind: 'visual', visual: visualOf(correct)!, speakText } as const)
      : ({ kind: 'audio', speakText } as const)

  return { prompt, speakText, choices }
}
