import IndexedDB from './indexedDB';

export default function Store(storeName) {
  this.DB = null;
}

Store.prototype.dbConnect = async function () {
  this.DB = this.DB || await new IndexedDB(
    'Notes',
    1,
    (db, oldVersion, newVersion) => {
      // обновление базы данных
      switch (oldVersion) {
        case 0: {
          let storeCategories = db.createObjectStore('categories');
          let storeNotes = db.createObjectStore('notes');
          storeNotes.createIndex('idCategory', 'idCategory');
        }
      }
    });

  return this.DB;
}

Store.prototype.set = async function (storeName, name, value) {
  // обновление базы данных
  const db = await this.dbConnect();
  await db.set(storeName, name, value);
}

Store.prototype.get = async function (storName, name) {
  const db = await this.dbConnect();

  return await db.get(storeName, name);
}

Store.prototype.getAll = async function (storeName, seachName) {
  const db = await this.dbConnect();

  return await db.getAll(storeName, seachName);
}

Store.prototype.getByIndex = async function (storeName, nameIndex, value) {
  const db = await  this.dbConnect();

  return await db.getByIndex(storeName, nameIndex, value);
}

Store.prototype.deleteItem = async function (storeName, id) {
  const db = await this.dbConnect();
  await db.deleteEntry(storeName, id);
}

Store.prototype.deleteNotes = async function (storeName, index, id) {
  const db = await this.dbConnect();
  await db.deleteMultipleEntries(storeName, index, id);
}