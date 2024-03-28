import {categories, getData, myApp } from '/dist/assets/main.js';

const renderAdminCategory = categories => {
    if (categories) {
        return categories.map(c => {
            const {id, name, banner} = c;
            
            return `
                <div class="admin__category col l-4 m-6 c-12 cp" data-id="${id}">
                    <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12">
                        <div class="flex">
                            <div class="admin__category__image por">
                                <div class="abs-full banner-cover" style="background-image: url('/src/assets/image/categories/${banner}');"></div>
                            </div>
                            <div class="admin__category__info flex-column flex-between g20 flex-full">
                                <h4 class="admin__product__name text body-large fw-smb ttc">${name}</h4>
                                <div class="flex-between">
                                    <div class="admin__category__stock flex g6 v-center wrap">
                                        <span class="admin__product__instock text body-large fw-smb"></span>
                                        <span class="admin__product__price__new text body-large fw-normal">products available</span>
                                    </div>
                                    <div class="admin__category__action flex-between v-center">
                                        <button class="icon-btn edit__btn">
                                            <i class="fal fa-edit"></i>
                                        </button>
                                        <button class="icon-btn delete__btn remove-category__btn por" data-id="${id}">
                                            <i class="fal fa-trash-alt"></i>
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
            `
        }).join(' ');
    } else {
        console.log('No categories founded!');
    }
}

const getAmountProduct = async id => {
    const data = await getData('http://localhost:3000/Products');
    const products = data.filter(p => p.idCategory == id);
    return products.length;
}

const adminCategory = document.querySelector('.category__panel');
if (adminCategory) {
    // render category
    adminCategory.innerHTML = renderAdminCategory(categories);

    // handle amount product
    const [...categoryItems] = document.querySelectorAll('.admin__category');
    const ids = categoryItems.map(item => item.dataset.id);
    
    ids.forEach(async id => {
        const amount = await getAmountProduct(id);
        const category = categoryItems.find(item => item.dataset.id === id);
        const stock = category.querySelectorAll('.admin__product__instock');
        stock.forEach(s => s.textContent = amount);
    });

    // handle redirect to detail page
    categoryItems.forEach(item => {
        item.addEventListener('click', e => {
            const target = e.target;
            const category = target.closest('.admin__category');
            const id = item.dataset.id;
            if (id) {
                window.location.href = `/src/template/admin_categoryDetail.html?categoryId=${id}`;
            }
        });
    });

    const popup = document.querySelector('.popup--delete');
    const overlay = document.querySelector('.overlay--popup');

    if (overlay) {
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                myApp.closeModal(popup, overlay);
            }
        })

        overlay.addEventListener('click', () => {
            myApp.closeModal(popup, overlay);
        })

        const categoryAPI = `http://localhost:3000/Categories`;
        const adminCategoryContainer = document.querySelector('.admin__panel__main');

        await getData(categoryAPI)
            .then(async categories => {
                await renderAdminCategory(categories, adminCategoryContainer);

                const deleteBtns = document.querySelectorAll('.delete__btn');

                deleteBtns.forEach(btn => {
                    btn.addEventListener('click', e => {
                        // console.log(e.target);
                        e.stopPropagation();
                        // open popup
                        myApp.openModal(e, popup, overlay);

                        // find and delete if confirmed
                        const id = btn.dataset.id;

                        // confirm
                        const confirmBtn = document.querySelector('.confirm-btn');
                        confirmBtn.addEventListener('click', async () => {
                            await handleRemoveCategory(
                                id,
                                renderAdminCategory(categories, adminCategoryContainer)
                            );
                        });

                        // discard
                        const discardBtn = document.querySelector('.discard-btn');
                        discardBtn.addEventListener('click', _ => {
                            myApp.closeModal(popup, overlay);
                        })
                    })
                });
            })
            .catch(err => console.log(err));
    }
    const handleRemoveCategory = async (id, callback = async _ => {}) => {
        const productAPI = `http://localhost:3000/Products`;
        const products = await getData(productAPI);
        /** delete selected category */
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        const categoryAPI = `http://localhost:3000/Categories/${id}`;
        try {
            const response = await fetch(categoryAPI, options);
            if (!response.ok) throw new Error('Failed to delete category');

            // delete products of the category
            await checkProduct();
            // Call the callback function if needed
            await callback();
        } catch (error) {
            console.log(error);
        } 
    }

    const checkProduct = async _ => {
        const productsAPI = `http://localhost:3000/Products`;
        const products = await getData(productsAPI);
        // console.log(products);

        const categoriesAPI = `http://localhost:3000/Categories`;
        const categories = await getData(categoriesAPI);
        // console.log(categories);

        const categoryIds = categories.map(c => c.id);
        // console.log(categoryIds);

        products.forEach(p => {
            if (!categoryIds.includes(p.idCategory)) {
                const productAPI = `http://localhost:3000/Products/${p.id}`;
                const options = {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                fetch(productAPI, options);
            }
        });
    }

    /** handle search category */
    const searchForm = document.querySelector('.form--search');
    if (searchForm) {
        searchForm.addEventListener('submit', e => {
            e.preventDefault();
        })

        const searchInput = searchForm.querySelector('.form__input--search');

        if (searchInput) {
            const adminCategoryContainer = document.querySelector('.admin__panel__main.category__panel'); 

            searchInput.addEventListener('input', e => {
                const query = e.target.value;

                const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
                if (query) {
                    adminCategoryContainer.innerHTML = renderAdminCategory(filteredCategories);
                }
            });

            searchInput.addEventListener('blur', e => {
                if (!e.target.value) {
                    adminCategoryContainer.innerHTML = renderAdminCategory(categories);
                }
            });
        }
    }
}