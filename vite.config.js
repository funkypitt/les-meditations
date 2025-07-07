import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svg from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({

  server: {
    https: true,
    host: '0.0.0.0',
    port: 49080
  },

  plugins: [
    vue(),
    svg(),
    tailwindcss(),
    basicSsl()
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true
    //   },
    //   // includeAssets: ['favicon.png', 'favicon-192.png', 'favicon-512.png'],
    //   // manifest: {
    //   //   name: 'App enpleineconscience.ch',
    //   //   short_name: 'enpleineconscience',
    //   //   description: 'Méditations guidées d\'enpleineconscience.ch',
    //   //   theme_color: '#7287F1',
    //   //   icons: [
    //   //     {
    //   //       src: 'favicon-192.png',
    //   //       sizes: '192x192',
    //   //       type: 'image/png'
    //   //     },
    //   //     {
    //   //       src: 'favicon-512.png',
    //   //       sizes: '512x512',
    //   //       type: 'image/png'
    //   //     }
    //   //   ]
    //   // },
    //   // workbox: {
    //   //   globPatterns: ['**/*.{js,css,html,png,mp3}'],
    //   //   skipWaiting: true, // Force l’activation immédiate (cohérent avec sw.js)
    //   //   clientsClaim: true // Prend le contrôle immédiatement
    //   // },
    //   // srcDir: 'src',
    //   // filename: 'sw.js' // Utilise votre fichier sw.js personnalisé
    // })
    ]
});
