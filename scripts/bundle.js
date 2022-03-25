/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./scripts/app.js":
/*!************************!*\
  !*** ./scripts/app.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./category */ "./scripts/category.js");
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util */ "./scripts/util.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/store */ "./scripts/store/store.js");




function App() {
  this.state = {
    categories: [],
    selectedCategory: null,
    sortedCategory: false,
    DB: null,
  }
}

App.prototype.init = function () {
  this.elements = {
    forms: {
      createCategoryForm: document.getElementById('createCategoryForm'),
      searchForm: document.getElementById('searchForm'),
    },
    listCategory: document.getElementById('listCategory'),
    listNotes: document.getElementById('noteList'),
    buttons: {
      createNoteButton: document.querySelector('.add-new-note'),
      sortCategory: document.getElementById('sortCategory'),
      addImageToNote: document.getElementById('addImage'),
      sortByDate: document.getElementById('sortByDate'),
      sortByName: document.getElementById('sortByName'),
      makeBoldText: document.getElementById('makeBold'),
      makeItalicText: document.getElementById('makeItalic'),
      closeSearchButton: document.getElementById('closeSearchButton'),
    },
  }

  this.store = new _store_store__WEBPACK_IMPORTED_MODULE_2__["default"]();

  let previousSelectedCategory = '';

  this.store.getAll('general')
    .then(result => {
      if(result.length > 0) {
        previousSelectedCategory = result[0].idSelectedCategory;
      }
    });

  this.store.getAll('categories')
    .then(result => {
      if(result.length > 0) {
        result.forEach(item => {
          const category = this.createNewCategory(item.id, item.title);
          this.state.categories.unshift(category);
          category.getNotesInDB();
          if (previousSelectedCategory === item.id) {
            this.state.selectedCategory = category;
          }
        });
        this.fullRender();
        this.state.selectedCategory?.init();
      }
    });

  this.elements.forms.createCategoryForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameCategory = formData.get('nameCategory');
    event.target.reset();

    const date = Date.now();
    const category = this.createNewCategory(date, nameCategory);

    this.state.categories.unshift(category);
    this.store.set('categories', category.state.id, {
      id: category.state.id,
      title: nameCategory,
    });
    this.renderItem();
  });

  this.elements.buttons.createNoteButton.addEventListener('click', () => {
    if (this.state.selectedCategory) {
      this.state.selectedCategory.createNewNote();
    }
  });

  this.elements.buttons.sortCategory.addEventListener('click', () => {
    if (this.state.sortedCategory) {
      this.state.categories.sort((0,_util__WEBPACK_IMPORTED_MODULE_1__.compare)('title', 'descending'));
    } else {
      this.state.categories.sort((0,_util__WEBPACK_IMPORTED_MODULE_1__.compare)('title'));
    }
    this.state.sortedCategory = !this.state.sortedCategory;
    this.fullRender();
  });

  this.elements.buttons.sortByDate.addEventListener('click', () => this.state.selectedCategory.sortNote('date'));
  this.elements.buttons.sortByName.addEventListener('click', () => this.state.selectedCategory.sortNote('title'));

  this.elements.buttons.addImageToNote.addEventListener('change', (event) => {
    const data = null;
    (0,_util__WEBPACK_IMPORTED_MODULE_1__.getBase64)(event.target.files[0], (base64Data) => {
      this.state.selectedCategory.state.selectedNote.addImage(base64Data);
    });
  });

  this.elements.buttons.makeBoldText.addEventListener('click', () => {
    document.execCommand('bold', false, null);
  });

  this.elements.buttons.makeItalicText.addEventListener('click', () => {
    document.execCommand('italic', false, null);
  });

  this.elements.forms.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const searchText = formData.get('searchInput');
    if (searchText) {
      this.search(searchText);
      this.elements.buttons.closeSearchButton.style.display = 'block';
    }
  });

  this.elements.buttons.closeSearchButton.addEventListener('click', event => {
    event.preventDefault();
    this.elements.forms.searchForm.reset();
    this.fullRender();
    this.state.selectedCategory.init();
  });
}

App.prototype.fullRender = function () {
  this.elements.listCategory.innerHTML = '';
  const categories = this.state.categories.map(item => item.htmlContainer);
  this.elements.listCategory.prepend(...categories);
  this.state.selectedCategory?.htmlContainer.classList.add('checked');
}

App.prototype.renderItem = function () {
  const category = this.state.categories[0];
  this.elements.listCategory.prepend(category.htmlContainer);
}

App.prototype.createNewCategory = function (date, nameCategory) {
  const category = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]({
    id: date,
    title: nameCategory || 'Без имени',
    onClick: (category) => {
      this.state.selectedCategory = category;
      this.state.categories.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedCategory.htmlContainer.classList.add('checked');
      this.state.selectedCategory.init();

      this.store.set('general', 0, {
        idSelectedCategory: this.state.selectedCategory.state.id,
        idSelectedNote: this.state.selectedCategory.state.selectedNote?.state.date || '',
      });
    },
    onDelete: (category) => {
      this.state.categories = this.state.categories.filter(item => item !== category);
      this.fullRender();
      if(this.state.categories.length > 0) {
        this.state.selectedCategory = this.state.categories[0];
        this.state.selectedCategory?.init();
        this.store.set('general', 0, {
          idSelectedCategory: this.state.selectedCategory?.state.id || '',
          idSelectedNote: this.state.selectedCategory.state.selectedNote?.state.date || '',
        });
      } else {
        this.store.deleteItem('general', 0);
      }
    },
    onUpdate: () => this.fullRender(),
  });

  return category;
}

App.prototype.search = function (text) {
  const regexp = new RegExp(`${text}`, 'gi');
  const date = Date.now();
  const searchResult = new _category__WEBPACK_IMPORTED_MODULE_0__["default"]({
    id: date,
    title: 'Результаты поиска',
  });
  searchResult.htmlContainer.querySelector('.kebab-menu-button').remove();

  searchResult.htmlContainer.classList.add('checked');
  this.elements.listCategory.innerHTML = '';
  this.elements.listCategory.prepend(searchResult.htmlContainer);

  this.store.getAll('notes')
    .then(result => {
      result.forEach(item => {
        if (item.title.toLowerCase().includes(text) || item.content.toLowerCase().includes(text)) {
          item.title = item.title.replaceAll(regexp, `<mark>${text}</mark>`);
          item.content = item.content.replaceAll(regexp, `<mark>${text}</mark>`);
          const foundNote = searchResult.renderNote(item.idCategory, item.title, item.content, item.date);
          foundNote.htmlContainer.querySelector('.delete-note-button').remove();
          searchResult.addNote(foundNote);
        }
      });
      searchResult.htmlContainer.children[1].textContent = searchResult.state.notes.length;
      searchResult.state.selectedNote = searchResult.state.notes[0];
      searchResult.init();
    });
}

/***/ }),

/***/ "./scripts/category.js":
/*!*****************************!*\
  !*** ./scripts/category.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./scripts/util.js");
/* harmony import */ var _note__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./note */ "./scripts/note.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/store */ "./scripts/store/store.js");





function Category(params) {
  this.state = {
    id: params.id,
    title: params.title,
    notes: [],
    sortedNote: false,
    selectedNote: null,
    onClick: params.onClick,
    onDelete: params.onDelete,
    onUpdate: params.onUpdate,
  };

  this.htmlContainer = this.renderCategory();
  this.store = new _store_store__WEBPACK_IMPORTED_MODULE_2__["default"]();
}

Category.prototype.init = function () {
  this.elements = {
    listNote: document.getElementById('noteList'),
    listContent: document.getElementById('contentContainer'),
  };

  if (!this.state.notes.length) {
    let previousSelectedNote = null;
    this.store.getAll('general').then(result => {
      if (result.length > 0) {
        previousSelectedNote = result[0].idSelectedNote;
      }
    });
    this.store.getByIndex('notes', 'idCategory', this.state.id)
      .then(result => {
        this.state.notes = [];
        result.forEach(item => {
          const note = this.renderNote(this.state.id, item.title, item.content, item.date);
          this.addNote(note);
          if (item.date === previousSelectedNote) {
            this.state.selectedNote = note;
          }
        });

        this.renderAllNote();

        if (this.state.selectedNote) {
          this.state.selectedNote?.init();
        } else {
          this.elements.listContent.innerHTML = '';
        }
      });
  } else {
    this.renderAllNote();

    if (this.state.selectedNote) {
      this.state.selectedNote?.init();
    } else {
      this.elements.listContent.innerHTML = '';
    }
  }
}

Category.prototype.getNotesInDB = function (select) {
  this.store.getByIndex('notes', 'idCategory', this.state.id)
    .then(result => {
      result.forEach(item => {
        const note = this.renderNote(item.idCategory, item.title, item.content, item.date);
        this.addNote(note);
      });
      this.htmlContainer = this.renderCategory();
      this.state.onUpdate();
    });
}

Category.prototype.delete = function () {
  //удаление со страницы
  this.elements.listNote.innerHTML = '';
  this.elements.listContent.innerHTML = '';
  //удаление из хранилища
  this.store.deleteItem('categories', this.state.id);
  this.store.deleteNotes('notes', 'idCategory', this.state.id);
  //удаление из state приложения
  this.state.onDelete(this);
}

/**
 *
 * @param {string} newName - новое имя категории
 */
Category.prototype.rename = function (newName) {
  this.state.title = newName;
  //меняем название категории
  this.htmlContainer = this.renderCategory();
  this.state.onUpdate();

  this.store.set('categories', this.state.id, {
    id: this.state.id,
    title: this.state.title,
  });
}

Category.prototype.addNote = function (note) {
  this.state.notes.unshift(note);
}

Category.prototype.createNewNote = function () {
  const date = Date.now();
  const newNote = this.renderNote(this.state.id, null, null, date);

  this.addNote(newNote);

  this.state.selectedNote = newNote;
  this.state.selectedNote.init();

  this.store.set('general', 0, {
    idSelectedCategory: this.state.id,
    idSelectedNote: this.state.selectedNote.state.date,
  });

  this.renderAllNote();

  this.store.set('notes', date, {
    idCategory: this.state.id,
    date: newNote.state.date,
    title: newNote.state.title,
    content: newNote.state.content,
  });
  //меняем количество заметок в категории
  this.htmlContainer = this.renderCategory();
  this.state.onUpdate();
}

Category.prototype.sortNote = function (sortField) {
  if (this.state.sortedNote) {
    this.state.notes.sort((0,_util__WEBPACK_IMPORTED_MODULE_0__.compare)(sortField, 'descending'));
  } else {
    this.state.notes.sort((0,_util__WEBPACK_IMPORTED_MODULE_0__.compare)(sortField));
  }

  this.state.sortedNote = !this.state.sortedNote;
  this.renderAllNote();
}

Category.prototype.renderPopup = function () {
  const popupInputText = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: 'Введите название',
    autofocus: true,
    maxLength: '50',
  });

  const acceptButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'popup-button',
    textContent: 'Принять',
    onclick: (event) => {
      event.preventDefault();
      this.rename(popupInputText.value || this.state.title);
      popupWrapper.remove();
    }
  });

  const cancelButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'popup-button',
    textContent: 'Отмена',
    onclick: (event) => {
      event.preventDefault();
      popupWrapper.remove();
    },
  });

  const popup = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('form', {
    className: 'popup-form',
  });

  const popupWrapper = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'popup-wrapper',
  });

  popup.append(popupInputText, acceptButton, cancelButton);
  popupWrapper.append(popup);

  return popupWrapper;
}

Category.prototype.renderCategory = function () {
  const categoryTitle = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {
    className: 'category-title',
    textContent: this.state.title
  });

  const noteCount = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'notes-count',
    textContent: this.state.notes.length
  });

  const menuButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'kebab-menu-button',
    onclick: (event) => {
      event.stopPropagation();
      kebabMenu.classList.toggle('active');
    },
  });

  const kebabMenuButtonEdit = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
    className: 'kebab-menu-item',
    textContent: 'Редактировать',
    onclick: event => {
      event.stopPropagation();
      const popup = this.renderPopup();
      document.body.append(popup);
      kebabMenu.classList.remove('active');
    }
  });

  const kebabMenuButtonDelete = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('li', {
    className: 'kebab-menu-item',
    textContent: 'Удалить',
    onclick: (event) => {
      event.stopPropagation();
      this.delete();
    }
  });

  const kebabMenu = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('ul', {
    className: 'kebab-menu'
  });

  kebabMenu.append(kebabMenuButtonEdit, kebabMenuButtonDelete);

  const category = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'category',
    onclick: () => {
      this.state.onClick(this);
    },
    onmouseleave: () => kebabMenu.classList.remove('active'),
  });

  category.append(categoryTitle, noteCount, menuButton, kebabMenu);

  return category;
}

Category.prototype.renderAllNote = function () {
  this.elements.listNote.innerHTML = '';

  if (!this.state.notes.length) {
    this.elements.listNote.prepend(`В категории ${this.state.title} заметок нет`);
  } else {
    const notes = this.state.notes.map(item => item.htmlContainer);

    if (this.state.selectedNote) {
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');
    }
    this.elements.listNote.prepend(...notes);
  }
}

Category.prototype.renderNote = function (id, title, content, date) {
  const newNote = new _note__WEBPACK_IMPORTED_MODULE_1__["default"]({
    idCategory: id,
    title: title || '',
    content: content || '',
    date: date,
    onClick: (note) => {
      this.state.selectedNote = note;
      this.state.selectedNote.init();
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');

      this.store.set('general', 0, {
        idSelectedCategory: this.state.id,
        idSelectedNote: this.state.selectedNote.state.date,
      });
    },
    onDelete: (note) => {
      this.state.notes = this.state.notes.filter(item => item !== note);
      this.htmlContainer = this.renderCategory();
      this.state.onUpdate();
    },
    onUpdate: () => this.renderAllNote(),
  });

  return newNote;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Category);


/***/ }),

/***/ "./scripts/note.js":
/*!*************************!*\
  !*** ./scripts/note.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Note)
/* harmony export */ });
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./scripts/util.js");
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./category */ "./scripts/category.js");
/* harmony import */ var _store_store__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./store/store */ "./scripts/store/store.js");




function Note(params) {
  this.state = {
    idCategory: params.idCategory,
    title: params.title,
    content: params.content,
    date: params.date,
    onClick: params.onClick,
    onDelete: params.onDelete,
    onUpdate: params.onUpdate,
  };
  this.htmlContainer = this.render();
  this.noteContent = this.renderNoteContent();
  this.store = new _store_store__WEBPACK_IMPORTED_MODULE_2__["default"]();
}

Note.prototype.init = function () {
  this.elements = {
    contentContainer: document.querySelector('.note-content-container'),
  };

  this.elements.contentContainer.innerHTML = '';
  this.elements.contentContainer.append(this.noteContent);
}

Note.prototype.delete = function () {
  this.htmlContainer.remove();
  this.noteContent.innerHTML = '';
  this.store.deleteItem('notes', this.state.date);
}

Note.prototype.addImage = function (source) {
  this.state.content += `<img src="${source}">`;
  this.noteContent = this.renderNoteContent();
  this.store.set('notes', this.state.date, {
    idCategory: this.state.idCategory,
    date: this.state.date,
    title: this.state.title,
    content: this.state.content,
  });
  this.init();
}

Note.prototype.render = function () {
  const titleNote = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('h3', {
    className: 'note-title',
    innerHTML: this.state.title || 'Заметка без названия'
  });

  const dateNote = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('span', {
    className: 'note-date',
    textContent: `${(0,_util__WEBPACK_IMPORTED_MODULE_0__.getDate)(this.state.date)}`
  });

  const shortDescription = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('p', {
    className: 'note-description',
    innerHTML: this.state.content.substring(0, 25),
  });

  shortDescription.prepend(dateNote);

  const deleteButton = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('button', {
    className: 'delete-note-button',
    onclick: () => {
      this.delete();
      this.state.onDelete(this);
    }
  });

  const note = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'note',
    onclick: () => this.state.onClick(this),
  });

  note.append(titleNote, shortDescription, deleteButton);

  return note;
}

Note.prototype.renderNoteContent = function () {
  const noteDate = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'note-content-date',
    textContent: `${(0,_util__WEBPACK_IMPORTED_MODULE_0__.getDate)(this.state.date)}`
  });

  const noteTitleInput = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'note-content-title',
    contentEditable: 'true',
    innerHTML: this.state.title,
    placeholder: 'Название заметки',
    oninput: (event) => {
      this.state.title = event.target.textContent;
      this.store.set('notes', this.state.date, {
        idCategory: this.state.idCategory,
        date: this.state.date,
        title: this.state.title,
        content: this.state.content,
      });
      this.htmlContainer = this.render();
      this.state.onUpdate();
    }
  });

  const noteTextInput = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'note-content-text',
    contentEditable: 'true',
    placeholder: 'Текст заметки',
    innerHTML: this.state.content,
    oninput: (event) => {
      this.state.content = event.target.innerHTML;
      this.store.set('notes', this.state.date, {
        idCategory: this.state.idCategory,
        date: this.state.date,
        title: this.state.title,
        content: this.state.content,
      });
      this.htmlContainer = this.render();
      this.state.onUpdate();
    }
  });

  const noteContentWrapper = (0,_util__WEBPACK_IMPORTED_MODULE_0__.createElement)('div', {
    className: 'note-content-body',
  });

  noteContentWrapper.append(noteDate, noteTitleInput, noteTextInput);

  return noteContentWrapper;
}

/***/ }),

/***/ "./scripts/store/indexedDB.js":
/*!************************************!*\
  !*** ./scripts/store/indexedDB.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IndexedDB)
/* harmony export */ });
/**
 * инициальзация базы данных
 * @param dbName - имя базы данных
 * @param dbVersion - версия базы данных
 * @param dbUpgrade - callback для обновления базы данных
 * @constructor
 */

function IndexedDB(dbName, dbVersion, dbUpgrade) {
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

/***/ }),

/***/ "./scripts/store/store.js":
/*!********************************!*\
  !*** ./scripts/store/store.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Store)
/* harmony export */ });
/* harmony import */ var _indexedDB__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./indexedDB */ "./scripts/store/indexedDB.js");


function Store(storeName) {
  this.DB = null;
}

Store.prototype.dbConnect = async function () {
  this.DB = this.DB || await new _indexedDB__WEBPACK_IMPORTED_MODULE_0__["default"](
    'Notes',
    1,
    (db, oldVersion, newVersion) => {
      // обновление базы данных
      switch (oldVersion) {
        case 0: {
          let storeCategories = db.createObjectStore('categories');
          let storeNotes = db.createObjectStore('notes');
          let storeGeneral = db.createObjectStore('general');
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

/***/ }),

/***/ "./scripts/util.js":
/*!*************************!*\
  !*** ./scripts/util.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "createElement": () => (/* binding */ createElement),
/* harmony export */   "getDate": () => (/* binding */ getDate),
/* harmony export */   "getBase64": () => (/* binding */ getBase64),
/* harmony export */   "compare": () => (/* binding */ compare)
/* harmony export */ });
/**
 *
 * @param {string} tag -  HTML-тег элемента
 * @param {Object} {attributes} - объект атрибутов элемента
 * @param
 */

function createElement(tag, attributes) {
  const element = document.createElement(tag);

  if (attributes) {
    Object.keys(attributes).forEach(key => {
      if (tag === 'div' && key === 'placeholder') {
        element.setAttribute(key, attributes[key])
      } else {
        element[key] = attributes[key];
      }
    });
  }

  return element;
}

function getDate(date) {
  const dateNow = new Date(date);

  return `${dateNow.toLocaleDateString()} ${dateNow.toLocaleTimeString()}`;
}

/**
 *
 * @param input
 * @returns {*}
 */

function getBase64(file, callback) {

  const reader = new FileReader();

  reader.addEventListener('load', () => callback(reader.result));

  reader.readAsDataURL(file);
}

/**
 *
 * @param key
 * @param order
 * @returns {function(*, *): number|number}
 */
function compare(key, order = 'ascending') {
  return function (a, b) {
    const firstName = a.state[key];
    const secondName = b.state[key];

    if (firstName.typeof === 'string' && secondName.typeof === 'string') {
      firstName = firstName.toUpperCase();
      secondName = secondName.toUpperCase();
    }

    let comparison = 0;

    if (firstName > secondName) {
      comparison = 1;
    } else if (firstName < secondName) {
      comparison = -1;
    }

    return order === 'descending' ? comparison * -1 : comparison;
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./scripts/index.js ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app */ "./scripts/app.js");


const app = new _app__WEBPACK_IMPORTED_MODULE_0__["default"]();
app.init();
})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map