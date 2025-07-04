import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'favicon-192.png', 'favicon-512.png'],
      manifest: {
        name: 'app enpleineconscience.ch',
        short_name: 'enpleineconscience',
        description: 'Méditations guidées d\'enpleineconscience.ch',
        theme_color: '#7287F1',
        icons: [
          {
            src: 'favicon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'favicon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,mp3}'], // Inclure les MP3 et autres fichiers
        skipWaiting: true, // Force l’activation immédiate (cohérent avec sw.js)
        clientsClaim: true // Prend le contrôle immédiatement
      },
      srcDir: 'src',
      filename: 'sw.js' // Utilise votre fichier sw.js personnalisé
    })
  ]
});
