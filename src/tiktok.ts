import type { HostEvent } from './brain'
export type TikTokAdapter = { status: 'disconnected'|'connected'|'live'; connect(): Promise<void>; disconnect(): Promise<void>; onEvent(handler:(event:HostEvent)=>void):void }
export class SimulatorAdapter implements TikTokAdapter {
  status: TikTokAdapter['status'] = 'disconnected'; private handler?: (event: HostEvent)=>void
  async connect(){ this.status='connected' }
  async disconnect(){ this.status='disconnected' }
  onEvent(handler:(event:HostEvent)=>void){ this.handler=handler }
  emit(event:HostEvent){ this.handler?.({...event,id:event.id || crypto.randomUUID()}) }
}
// Production transport remains isolated here. Configure an approved TikTok LIVE Events API/webhook
// or an authorized third-party transport server-side; never put TikTok secrets in the browser.
