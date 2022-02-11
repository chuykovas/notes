function Category(title) {
    this.title = title;

    this.render = function () {
        const category = document.createElement('div');
        category.classList.add('category');

        if(!this.title) {
            category.innerHTML = `
            <input type="text" placeholder="Название" class="add-name-input"/>
            <button class="add-name-category-button"></button>
            `;
        }
        category.addEventListener('click', event => {
            const clickedElement = event.target;

            if(clickedElement.tagName === 'BUTTON') {
                this.title = clickedElement.previousElementSibling.value || 'Без названия';
                category.innerHTML = `
                    <h3 class="category-title">${this.title}</h3>
                    <p class="notes-count">Заметок: <span>0</span></p>
                `;
            }
        })
        return category;
    }
}

export default Category;