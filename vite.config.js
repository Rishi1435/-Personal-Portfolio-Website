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

// Serve the /api/* serverless handlers locally (npm run dev / preview) by
// adapting the Vercel-style handlers to connect middleware. On Vercel the real
// functions are used instead. Add a route here whenever a new api/<name>.js
// endpoint is created so it works in local dev too.
const LOCAL_API_ROUTES = {
  '/api/ask': () => import('./api/ask.js'),
  '/api/github': () => import('./api/github.js'),
  '/api/leetcode': () => import('./api/leetcode.js'),
}

function localApi() {
  const mount = (server) => {
    server.middlewares.use(async (req, res, next) => {
      const pathname = (req.url || '').split('?')[0]
      const load = LOCAL_API_ROUTES[pathname]
      if (!load) return next()
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
        const { default: handler } = await load()
        await handler(req, res)
      } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Local API error: ' + e.message }))
      }
    })
  }
  return {
    name: 'local-api',
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
  // Honour a PORT env var when one is provided (e.g. the preview tooling), and
  // pin to it so the port is predictable; otherwise fall back to Vite's default.
  server: process.env.PORT
    ? { port: Number(process.env.PORT), strictPort: true }
    : undefined,
})
