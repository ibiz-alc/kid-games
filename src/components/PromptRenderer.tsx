import type { Prompt } from '../types'

export function PromptRenderer({ prompt }: { prompt: Prompt }) {
  switch (prompt.kind) {
    case 'number':
      return <div className="prompt-number">{prompt.value}</div>
    case 'color':
      return (
        <div
          className="prompt-color"
          style={{ backgroundColor: prompt.hex }}
          aria-label={prompt.name}
        />
      )
    case 'math':
      return (
        <div className="prompt-math">
          {prompt.a} + {prompt.b} = ?
        </div>
      )
  }
}
