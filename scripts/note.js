import {createElement, formatDate} from './util';
import Category from './category';
import Store from './store/store';

export default function Note(params) {
  this.state = {
    idCategory: params.idCategory,
    title: params.title || 'Заметка без названия',
    content: params.content || '',
    date: params.date,
    onClick: params.onClick,
    onDelete: params.onDelete,
    onUpdate: params.onUpdate,
  };
  this.htmlContainer = this.render();
  this.noteContent = this.renderNoteContent();
  this.store = new Store();
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
  const titleNote = createElement('h3', {
    className: 'note-title',
    innerHTML: this.state.title || 'Заметка без названия'
  });

  const dateNote = createElement('span', {
    className: 'note-date',
    textContent: `${formatDate(this.state.date)}`
  });

  const shortDescription = createElement('p', {
    className: 'note-description',
    innerHTML: this.state.content.substring(0, 25),
  });

  shortDescription.prepend(dateNote);

  const deleteButton = createElement('button', {
    className: 'delete-note-button',
    onclick: () => {
      this.delete();
      this.state.onDelete(this);
    }
  });

  const note = createElement('div', {
    className: 'note',
    onclick: () => this.state.onClick(this),
  });

  note.append(titleNote, shortDescription, deleteButton);

  return note;
}

Note.prototype.renderNoteContent = function () {
  const noteDate = createElement('div', {
    className: 'note-content-date',
    textContent: `${formatDate(this.state.date)}`
  });

  const noteTitleInput = createElement('div', {
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

  const noteTextInput = createElement('div', {
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

  const noteContentWrapper = createElement('div', {
    className: 'note-content-body',
  });

  noteContentWrapper.append(noteDate, noteTitleInput, noteTextInput);

  return noteContentWrapper;
}