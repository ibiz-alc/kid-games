import { useEffect, useRef, useState } from 'react'
import type { LetterTile, SlotState } from '../games/spelling/types'
import type { ShapeName } from '../games/test13/content'
import { TEST13_SHAPES } from '../games/test13/content'
import { letterBankFor } from '../games/test13/generate'
import { isComplete, isCorrect } from '../games/spelling/check'
import { createSequencer } from '../lib/sequencer'
import { SlotRow } from '../components/SlotRow'
import { LetterBank } from '../components/LetterBank'
import { ShapeView } from '../components/ShapeView'
import { speak, playCorrect, playWrong } from '../lib/audio'

const ROUND = 5
const CORRECT_DELAY_MS = 1300
const WRONG_DELAY_MS = 900

type Status = 'playing' | 'correct' | 'wrong'

type Props = {
  promptMode: 'image' | 'audio'
  onFinish: (correct: number, total: number) => void
  onExit: () => void
}

type Q = { word: ShapeName; bank: LetterTile[] }

function makeQuestion(word: ShapeName): Q {
  return { word, bank: letterBankFor(word) }
}

export function ShapeSpellEngine({ promptMode, onFinish, onExit }: Props) {
  const [nextShape] = useState(() => createSequencer<ShapeName>([...TEST13_SHAPES]))
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<Q>(() => makeQuestion(nextShape()))
  const [slots, setSlots] = useState<SlotState>(() => Array(question.word.length).fill(null))
  const [status, setStatus] = useState<Status>('playing')

  const correctRef = useRef(0)
  const failedRef = useRef(false)
  const timeoutRef = useRef<number | null>(null)

  // Speak the word on each new question in listen mode.
  useEffect(() => {
    if (promptMode === 'audio') speak(question.word.toLowerCase())
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question])

  const placedIds = new Set(
    slots.filter((s): s is LetterTile => s !== null).map((s) => s.id),
  )
  const availableTiles = question.bank.filter((t) => !placedIds.has(t.id))

  function slotForLetter(current: SlotState, letter: string): number {
    const matching = current.findIndex((s, i) => s === null && question.word[i] === letter)
    return matching >= 0 ? matching : current.findIndex((s) => s === null)
  }

  function goNext() {
    const next = index + 1
    if (next >= ROUND) {
      onFinish(correctRef.current, ROUND)
      return
    }
    const q = makeQuestion(nextShape())
    setIndex(next)
    setQuestion(q)
    setSlots(Array(q.word.length).fill(null))
    failedRef.current = false
    setStatus('playing')
  }

  function evaluate(filled: SlotState) {
    if (isCorrect(filled, question.word)) {
      setStatus('correct')
      playCorrect()
      speak(question.word.toLowerCase())
      if (!failedRef.current) correctRef.current += 1
      timeoutRef.current = window.setTimeout(goNext, CORRECT_DELAY_MS)
    } else {
      setStatus('wrong')
      playWrong()
      failedRef.current = true
      timeoutRef.current = window.setTimeout(() => {
        setSlots(Array(question.word.length).fill(null))
        setStatus('playing')
      }, WRONG_DELAY_MS)
    }
  }

  function handleSlotTap(i: number) {
    if (status !== 'playing') return
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
            style={{ width: `${((index + (status === 'correct' ? 1 : 0)) / ROUND) * 100}%` }}
          />
        </div>
        <div className="progress-count">
          {index + 1}/{ROUND}
        </div>
      </div>

      {promptMode === 'image' ? (
        <div className="k2-prompt">
          <ShapeView shape={question.word} size="big" />
        </div>
      ) : (
        <div className="k2-prompt">
          <button
            className="replay-btn"
            onClick={() => speak(question.word.toLowerCase())}
            aria-label="ฟังอีกครั้ง"
          >
            🔊
          </button>
          <p className="k2-listen-hint">ฟังแล้วเขียนคำ</p>
        </div>
      )}

      <SlotRow
        slots={slots}
        revealedIndex={-1}
        selectedIndex={null}
        status={status}
        onSlotTap={handleSlotTap}
      />

      <LetterBank tiles={availableTiles} disabled={status !== 'playing'} onTileTap={handleTileTap} />
    </div>
  )
}
