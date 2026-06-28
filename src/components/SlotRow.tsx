import type { SlotState } from '../games/spelling/types'

type Props = {
  slots: SlotState
  revealedIndex: number
  selectedIndex: number | null
  status: 'playing' | 'correct' | 'wrong'
  onSlotTap: (index: number) => void
}

export function SlotRow({ slots, revealedIndex, selectedIndex, status, onSlotTap }: Props) {
  return (
    <div className="slot-row">
      {slots.map((tile, i) => {
        const locked = i === revealedIndex
        const classes = ['spell-slot']
        if (locked) classes.push('locked')
        if (tile) classes.push('filled')
        if (i === selectedIndex && status === 'playing') classes.push('selected')
        if (status === 'correct') classes.push('correct')
        if (status === 'wrong' && tile && !locked) classes.push('wrong')
        return (
          <button
            key={i}
            className={classes.join(' ')}
            disabled={locked || status !== 'playing'}
            onClick={() => onSlotTap(i)}
          >
            {tile ? tile.letter : ''}
          </button>
        )
      })}
    </div>
  )
}
