import { games } from '../games'
import { getStars } from '../lib/storage'
import type { SpellCategory } from '../games/spelling/types'

const SPELL_CATEGORIES: SpellCategory[] = ['vocab', 'numbers', 'colors']

function bestSpellStars(): number {
  return Math.max(0, ...SPELL_CATEGORIES.map((c) => getStars(`spell:${c}`)))
}

type Props = {
  onPick: (gameId: string) => void
  onSpell: () => void
}

export function Home({ onPick, onSpell }: Props) {
  const spellStars = bestSpellStars()
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
        <button className="game-card" onClick={onSpell}>
          <span className="game-icon">🔤</span>
          <span className="game-title">สะกดคำ</span>
          <span className="game-stars">{spellStars > 0 ? '⭐'.repeat(spellStars) : '☆☆☆'}</span>
        </button>
      </div>
    </div>
  )
}
