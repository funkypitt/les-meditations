import { reactive, shallowReactive, computed } from 'vue'
import mitt from 'mitt';
import db from './db.js'
import state from './state.js'



// -----------------
// Data
// -----------------

const loader = shallowReactive({
  active: null,
  controller: null,
  queue: reactive([])
})

export const pending = computed(() => {
  return loader.queue.length;
})

export const emitter = mitt();



// -----------------
// Download
// -----------------

async function download () {

  try {

    if (loader.active) return;
    if (!loader.queue.length) return;

    loader.active = loader.queue[0];
    loader.progress = 0;
    loader.controller = new AbortController();

    const response = await fetch(loader.active.url, {
      signal: loader.controller.signal
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${loader.active.name}: ${response.status}`);
    }

    const total = parseInt(response.headers.get('Content-Length'));
    const reader = response.body.getReader();
    const chunks = [];
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      received += value.length;
      loader.progress = received / total;
    }

    await db.put({
      ...loader.active,
      blob: new Blob(chunks)
    })

    emitter.emit('load', loader.active);
    loader.active = null;
    loader.queue.shift();

    download();

  }

  catch (e) {
    loader.active = null;
    loader.queue = reactive([]);
    state.error = e;
  }

}



// -----------------
// Exports
// -----------------

export default {

  has (rec) {
    return loader.queue.includes(rec);
  },

  del (rec) {
    const index = loader.queue.indexOf(rec);
    if (index === -1) return;
    if (loader.active === rec) loader.controller.abort();
    loader.queue.splice(index);
    download(); // timeout?
  },

  load (rec) {
    if (this.has(rec)) return;
    loader.queue.push(rec);
    download();
  }

}
