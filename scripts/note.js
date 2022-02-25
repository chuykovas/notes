import {createElement} from './util';
import Category from './category';

export default function Note(params) {
  this.state = {
    content: [],
    date: params.date,
  };
  this.htmlContainer = this.render();
}

Note.prototype.init = function () {
  this.elements = {
    noteContent: document.querySelector('.note-content'),
  };
  const noteContent = this.renderNoteContent();

  this.elements.noteContent.lastChild.remove();
  this.elements.noteContent.append(noteContent);
}

Note.prototype.delete = function () {
  this.htmlContainer.remove();
  this.state = {};
}

Note.prototype.render = function () {
  const titleNote = createElement('h3', {
    className: 'note-title',
    textContent: this.state.content.title || 'Заметка без названия'
  });

  const dateNote = createElement('span', {
    className: 'note-date',
    textContent: `${this.state.date}`
  });

  const shortDescription = createElement('p', {
    className: 'note-description',
    textContent: this.state.content.text || ''
  });

  shortDescription.prepend(dateNote);

  const deleteButton = createElement('button', {
    className: 'delete-note-button',
    onclick: () => this.delete()
  });

  const note = createElement('div', {
    className: 'note',
    onclick: () => this.init()
  });

  note.append(titleNote, shortDescription, deleteButton);

  return note;
}

Note.prototype.renderNoteContent = function () {
  const noteDate = createElement('div', {
    className: 'note-content-date',
    textContent: `${this.state.date}`
  });

  const noteTitleInput = createElement('div', {
    className: 'note-content-title',
    contentEditable: 'true',
    textContent: 'Название заметки'
  });

  const noteTextInput = createElement('div', {
    className: 'note-content-text',
    contentEditable: 'true',
    textContent: 'Название заметки'
  });

  const noteContentWrapper = createElement('div', {
    className: 'note-content-body',
  });

  noteContentWrapper.append(noteDate, noteTitleInput, noteTextInput);

  return noteContentWrapper;
}

