import test from 'node:test'
import assert from 'node:assert/strict'
import { startServer } from './server.mjs'

let server
let base

test.before(async()=>{server=await startServer(0); const address=server.address(); base=`http://127.0.0.1:${address.port}`})
test.after(async()=>{await new Promise(r=>server.close(r))})

test('backend starts and health/status endpoints respond',async()=>{const h=await fetch(`${base}/api/health`);assert.equal(h.status,200);assert.equal((await h.json()).ok,true);const s=await fetch(`${base}/api/status`);assert.equal(s.status,200);assert.equal((await s.json()).backend,'online')})
test('event normalization endpoint accepts simulator events',async()=>{const r=await fetch(`${base}/api/events`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'gift',viewer:'Tester',gift:'Rose'})});assert.equal(r.status,200);assert.equal((await r.json()).ok,true)})
test('invalid event is rejected',async()=>{const r=await fetch(`${base}/api/events`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:'unknown',viewer:'Tester'})});assert.equal(r.status,400)})
test('chat remains explicitly unconfigured without server AI credentials',async()=>{const r=await fetch(`${base}/api/chat`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({viewer:'Tester',message:'hello'})});assert.ok([200,503].includes(r.status));if(r.status===503)assert.match((await r.json()).error,/AI unavailable|OPENAI_API_KEY/)})
