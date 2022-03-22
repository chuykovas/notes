import Category from './category';
import {createElement, getDate, compare, getBase64} from './util';
import i18next from 'i18next';
import Store from './store/store';
import Note from './note';

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
    },
  }

  this.store = new Store();

  let previousState = null;

  this.store.getAll('general').
    then(result => previousState = result[0].idSelectedCategory);

  this.store.getAll('categories')
    .then(result => {
      result.forEach(item => {
        const category = this.createNewCategory(item.id, item.title);
        category.getNotesInDB();
        this.state.categories.unshift(category);
        if(previousState === item.id) {
          this.state.selectedCategory = category;
        }
      });
      this.fullRender();
      this.state.selectedCategory.htmlContainer.classList.add('checked');
      this.state.selectedCategory.init();
    });

  this.elements.forms.searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const searchText = formData.get('searchInput');
    console.log(searchText);
    if (searchText){
      this.search(searchText);
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

  this.elements.buttons.makeBoldText.addEventListener('click', () => {
    document.execCommand('bold', false, null);
  });

  this.elements.buttons.makeItalicText.addEventListener('click', () => {
    document.execCommand('italic', false, null);
  })
}

App.prototype.fullRender = function () {
  this.elements.listCategory.innerHTML = '';
  const categories = this.state.categories.map(item => item.htmlContainer);
  this.elements.listCategory.prepend(...categories);
}

App.prototype.renderItem = function () {
  const category = this.state.categories[0];
  this.elements.listCategory.prepend(category.htmlContainer);
}

App.prototype.createNewCategory = function (date, nameCategory) {
  const category = new Category({
    id: date,
    title: nameCategory || 'Без имени',
    onClick: (category) => {
      this.state.selectedCategory = category;
      this.state.categories.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedCategory.htmlContainer.classList.add('checked');
      this.state.selectedCategory.init();
      this.store.set('general', 0, {idSelectedCategory: this.state.selectedCategory.state.id});
    },
    onDelete: (category) => this.state.categories = this.state.categories.filter(item => item !== category),
  });

  return category;
}

App.prototype.search = function (text) {
  const regexp = new RegExp(`${text}`, 'gi');
  this.elements.listNotes.innerHTML = '';
  this.store.getAll('notes')
    .then(result => {
        result.forEach(item => {

          if (item.title.toLowerCase().includes(text) || item.content.toLowerCase().includes(text)) {
            item.title = item.title.replaceAll(regexp, `<mark>${text}</mark>`);
            item.content = item.content.replaceAll(regexp, `<mark>${text}</mark>`);

            const newNote = new Note({
              title: item.title,
              content: item.content,
              date: item.date,
              onClick: (note) => {
                newNote.init();
              },
              onDelete: (note) => {
                this.state.notes = this.state.notes.filter(item => item !== note);
              },
            });

            this.elements.listNotes.append(newNote.htmlContainer);
          }
        });
    });

}