import Category from './category';
import {createElement} from './util';

export function App() {
    this.state = {
        categories: [],
    }
}

App.prototype.render = function () {
    const addCategoryButton = document.querySelector('.add-button');
    const addCategoryInput = document.querySelector('.add-category-input');

    const categoryList = document.querySelector('.category-list_content');
    const categoryItem = new Category({title: 'Короткие заметки'});
    categoryList.append(categoryItem.htmlContainer);

    addCategoryButton.addEventListener('click', (event) => {
        event.preventDefault();
        const category = new Category({title: addCategoryInput.value});
        categoryList.append(category.htmlContainer);
        this.state.categories.push(category.htmlContainer);
        addCategoryInput.value = '';
        console.log(this.state.categories);
    });
}

new App().render();




