import { reactive, markRaw, ref } from 'vue'
import mitt from 'mitt';
import db from './db.js'
import state from './state.js'



// -----------------
// Data
// -----------------

let controller;
const emitter = mitt();
const active = ref(null);
const progress = ref(0);
const queue = reactive([]);



// -----------------
// Download
// -----------------

async function download () {

  try {

    if (active.value) return;
    if (!queue.length) return;

    active.value = queue[0];
    progress.value = 0;
    controller = new AbortController();

    const response = await fetch(active.value.url, {
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Échec de récupération ${active.value.name}: ${response.status}`);
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
      progress.value = received / total;
    }

    const row = {
      ...active.value,
      blob: new Blob(chunks, { type: 'audio/mpeg' })
    }

    const success = await db.put(row);
    if (!success) throw state.error;

    emitter.emit('load', row);
    active.value = null;
    queue.shift();

    download();

  }

  catch (e) {
    active.value = null;
    if (e.name !== 'AbortError') {
      queue.length = 0;
      state.error = e;
    }
  }

}



// -----------------
// Exports
// -----------------

export default reactive({

  active,
  progress,
  queue,
  emitter: markRaw(emitter),

  has (rec) {
    return queue.includes(rec);
  },

  del (rec) {
    const index = queue.indexOf(rec);
    if (index === -1) return;
    if (active.value.url === rec.url) controller?.abort();
    queue.splice(index, 1);
    setTimeout(download);
  },

  load (rec) {
    if (this.has(rec)) return;
    queue.push(rec);
    download();
  }

})
