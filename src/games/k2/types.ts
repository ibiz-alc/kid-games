export type K2Category =
  | 'numbers'
  | 'colours'
  | 'shapes'
  | 'feelings'
  | 'weather'
  | 'vegetables'
  | 'fruits'
  | 'foods'
  | 'body'
  | 'actions'
  | 'days'

export type K2Item = { word: string; emoji?: string; hex?: string }

export type K2Visual = { kind: 'emoji'; emoji: string } | { kind: 'color'; hex: string }

export type K2Prompt =
  | { kind: 'visual'; visual: K2Visual; speakText: string }
  | { kind: 'audio'; speakText: string }

export type K2Render = { kind: 'word'; word: string } | { kind: 'image'; visual: K2Visual }

export type K2Choice = {
  id: string
  correct: boolean
  render: K2Render
}

export type K2Question = {
  prompt: K2Prompt
  speakText: string
  choices: K2Choice[]
}
