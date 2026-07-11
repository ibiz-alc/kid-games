import type { ShapeName } from '../games/test13/content'

function shapeBody(shape: ShapeName) {
  switch (shape) {
    case 'CIRCLE':
      return <circle cx="50" cy="50" r="42" />
    case 'OVAL':
      return <ellipse cx="50" cy="50" rx="46" ry="30" />
    case 'SQUARE':
      return <rect x="12" y="12" width="76" height="76" rx="8" />
    case 'STAR':
      return <path d="M50 6 L61 38 L95 38 L67 58 L78 92 L50 71 L22 92 L33 58 L5 38 L39 38 Z" />
    case 'HEART':
      return (
        <path d="M50 88 C 10 58, 14 20, 38 20 C 47 20, 50 29, 50 34 C 50 29, 53 20, 62 20 C 86 20, 90 58, 50 88 Z" />
      )
  }
}

export function ShapeView({ shape, size }: { shape: ShapeName; size: 'big' | 'choice' }) {
  return (
    <svg
      className={`shape-svg shape-${size}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label={shape}
      fill="currentColor"
    >
      {shapeBody(shape)}
    </svg>
  )
}
