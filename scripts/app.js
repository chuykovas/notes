import Category from './category';
import {createElement, getDate, compare, getBase64} from './util';
import i18next from 'i18next';
// import IndexedDB from './store/indexedDB';
import Store from './store/store';

export default function App() {
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
    },
    listCategory: document.getElementById('listCategory'),
    buttons: {
      createNoteButton: document.querySelector('.add-new-note'),
      sortCategory: document.getElementById('sortCategory'),
      // switchRussianLanguage: document.getElementById('ru'),
      // switchEnglichLanguage: document.getElementById('en'),
      addImageToNote: document.getElementById('addImage'),
      sortByDate: document.getElementById('sortByDate'),
      sortByName: document.getElementById('sortByName'),
    },
  }

  this.store = new Store();

  this.store.getAll('categories')
    .then(result => {
      result.forEach(item => {
        const category = new Category({
          id: item.id,
          title: item.title || 'Без имени',
          onClick: (category) => {
            this.state.selectedCategory = category;
            // this.state.selectedCategory.htmlContainer.classList.add('checked');
            this.state.selectedCategory.init();
          },
          onDelete: (category) => {
            this.state.categories = this.state.categories.filter(item => item !== category);
            this.state.selectedCategory = null;
          }
        });
        category.getNotesInDB();
        this.state.categories.unshift(category);
      });
      this.fullRender();
    });

  this.elements.forms.createCategoryForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameCategory = formData.get('nameCategory');
    const date = Date.now();
    event.target.reset();

    const category = new Category({
      id: date,
      title: nameCategory || 'Без имени',
      onClick: (category) => {
        this.state.selectedCategory = category;
        // this.state.selectedCategory.htmlContainer.classList.add('checked');
        this.state.selectedCategory.init();
      },
      onDelete: (category) => this.state.categories = this.state.categories.filter(item => item !== category),
    });

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
      this.state.categories.sort(compare('title', 'descending'));
    } else {
      this.state.categories.sort(compare('title'));
    }
    this.state.sortedCategory = !this.state.sortedCategory;
    this.fullRender();
  });

  this.elements.buttons.sortByDate.addEventListener('click', () => this.state.selectedCategory.sortNote('date'));
  this.elements.buttons.sortByName.addEventListener('click', () => this.state.selectedCategory.sortNote('title'));

  this.elements.buttons.addImageToNote.addEventListener('change', (event) => {
    const data = null;
    getBase64(event.target.files[0], (base64Data) => {
      this.state.selectedCategory.state.selectedNote.addImage(base64Data);
    });
  });

  // this.elements.buttons.switchEnglichLanguage.addEventListener('click', () => i18next.changeLanguage('en'));
  // this.elements.buttons.switchRussianLanguage.addEventListener('click', () => i18next.changeLanguage('ru'));

  this.fullRender();
}

// App.prototype.dbConnect = async function () {
//   this.state.DB = this.state.DB || await new IndexedDB(
//     'Notes',
//     1,
//     (db, oldVersion, newVersion) => {
//       // обновление базы данных
//       switch (oldVersion) {
//         case 0: {
//           db.createObjectStore('categories');
//         }
//       }
//     });
//
//   return this.state.DB;
// }
//
// App.prototype.setToDB = async function (name, value) {
//   // обновление базы данных
//   const db = await this.dbConnect();
//   await db.set('categories', name, value);
// }
//
// App.prototype.getCategoriesInDB = async function () {
//     const db = await this.dbConnect();
//
//     return await db.getAllCategory('categories');
// }

App.prototype.fullRender = function () {
  this.elements.listCategory.innerHTML = '';
  const categories = this.state.categories.map(item => item.htmlContainer);
  this.elements.listCategory.prepend(...categories);
}

App.prototype.renderItem = function () {
  const category = this.state.categories[0];
  this.elements.listCategory.prepend(category.htmlContainer);
}
