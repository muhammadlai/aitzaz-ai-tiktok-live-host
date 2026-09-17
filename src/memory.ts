export type Memory = { viewer: string; fact: string; timestamp: number }
const KEY = 'aitzaz-live-memory'
export function loadMemory(): Memory[] { try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Memory[] } catch { return [] } }
export function remember(viewer: string, fact: string): Memory[] { const next = [...loadMemory(), { viewer, fact, timestamp: Date.now() }].slice(-200); localStorage.setItem(KEY, JSON.stringify(next)); return next }
export function clearMemory() { localStorage.removeItem(KEY) }
