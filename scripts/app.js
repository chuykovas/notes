import Category from './category';
import {createElement, getDate, compare, loadPicture} from './util';
import i18next from 'i18next';
import DataBase from './indexedDB';

export default function App() {
  this.state = {
    categories: [],
    selectedCategory: null,
    sortedCategory: false,
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
      switchRussianLanguage: document.getElementById('ru'),
      switchEnglichLanguage: document.getElementById('en'),
      addImageToNote: document.getElementById('addImage'),
      sortByDate: document.getElementById('sortByDate'),
      sortByName: document.getElementById('sortByName'),
    },
  }

  const dataBase = new DataBase();
  dataBase.init();

  this.elements.forms.createCategoryForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameCategory = formData.get('nameCategory');
    event.target.reset();

    const category = new Category({
      title: nameCategory || 'Без имени',
      onClick: (category) => {
        this.state.selectedCategory = category;
        // this.state.selectedCategory.htmlContainer.classList.add('checked');
        this.state.selectedCategory.init();
      }
    });
    this.state.categories.unshift(category);
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
    const image = createElement('img', {src: `${loadPicture(event.target)}`});
    this.state.selectedCategory.state.selectedNote.addImage(image);
    // console.log(this.state.selectedCategory.selectedNote);
  });

  this.elements.buttons.switchEnglichLanguage.addEventListener('click', () => i18next.changeLanguage('en'));
  this.elements.buttons.switchRussianLanguage.addEventListener('click', () => i18next.changeLanguage('ru'));

  this.fullRender();
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
