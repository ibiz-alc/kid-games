export type Choice = { id: string; label: string; correct: boolean }

export type Prompt =
  | { kind: 'number'; value: number }
  | { kind: 'color'; hex: string; name: string }
  | { kind: 'math'; a: number; b: number }

export type Question = {
  prompt: Prompt
  speakText: string
  choices: Choice[]
}

export type GameDefinition = {
  id: string
  title: string
  icon: string
  generateQuestion: () => Question
}
