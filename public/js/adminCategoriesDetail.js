import { App, getData, categoriesEndpoint } from './main.js';
const { pathname } = new URL(window.location.href);
const id = pathname.split('/').pop();
const app = new App();
const run = async () => {
    const href = `/admin/addProduct?idCategory=${id}`;
    const addProductBtn = document.querySelector('.add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = href;
        });
    }
    if (id) {
        const category = await getData(`${categoriesEndpoint}/${id}`);
        const categoryNameInput = document.querySelector('.form__input--category__name');
        const categoryDescriptionInput = document.querySelector('.form__input--category__description');
        if (categoryNameInput && categoryDescriptionInput) {
            categoryNameInput.value = category.name;
            categoryDescriptionInput.value = category.description;
        }
        (async (id) => {
            const categoryAPI = `${categoriesEndpoint}/${id}`;
            const categoryNameInput = document.querySelector('.form__input--category__name');
            const categoryDescriptionInput = document.querySelector('.form__input--category__description');
            const updateCategoryBtn = document.querySelector('.update__category__btn');
            if (updateCategoryBtn) {
                updateCategoryBtn.addEventListener('click', async () => {
                    const name = categoryNameInput.value;
                    const description = categoryDescriptionInput.value;
                    const category = {
                        name,
                        description
                    };
                    const res = await fetch(categoryAPI, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(category)
                    });
                    if (res.ok) {
                        app.handleToastMessage('success', 'Category updated!');
                        window.location.reload();
                    }
                });
            }
        })(id);
    }
    else {
        console.log('No category id found!');
    }
};
run();
