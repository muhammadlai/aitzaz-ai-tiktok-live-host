import {useEffect,useMemo,useState} from 'react'
import {respond,type HostEvent} from './brain'
import {loadMemory,remember,type Memory} from './memory'
import {backendEvent,backendSession,backendStatus,connectEventStream} from './api'
import {playBase64Audio,speakBrowser,stopAudio} from './avatar'
import {AvatarStage} from './AvatarStage'
import {HOSTS,getHost,type HostProfile} from './hostStudio'
import './studio.css'

const initial:HostEvent[]=[{type:'follow',viewer:'Ayesha'},{type:'comment',viewer:'Ali',text:'Hi! How are you?'},{type:'gift',viewer:'Sana',gift:'Rose'}]
const labels:Record<string,string>={comment:'💬 Comment',gift:'🎁 Gift',follow:'❤️ Follow',like:'👍 Like',share:'↗ Share',join:'👋 Join',battle:'⚔️ Battle'}
const env=import.meta.env as Record<string,string|undefined>
function avatarUrl(host:HostProfile){return env[`VITE_AVATAR_MODEL_URL_${host.id.toUpperCase()}`]||env.VITE_AVATAR_MODEL_URL||''}

export default function App(){
 const[activeHosts,setActiveHosts]=useState(['sara']),[events,setEvents]=useState<HostEvent[]>(initial),[memory,setMemory]=useState<Memory[]>(loadMemory()),[lastReply,setLastReply]=useState('Choose a host and start a test LIVE.'),[speaking,setSpeaking]=useState(false),[provider,setProvider]=useState('checking'),[voice,setVoice]=useState('checking'),[tiktok,setTiktok]=useState('simulator'),[errors,setErrors]=useState<string[]>([]),[live,setLive]=useState(false),[input,setInput]=useState(''),[streamOnline,setStreamOnline]=useState(false)
 const selected=useMemo(()=>activeHosts.map(id=>getHost(id)),[activeHosts])
 const viewerCount=useMemo(()=>128+events.length*17,[events.length])
 useEffect(()=>{
  backendStatus().then(s=>{setProvider(s.aiProvider);setVoice(s.voice);setTiktok(s.tiktok);if(Array.isArray(s.activeHosts))setActiveHosts(s.activeHosts)}).catch(e=>setErrors(v=>[e.message,...v].slice(0,8)))
  const es=connectEventStream((type,data)=>{
   setStreamOnline(true)
   if(type==='session.changed'&&Array.isArray(data.activeHosts))setActiveHosts(data.activeHosts)
   if(type==='tiktok.event'){const e:HostEvent={type:data.type,viewer:data.viewer,text:data.text,gift:data.gift,id:data.id};setEvents(v=>[e,...v].slice(0,30));if(e.viewer&&e.text)setMemory(remember(e.viewer,`Asked: ${e.text}`))}
   if(type==='host.reply'){setLastReply(`${data.hostName||'HOST'}: ${data.text}`);setProvider(data.provider||'openai');if(data.text){setSpeaking(true);if(data.audioBase64)playBase64Audio(data.audioBase64,undefined,()=>setSpeaking(false));else speakBrowser({text:data.text,emotion:data.emotion||'warm',speaking:true},undefined,()=>setSpeaking(false))}}
   if(type==='error')setErrors(v=>[data.message,...v].slice(0,8))
  })
  return()=>{es.close();stopAudio()}
 },[])
 async function chooseHost(id:string){
  const next=activeHosts.includes(id)?activeHosts.filter(x=>x!==id):activeHosts.length<2?[...activeHosts,id]:[activeHosts[0],id]
  const safe=next.length?next:['sara'];setActiveHosts(safe)
  try{await backendSession(safe)}catch(e){setErrors(v=>[(e as Error).message,...v].slice(0,8))}
 }
 async function handle(event:HostEvent){
  setEvents(v=>[event,...v].slice(0,30));if(event.viewer&&event.text)setMemory(remember(event.viewer,`Asked: ${event.text}`))
  try{await backendEvent({...event,hostId:activeHosts[0]})}catch(e){const reply=respond(event,memory.map(m=>m.fact));setLastReply(`${selected[0]?.name||'HOST'}: ${reply.text}`);speakBrowser({...reply,speaking:true},()=>setSpeaking(true),()=>setSpeaking(false));setErrors(v=>[`Backend unavailable; browser fallback used: ${(e as Error).message}`,...v].slice(0,8))}
 }
 function ask(){if(!input.trim())return;handle({type:'comment',viewer:'Test Viewer',text:input.trim()});setInput('')}
 return <div className="app">
  <header><div><div className="brand">AITZAZ <span>AI</span></div><div className="sub">MULTI-HOST TIKTOK LIVE STUDIO</div></div><div className="status"><i className={streamOnline?'on':''}/> {tiktok.toUpperCase()} · {streamOnline?'ENGINE ONLINE':'ENGINE READY'}</div></header>
  <main>
   <section className="studioHero card"><div className="heroText"><div className="live-pill"><b/> {live?'TEST LIVE':'READY'}</div><h1>Choose your AI LIVE hosts.</h1><p>SARA, LUNA, MAYA, ZAYN and ALEX can run solo. Select two for co-host mode: they take turns, react to each other and share one speech floor.</p><div className="actions"><button onClick={()=>setLive(v=>!v)} className={live?'danger':'primary'}>{live?'End Test LIVE':'Start Test LIVE'}</button></div></div><div className="miniStats"><div><b>{activeHosts.length}</b><span>ACTIVE HOSTS</span></div><div><b>2</b><span>MAX CO-HOSTS</span></div><div><b>{viewerCount}</b><span>SIM VIEWERS</span></div></div></section>
   <section className="card hostLibrary"><div className="title"><span>HOST LIBRARY</span><strong>{activeHosts.length===2?'CO-HOST MODE':'SOLO MODE'}</strong></div><div className="hostCards">{HOSTS.map(host=><button key={host.id} className={activeHosts.includes(host.id)?'hostCard active':'hostCard'} onClick={()=>chooseHost(host.id)}><div className="hostAvatar"><div className="hostGlow" style={{background:host.color}}/><span>{host.name.slice(0,1)}</span></div><div className="hostInfo"><b>{host.name}</b><small>{host.tagline}</small><em>{host.gender} · {host.voice}</em></div><div className="check">{activeHosts.includes(host.id)?'✓':'+'}</div></button>)}</div></section>
   <section className="avatarGrid">{selected.map(host=><div className="avatarPanel card" key={host.id}><div className="avatarPanelHead"><b>{host.name}</b><span>{host.personality}</span></div><AvatarStage modelUrl={avatarUrl(host)} speaking={speaking}/></div>)}</section>
   <section className="grid">
    <div className="card brain"><div className="title"><span>AITZAZ SUPER BRAIN</span><strong>{provider.toUpperCase()}</strong></div><div className="brain-core"><div className="pulse"/><div><b>HOST ORCHESTRATOR</b><small>Scheduler + memory + event priority</small></div></div><div className="provider"><span>Active</span><b>{selected.map(h=>h.name).join(' + ')}</b></div><div className="provider"><span>Voice</span><b>{voice}</b></div></div>
    <div className="card conversation"><div className="title"><span>LIVE CONVERSATION</span><strong>{viewerCount} viewers</strong></div><div className="reply">{lastReply}</div><div className="ask"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&ask()} placeholder="Test a viewer question…"/><button onClick={ask}>Send</button></div></div>
    <div className="card events"><div className="title"><span>TIKTOK EVENT ENGINE</span><strong>{tiktok.toUpperCase()}</strong></div><div className="event-buttons">{(['comment','gift','follow','like','share','join','battle'] as const).map(type=><button key={type} onClick={()=>handle(type==='comment'?{type,viewer:'Hassan',text:'Tell me something interesting'}:type==='gift'?{type,viewer:'Maya',gift:'Galaxy'}:{type,viewer:type==='battle'?'Opponent':'Noor'})}>{labels[type]}</button>)}</div><div className="feed">{events.slice(0,8).map((e,i)=><div key={e.id||i}><b>{e.viewer}</b><span>{e.type==='comment'?e.text:e.type==='gift'?'sent '+e.gift:e.type}</span></div>)}</div></div>
    <div className="card memory"><div className="title"><span>VIEWER MEMORY</span><strong>{memory.length} records</strong></div><p>Regular viewers can build persistent context for future replies.</p>{memory.slice(-4).reverse().map((m,i)=><div className="mem" key={i}><b>{m.viewer}</b><span>{m.fact}</span></div>)}</div>
    <div className="card"><div className="title"><span>SYSTEM</span><strong>{speaking?'SPEAKING':'IDLE'}</strong></div><div className="feed"><div><b>Brain</b><span>{provider}</span></div><div><b>Hosts</b><span>{selected.map(h=>h.name).join(' + ')}</span></div><div><b>Avatar</b><span>{selected.every(h=>avatarUrl(h))?'3D models configured':'avatar slots ready'}</span></div><div><b>TikTok</b><span>{tiktok}</span></div></div></div>
    <div className="card"><div className="title"><span>ERROR LOG</span><strong>{errors.length}</strong></div><div className="feed">{errors.length?errors.slice(0,5).map((e,i)=><div key={i}><b>!</b><span>{e}</span></div>):<div><b>✓</b><span>No runtime errors reported.</span></div>}</div></div>
   </section>
  </main>
  <footer>AITZAZ AI • Multi-host engine inspired by public open-source orchestration patterns. TikTok transport remains subject to available/approved access; this build keeps a safe simulator/webhook path for testing.</footer>
 </div>
}
