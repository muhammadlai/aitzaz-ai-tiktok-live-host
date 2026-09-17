export type AvatarCue = { emotion: string; speaking: boolean; text: string }
let currentAudio: HTMLAudioElement | undefined
export function speakBrowser(cue: AvatarCue, onStart?: () => void, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cue.text)
  utterance.rate = 1.02
  utterance.pitch = 1.05
  utterance.onstart = () => onStart?.()
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  window.speechSynthesis.speak(utterance)
}
export function playBase64Audio(base64: string, onStart?: () => void, onEnd?: () => void) {
  currentAudio?.pause(); currentAudio = new Audio(`data:audio/mpeg;base64,${base64}`)
  currentAudio.onplay = () => onStart?.(); currentAudio.onended = () => { currentAudio = undefined; onEnd?.() }; currentAudio.onerror = () => { currentAudio = undefined; onEnd?.() }
  currentAudio.play().catch(() => onEnd?.())
  return currentAudio
}
export function stopAudio() { currentAudio?.pause(); currentAudio = undefined; window.speechSynthesis?.cancel() }
