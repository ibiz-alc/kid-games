import type { Test13Mode } from '../games/test13/content'
import { TEST13_MODES } from '../games/test13/content'
import { getStars } from '../lib/storage'

type Props = {
  onPick: (mode: Test13Mode) => void
  onExit: () => void
}

export function Test13Menu({ onPick, onExit }: Props) {
  return (
    <div className="home">
      <div className="quiz-top">
        <button className="back-btn" onClick={onExit} aria-label="กลับหน้าหลัก">
          ←
        </button>
        <h1 className="picker-title">TEST@13Jul</h1>
      </div>
      <div className="game-cards">
        {TEST13_MODES.map((m) => {
          const stars = getStars(`test13:${m.id}`)
          return (
            <button key={m.id} className="game-card" onClick={() => onPick(m.id)}>
              <span className="game-icon">{m.icon}</span>
              <span className="game-title">{m.title}</span>
              <span className="game-stars">{stars > 0 ? '⭐'.repeat(stars) : '☆☆☆'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
