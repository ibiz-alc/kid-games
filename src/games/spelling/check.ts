import type { SlotState } from './types'

export function isComplete(slots: SlotState): boolean {
  return slots.every((s) => s !== null)
}

export function isCorrect(slots: SlotState, target: string): boolean {
  if (!isComplete(slots)) return false
  return slots.every((s, i) => s!.letter === target[i])
}
