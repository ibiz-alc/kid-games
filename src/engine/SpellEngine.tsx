import { useEffect, useRef, useState } from 'react'
import type { SpellCategory, SpellQuestion, SlotState, LetterTile } from '../games/spelling/types'
import { generateSpellQuestion } from '../games/spelling/generate'
import { isComplete, isCorrect } from '../games/spelling/check'
import { SpellPromptView } from '../components/SpellPromptView'
import { SlotRow } from '../components/SlotRow'
import { LetterBank } from '../components/LetterBank'
import { speak, playCorrect, playWrong } from '../lib/audio'

const WORDS_PER_ROUND = 10
const CORRECT_DELAY_MS = 1300
const WRONG_DELAY_MS = 900

type Status = 'playing' | 'correct' | 'wrong'

type Props = {
  category: SpellCategory
  onFinish: (correct: number, total: number) => void
  onExit: () => void
}

function initSlots(q: SpellQuestion): SlotState {
  const slots: SlotState = Array(q.target.length).fill(null)
  slots[q.revealedIndex] = { id: 'locked', letter: q.target[q.revealedIndex] }
  return slots
}

export function SpellEngine({ category, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<SpellQuestion>(() => generateSpellQuestion(category))
  const [slots, setSlots] = useState<SlotState>(() => initSlots(question))
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [status, setStatus] = useState<Status>('playing')

  const correctRef = useRef(0)
  const failedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  const placedIds = new Set(
    slots.filter((s): s is LetterTile => s !== null && s.id !== 'locked').map((s) => s.id),
  )
  const availableTiles = question.bank.filter((t) => !placedIds.has(t.id))

  function firstEmptyNonLocked(current: SlotState): number {
    return current.findIndex((s, i) => s === null && i !== question.revealedIndex)
  }

  function goNext() {
    const next = index + 1
    if (next >= WORDS_PER_ROUND) {
      onFinish(correctRef.current, WORDS_PER_ROUND)
      return
    }
    const q = generateSpellQuestion(category)
    setIndex(next)
    setQuestion(q)
    setSlots(initSlots(q))
    setSelectedIndex(null)
    failedRef.current = false
    setStatus('playing')
  }

  function evaluate(filled: SlotState) {
    if (isCorrect(filled, question.target)) {
      setStatus('correct')
      playCorrect()
      speak(question.target.toLowerCase())
      if (!failedRef.current) correctRef.current += 1
      timeoutRef.current = window.setTimeout(goNext, CORRECT_DELAY_MS)
    } else {
      setStatus('wrong')
      playWrong()
      failedRef.current = true
      timeoutRef.current = window.setTimeout(() => {
        setSlots(initSlots(question))
        setSelectedIndex(null)
        setStatus('playing')
      }, WRONG_DELAY_MS)
    }
  }

  function handleSlotTap(i: number) {
    if (status !== 'playing' || i === question.revealedIndex) return
    if (slots[i]) {
      // return the placed tile to the bank
      const next = [...slots]
      next[i] = null
      setSlots(next)
      setSelectedIndex(i)
    } else {
      setSelectedIndex(i)
    }
  }

  function handleTileTap(tile: LetterTile) {
    if (status !== 'playing') return
    let target = selectedIndex
    if (target === null || slots[target] !== null || target === question.revealedIndex) {
      target = firstEmptyNonLocked(slots)
    }
    if (target < 0) return
    const next = [...slots]
    next[target] = tile
    setSlots(next)
    setSelectedIndex(null)
    if (isComplete(next)) evaluate(next)
  }

  const progressPct = ((index + (status === 'correct' ? 1 : 0)) / WORDS_PER_ROUND) * 100

  return (
    <div className="quiz">
      <div className="quiz-top">
        <button className="back-btn" onClick={onExit} aria-label="กลับหน้าหลัก">
          ←
        </button>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progress-count">
          {index + 1}/{WORDS_PER_ROUND}
        </div>
      </div>

      <SpellPromptView prompt={question.prompt} />

      <SlotRow
        slots={slots}
        revealedIndex={question.revealedIndex}
        selectedIndex={selectedIndex}
        status={status}
        onSlotTap={handleSlotTap}
      />

      <LetterBank tiles={availableTiles} disabled={status !== 'playing'} onTileTap={handleTileTap} />
    </div>
  )
}
