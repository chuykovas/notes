import {createElement} from './util';
import Category from './category';

export default function Note(params) {
  this.state = {
    title: ``,
    content: ``,
    date: params.date,
    onClick: params.onClick,
  };
  this.htmlContainer = this.render();
  this.noteContent = this.renderNoteContent();
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
}

Note.prototype.addImage = function (image) {
  this.state.content += `${image}`;
}

Note.prototype.render = function () {
  const titleNote = createElement('h3', {
    className: 'note-title',
    textContent: this.state.title || 'Заметка без названия'
  });

  const dateNote = createElement('span', {
    className: 'note-date',
    textContent: `${this.state.date}`
  });

  const shortDescription = createElement('p', {
    className: 'note-description',
    textContent: this.state.content || 'Нет текста'
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
    textContent: `${this.state.date}`
  });

  const noteTitleInput = createElement('div', {
    className: 'note-content-title',
    contentEditable: 'true',
    textContent: this.state.title || 'Название заметки',
    oninput: (event) => {
      this.state.title = event.target.textContent;
      this.htmlContainer = this.render();
    }
  });

  const noteTextInput = createElement('div', {
    className: 'note-content-text',
    contentEditable: 'true',
    textContent: this.state.content || 'Текст заметки',
    oninput: (event) => {
      this.state.content = event.target.innerHTML;
      this.htmlContainer = this.render();
    }
  });

  const noteContentWrapper = createElement('div', {
    className: 'note-content-body',
  });

  noteContentWrapper.append(noteDate, noteTitleInput, noteTextInput);

  return noteContentWrapper;
}

