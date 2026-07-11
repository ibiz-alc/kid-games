type Props = {
  remaining: number
  total: number
}

export function TimerBar({ remaining, total }: Props) {
  const pct = Math.max(0, Math.min(100, (remaining / total) * 100))
  const low = remaining <= 5
  return (
    <div className="timer-wrap">
      <div className="timer-track">
        <div className={`timer-fill ${low ? 'low' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="timer-count">{Math.ceil(remaining)}</span>
    </div>
  )
}
