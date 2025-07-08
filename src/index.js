import './index.css'
import { createApp, reactive } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './index.vue';
import routes from './config/routes.js'

const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);
const state = reactive({})

app.use(router);
app.provide('state', state);
app.mount('#app');

window.addEventListener('unhandledrejection', event => {
  state.error = event.reason;
})




// dbPromise.then(db => {
//   db.add('uploads', { name: 'a', description: 'b', url: 'http://localhost:8080' });
// })

// // Enregistrer le service worker
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(registration => {
//       console.log('Service Worker registered:', registration);
//     }).catch(error => {
//       console.error('Service Worker registration failed:', error);
//     });
//   });
// }
