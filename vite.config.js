import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'

// Load .env / .env.local into process.env for the local dev API middleware
// (Vite only exposes VITE_-prefixed vars to the client; the serverless handler
// reads process.env.NVIDIA_API_KEY on the server side).
function loadDotEnv() {
  for (const file of ['.env', '.env.local']) {
    try {
      for (const line of readFileSync(new URL(file, import.meta.url), 'utf8').split('\n')) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
        if (m && process.env[m[1]] === undefined) {
          process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
        }
      }
    } catch { /* file may not exist */ }
  }
}
loadDotEnv()

// Serve /api/ask locally (npm run dev / preview) by adapting the Vercel-style
// handler to a connect middleware. On Vercel the real function is used instead.
function localApi() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      if ((req.url || '').split('?')[0] !== '/api/ask') return next()
      res.status = (c) => { res.statusCode = c; return res }
      res.json = (o) => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(o)); return res }
      if (req.method === 'POST') {
        req.body = await new Promise((resolve) => {
          let d = ''
          req.on('data', (c) => (d += c))
          req.on('end', () => { try { resolve(d ? JSON.parse(d) : {}) } catch { resolve({}) } })
          req.on('error', () => resolve({}))
        })
      }
      try {
        const { default: handler } = await import('./api/ask.js')
        await handler(req, res)
      } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Local API error: ' + e.message }))
      }
    })
  }
  return {
    name: 'local-api-ask',
    configureServer: mount,
    configurePreviewServer: mount,
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localApi(),
  ],
})
