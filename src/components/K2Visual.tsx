import type { K2Visual } from '../games/k2/types'

export function K2VisualView({ visual, size }: { visual: K2Visual; size: 'big' | 'choice' }) {
  if (visual.kind === 'color') {
    return (
      <span
        className={`k2-swatch k2-swatch-${size}`}
        style={{ backgroundColor: visual.hex }}
        aria-hidden
      />
    )
  }
  return <span className={`k2-emoji k2-emoji-${size}`}>{visual.emoji}</span>
}
