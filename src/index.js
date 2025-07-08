import './index.css'
import { createApp, reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './index.vue';
import routes from './config/routes.js'

const router = createRouter({
  routes,
  history: createWebHistory(),
  scrollBehavior: () => ({ top: 0 })
});

const app = createApp(App);
const state = reactive({})

app.use(router);
app.provide('state', state);
app.mount('#app');

window.addEventListener('unhandledrejection', event => {
  state.error = event.reason;
})