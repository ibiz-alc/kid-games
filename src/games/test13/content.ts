export type Test13Mode = 'choose' | 'write' | 'order' | 'listen'

export const TEST13_SHAPES = ['STAR', 'SQUARE', 'CIRCLE', 'OVAL', 'HEART'] as const

export type ShapeName = (typeof TEST13_SHAPES)[number]

export const TEST13_MODES: { id: Test13Mode; title: string; icon: string }[] = [
  { id: 'choose', title: 'CHOOSE', icon: '👆' },
  { id: 'write', title: 'WRITE', icon: '✏️' },
  { id: 'order', title: 'WRITE ORDER', icon: '🔡' },
  { id: 'listen', title: 'LISTEN', icon: '👂' },
]
