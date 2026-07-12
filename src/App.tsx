import { useState } from 'react'
import { Home } from './components/Home'
import { Result } from './components/Result'
import { CategoryPicker } from './components/CategoryPicker'
import { CategoryPickerK2 } from './components/CategoryPickerK2'
import { Test13Menu } from './components/Test13Menu'
import { QuizEngine } from './engine/QuizEngine'
import { SpellEngine } from './engine/SpellEngine'
import { K2Engine } from './engine/K2Engine'
import { ShapeChooseEngine } from './engine/ShapeChooseEngine'
import { ShapeSpellEngine } from './engine/ShapeSpellEngine'
import { findGame } from './games'
import { starsFor, starsForScore } from './engine/scoring'
import { recordStars } from './lib/storage'
import type { SpellCategory } from './games/spelling/types'
import type { K2Category } from './games/k2/types'
import type { Test13Mode } from './games/test13/content'

type Screen =
  | { name: 'home' }
  | { name: 'play'; gameId: string }
  | { name: 'category' }
  | { name: 'spell'; category: SpellCategory }
  | { name: 'k2-category' }
  | { name: 'k2'; category: K2Category; seconds: number }
  | { name: 'test13-menu' }
  | { name: 'test13'; mode: Test13Mode }
  | { name: 'result'; stars: number; correct: number; total: number; replay: Screen }

export default function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })

  const goHome = () => setScreen({ name: 'home' })

  if (screen.name === 'home') {
    return (
      <Home
        onPick={(gameId) => setScreen({ name: 'play', gameId })}
        onSpell={() => setScreen({ name: 'category' })}
        onK2={() => setScreen({ name: 'k2-category' })}
        onTest13={() => setScreen({ name: 'test13-menu' })}
      />
    )
  }

  if (screen.name === 'test13-menu') {
    return (
      <Test13Menu onPick={(mode) => setScreen({ name: 'test13', mode })} onExit={goHome} />
    )
  }

  if (screen.name === 'test13') {
    const mode = screen.mode
    const replay: Screen = { name: 'test13', mode }
    const finish = (correct: number, total: number) => {
      const stars = starsForScore(correct, total)
      recordStars(`test13:${mode}`, stars)
      setScreen({ name: 'result', stars, correct, total, replay })
    }
    if (mode === 'choose') {
      return <ShapeChooseEngine onFinish={finish} onExit={goHome} />
    }
    return (
      <ShapeSpellEngine
        promptMode={mode === 'listen' ? 'audio' : 'image'}
        ordered={mode === 'order'}
        onFinish={finish}
        onExit={goHome}
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

  if (screen.name === 'k2-category') {
    return (
      <CategoryPickerK2
        onPick={(category, seconds) => setScreen({ name: 'k2', category, seconds })}
        onExit={goHome}
      />
    )
  }

  if (screen.name === 'play') {
    const game = findGame(screen.gameId)
    if (!game) return <Home onPick={() => {}} onSpell={goHome} onK2={goHome} onTest13={goHome} />
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

  if (screen.name === 'k2') {
    const { category, seconds } = screen
    const replay: Screen = { name: 'k2', category, seconds }
    return (
      <K2Engine
        category={category}
        seconds={seconds}
        onFinish={(correct, total) => {
          const stars = starsFor(correct)
          recordStars(`k2:${category}`, stars)
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
