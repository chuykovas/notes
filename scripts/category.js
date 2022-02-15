import {createElement} from './util'

function Category(params) {
  this.onDelete = params.onDelete;
  this.state = {
    title: params.title,
    notes: [],
  };

  this.htmlContainer = this.render();

}

function handlerClickEdit() {

}

Category.prototype.delete = function () {
  this.htmlContainer.remove();

}

Category.prototype.rename = function (newName) {
  this.state.title = newName;
  this.htmlContainer = this.render();
}

Category.prototype.render = function () {
  const category = createElement('div', {name: 'className', value: 'category'});
  const categoryTitle = createElement('h3', {name: 'className', value: 'category-title'},
                                            {name: 'textContent', value: this.state.title});
  const noteCount = createElement('p', {name: 'className', value: 'notes-count'},
                                       {name: 'textContent', value: this.state.notes.length || 0});
  const menuButton = createElement('button', {name: 'className', value: 'kebab-menu-button'},
                                             {name: 'onclick', value: () => kebabMenu.classList.toggle('active')});

  const kebabMenu = createElement('ul', {name: 'className', value: 'kebab-menu'});
  const kebabMenuButtonEdit = createElement('li', {name: 'className', value: 'kebab-menu-item'},
                                                  {name: 'textContent', value: 'Редактировать'});
  const kebabMenuButtonDelete = createElement('li', {name: 'className', value: 'kebab-menu-item'},
                                                    {name: 'textContent', value: 'Удалить'},
                                                    {name: 'onclick', value: () => this.delete()});

  kebabMenu.append(kebabMenuButtonEdit, kebabMenuButtonDelete);

  category.append(categoryTitle, noteCount, menuButton,kebabMenu);

  return category;
}

export default Category;