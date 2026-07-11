export function speak(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.()
    return
  }
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9
  if (onEnd) {
    utterance.onend = () => onEnd()
    utterance.onerror = () => onEnd()
  }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

let audioCtx: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioCtx) audioCtx = new Ctor()
  return audioCtx
}

function tone(freq: number, durationMs: number, startOffset = 0): void {
  const ctx = getContext()
  if (!ctx) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.value = 0.2
  osc.connect(gain)
  gain.connect(ctx.destination)
  const start = ctx.currentTime + startOffset
  osc.start(start)
  osc.stop(start + durationMs / 1000)
}

export function playCorrect(): void {
  tone(660, 120, 0)
  tone(880, 160, 0.12)
}

export function playWrong(): void {
  tone(200, 250, 0)
}
