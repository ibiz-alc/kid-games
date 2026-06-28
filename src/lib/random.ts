export function randInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1))
}

export function shuffle<T>(items: T[]): T[] {
  const arr = [...items]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randInt(0, i)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function pickDistinct<T>(pool: T[], count: number, exclude: T[] = []): T[] {
  const available = pool.filter((x) => !exclude.includes(x))
  return shuffle(available).slice(0, count)
}
