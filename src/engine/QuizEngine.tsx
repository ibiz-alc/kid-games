import { useState } from 'react'
import type { GameDefinition, Choice, Question } from '../types'
import { PromptRenderer } from '../components/PromptRenderer'
import { ChoiceButtons } from '../components/ChoiceButtons'
import { speak, playCorrect, playWrong } from '../lib/audio'

const QUESTIONS_PER_ROUND = 10
const ADVANCE_DELAY_MS = 1200

type Props = {
  game: GameDefinition
  onFinish: (correct: number, total: number) => void
}

export function QuizEngine({ game, onFinish }: Props) {
  const [index, setIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [question, setQuestion] = useState<Question>(() => game.generateQuestion())
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

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

    window.setTimeout(() => {
      const next = index + 1
      if (next >= QUESTIONS_PER_ROUND) {
        onFinish(correctCount + (isCorrect ? 1 : 0), QUESTIONS_PER_ROUND)
      } else {
        setIndex(next)
        setQuestion(game.generateQuestion())
        setSelectedId(null)
        setAnswered(false)
      }
    }, ADVANCE_DELAY_MS)
  }

  return (
    <div className="quiz">
      <div className="progress">
        ข้อ {index + 1} / {QUESTIONS_PER_ROUND}
      </div>
      <PromptRenderer prompt={question.prompt} />
      <ChoiceButtons
        choices={question.choices}
        selectedId={selectedId}
        answered={answered}
        onSelect={handleSelect}
      />
    </div>
  )
}
