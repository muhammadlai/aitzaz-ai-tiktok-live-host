import type { HostEvent } from './brain'

export type TikTokAdapter = {
  status: 'disconnected' | 'connected' | 'live'
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  onEvent: (handler: (event: HostEvent) => void) => void
}

// Browser-safe simulator. Replace with an approved TikTok LIVE transport in production.
export class SimulatorAdapter implements TikTokAdapter {
  status: TikTokAdapter['status'] = 'disconnected'
  private handler: ((event: HostEvent) => void) | undefined
  async connect() { this.status = 'connected' }
  async disconnect() { this.status = 'disconnected' }
  onEvent(handler: (event: HostEvent) => void) { this.handler = handler }
  emit(event: HostEvent) { this.handler?.(event) }
}
