import Category from './category';
import Note from './note';
import {createElement, getDate} from './util';

export default function App() {
  this.state = {
    categories: [],
    selectedCategory: null,
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
    }
  });

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
