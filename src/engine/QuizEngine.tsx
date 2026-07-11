import { useEffect, useRef, useState } from 'react'
import type { GameDefinition, Choice, Question } from '../types'
import { PromptRenderer } from '../components/PromptRenderer'
import { ChoiceButtons } from '../components/ChoiceButtons'
import { WordBank } from '../components/WordBank'
import { speak, playCorrect, playWrong } from '../lib/audio'
import { createSequencer } from '../lib/sequencer'

const QUESTIONS_PER_ROUND = 10
const ADVANCE_DELAY_MS = 1200

type Props = {
  game: GameDefinition
  onFinish: (correct: number, total: number) => void
  onExit: () => void
}

export function QuizEngine({ game, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [nextKey] = useState(() => createSequencer(game.itemKeys))
  const [question, setQuestion] = useState<Question>(() => game.generateQuestion(nextKey()))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  // Cancel any pending advance timer when leaving the screen.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  function handleSelect(choice: Choice) {
    if (answered) return
    setSelectedId(choice.id)
    setAnswered(true)

    const isCorrect = choice.correct
    if (isCorrect) {
      setCorrectCount((n) => n + 1)
      playCorrect()
      speak(question.speakText)
    } else {
      playWrong()
    }

    timeoutRef.current = window.setTimeout(() => {
      const next = index + 1
      if (next >= QUESTIONS_PER_ROUND) {
        onFinish(correctCount + (isCorrect ? 1 : 0), QUESTIONS_PER_ROUND)
      } else {
        setIndex(next)
        setQuestion(game.generateQuestion(nextKey()))
        setSelectedId(null)
        setAnswered(false)
      }
    }, ADVANCE_DELAY_MS)
  }

  const progressPct = ((index + (answered ? 1 : 0)) / QUESTIONS_PER_ROUND) * 100

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
          {index + 1}/{QUESTIONS_PER_ROUND}
        </div>
      </div>

      <PromptRenderer prompt={question.prompt} />

      {game.answerMode === 'wordbank' ? (
        <WordBank
          choices={question.choices}
          selectedId={selectedId}
          answered={answered}
          onSelect={handleSelect}
        />
      ) : (
        <ChoiceButtons
          choices={question.choices}
          selectedId={selectedId}
          answered={answered}
          onSelect={handleSelect}
        />
      )}
    </div>
  )
}
