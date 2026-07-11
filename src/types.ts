export type Choice = { id: string; label: string; correct: boolean }

export type Prompt =
  | { kind: 'number'; value: number }
  | { kind: 'color'; hex: string; name: string }
  | { kind: 'math'; a: number; b: number }
  | { kind: 'picture'; count: number; emoji: string }

export type AnswerMode = 'buttons' | 'wordbank'

export type Question = {
  prompt: Prompt
  speakText: string
  choices: Choice[]
}

export type GameDefinition = {
  id: string
  title: string
  icon: string
  /** Stable keys for the shuffle-bag sequencer (one per possible question subject). */
  itemKeys: string[]
  /** Build a question; when a key is given, build that specific subject (else random). */
  generateQuestion: (key?: string) => Question
  /** How the answer choices are presented. Defaults to 'buttons'. */
  answerMode?: AnswerMode
}
