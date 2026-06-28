import type { Choice } from '../types'

type Props = {
  choices: Choice[]
  selectedId: string | null
  answered: boolean
  onSelect: (choice: Choice) => void
}

export function ChoiceButtons({ choices, selectedId, answered, onSelect }: Props) {
  return (
    <div className="choices">
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
            {c.label}
          </button>
        )
      })}
    </div>
  )
}
