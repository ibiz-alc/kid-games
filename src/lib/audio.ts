// Voices we know sound natural for English, in order of preference.
// Matched by substring against the voice name.
const PREFERRED_VOICE_NAMES = [
  'Google US English',
  'Microsoft Aria', // Windows natural online
  'Microsoft Jenny',
  'Microsoft Zira',
  'Samantha', // macOS / iOS natural
  'Aaron',
  'Google UK English Female',
  'Google UK English Male',
  'Daniel', // en-GB macOS
  'Karen',
  'Moira',
  'Tessa',
]

/**
 * Pick the best available English voice. Never returns a non-English voice,
 * which is what caused English words to be read with a Thai voice.
 */
export function pickEnglishVoice(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice | null {
  const english = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('en'))
  if (english.length === 0) return null

  for (const name of PREFERRED_VOICE_NAMES) {
    const hit = english.find((v) => v.name.includes(name))
    if (hit) return hit
  }

  const natural = english.find((v) => /natural|online|google|enhanced|premium/i.test(v.name))
  if (natural) return natural

  const us = english.find((v) => v.lang.toLowerCase() === 'en-us')
  if (us) return us

  return english[0]
}

let cachedVoice: SpeechSynthesisVoice | null = null
let voicesBound = false

function ensureVoice(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const refresh = () => {
    cachedVoice = pickEnglishVoice(window.speechSynthesis.getVoices())
  }
  refresh()
  if (!voicesBound) {
    voicesBound = true
    // Voices often load asynchronously; refresh when they become available.
    window.speechSynthesis.onvoiceschanged = refresh
  }
}

ensureVoice()

export function speak(text: string, onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.()
    return
  }
  ensureVoice()
  const utterance = new SpeechSynthesisUtterance(text)
  if (cachedVoice) {
    utterance.voice = cachedVoice
    utterance.lang = cachedVoice.lang
  } else {
    utterance.lang = 'en-US'
  }
  utterance.rate = 0.9
  utterance.pitch = 1.0
  utterance.volume = 1.0
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
  // short attack/release envelope so tones sound smooth, not clicky
  const start = ctx.currentTime + startOffset
  const end = start + durationMs / 1000
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(0.2, start + 0.02)
  gain.gain.setValueAtTime(0.2, Math.max(start + 0.02, end - 0.04))
  gain.gain.linearRampToValueAtTime(0, end)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(end)
}

export function playCorrect(): void {
  tone(660, 140, 0)
  tone(880, 180, 0.12)
}

export function playWrong(): void {
  tone(200, 260, 0)
}
