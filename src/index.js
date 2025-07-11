import './index.css'
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './index.vue';
import routes from './config/routes.js'
import shades from '#database/shades.js'

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 })
});

router.beforeResolve(to => {
  const color = to.name === 'category' ? to.meta.category.color : 'blue';
  shades.forEach(shade => {
    document.documentElement.style.setProperty(`--color-theme-${shade}`, `var(--color-${color}-${shade})`);
  })
})

const app = createApp(App);
app.use(router);
app.mount('#app');

window.addEventListener('unhandledrejection', event => {
  state.error = event.reason;
})