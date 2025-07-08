import { openDB } from 'idb'
import state from './state.js'



// -----------------
// Constants
// -----------------

const STORE = 'uploads';
const DATABASE = 'data';
const VERSION = 1;



// -----------------
// Connection
// -----------------

const connection = openDB(DATABASE, VERSION, {
  upgrade(db) {
    db.createObjectStore(STORE, { keyPath: 'url' });
  }
});



// -----------------
// Call db method
// -----------------

async function call (method, ...args) {
  try {
    const db = await connection;
    return await db[method](STORE, ...args);
  }
  catch (e) {
    state.error = e;
  }
}



// -----------------
// Exports
// -----------------

export default {

  get (url) {
    return call('get', url);
  },

  put (rec) {
    return call('put', rec);
  },

  del (url) {
    return call('delete', url);
  },

  list () {
    return call('getAll');
  },

  count () {
    return call('count');
  }

}