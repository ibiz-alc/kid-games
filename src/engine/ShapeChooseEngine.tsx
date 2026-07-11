import { useEffect, useRef, useState } from 'react'
import type { Choice } from '../types'
import type { ShapeName } from '../games/test13/content'
import { TEST13_SHAPES } from '../games/test13/content'
import { chooseChoices } from '../games/test13/generate'
import { createSequencer } from '../lib/sequencer'
import { ChoiceButtons } from '../components/ChoiceButtons'
import { ShapeView } from '../components/ShapeView'
import { speak, playCorrect, playWrong } from '../lib/audio'

const ROUND = 5
const ADVANCE_DELAY_MS = 1200

type Props = {
  onFinish: (correct: number, total: number) => void
  onExit: () => void
}

type Q = { shape: ShapeName; choices: Choice[] }

function makeQuestion(shape: ShapeName): Q {
  return { shape, choices: chooseChoices(shape) }
}

export function ShapeChooseEngine({ onFinish, onExit }: Props) {
  const [nextShape] = useState(() => createSequencer<ShapeName>([...TEST13_SHAPES]))
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<Q>(() => makeQuestion(nextShape()))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const correctRef = useRef(0)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSelect(choice: Choice) {
    if (answered) return
    setSelectedId(choice.id)
    setAnswered(true)
    if (choice.correct) {
      correctRef.current += 1
      playCorrect()
      speak(question.shape.toLowerCase())
    } else {
      playWrong()
    }
    timeoutRef.current = window.setTimeout(() => {
      const next = index + 1
      if (next >= ROUND) {
        onFinish(correctRef.current, ROUND)
      } else {
        setIndex(next)
        setQuestion(makeQuestion(nextShape()))
        setSelectedId(null)
        setAnswered(false)
      }
    }, ADVANCE_DELAY_MS)
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
            style={{ width: `${((index + (answered ? 1 : 0)) / ROUND) * 100}%` }}
          />
        </div>
        <div className="progress-count">
          {index + 1}/{ROUND}
        </div>
      </div>

      <div className="k2-prompt">
        <ShapeView shape={question.shape} size="big" />
      </div>

      <ChoiceButtons
        choices={question.choices}
        selectedId={selectedId}
        answered={answered}
        onSelect={handleSelect}
      />
    </div>
  )
}
