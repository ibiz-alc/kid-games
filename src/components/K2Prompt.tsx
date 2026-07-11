import type { K2Prompt } from '../games/k2/types'
import { K2VisualView } from './K2Visual'

type Props = {
  prompt: K2Prompt
  onReplay: () => void
}

export function K2PromptView({ prompt, onReplay }: Props) {
  if (prompt.kind === 'visual') {
    return (
      <div className="k2-prompt">
        <K2VisualView visual={prompt.visual} size="big" />
      </div>
    )
  }
  return (
    <div className="k2-prompt">
      <button className="replay-btn" onClick={onReplay} aria-label="ฟังอีกครั้ง">
        🔊
      </button>
      <p className="k2-listen-hint">ฟังแล้วเลือกคำตอบ</p>
    </div>
  )
}
