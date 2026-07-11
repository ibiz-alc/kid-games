import type { K2Choice } from '../games/k2/types'
import { K2VisualView } from './K2Visual'

type Props = {
  choices: K2Choice[]
  selectedId: string | null
  answered: boolean
  onSelect: (choice: K2Choice) => void
}

export function K2Choices({ choices, selectedId, answered, onSelect }: Props) {
  const isImage = choices[0]?.render.kind === 'image'
  return (
    <div className={`choices ${isImage ? 'choices-image' : ''}`}>
      {choices.map((c) => {
        let state = ''
        if (answered) {
          if (c.correct) state = 'correct'
          else if (c.id === selectedId) state = 'wrong'
        }
        return (
          <button
            key={c.id}
            className={`choice ${state}`}
            disabled={answered}
            onClick={() => onSelect(c)}
          >
            {c.render.kind === 'word' ? (
              c.render.word
            ) : (
              <K2VisualView visual={c.render.visual} size="choice" />
            )}
          </button>
        )
      })}
    </div>
  )
}
