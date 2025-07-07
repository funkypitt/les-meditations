import { reactive } from 'vue'
import db from '#src/services/db.js'

const state = reactive({
  active: null,
  controller: null,
  queue: []
})

export default {

  cancel (rec) {
      if (state.active === rec) return state.controller.abort();
      const index = state.queue.indexOf(rec);
      if (index > -1) return state.queue.splice(index, 1);
      return db.del(rec.url);
  },

  async test () {

    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    })

    throw new Error('!')

  }

}
