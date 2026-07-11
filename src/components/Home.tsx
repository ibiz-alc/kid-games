import { useState } from 'react'
import { games } from '../games'
import { getStars } from '../lib/storage'
import type { SpellCategory } from '../games/spelling/types'
import { K2_CATEGORIES } from '../games/k2/content'
import { getTheme, setTheme, toggleTheme, type Theme } from '../lib/theme'

const SPELL_CATEGORIES: SpellCategory[] = ['vocab', 'numbers', 'colors']

function bestSpellStars(): number {
  return Math.max(0, ...SPELL_CATEGORIES.map((c) => getStars(`spell:${c}`)))
}

function bestK2Stars(): number {
  return Math.max(0, ...K2_CATEGORIES.map((c) => getStars(`k2:${c.id}`)))
}

type Props = {
  onPick: (gameId: string) => void
  onSpell: () => void
  onK2: () => void
}

export function Home({ onPick, onSpell, onK2 }: Props) {
  const spellStars = bestSpellStars()
  const k2Stars = bestK2Stars()
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  function flipTheme() {
    const next = toggleTheme(theme)
    setTheme(next)
    setThemeState(next)
  }

  return (
    <div className="home">
      <div className="home-header">
        <h1>เกมของหนู</h1>
        <button
          className="theme-toggle"
          onClick={flipTheme}
          aria-label={theme === 'light' ? 'เปลี่ยนเป็นธีมมืด' : 'เปลี่ยนเป็นธีมสว่าง'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
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
        <button className="game-card" onClick={onK2}>
          <span className="game-icon">🎓</span>
          <span className="game-title">K.2</span>
          <span className="game-stars">{k2Stars > 0 ? '⭐'.repeat(k2Stars) : '☆☆☆'}</span>
        </button>
      </div>
    </div>
  )
}
