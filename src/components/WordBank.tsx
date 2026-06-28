import type { Choice } from '../types'

type Props = {
  choices: Choice[]
  selectedId: string | null
  answered: boolean
  onSelect: (choice: Choice) => void
}

export function WordBank({ choices, selectedId, answered, onSelect }: Props) {
  const selected = choices.find((c) => c.id === selectedId) ?? null
  const slotState = answered ? (selected?.correct ? 'correct' : 'wrong') : ''

  return (
    <div className="wordbank">
      <div className={`slot ${slotState}`}>
        {selected ? selected.label : '?'}
      </div>
      <div className="word-tiles">
        {choices.map((c) => {
          let state = ''
          if (answered) {
            if (c.correct) state = 'correct'
            else if (c.id === selectedId) state = 'wrong'
          } else if (c.id === selectedId) {
            state = 'picked'
          }
          return (
            <button
              key={c.id}
              className={`word-tile ${state}`}
              disabled={answered}
              onClick={() => onSelect(c)}
            >
              {c.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
