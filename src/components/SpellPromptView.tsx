import type { SpellPrompt } from '../games/spelling/types'

export function SpellPromptView({ prompt }: { prompt: SpellPrompt }) {
  switch (prompt.kind) {
    case 'picture':
      return <div className="spell-prompt-emoji">{prompt.emoji}</div>
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
  }
}
