import { useState } from 'react'
import type { K2Category } from '../games/k2/types'
import { K2_CATEGORIES } from '../games/k2/content'
import { getStars, getSetting, setSetting } from '../lib/storage'

const MIN_SECONDS = 5
const MAX_SECONDS = 30
const STEP = 5
export const SECONDS_KEY = 'k2-seconds'
export const DEFAULT_SECONDS = 15

type Props = {
  onPick: (category: K2Category, seconds: number) => void
  onExit: () => void
}

export function CategoryPickerK2({ onPick, onExit }: Props) {
  const [seconds, setSeconds] = useState(() => getSetting(SECONDS_KEY, DEFAULT_SECONDS))

  function changeSeconds(delta: number) {
    const next = Math.max(MIN_SECONDS, Math.min(MAX_SECONDS, seconds + delta))
    setSeconds(next)
    setSetting(SECONDS_KEY, next)
  }

  return (
    <div className="home">
      <div className="quiz-top">
        <button className="back-btn" onClick={onExit} aria-label="กลับหน้าหลัก">
          ←
        </button>
        <h1 className="picker-title">เลือกหมวด K.2</h1>
      </div>

      <div className="seconds-control">
        <span>เวลาต่อข้อ</span>
        <button
          className="step-btn"
          onClick={() => changeSeconds(-STEP)}
          disabled={seconds <= MIN_SECONDS}
          aria-label="ลดเวลา"
        >
          −
        </button>
        <span className="seconds-value">{seconds} วิ</span>
        <button
          className="step-btn"
          onClick={() => changeSeconds(STEP)}
          disabled={seconds >= MAX_SECONDS}
          aria-label="เพิ่มเวลา"
        >
          +
        </button>
      </div>

      <div className="game-cards">
        {K2_CATEGORIES.map((c) => {
          const stars = getStars(`k2:${c.id}`)
          return (
            <button key={c.id} className="game-card" onClick={() => onPick(c.id, seconds)}>
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
