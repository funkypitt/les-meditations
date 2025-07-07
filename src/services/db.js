import { openDB } from 'idb';

const connection = openDB('data', 1, {
  upgrade(db) {
    db.createObjectStore('uploads', {keyPath: 'url'});
  }
});

export default {

  async get(url) {
    const db = await connection;
    return db.get('uploads', url);
  },

  async del(url) {
    const db = await connection;
    return db.delete('uploads', url);
  },

  async list() {
    const db = await connection;
    await db.getAll('uploads');
  }

}