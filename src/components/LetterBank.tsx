import type { LetterTile } from '../games/spelling/types'

type Props = {
  tiles: LetterTile[]
  disabled: boolean
  onTileTap: (tile: LetterTile) => void
}

export function LetterBank({ tiles, disabled, onTileTap }: Props) {
  return (
    <div className="letter-bank">
      {tiles.map((tile) => (
        <button
          key={tile.id}
          className="letter-tile"
          disabled={disabled}
          onClick={() => onTileTap(tile)}
        >
          {tile.letter}
        </button>
      ))}
    </div>
  )
}
