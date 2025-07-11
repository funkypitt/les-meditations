import vue from '@vitejs/plugin-vue'
import svg from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { tailwindColors } from './vite.plugins.js'
import categories from '#database/categories.js'
import shades from '#database/shades.js'

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
      shades,
      colors: categories.map(c => c.color),
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
