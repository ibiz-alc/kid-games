export type SpellCategory = 'vocab' | 'numbers' | 'colors'

export type SpellPrompt =
  | { kind: 'picture'; emoji: string }
  | { kind: 'number'; value: number }
  | { kind: 'color'; hex: string; name: string }

export type LetterTile = { id: string; letter: string }

export type SpellQuestion = {
  target: string
  prompt: SpellPrompt
  revealedIndex: number
  bank: LetterTile[]
}

/** A slot is null when empty, or holds the tile placed in it. */
export type SlotState = (LetterTile | null)[]
