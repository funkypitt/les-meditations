import { shallowReactive } from 'vue'

const state = shallowReactive({
  error: null,
  installPrompt: null
})

window.addEventListener('beforeinstallprompt', (event) => {
  state.installPrompt = event;
});

export default state;