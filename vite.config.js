import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Para GitHub Pages: BASE_PATH=/nombre-del-repo/ npm run build
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'img/*.svg'],
      manifest: {
        name: 'Estudio Bíblico',
        short_name: 'Biblia',
        description: 'Estudio bíblico interactivo con lecciones, versículos y comandos de voz.',
        lang: 'es',
        theme_color: '#1e4fa3',
        background_color: '#f7f9fc',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            // Capítulos de la Free Use Bible API (AO Lab)
            urlPattern: /^https:\/\/bible\.helloao\.org\/api\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'bible-api',
              expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            // Imágenes remotas (p. ej. Unsplash) si decides usarlas en las lecciones
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'lesson-images',
              expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 90 },
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ]
})
