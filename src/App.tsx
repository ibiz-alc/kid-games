import { useState } from 'react'
import { Home } from './components/Home'
import { Result } from './components/Result'
import { QuizEngine } from './engine/QuizEngine'
import { findGame } from './games'
import { starsFor } from './engine/scoring'
import { recordStars } from './lib/storage'

type Screen =
  | { name: 'home' }
  | { name: 'play'; gameId: string }
  | { name: 'result'; gameId: string; stars: number; correct: number; total: number }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  if (screen.name === 'home') {
    return <Home onPick={(gameId) => setScreen({ name: 'play', gameId })} />
  }

  if (screen.name === 'play') {
    const game = findGame(screen.gameId)
    if (!game) {
      return <Home onPick={(gameId) => setScreen({ name: 'play', gameId })} />
    }
    const gameId = screen.gameId
    return (
      <QuizEngine
        game={game}
        onFinish={(correct, total) => {
          const stars = starsFor(correct)
          recordStars(gameId, stars)
          setScreen({ name: 'result', gameId, stars, correct, total })
        }}
      />
    )
  }

  return (
    <Result
      stars={screen.stars}
      correct={screen.correct}
      total={screen.total}
      onReplay={() => setScreen({ name: 'play', gameId: screen.gameId })}
      onHome={() => setScreen({ name: 'home' })}
    />
  )
}
