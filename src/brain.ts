export type HostEvent = {
  type: 'comment' | 'gift' | 'follow' | 'like' | 'battle'
  viewer: string
  text?: string
  gift?: string
}

export type BrainReply = { text: string; emotion: string }

export function respond(event: HostEvent, context: string[] = []): BrainReply {
  const name = event.viewer || 'friend'
  if (event.type === 'gift') return { text: `Thank you ${name} for the ${event.gift ?? 'gift'}! That means a lot. 💖`, emotion: 'excited' }
  if (event.type === 'follow') return { text: `Welcome ${name}! Thank you for the follow — stay with us!`, emotion: 'happy' }
  if (event.type === 'battle') return { text: `Battle time! Let's keep the energy up and have fun, everyone! 🔥`, emotion: 'energetic' }
  if (event.type === 'like') return { text: `I see the love, ${name}! Thank you for the likes!`, emotion: 'happy' }
  const q = (event.text ?? '').trim()
  if (!q) return { text: `Hey ${name}, I'm here. What would you like to talk about?`, emotion: 'warm' }
  if (/^(hi|hello|hey)\b/i.test(q)) return { text: `Hi ${name}! I'm AITZAZ AI. It's great to see you live!`, emotion: 'happy' }
  return { text: `That's a great question, ${name}. I'm listening — tell me a little more and I'll keep the conversation going.`, emotion: 'thoughtful' }
}
