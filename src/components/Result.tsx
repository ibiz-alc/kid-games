type Props = {
  stars: number
  correct: number
  total: number
  onReplay: () => void
  onHome: () => void
}

export function Result({ stars, correct, total, onReplay, onHome }: Props) {
  return (
    <div className="result">
      <h1>เก่งมาก!</h1>
      <div className="result-stars">{stars > 0 ? '⭐'.repeat(stars) : '☆'}</div>
      <p>
        ตอบถูก {correct} จาก {total} ข้อ
      </p>
      <div className="result-actions">
        <button className="btn-primary" onClick={onReplay}>
          เล่นอีกครั้ง
        </button>
        <button className="btn-secondary" onClick={onHome}>
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  )
}
