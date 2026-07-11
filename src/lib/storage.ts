const KEY_PREFIX = 'kid-games:stars:'
const SETTING_PREFIX = 'kid-games:setting:'

export function getStars(gameId: string): number {
  const raw = localStorage.getItem(KEY_PREFIX + gameId)
  return raw ? Number(raw) : 0
}

export function recordStars(gameId: string, stars: number): void {
  const best = Math.max(getStars(gameId), stars)
  localStorage.setItem(KEY_PREFIX + gameId, String(best))
}

export function getSetting(key: string, fallback: number): number {
  const raw = localStorage.getItem(SETTING_PREFIX + key)
  if (raw === null) return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

export function setSetting(key: string, value: number): void {
  localStorage.setItem(SETTING_PREFIX + key, String(value))
}
