import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('AITZAZ AI boot failed: #root element is missing')
}

try {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
} catch (error) {
  console.error('AITZAZ AI failed to start', error)
  root.innerHTML = `
    <main style="min-height:100vh;display:grid;place-items:center;background:#070912;color:#fff;font-family:system-ui,sans-serif;padding:24px;box-sizing:border-box">
      <section style="max-width:640px;text-align:center">
        <div style="font-size:32px;font-weight:800;letter-spacing:.08em">AITZAZ AI</div>
        <p style="opacity:.75">The LIVE host could not start.</p>
        <button onclick="location.reload()" style="padding:12px 18px;border:0;border-radius:10px;cursor:pointer">Reload</button>
      </section>
    </main>
  `
}
