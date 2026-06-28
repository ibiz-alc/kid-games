import type { GameDefinition } from '../types'
import { numbersGame } from './numbers'
import { colorsGame } from './colors'
import { mathGame } from './math'

export const games: GameDefinition[] = [numbersGame, colorsGame, mathGame]

export function findGame(id: string): GameDefinition | undefined {
  return games.find((g) => g.id === id)
}
