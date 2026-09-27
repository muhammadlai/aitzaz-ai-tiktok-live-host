import type { HostEvent, BrainReply } from './brain'

const API=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'')
export function apiUrl(path:string){return `${API}${path}`}
export async function backendHealth(){const r=await fetch(apiUrl('/api/health'));return r.json()}
export async function backendStatus(){const r=await fetch(apiUrl('/api/status'));return r.json()}
export async function backendHosts(){const r=await fetch(apiUrl('/api/hosts'));return r.json()}
export async function backendSession(hostIds:string[]){const r=await fetch(apiUrl('/api/session'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({hostIds})});if(!r.ok)throw new Error(`Session ${r.status}`);return r.json()}
export async function backendChat(event:HostEvent,history:Array<{role:'user'|'assistant';content:string}> = [],hostId?:string):Promise<BrainReply&{provider:string;hostId:string;hostName:string;voice:string}>{const r=await fetch(apiUrl('/api/chat'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({viewer:event.viewer,message:event.text||event.gift||event.type,eventType:event.type,history,hostId})});if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||`Backend ${r.status}`);return r.json()}
export async function backendEvent(event:HostEvent&{hostId?:string}){const r=await fetch(apiUrl('/api/events'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(event)});if(!r.ok)throw new Error(`Event ${r.status}`);return r.json()}
export async function backendTts(text:string,voice?:string){const r=await fetch(apiUrl('/api/tts'),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,voice})});if(!r.ok)throw new Error((await r.json().catch(()=>({}))).error||`TTS ${r.status}`);return r.json() as Promise<{audioBase64:string}>}
export function connectEventStream(onEvent:(type:string,data:any)=>void){const source=new EventSource(apiUrl('/api/events'));for(const type of ['ready','tiktok.event','host.reply','session.changed','event.skipped','voice.fallback','error'])source.addEventListener(type,e=>onEvent(type,JSON.parse((e as MessageEvent).data)));return source}
