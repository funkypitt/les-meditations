import { ref, reactive } from 'vue'
import db from './db.js'
import state from './state.js'



// -----------------
// UseDB
// -----------------

export function useDB () {

  const loading = ref(false);

  async function call (method, ...args) {
    try {
      loading.value = true;
      const data = await db[method](...args);
      loading.value = false;
      return data;
    }
    catch (e) {
      state.error = e;
      loading.value = false;
    }
  }

  const api = reactive({ loading })

  Object.keys(db).forEach(key => {
    api[key] = (...args) => call(key, ...args);
  })

  return api;

}