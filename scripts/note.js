import {createElement, getDate} from './util';
import Category from './category';
import Store from './store/store';

export default function Note(params) {
  this.state = {
    idCategory: params.idCategory,
    title: params.title || ``,
    content: params.content || ``,
    date: params.date,
    onClick: params.onClick,
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
  this.noteContent.remove();
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
    textContent: this.state.title || 'Заметка без названия'
  });

  const dateNote = createElement('span', {
    className: 'note-date',
    textContent: `${getDate(this.state.date)}`
  });

  const shortDescription = createElement('p', {
    className: 'note-description',
    textContent: this.state.content.substring(0, 25),
  });

  shortDescription.prepend(dateNote);

  const deleteButton = createElement('button', {
    className: 'delete-note-button',
    onclick: () => this.delete()
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
    textContent: `${getDate(this.state.date)}`
  });

  const noteTitleInput = createElement('div', {
    className: 'note-content-title',
    contentEditable: 'true',
    textContent: this.state.title,
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
    }
  });

  const noteTextInput = createElement('div', {
    className: 'note-content-text',
    contentEditable: 'true',
    placeholder: 'Текст заметки',
    oninput: (event) => {
      this.state.content = event.target.innerHTML;
      this.store.set('notes', this.state.date, {
        idCategory: this.state.idCategory,
        date: this.state.date,
        title: this.state.title,
        content: this.state.content,
      });
      this.htmlContainer = this.render();
    }
  });

  // noteTextInput.insertAdjacentHTML('afterbegin', this.state.content);
  noteTextInput.innerHTML = this.state.content;

  const noteContentWrapper = createElement('div', {
    className: 'note-content-body',
  });

  noteContentWrapper.append(noteDate, noteTitleInput, noteTextInput);

  return noteContentWrapper;
}