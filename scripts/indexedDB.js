function DataBase() {
  this.db = null;

  this.init = function () {
    let request = indexedDB.open('Notes', 1);

    request.onupgradeneeded = function (e) {
      this.db = e.target.result;
      if (!this.db.objectStoreNames.contains('categories')) {
        let categories = this.db.createObjectStore('categories');
      }
    }

    request.onerror = function () {
      console.log("Error", request.error);
    }

    request.onsuccess = function (e) {
      this.db = e.target.result;
      console.log("Подключение прошло успешно!");
    }
  }

  this.add = function (item) {
    let transaction = this.db.transaction(['categories'], 'readwrite');
    let store = transaction.objectStore('categories');

    const category = {title: item.title, noteList: item.notes};

    store.add(category, item.id);

    transaction.onsuccess = () => {
      console.log("Запись успещно завершена");
    }

    transaction.onerror = () => {
      console.log('Ошибка записи в базу');
    }
  }

  this.load = function () {
    let transaction = db.transaction(['categories'], 'readonly');
    let store = transaction.objectStore("categories");

    let request = store.openCursor();

    request.onsuccess = function () {
      let cursor = request.result;
      if (cursor) {
        let value = cursor.value.data.text;
        console.log(value);
        outputDiv.innerHTML += value;
        cursor.continue();
      }
    };
  }

  this.delete = function (id) {
    const transaction = this.db.transaction(['categories'], 'readwrite');

    transaction.oncomplete = (event) => {
      console.log('Transaction completed.')
      getAndDisplayNotes(db);
    };
    transaction.onerror = function (event) {
      console.log('Ошибка удаления записи');
    };

    const store = transaction.objectStore('categories');
    const deleteRequest = store.delete(id);

    deleteRequest.onsuccess = (event) => {
      // обрабатываем успех нашего запроса на удаление
      console.log('Delete request successful')
    };
  }
}

export default DataBase;