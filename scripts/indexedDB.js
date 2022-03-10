export default function IndexedDB(dbName, dbVersion, dbUpgrade) {
  this.dbName = dbName;
  this.dbVersion = dbVersion;
  this.dbUpgrade = dbUpgrade;

  return new Promise((resolve, reject) => {

    // объект базы данных
    this.db = null;

    // если не поддерживается IndexedDB
    if (!('indexedDB' in window)) reject('not supported');

    // открытие базы данных
    const dbOpen = indexedDB.open(this.dbName, this.dbVersion);

    if (this.dbUpgrade) {

      // database upgrade event
      dbOpen.onupgradeneeded = e => {
        this.dbUpgrade(dbOpen.result, e.oldVersion, e.newVersion);
      };
    }

    dbOpen.onsuccess = () => {
      this.db = dbOpen.result;
      resolve(this);
    };

    dbOpen.onerror = e => {
      reject(`IndexedDB error: ${e.target.errorCode}`);
    };

  });

}

IndexedDB.prototype.set = function (storeName, name, value) {
  return new Promise((resolve, reject) => {

    // новая транзакция
    const
      transaction = this.db.transaction(storeName, 'readwrite'),
      store = transaction.objectStore(storeName);
    console.log(name, value);
    // запись в базу
    store.put(value, name);

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

  });
}

IndexedDB.prototype.get = function (storeName, name) {
  return new Promise((resolve, reject) => {

    // новая транзакция
    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    // чтение из базы
    const request = store.get(name);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

IndexedDB.prototype.getAllCategory = function (storeName) {
  return new Promise((resolve, reject) => {
    //новая транзакция
    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);

    //чтение из базы
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };

  })
}