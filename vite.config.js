import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svg from 'vite-svg-loader';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({

  server: {
    host: '0.0.0.0',
    port: 49080
  },

  plugins: [
    vue(),
    svg(),
    tailwindcss()
  ]
});
