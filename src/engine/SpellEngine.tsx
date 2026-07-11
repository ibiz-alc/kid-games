import { useEffect, useRef, useState } from 'react'
import type { SpellCategory, SpellQuestion, SlotState, LetterTile } from '../games/spelling/types'
import { generateSpellQuestion, spellKeys } from '../games/spelling/generate'
import { isComplete, isCorrect } from '../games/spelling/check'
import { createSequencer } from '../lib/sequencer'
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
  const [nextWord] = useState(() => createSequencer(spellKeys(category)))
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<SpellQuestion>(() =>
    generateSpellQuestion(category, nextWord()),
  )
  const [slots, setSlots] = useState<SlotState>(() => initSlots(question))
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

  /** Slot for this letter: its correct empty position if any, else the first empty slot. */
  function slotForLetter(current: SlotState, letter: string): number {
    const matching = current.findIndex(
      (s, i) => s === null && i !== question.revealedIndex && question.target[i] === letter,
    )
    return matching >= 0 ? matching : firstEmptyNonLocked(current)
  }

  function goNext() {
    const next = index + 1
    if (next >= WORDS_PER_ROUND) {
      onFinish(correctRef.current, WORDS_PER_ROUND)
      return
    }
    const q = generateSpellQuestion(category, nextWord())
    setIndex(next)
    setQuestion(q)
    setSlots(initSlots(q))
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
        setStatus('playing')
      }, WRONG_DELAY_MS)
    }
  }

  function handleSlotTap(i: number) {
    if (status !== 'playing' || i === question.revealedIndex) return
    // tapping a filled slot returns its letter to the bank
    if (slots[i]) {
      const next = [...slots]
      next[i] = null
      setSlots(next)
    }
  }

  function handleTileTap(tile: LetterTile) {
    if (status !== 'playing') return
    const target = slotForLetter(slots, tile.letter)
    if (target < 0) return
    const next = [...slots]
    next[target] = tile
    setSlots(next)
    if (isComplete(next)) evaluate(next)
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <button className="back-btn" onClick={onExit} aria-label="กลับหน้าหลัก">
          ←
        </button>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((index + (status === 'correct' ? 1 : 0)) / WORDS_PER_ROUND) * 100}%` }}
          />
        </div>
        <div className="progress-count">
          {index + 1}/{WORDS_PER_ROUND}
        </div>
      </div>

      <SpellPromptView prompt={question.prompt} />

      <SlotRow
        slots={slots}
        revealedIndex={question.revealedIndex}
        selectedIndex={null}
        status={status}
        onSlotTap={handleSlotTap}
      />

      <LetterBank tiles={availableTiles} disabled={status !== 'playing'} onTileTap={handleTileTap} />
    </div>
  )
}
