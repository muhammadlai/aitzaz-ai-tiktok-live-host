import { useMemo, useState } from 'react'
import { respond, type HostEvent } from './brain'
import { remember, loadMemory } from './memory'
import { speak } from './avatar'

const initial: HostEvent[] = [
  { type: 'follow', viewer: 'Ayesha' },
  { type: 'comment', viewer: 'Ali', text: 'Hi! How are you?' },
  { type: 'gift', viewer: 'Sana', gift: 'Rose' },
]

export default function App() {
  const [connected, setConnected] = useState(false)
  const [live, setLive] = useState(false)
  const [autoReply, setAutoReply] = useState(true)
  const [events, setEvents] = useState<HostEvent[]>(initial)
  const [memory, setMemory] = useState(loadMemory())
  const [lastReply, setLastReply] = useState('Welcome! I am AITZAZ AI, your LIVE host.')
  const [input, setInput] = useState('')
  const viewerCount = useMemo(() => 128 + events.length * 17, [events.length])

  function handle(event: HostEvent) {
    setEvents(v => [event, ...v].slice(0, 30))
    if (event.viewer && event.text) setMemory(remember(event.viewer, `Asked: ${event.text}`))
    if (autoReply) {
      const reply = respond(event, memory.map(m => m.fact))
      setLastReply(reply.text)
      speak({ ...reply, speaking: true })
    }
  }

  function ask() {
    if (!input.trim()) return
    handle({ type: 'comment', viewer: 'Test Viewer', text: input.trim() })
    setInput('')
  }

  return <div className="app">
    <header><div><div className="brand">AITZAZ <span>AI</span></div><div className="sub">TikTok LIVE Super Host</div></div><div className="status"><i className={connected ? 'on' : ''}/> {connected ? 'TikTok connected' : 'Simulator mode'}</div></header>
    <main>
      <section className="hero card">
        <div className="avatar-wrap"><div className={`avatar ${lastReply ? 'alive' : ''}`}><div className="hair"/><div className="face"><div className="eye e1"/><div className="eye e2"/><div className="mouth"/></div><div className="neck"/><div className="body"/></div><div className="ring"/></div>
        <div className="hero-copy"><div className="live-pill"><b/> {live ? 'LIVE' : 'READY'}</div><h1>Your AI host is ready.</h1><p>One brain. Natural conversation. Memory, gifts, reactions and live-event intelligence.</p><div className="actions"><button onClick={() => setLive(v => !v)} className={live ? 'danger' : 'primary'}>{live ? 'End LIVE' : 'Start LIVE'}</button><button onClick={() => setConnected(v => !v)}>{connected ? 'Disconnect' : 'Connect TikTok'}</button></div></div>
      </section>
      <section className="grid">
        <div className="card brain"><div className="title"><span>SUPER BRAIN</span><strong>ONLINE</strong></div><div className="brain-core"><div className="pulse"/><div><b>AITZAZ AI</b><small>Conversation Engine</small></div></div><div className="tog"><span>Automatic replies</span><button className={autoReply ? 'switch on' : 'switch'} onClick={() => setAutoReply(v => !v)}><i/></button></div><div className="provider"><span>AI Provider</span><b>OpenAI → Gemini fallback</b></div></div>
        <div className="card conversation"><div className="title"><span>LIVE CONVERSATION</span><strong>{viewerCount} viewers</strong></div><div className="reply">{lastReply}</div><div className="ask"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && ask()} placeholder="Test a viewer question…"/><button onClick={ask}>Send</button></div></div>
        <div className="card events"><div className="title"><span>EVENTS</span><strong>SIMULATOR</strong></div><div className="event-buttons"><button onClick={() => handle({type:'comment',viewer:'Hassan',text:'Tell me something interesting'})}>💬 Comment</button><button onClick={() => handle({type:'gift',viewer:'Maya',gift:'Galaxy'})}>🎁 Gift</button><button onClick={() => handle({type:'follow',viewer:'Noor'})}>❤️ Follow</button><button onClick={() => handle({type:'battle',viewer:'Opponent'})}>⚔️ Battle</button></div><div className="feed">{events.slice(0,7).map((e,i)=><div key={i}><b>{e.viewer}</b><span>{e.type === 'comment' ? e.text : e.type === 'gift' ? `sent ${e.gift}` : e.type}</span></div>)}</div></div>
        <div className="card memory"><div className="title"><span>MEMORY</span><strong>{memory.length} records</strong></div><p>Viewer context is stored locally in this browser test. Production memory will move behind the secure backend.</p>{memory.slice(-4).reverse().map((m,i)=><div className="mem" key={i}><b>{m.viewer}</b><span>{m.fact}</span></div>)}</div>
      </section>
    </main>
    <footer>AITZAZ AI • Browser test build • TikTok transport remains an adapter pending approved LIVE access</footer>
  </div>
}
