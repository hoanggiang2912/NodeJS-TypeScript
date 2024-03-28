import { categories, products } from '/dist/assets/main.js';
import { renderAdminProduct } from '/src/js/adminProduct.js';
// console.log(renderAdminProduct);

// console.log(categories);
// console.log(products);

const id = window.location.search.split('=')[1];

const href = `/src/template/admin_addProduct.html?categoryId=${id}`;
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
    const adminCategoryWrapper = document.querySelector('.admin__category__wrapper');

    const category = categories.find(c => c.id == id);
    const categoryProduct = products.filter(p => p.idCategory == id);
    // console.log(category);
    if (category && adminCategoryWrapper) {
        const { id, name, banner } = category;
        
        adminCategoryWrapper.innerHTML = `
            <!-- single category start -->
            <div class="admin__category">
                <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12">
                    <div class="flex">
                        <div class="admin__category__image por">
                            <div class="abs-full banner-cover" style="background-image: url('/src/assets/image/categories/${banner}');"></div>
                        </div>
                        <div class="admin__category__info flex-column flex-between g20 flex-full">
                            <h4 class="admin__product__name text body-large fw-smb ttc">${name}</h4>
                            <div class="flex-between">
                                <div class="admin__category__stock flex g6 v-center wrap">
                                    <span class="admin__product__price__old text body-large fw-smb">${categoryProduct.length}</span>
                                    <span class="admin__product__price__new text body-large fw-normal">products available</span>
                                </div>
                                <div class="admin__category__action flex-between v-center">
                                    <button class="icon-btn edit__btn">
                                        <i class="fal fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="admin__product__info flex-between v-center">
                        <span class="admin__category__statis__text flex g6 v-center"><i class="fa-solid fa-arrow-trend-up"></i> 15% increased</span>
                        <span class="admin__category__update__text body-medium fw-light flex g6 neutral-text60"> Last 24 hours
                        </span>
                    </div>
                </div>
            </div>
            <!-- single category end -->
        `;
    }

    /** show category name and description */
    const categoryNameInput = document.querySelector('.form__input--category__name');
    const categoryDescriptionInput = document.querySelector('.form__input--category__description');
    
    if (categoryNameInput && categoryDescriptionInput) {
        categoryNameInput.value = category.name;
        categoryDescriptionInput.value = category.description;
    }

    /** show category's products */
    const adminProductWrapper = document.querySelector('.product__panel');
    // console.log(adminProductWrapper);
    if (categoryProduct) {
        renderAdminProduct(categoryProduct, adminProductWrapper);
    }

    /** handle update category */
    (async id => {
        const categoryAPI = `http://localhost:3000/Categories/${id}`;
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
                }

                await fetch(categoryAPI, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(category)
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                    })
                    .catch(err => console.log(err))

            })
        }
    })(id);
} else {
    console.log('No category id found!');
}