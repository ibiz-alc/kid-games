import { describe, it, expect } from 'vitest'
import { pickEnglishVoice } from './audio'

// Minimal fake voices (only the fields pickEnglishVoice reads).
function voice(name: string, lang: string): SpeechSynthesisVoice {
  return { name, lang } as SpeechSynthesisVoice
}

describe('pickEnglishVoice', () => {
  it('returns null when there are no voices', () => {
    expect(pickEnglishVoice([])).toBeNull()
  })

  it('never picks a non-English voice (the Thai-reading-English bug)', () => {
    const voices = [voice('Kanya', 'th-TH'), voice('Narisa', 'th-TH')]
    expect(pickEnglishVoice(voices)).toBeNull()
  })

  it('chooses the English voice over a Thai default', () => {
    const voices = [voice('Kanya', 'th-TH'), voice('Alex', 'en-US')]
    const picked = pickEnglishVoice(voices)
    expect(picked?.lang.toLowerCase()).toBe('en-us')
  })

  it('prefers a known natural voice by name', () => {
    const voices = [
      voice('Alex', 'en-US'),
      voice('Google US English', 'en-US'),
      voice('Daniel', 'en-GB'),
    ]
    expect(pickEnglishVoice(voices)?.name).toBe('Google US English')
  })

  it('falls back to a natural/online voice when no preferred name matches', () => {
    const voices = [
      voice('Some Basic Voice', 'en-IN'),
      voice('Microsoft Guy Online (Natural) - English', 'en-US'),
    ]
    expect(pickEnglishVoice(voices)?.name).toContain('Natural')
  })

  it('prefers en-US over other English locales when nothing else matches', () => {
    const voices = [voice('Basic AU', 'en-AU'), voice('Basic US', 'en-US')]
    expect(pickEnglishVoice(voices)?.lang.toLowerCase()).toBe('en-us')
  })
})
