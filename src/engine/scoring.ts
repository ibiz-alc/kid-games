export function starsFor(correct: number): number {
  if (correct >= 8) return 3
  if (correct >= 5) return 2
  if (correct >= 1) return 1
  return 0
}

/** Stars from a score of any round length (ratio-based): >=80% = 3, >=50% = 2, any = 1. */
export function starsForScore(correct: number, total: number): number {
  const ratio = total > 0 ? correct / total : 0
  if (ratio >= 0.8) return 3
  if (ratio >= 0.5) return 2
  if (correct >= 1) return 1
  return 0
}
