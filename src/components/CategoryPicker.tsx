import type { SpellCategory } from '../games/spelling/types'
import { getStars } from '../lib/storage'

type CategoryDef = { id: SpellCategory; title: string; icon: string }

const CATEGORIES: CategoryDef[] = [
  { id: 'vocab', title: 'คำศัพท์', icon: '🐱' },
  { id: 'numbers', title: 'ตัวเลข', icon: '🔢' },
  { id: 'colors', title: 'สี', icon: '🎨' },
]

type Props = {
  onPick: (category: SpellCategory) => void
  onExit: () => void
}

export function CategoryPicker({ onPick, onExit }: Props) {
  return (
    <div className="home">
      <div className="quiz-top">
        <button className="back-btn" onClick={onExit} aria-label="กลับหน้าหลัก">
          ←
        </button>
        <h1 className="picker-title">เลือกหมวดสะกดคำ</h1>
      </div>
      <div className="game-cards">
        {CATEGORIES.map((c) => {
          const stars = getStars(`spell:${c.id}`)
          return (
            <button key={c.id} className="game-card" onClick={() => onPick(c.id)}>
              <span className="game-icon">{c.icon}</span>
              <span className="game-title">{c.title}</span>
              <span className="game-stars">{stars > 0 ? '⭐'.repeat(stars) : '☆☆☆'}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
