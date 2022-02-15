import Category from './category';
import {createElement} from './util';



const categoryList = document.querySelector('.category-list_content');
const categoryItem = new Category({title: 'Короткие заметки'});
categoryList.append(categoryItem.htmlContainer);
//
// const addCategoryButton = document.querySelector('.add-category-button');
// const categoryList = document.querySelector('.category-list_content');
//
// const defaultCategory = new Category('Без категории');
// categoryList.append(defaultCategory.createCategory());
//
//
// addCategoryButton.addEventListener('click', () => {
//     const category = new Category();
//     categoryList.append(category.createCategory());
// })


