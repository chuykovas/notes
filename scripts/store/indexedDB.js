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
    const transaction = this.db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
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

/**
 *
 */

IndexedDB.prototype.getAll = function (storeName, searchName) {
  return new Promise((resolve, reject) => {
    //новая транзакция
    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    let request = null;
    //чтение из базы
    if (searchName) {
      request = store.getAll(searchName);
    } else {
      request = store.getAll();
    }

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  })
}

/**
 *
 */

IndexedDB.prototype.getByIndex = function (storeName, nameIndex, value) {
  return new Promise((resolve, reject) => {
    //новая транзакция
    const transaction = this.db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(nameIndex);
    const request = index.getAll(value);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error);
    };
  })
}

/**
 *
 */

IndexedDB.prototype.deleteEntry = function (storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = this.db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);

    // запись в базу
    store.delete(id);

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  });
}

IndexedDB.prototype.deleteMultipleEntries = function (storeName, nameIndex, indexValue) {
  return new Promise((resolve, reject) => {
    //новая транзакция
    const transaction = this.db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const index = store.index(nameIndex);

    const request = index.openKeyCursor(IDBKeyRange.only(indexValue));

    request.onsuccess = () => {
      let cursor = request.result;
      if (cursor) {
        store.delete(cursor.primaryKey);
        cursor.continue();
      }
    };

    transaction.oncomplete = () => {
      resolve(true);
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };
  })
}