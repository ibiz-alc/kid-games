const KEY_PREFIX = 'kid-games:stars:'

export function getStars(gameId: string): number {
  const raw = localStorage.getItem(KEY_PREFIX + gameId)
  return raw ? Number(raw) : 0
}

export function recordStars(gameId: string, stars: number): void {
  const best = Math.max(getStars(gameId), stars)
  localStorage.setItem(KEY_PREFIX + gameId, String(best))
}
