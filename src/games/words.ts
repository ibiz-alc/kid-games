export const NUMBER_WORDS = [
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
]

export function numberWord(n: number): string {
  return NUMBER_WORDS[n - 1]
}
