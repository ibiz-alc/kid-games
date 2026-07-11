import { shuffle, randInt } from './random'

/**
 * Returns a draw function that yields items in a "shuffle-bag" order:
 * every item appears once before any repeats, the bag reshuffles when empty,
 * and the seam between bags never repeats the previous item (pool > 1).
 */
export function createSequencer<T>(items: T[]): () => T {
  if (items.length === 0) throw new Error('createSequencer needs at least one item')

  let queue: T[] = []
  let last: T | undefined

  function refill() {
    queue = shuffle(items)
    if (items.length > 1 && queue[0] === last) {
      const swapWith = 1 + randInt(0, queue.length - 2)
      ;[queue[0], queue[swapWith]] = [queue[swapWith], queue[0]]
    }
  }

  return () => {
    if (queue.length === 0) refill()
    last = queue.shift() as T
    return last
  }
}
