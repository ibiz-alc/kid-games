import { useState } from 'react'
import { Home } from './components/Home'
import { Result } from './components/Result'
import { CategoryPicker } from './components/CategoryPicker'
import { QuizEngine } from './engine/QuizEngine'
import { SpellEngine } from './engine/SpellEngine'
import { findGame } from './games'
import { starsFor } from './engine/scoring'
import { recordStars } from './lib/storage'
import type { SpellCategory } from './games/spelling/types'

type Screen =
  | { name: 'home' }
  | { name: 'play'; gameId: string }
  | { name: 'category' }
  | { name: 'spell'; category: SpellCategory }
  | { name: 'result'; stars: number; correct: number; total: number; replay: Screen }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const goHome = () => setScreen({ name: 'home' })

  if (screen.name === 'home') {
    return (
      <Home
        onPick={(gameId) => setScreen({ name: 'play', gameId })}
        onSpell={() => setScreen({ name: 'category' })}
      />
    )
  }

  if (screen.name === 'category') {
    return (
      <CategoryPicker
        onPick={(category) => setScreen({ name: 'spell', category })}
        onExit={goHome}
      />
    )
  }

  if (screen.name === 'play') {
    const game = findGame(screen.gameId)
    if (!game) return <Home onPick={() => {}} onSpell={() => setScreen({ name: 'category' })} />
    const replay: Screen = { name: 'play', gameId: screen.gameId }
    return (
      <QuizEngine
        game={game}
        onFinish={(correct, total) => {
          const stars = starsFor(correct)
          recordStars(screen.gameId, stars)
          setScreen({ name: 'result', stars, correct, total, replay })
        }}
        onExit={goHome}
      />
    )
  }

  if (screen.name === 'spell') {
    const category = screen.category
    const replay: Screen = { name: 'spell', category }
    return (
      <SpellEngine
        category={category}
        onFinish={(correct, total) => {
          const stars = starsFor(correct)
          recordStars(`spell:${category}`, stars)
          setScreen({ name: 'result', stars, correct, total, replay })
        }}
        onExit={goHome}
      />
    )
  }

  return (
    <Result
      stars={screen.stars}
      correct={screen.correct}
      total={screen.total}
      onReplay={() => setScreen(screen.replay)}
      onHome={goHome}
    />
  )
}
