export function starsFor(correct: number): number {
  if (correct >= 8) return 3
  if (correct >= 5) return 2
  if (correct >= 1) return 1
  return 0
}
