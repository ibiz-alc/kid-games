import { useEffect, useRef, useState } from 'react'
import type { K2Category, K2Question, K2Choice } from '../games/k2/types'
import { generateK2Question } from '../games/k2/generate'
import { K2PromptView } from '../components/K2Prompt'
import { K2Choices } from '../components/K2Choices'
import { TimerBar } from '../components/TimerBar'
import { speak, playCorrect, playWrong } from '../lib/audio'

const QUESTIONS_PER_ROUND = 10
const ADVANCE_DELAY_MS = 1300

type Props = {
  category: K2Category
  seconds: number
  onFinish: (correct: number, total: number) => void
  onExit: () => void
}

export function K2Engine({ category, seconds, onFinish, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [question, setQuestion] = useState<K2Question>(() => generateK2Question(category))
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [remaining, setRemaining] = useState(seconds)

  const correctRef = useRef(0)
  const answeredRef = useRef(false)
  const endRef = useRef(0)
  const intervalRef = useRef<number | null>(null)
  const advanceRef = useRef<number | null>(null)

  function stopCountdown() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  function scheduleAdvance() {
    advanceRef.current = window.setTimeout(() => {
      const next = index + 1
      if (next >= QUESTIONS_PER_ROUND) {
        onFinish(correctRef.current, QUESTIONS_PER_ROUND)
      } else {
        setIndex(next)
        setQuestion(generateK2Question(category))
      }
    }, ADVANCE_DELAY_MS)
  }

  function handleTimeout() {
    if (answeredRef.current) return
    answeredRef.current = true
    stopCountdown()
    setAnswered(true)
    playWrong()
    scheduleAdvance()
  }

  function startCountdown() {
    stopCountdown()
    endRef.current = Date.now() + seconds * 1000
    setRemaining(seconds)
    intervalRef.current = window.setInterval(() => {
      const rem = (endRef.current - Date.now()) / 1000
      if (rem <= 0) {
        setRemaining(0)
        handleTimeout()
      } else {
        setRemaining(rem)
      }
    }, 100)
  }

  // Set up each question: speak audio prompts, then start the timer.
  useEffect(() => {
    answeredRef.current = false
    setAnswered(false)
    setSelectedId(null)
    setRemaining(seconds)

    if (question.prompt.kind === 'audio') {
      speak(question.prompt.speakText, () => {
        if (!answeredRef.current) startCountdown()
      })
    } else {
      startCountdown()
    }

    return () => {
      stopCountdown()
      if (advanceRef.current !== null) window.clearTimeout(advanceRef.current)
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question])

  function handleSelect(choice: K2Choice) {
    if (answeredRef.current) return
    answeredRef.current = true
    stopCountdown()
    setSelectedId(choice.id)
    setAnswered(true)
    if (choice.correct) {
      correctRef.current += 1
      playCorrect()
      speak(question.speakText)
    } else {
      playWrong()
    }
    scheduleAdvance()
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

      <TimerBar remaining={remaining} total={seconds} />

      <K2PromptView prompt={question.prompt} onReplay={() => speak(question.speakText)} />

      <K2Choices
        choices={question.choices}
        selectedId={selectedId}
        answered={answered}
        onSelect={handleSelect}
      />
    </div>
  )
}
