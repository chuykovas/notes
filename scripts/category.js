import {createElement} from './util';


function Category(params) {
  this.onDelete = params.onDelete;
  this.state = {
    title: params.title,
    notes: [],
  };

  this.htmlContainer = this.render();

}

function handlerClickEdit() {
  const popupInputText = createElement('input', {
    className: 'popup-input',
    type: 'text',
    placeholder: 'Введите название'
  });
  const acceptButton = createElement('button', {
    className: 'popup-button', onclick: (event) => {
      event.preventDefault();
      this.rename(popupInputText.value || this.state.title);
      popupWrapper.remove();
    }
  }, 'Принять');
  const cancelButton = createElement('button', {
    className: 'popup-button',
    onclick: (event) => {
      event.preventDefault();
      popupWrapper.remove();
    }
  }, 'Отменить');
  const popup = createElement('form', {className: 'popup-form'}, popupInputText, acceptButton, cancelButton);
  const popupWrapper = createElement('div', {className: 'popup-wrapper'}, popup);

  document.body.append(popupWrapper);
}

Category.prototype.delete = function () {
  this.htmlContainer.remove();
}

Category.prototype.rename = function (newName) {
  this.state.title = newName;
  this.htmlContainer.firstChild.textContent = this.state.title;
}

Category.prototype.render = function () {

  const categoryTitle = createElement('h3', {className: 'category-title'}, this.state.title);
  const noteCount = createElement('p', {className: 'notes-count'}, String(this.state.notes.length));
  const menuButton = createElement('button', {
    className: 'kebab-menu-button',
    onclick: () => kebabMenu.classList.toggle('active')
  });
  const kebabMenuButtonEdit = createElement('li', {
    className: 'kebab-menu-item',
    onclick: () => handlerClickEdit.bind(this)()
  }, 'Редактировать');
  const kebabMenuButtonDelete = createElement('li', {
    className: 'kebab-menu-item',
    onclick: () => this.delete()
  }, 'Удалить');
  const kebabMenu = createElement('ul', {className: 'kebab-menu'}, kebabMenuButtonEdit, kebabMenuButtonDelete);

  const category = createElement('div', {
    className: 'category',
    onclick: () => category.classList.toggle('checked')
  }, categoryTitle, noteCount, menuButton, kebabMenu);

  return category;
}

export default Category;