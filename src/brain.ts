export type HostEvent = {
  id?: string
  type: 'comment' | 'gift' | 'follow' | 'like' | 'share' | 'join' | 'battle'
  viewer: string
  text?: string
  gift?: string
  amount?: number
}
export type BrainReply = { text: string; emotion: string }

export function respond(event: HostEvent, _context: string[] = []): BrainReply {
  const name = event.viewer || 'friend'
  if (event.type === 'gift') return { text: `Thank you ${name} for the ${event.gift ?? 'gift'}! 💖`, emotion: 'excited' }
  if (event.type === 'follow') return { text: `Welcome ${name}! Thank you for the follow!`, emotion: 'happy' }
  if (event.type === 'battle') return { text: `Battle time! Let's keep the energy fun! 🔥`, emotion: 'energetic' }
  if (event.type === 'like') return { text: `I see the love, ${name}! Thank you!`, emotion: 'happy' }
  if (event.type === 'share') return { text: `Thank you ${name} for sharing the LIVE!`, emotion: 'happy' }
  if (event.type === 'join') return { text: `Welcome in, ${name}!`, emotion: 'warm' }
  const q = (event.text ?? '').trim()
  if (!q) return { text: `Hey ${name}, I'm here. What would you like to talk about?`, emotion: 'warm' }
  if (/^(hi|hello|hey)\b/i.test(q)) return { text: `Hi ${name}! Great to see you LIVE!`, emotion: 'happy' }
  return { text: `That's interesting, ${name}. Tell me a little more!`, emotion: 'thoughtful' }
}
