import { games } from '../games'
import { getStars } from '../lib/storage'

export function Home({ onPick }: { onPick: (gameId: string) => void }) {
  return (
    <div className="home">
      <h1>เกมของหนู</h1>
      <div className="game-cards">
        {games.map((g) => {
          const stars = getStars(g.id)
          return (
            <button key={g.id} className="game-card" onClick={() => onPick(g.id)}>
              <span className="game-icon">{g.icon}</span>
              <span className="game-title">{g.title}</span>
              <span className="game-stars">{stars > 0 ? '⭐'.repeat(stars) : '☆☆☆'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
