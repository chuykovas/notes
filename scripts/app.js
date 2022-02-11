import Category from './category';

const addCategoryButton = document.querySelector('.add-category-button');
const categoryList = document.querySelector('.category-list_content');

const defaultCategory = new Category('Без категории');
categoryList.append(defaultCategory.render());


addCategoryButton.addEventListener('click', () => {
    const category = new Category();
    categoryList.append(category.render());
})