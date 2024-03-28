import { Category, Product } from './interfaces';
import { 
    App, 
    getData, 
    getJSON, 
    productsEndpoint, 
    categoriesEndpoint 
} from './main.js';
// console.log(renderAdminProduct);

// console.log(categories);
// console.log(products);
const {pathname} = new URL(window.location.href);
const id = pathname.split('/').pop();
const app = new App();


const run = async () => {

    // const app = new App();

    const href = `/admin/addProduct?idCategory=${id}`;
    const addProductBtn = document.querySelector('.add-product-btn');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = href;
        })
    }
    // console.log(id);

    if (id) {
        /** render category item */
        const category = await getData(`${categoriesEndpoint}/${id}`);

        /** show category name and description */
        const categoryNameInput = document.querySelector('.form__input--category__name') as HTMLInputElement;
        const categoryDescriptionInput = document.querySelector('.form__input--category__description') as HTMLInputElement;

        if (categoryNameInput && categoryDescriptionInput) {
            categoryNameInput.value = category.name;
            categoryDescriptionInput.value = category.description;
        }

        /** handle update category */
        (async id => {
            const categoryAPI = `${categoriesEndpoint}/${id}`;
            const categoryNameInput = document.querySelector('.form__input--category__name') as HTMLInputElement;
            const categoryDescriptionInput = document.querySelector('.form__input--category__description') as HTMLTextAreaElement;
            const updateCategoryBtn = document.querySelector('.update__category__btn') as HTMLButtonElement;

            if (updateCategoryBtn) {
                updateCategoryBtn.addEventListener('click', async () => {
                    const name = categoryNameInput.value;
                    const description = categoryDescriptionInput.value;

                    const category = {
                        name,
                        description
                    }

                    const res = await fetch(categoryAPI, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(category)
                    })

                    if (res.ok) {
                        app.handleToastMessage('success', 'Category updated!');
                        window.location.reload();
                    }
                })
            }
        })(id);
    } else {
        console.log('No category id found!');
    }
}

run();


