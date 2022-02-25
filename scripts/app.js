import Category from './category';
import Note from './note';
import {createElement, getDate, compareCategoryName} from './util';
import i18next from 'i18next';

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
    },
  }

  this.elements.forms.createCategoryForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nameCategory = formData.get('nameCategory');
    event.target.reset();

    const category = new Category({
      title: nameCategory || 'Без имени',
      onClick: (category) => {
        this.state.selectedCategory = category;
        this.state.selectedCategory.htmlContainer.classList.add('checked');
        category.init();
      }
    });
    this.state.categories.unshift(category);
    this.renderItem();
  });

  this.elements.buttons.createNoteButton.addEventListener('click', () => {
    const selectedCategory = this.state.selectedCategory;
    if (selectedCategory) {
      const newNote = new Note({date: getDate()});
      selectedCategory.addNote(newNote);
      selectedCategory.renderNewNote();
      //меняем количество заметок в категории
      selectedCategory.htmlContainer.children[1].textContent = selectedCategory.state.notes.length;
      newNote.init();
    }
  });

  this.elements.buttons.sortCategory.addEventListener('click', () => {
    if (this.state.sortedCategory) {
      this.state.categories.sort(compareCategoryName('title','descending'));
      this.state.sortedCategory = false;
    } else {
      this.state.categories.sort(compareCategoryName('title'));
      this.state.sortedCategory = true;
    }
    this.fullRender();
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
