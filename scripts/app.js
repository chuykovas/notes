import Category from './category';
import {compare, convertToBase64} from './util';
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

  this.store = new Store();

  let previousSelectedCategory = '';

  this.store.getAll('general')
    .then(result => {
      if (result.length > 0) {
        previousSelectedCategory = result[0].idSelectedCategory;
      }
    });

  this.store.getAll('categories')
    .then(data => {
      if (!!data.length) {
        data.forEach(item => {
          const category = this.createNewCategory(item.id, item.title);
          this.state.categories.unshift(category);
          category.getNotesFromDB();
          if (previousSelectedCategory === item.id) {
            this.state.selectedCategory = category;
          }
        });
        this.fullRender();

        if (this.state.selectedCategory) {
          this.state.selectedCategory.init();
        }
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
      this.state.categories.sort(compare('title', 'desc'));
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
    convertToBase64(event.target.files[0], (base64Data) => {
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
  this.elements.listCategory.append(...categories);
  if (this.state.selectedCategory) {
    this.state.selectedCategory.htmlContainer.classList.add('checked');
  }
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

      this.store.set('general', 0, {
        idSelectedCategory: this.state.selectedCategory.state.id,
        idSelectedNote: this.state.selectedCategory.state.selectedNote?.state.date || '',
      });
    },
    onDelete: (category) => {
      this.state.categories = this.state.categories.filter(item => item !== category);
      this.fullRender();

      if (this.state.categories.length > 0) {
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
  const searchResult = new Category({
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
        const titleIncludesText = item.title.toLowerCase().includes(text);
        const contentIncludesText = item.content.toLowerCase().includes(text);

        if (titleIncludesText || contentIncludesText) {
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