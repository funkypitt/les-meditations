import { openDB } from 'idb'



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
// Exports
// -----------------

export default {

  async get (url) {
    const db = await connection;
    return db.get(STORE, url);
  },

  async put (rec) {
    const db = await connection;
    return db.put(STORE, rec);
  },

  async del (url) {
    const db = await connection;
    return db.delete(STORE, url);
  },

  async list () {
    const db = await connection;
    return db.getAll(STORE);
  }

}