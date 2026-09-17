export type AvatarCue = { emotion: string; speaking: boolean; text: string }

export function speak(cue: AvatarCue) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(cue.text)
    utterance.rate = 1.02
    utterance.pitch = 1.05
    window.speechSynthesis.speak(utterance)
  }
}
