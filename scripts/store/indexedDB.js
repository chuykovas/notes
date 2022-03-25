/**
 * инициальзация базы данных
 * @param dbName - имя базы данных
 * @param dbVersion - версия базы данных
 * @param dbUpgrade - callback для обновления базы данных
 * @constructor
 */

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

/**
 * запись в базу данных
 * @param storeName - имя хранилища
 * @param name - название для поля key
 * @param value - записываемое значение
 * @returns {Promise<unknown> | Promise<unknown>} возврщает промис
 */
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

/**
 * получение одного значения из базы данных
 * @param storeName - имя хранилища
 * @param name - значение key для получения элемента из базы
 * @returns {Promise<unknown> | Promise<unknown>}
 */
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
 * получение всех значений из базы данных
 * если передан параметр searchName будут найдены все записи с этим значением
 * @param storeName - имя хранилища
 * @param searchName - поле для поиска
 * @returns {Promise<unknown> | Promise<unknown>}
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
 * получение записей из базы данных по индексу
 * @param storeName - имя хранилища
 * @param nameIndex - название индекса
 * @param value - значение индекса
 * @returns {Promise<unknown> | Promise<unknown>}
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
 * удаление записи из базы данных
 * @param storeName - имя хранилища
 * @param id - ключ удаляемого элемента
 * @returns {Promise<unknown> | Promise<unknown>}
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
      console.log('чет видимо не так пошло в deleteentry');
      reject(transaction.error);
    };
  });
}

/**
 * удаление всех записей с указанным индексом
 * @param storeName - имя хранилища
 * @param nameIndex - название индекса
 * @param indexValue - значение индекса
 * @returns {Promise<unknown> | Promise<unknown>}
 */
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
      console.log('чет видимо не так пошло в deleteentry');
      reject(transaction.error);
    };
  })
}