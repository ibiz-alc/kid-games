import type { GameDefinition } from '../types'
import { numbersGame } from './numbers'
import { colorsGame } from './colors'
import { mathGame } from './math'
import { fillinGame } from './fillin'

export const games: GameDefinition[] = [numbersGame, colorsGame, mathGame, fillinGame]

export function findGame(id: string): GameDefinition | undefined {
  return games.find((g) => g.id === id)
}
