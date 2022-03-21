import {createElement, getDate} from './util';
import Note from './note';
import onChange from 'on-change';
import {compare} from './util';
import Store from './store/store';


function Category(params) {
  this.state = {
    id: params.id,
    title: params.title,
    notes: [],
    sortedNote: false,
    selectedNote: null,
    onClick: params.onClick,
    onDelete: params.onDelete,
  };

  this.htmlContainer = this.renderCategory();
  this.store = new Store();
}

Category.prototype.init = function () {
  this.elements = {
    listNote: document.getElementById('noteList'),
    listContent: document.getElementById('contentContainer'),
  };

  this.renderAllNote();

  if(this.state.selectedNote){
    this.state.selectedNote.init();
  } else {
    this.elements.listContent.innerHTML = '';
  }
}

Category.prototype.getNotesInDB = function () {
  this.store.getByIndex('notes', 'idCategory', this.state.id)
    .then(result => {
      result.forEach(item => {
        const note = this.renderNote(this.state.id, item.title, item.content, item.date);
        this.addNote(note);
        this.htmlContainer.children[1].textContent = this.state.notes.length;
      });
    });
}

Category.prototype.delete = function () {
  //удаление со страницы
  this.state.notes = [];
  this.htmlContainer.remove();
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
  this.htmlContainer.firstChild.textContent = this.state.title;
  this.store.set('categories', this.state.id, {
    id: this.state.id,
    title: newName,
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

  this.renderAllNote();



  this.store.set('notes', date, {
    idCategory: this.state.id,
    date: newNote.state.date,
    title: newNote.state.title,
    content: newNote.state.content,
  });
  //меняем количество заметок в категории
  this.htmlContainer.children[1].textContent = this.state.notes.length;
}

Category.prototype.sortNote = function (sortField){
  if (this.state.sortedNote) {
    this.state.notes.sort(compare(sortField, 'descending'));
  } else {
    this.state.notes.sort(compare(sortField));
  }
  this.state.sortedNote = !this.state.sortedNote;

  this.renderAllNote();
}

Category.prototype.renderPopup = function () {
  const popupInputText = createElement('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: 'Введите название',
    autofocus: true,
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

Category.prototype.renderAllNote = function () {
  this.elements.listNote.innerHTML = '';
  if(!this.state.notes.length){
    this.elements.listNote.prepend(`В категории ${this.state.title} заметок нет`);
  } else {
    const notes = this.state.notes.map(item => item.htmlContainer);
    if(this.state.selectedNote){
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');
    }
    this.elements.listNote.prepend(...notes);
  }

}

Category.prototype.renderNote = function (id, title, content, date) {
  const newNote = new Note({
    idCategory: id,
    title: title || '',
    content: content || '',
    date: date,
    onClick: (note) => {
      this.state.selectedNote = note;
      this.state.selectedNote.init();
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');
    },
    onDelete: (note) => {
      this.state.notes = this.state.notes.filter(item => item !== note);
      this.htmlContainer.children[1].textContent = this.state.notes.length;
    },
    onUpdate: () => this.renderAllNote(),
  });

  return newNote;
}

export default Category;
