import type { HostEvent, BrainReply } from './brain'

const API=(import.meta.env.VITE_API_URL||'').replace(/\/$/,'')
export function apiUrl(path:string){return `${API}${path}`}
async function jsonFetch(path:string,init?:RequestInit){const r=await fetch(apiUrl(path),init);const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.error||`Request ${r.status}`);return body}
export function backendHealth(){return jsonFetch('/api/health')}
export function backendStatus(){return jsonFetch('/api/status')}
export function backendHosts(){return jsonFetch('/api/hosts')}
export function backendSession(hostIds:string[]){return jsonFetch('/api/session',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({hostIds})})}
export function backendConfig(token:string,config:Record<string,string>){return jsonFetch('/api/config',{method:'POST',headers:{'content-type':'application/json','x-aitzaz-admin-token':token},body:JSON.stringify(config)})}
export function backendConfigStatus(){return jsonFetch('/api/config/status')}
export function backendChat(event:HostEvent,history:Array<{role:'user'|'assistant';content:string}> = [],hostId?:string):Promise<BrainReply&{provider:string;hostId:string;hostName:string;voice:string}>{return jsonFetch('/api/chat',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({viewer:event.viewer,message:event.text||event.gift||event.type,eventType:event.type,history,hostId})})}
export function backendEvent(event:HostEvent&{hostId?:string}){return jsonFetch('/api/events',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(event)})}
export function backendTts(text:string,voice?:string){return jsonFetch('/api/tts',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({text,voice})}) as Promise<{audioBase64:string}>}
export function backendSchedule(input:{hostIds:string[];date:string;time:string;duration:number;topic:string}){return jsonFetch('/api/schedule',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(input)})}
export function backendSchedules(){return jsonFetch('/api/schedule')}
export function connectEventStream(onEvent:(type:string,data:any)=>void){const source=new EventSource(apiUrl('/api/events'));for(const type of ['ready','tiktok.event','host.reply','session.changed','event.skipped','voice.fallback','error','schedule.started'])source.addEventListener(type,e=>onEvent(type,JSON.parse((e as MessageEvent).data)));return source}
export function connectTikTok(){window.location.href=apiUrl('/api/tiktok/oauth')}
