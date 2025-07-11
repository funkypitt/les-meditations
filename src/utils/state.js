import { shallowReactive } from 'vue'

const state = shallowReactive({
  error: null,
  theme: 'blue',
  installPrompt: null
})

window.addEventListener('beforeinstallprompt', (event) => {
  state.installPrompt = event;
  event.preventDefault();
});

export default state;