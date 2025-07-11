import vue from '@vitejs/plugin-vue'
import svg from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { tailwindColors } from './vite.plugins.js'
import db from '#database/categories.js'

export default {

  server: {
    host: '0.0.0.0',
    port: 49080
  },

  plugins: [
    vue(),
    svg(),
    tailwindcss(),
    tailwindColors({
      colors: db.map(c => c.color),
      filename: 'src/tailwind-colors.css'
    }),
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      includeAssets: [
        'favicon.ico',
        'logo.png'
      ]
    })
  ]

}
