import {compare, createElement} from './util';
import Note from './note';
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
    onUpdate: params.onUpdate,
  };

  this.htmlContainer = this.renderCategory();
  this.store = new Store();
}

Category.prototype.init = function () {
  this.elements = {
    listNote: document.getElementById('noteList'),
    listContent: document.getElementById('contentContainer'),
  };

  if (!this.state.notes.length) {
    let previousSelectedNote = null;
    this.store.getAll('general').then(result => {
      if (result.length > 0) {
        previousSelectedNote = result[0].idSelectedNote;
      }
    });
    this.store.getByIndex('notes', 'idCategory', this.state.id)
      .then(result => {
        this.state.notes = [];
        result.forEach(item => {
          const note = this.renderNote(this.state.id, item.title, item.content, item.date);
          this.addNote(note);
          if (item.date === previousSelectedNote) {
            this.state.selectedNote = note;
          }
        });

        this.renderAllNote();

        if (this.state.selectedNote) {
          this.state.selectedNote?.init();
        } else {
          this.elements.listContent.innerHTML = '';
        }
      });
  } else {
    this.renderAllNote();

    if (this.state.selectedNote) {
      this.state.selectedNote?.init();
    } else {
      this.elements.listContent.innerHTML = '';
    }
  }
}

Category.prototype.getNotesFromDB = function (select) {
  this.store.getByIndex('notes', 'idCategory', this.state.id)
    .then(result => {
      result.forEach(item => {
        const note = this.renderNote(item.idCategory, item.title, item.content, item.date);
        this.addNote(note);
      });

      this.htmlContainer = this.renderCategory();
      this.state.onUpdate();
    });
}

Category.prototype.delete = function () {
  //???????????????? ???? ????????????????
  this.elements.listNote.innerHTML = '';
  this.elements.listContent.innerHTML = '';
  //???????????????? ???? ??????????????????
  this.store.deleteItem('categories', this.state.id);
  this.store.deleteNotes('notes', 'idCategory', this.state.id);
  //???????????????? ???? state ????????????????????
  this.state.onDelete(this);
}

/**
 *
 * @param {string} newName - ?????????? ?????? ??????????????????
 */
Category.prototype.rename = function (newName) {
  this.state.title = newName;
  //???????????? ???????????????? ??????????????????
  this.htmlContainer = this.renderCategory();
  this.state.onUpdate();

  this.store.set('categories', this.state.id, {
    id: this.state.id,
    title: this.state.title,
  });
}

Category.prototype.addNote = function (note) {
  this.state.notes.unshift(note);
}

Category.prototype.sortNote = function (sortField) {
  if (this.state.sortedNote) {
    this.state.notes.sort(compare(sortField, 'desc'));
  } else {
    this.state.notes.sort(compare(sortField));
  }

  this.state.sortedNote = !this.state.sortedNote;
  this.renderAllNote();
}

Category.prototype.createNewNote = function () {
  const date = Date.now();
  const newNote = this.renderNote(this.state.id, null, null, date);

  this.addNote(newNote);

  this.state.selectedNote = newNote;
  this.state.selectedNote.init();

  this.store.set('general', 0, {
    idSelectedCategory: this.state.id,
    idSelectedNote: this.state.selectedNote.state.date,
  });

  this.renderAllNote();

  this.store.set('notes', date, {
    idCategory: this.state.id,
    date: newNote.state.date,
    title: newNote.state.title,
    content: newNote.state.content,
  });
  //???????????? ???????????????????? ?????????????? ?? ??????????????????
  this.htmlContainer = this.renderCategory();
  this.state.onUpdate();
}

Category.prototype.renderPopup = function () {
  const popupInputText = createElement('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: '?????????????? ????????????????',
    autofocus: true,
    maxLength: '50',
  });

  const acceptButton = createElement('button', {
    className: 'popup-button',
    textContent: '??????????????',
    onclick: (event) => {
      event.preventDefault();
      this.rename(popupInputText.value || this.state.title);
      popupWrapper.remove();
    }
  });

  const cancelButton = createElement('button', {
    className: 'popup-button',
    textContent: '????????????',
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
    onclick: (event) => {
      event.stopPropagation();
      kebabMenu.classList.toggle('active');
    },
  });

  const kebabMenuButtonEdit = createElement('li', {
    className: 'kebab-menu-item',
    textContent: '??????????????????????????',
    onclick: event => {
      event.stopPropagation();
      const popup = this.renderPopup();
      document.body.append(popup);
      kebabMenu.classList.remove('active');
    }
  });

  const kebabMenuButtonDelete = createElement('li', {
    className: 'kebab-menu-item',
    textContent: '??????????????',
    onclick: (event) => {
      event.stopPropagation();
      this.delete();
    }
  });

  const kebabMenu = createElement('ul', {
    className: 'kebab-menu'
  });

  kebabMenu.append(kebabMenuButtonEdit, kebabMenuButtonDelete);

  const category = createElement('div', {
    className: 'category',
    onclick: () => {
      this.state.onClick(this);
    },
    onmouseleave: () => kebabMenu.classList.remove('active'),
  });

  category.append(categoryTitle, noteCount, menuButton, kebabMenu);

  return category;
}

Category.prototype.renderAllNote = function () {
  this.elements.listNote.innerHTML = '';

  if (!this.state.notes.length) {
    this.elements.listNote.prepend(`?? ?????????????????? ${this.state.title} ?????????????? ??????`);
  } else {
    const notes = this.state.notes.map(item => item.htmlContainer);

    if (this.state.selectedNote) {
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');
    }
    this.elements.listNote.prepend(...notes);
  }
}

Category.prototype.renderNote = function (id, title='', content='', date) {
  const newNote = new Note({
    idCategory: id,
    title,
    content,
    date,
    onClick: (note) => {
      this.state.selectedNote = note;
      this.state.selectedNote.init();
      this.state.notes.forEach(item => item.htmlContainer.classList.remove('checked'));
      this.state.selectedNote.htmlContainer.classList.add('checked');

      this.store.set('general', 0, {
        idSelectedCategory: this.state.id,
        idSelectedNote: this.state.selectedNote.state.date,
      });
    },
    onDelete: (note) => {
      this.state.notes = this.state.notes.filter(item => item !== note);
      this.htmlContainer = this.renderCategory();
      this.state.onUpdate();
    },
    onUpdate: () => this.renderAllNote(),
  });

  return newNote;
}

export default Category;
