import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import svg from 'vite-svg-loader'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'






// -----------------
// Vite
// -----------------

export default defineConfig({

  server: {
    host: '0.0.0.0',
    port: 49080
  },

  plugins: [
    vue(),
    svg(),
    tailwindcss(),
    VitePWA({
      manifest: false,
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true // enables in dev mode
      }
    })
  ]

});
