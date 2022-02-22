import {createElement, getDate} from './util';
import Note from './note';
import onChange from 'on-change';


function Category(params) {
  this.state = {
    title: params.title,
    notes: [],
    onClick: params.onClick,
  };

  this.htmlContainer = this.renderCategory();
}

Category.prototype.init = function () {
  this.elements = {
    listNote: document.getElementById('noteList'),
  };
  const watchedState = onChange(this.state, (value) => render(value));
  this.renderAllNote();
}

Category.prototype.delete = function () {
  this.state.notes = [];
  this.htmlContainer.remove();
}

/**
 *
 * @param {string} newName - новое имя категории
 */
Category.prototype.rename = function (newName) {
  this.state.title = newName;
  //меняем название категории
  this.htmlContainer.firstChild.textContent = this.state.title;
}

Category.prototype.addNote = function (note) {
  this.state.notes.unshift(note);
}

Category.prototype.renderPopup = function () {
  const popupInputText = createElement('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: 'Введите название'
  });

  const acceptButton = createElement('button', {
    className: 'popup-button',
    textContent: 'Принять',
    onclick: (event) => {
      event.preventDefault();
      this.rename(popupInputText.value || this.state.title);
      popupWrapper.remove();
    }
  });

  const cancelButton = createElement('button', {
    className: 'popup-button',
    textContent: 'Отмена',
    onclick: (event) => {
      event.preventDefault();
      popupWrapper.remove();
    },
  });

  const popup = createElement('form', {
    className: 'popup-form',
  });

  const popupWrapper = createElement('div', {
    className: 'popup-wrapper',
  });

  popup.append(popupInputText, acceptButton, cancelButton);
  popupWrapper.append(popup);

  return popupWrapper;
}

Category.prototype.renderCategory = function () {
  const categoryTitle = createElement('h3', {
    className: 'category-title',
    textContent: this.state.title
  });

  const noteCount = createElement('p', {
    className: 'notes-count',
    textContent: this.state.notes.length
  });

  const menuButton = createElement('button', {
    className: 'kebab-menu-button',
    onclick: () => kebabMenu.classList.toggle('active')
  });

  const kebabMenuButtonEdit = createElement('li', {
    className: 'kebab-menu-item',
    textContent: 'Редактировать',
    onclick: () => {
      const popup = this.renderPopup();
      document.body.append(popup);
    }
  });

  const kebabMenuButtonDelete = createElement('li', {
    className: 'kebab-menu-item',
    textContent: 'Удалить',
    onclick: () => this.delete()
  });

  const kebabMenu = createElement('ul', {
    className: 'kebab-menu'
  });

  kebabMenu.append(kebabMenuButtonEdit, kebabMenuButtonDelete);

  const category = createElement('div', {
    className: 'category',
    onclick: () => {
      this.state.onClick(this);
    }
  });

  category.append(categoryTitle, noteCount, menuButton, kebabMenu);

  return category;
}

Category.prototype.renderNewNote = function () {
  const note = this.state.notes[0];
  this.elements.listNote.prepend(note.htmlContainer);

  //меняем количество заметок в категории
  this.htmlContainer.children[1].textContent = this.state.notes.length;
}

Category.prototype.renderAllNote = function () {
  this.elements.listNote.innerHTML = '';
  if(this.state.notes.length === 0){
    this.elements.listNote.prepend(`В категории ${this.state.title} заметок нет`);
  } else {
    const notes = this.state.notes.map(item => item.htmlContainer);
    this.elements.listNote.prepend(...notes);
  }
}

export default Category;
