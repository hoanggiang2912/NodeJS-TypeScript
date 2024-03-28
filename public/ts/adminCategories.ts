import { getData, categoriesEndpoint, productsEndpoint, App } from './main.js';
import { Category, Product } from './interfaces.js';

const getAmountProduct = async (id: string) => {
    const data = await getData(productsEndpoint);
    const products = data.filter((p: Product) => p.idCategory._id == id) as Product[];
    return products.length;
}

const renderAdminCategory = (categories: Category[], container: HTMLElement) => {
    if (categories) {
        const html = categories.map(c => {
            const { _id, name, banner } = c;

            return `
                <div class="admin__category col l-4 m-6 c-12 cp" data-id="${_id}">
                    <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12 por">
                        <a class="abs-full" href="/admin/category/${_id}"></a>
                        <div class="flex">
                            <div class="admin__category__image por">
                                <div class="abs-full banner-cover" style="background-image: url('/uploads/${banner}');"></div>
                            </div>
                            <div class="admin__category__info flex-column flex-between g20 flex-full">
                                <h4 class="admin__product__name text body-large fw-smb ttc">${name}</h4>
                                <div class="flex-between">
                                    <div class="admin__category__stock flex g6 v-center wrap">
                                        <span class="admin__product__instock text body-large fw-smb"></span>
                                        <span class="admin__product__price__new text body-large fw-normal">products available</span>
                                    </div>
                                    <div class="admin__category__action flex-between v-center">
                                        <a href="/admin/category/edit/${_id}" class="icon-btn edit__btn" data-id="${_id}">
                                            <i class="fal fa-edit"></i>
                                        </a>
                                        <button class="icon-btn delete__btn remove-category__btn por" data-id="${_id}">
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

        if (container) {
            container.innerHTML = '';
            container.insertAdjacentHTML('beforeend', html);
        }
    } else {
        console.log('No categories founded!');
    }
}

const run = async () => {
    const categories = await getData(categoriesEndpoint);

    // console.log(product, categories);

    const app = new App();
    
    const adminCategory = document.querySelector('.category__panel') as HTMLElement;
    
    if (adminCategory) {
        renderAdminCategory(categories, adminCategory);
        // handle amount product
        const categoryItems = [...document.querySelectorAll('.admin__category')] as HTMLElement[];
        // console.log(categoryItems);
        const ids = categoryItems.map(item => item.dataset.id);
        // console.log(ids);

        ids.forEach(async (id) => {
            const amount = await getAmountProduct((id as unknown) as string);
            // console.log(amount);
            const categoryStock = document.querySelector(`.admin__category[data-id="${id}"]`)?.querySelector('.admin__product__instock') as HTMLElement;
            // console.log(stock);
            if (categoryStock) {
                categoryStock.textContent = amount.toString();
            }
        });

        // handle redirect to detail page
        categoryItems.forEach(item => {
            item.addEventListener('click', e => {
                const target = e.target as HTMLElement;
                const category = target.closest('.admin__category');
                const id = item.dataset.id;
                if (id) {
                    window.location.href = `/admin/category/${id}`;
                }
            });
        });

        const popup = document.querySelector('.popup--delete') as HTMLElement;
        const overlay = document.querySelector('.overlay--popup') as HTMLElement;

        const openModal = (popup: HTMLElement, overlay: HTMLElement) => {
            popup.classList.add('show');
            overlay.classList.add('show');
        }

        const closeModal = (popup: HTMLElement, overlay: HTMLElement) => {
            popup.classList.remove('show');
            overlay.classList.remove('show');
        }

        if (overlay) {
            document.addEventListener('keydown', e => {
                if (e.key === 'Escape') {
                    app.closeModal(popup, overlay);
                }
            })

            overlay.addEventListener('click', () => {
                app.closeModal(popup, overlay);
            })

            const adminCategoryContainer = document.querySelector('.admin__panel__main') as HTMLElement;

            await getData(categoriesEndpoint)
                .then((categories: Category[]) => {
                    renderAdminCategory(categories, adminCategoryContainer);

                    const deleteBtns = [...document.querySelectorAll('.delete__btn')] as HTMLButtonElement[];

                    deleteBtns.forEach(btn => {
                        btn.addEventListener('click', e => {
                            // console.log(e.target);
                            e.stopPropagation();
                            // open popup
                            app.openModal(popup, overlay);

                            // find and delete if confirmed
                            const id = btn.dataset.id;

                            // confirm
                            const confirmBtn = document.querySelector('.confirm-btn') as HTMLButtonElement;
                            confirmBtn.addEventListener('click', async () => {
                                await handleRemoveCategory(
                                    id || '',
                                    () => renderAdminCategory(categories, adminCategoryContainer)
                                );
                            });

                            // discard
                            const discardBtn = document.querySelector('.discard-btn') as HTMLButtonElement;
                            discardBtn.addEventListener('click', _ => {
                                app.closeModal(popup, overlay);
                            })
                        })
                    });
                })
                .catch(err => console.log(err));
        }
        const handleRemoveCategory = async (id: string, callback = () => { }) => {
            /** delete selected category */
            const options = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const categoryAPI = `${categoriesEndpoint}/${id}`;
            try {
                const response = await fetch(categoryAPI, options);
                if (!response.ok) throw new Error('Failed to delete category');

                // delete products of the category
                await checkProduct();
                // Call the callback function if needed
                callback();
            } catch (error) {
                console.log(error);
            }
        }

        const checkProduct = async () => {
            const products = await getData(productsEndpoint) as Product[];

            const categories = await getData(categoriesEndpoint) as Category[];
            // console.log(categories);

            const categoryIds = categories.map(c => c._id);
            // console.log(categoryIds);

            products.forEach(p => {
                if (!categoryIds.includes(p.idCategory._id)) {
                    const productAPI = `${productsEndpoint}/${p._id}`;
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
        
        const removeCategoryBtns = [...document.querySelectorAll('.remove-category__btn')] as HTMLButtonElement[];

        if (removeCategoryBtns) {
            removeCategoryBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    const target = e.target as HTMLElement;

                    const btn = target.closest('.remove-category__btn') as HTMLButtonElement;

                    const id = btn.dataset.id as string;
                    const categoryAPI = `${categoriesEndpoint}/${id}`;
                    const confirmBtn = document.querySelector('.confirm-btn') as HTMLButtonElement;
                    const discardBtn = document.querySelector('.discard-btn') as HTMLButtonElement;

                    openModal(popup, overlay);
                    if (confirmBtn) {
                        confirmBtn.addEventListener('click', async () => {
                            const options = {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }

                            try {
                                const response = await fetch(categoryAPI, options);
                                if (!response.ok) throw new Error('Failed to delete category');

                                // delete products of the category
                                await checkProduct();
                                // Call the callback function if needed
                                window.location.reload();
                            } catch (error) {
                                console.log(error);
                            }
                        });
                    }
                    if (discardBtn) {
                        discardBtn.addEventListener('click', _ => {
                            closeModal(popup, overlay);
                        });
                    }
                    if (overlay) {
                        overlay.addEventListener('click', () => {
                            closeModal(popup, overlay);
                        })
                    }
                    if (document) {
                        document.addEventListener('keydown', e => {
                            if (e.key === 'Escape') {
                                closeModal(popup, overlay);
                            }
                        })
                    }
                })
            })
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

                let filteredCategories: Category[] = [];
                
                searchInput.addEventListener('input', e => {
                    const query = ((e.target as unknown) as HTMLInputElement).value as string;

                    filteredCategories = categories.filter(
                        (c: Category) => c.name.toLowerCase().includes(query.toLowerCase())
                    );
                    if (query) {
                        renderAdminCategory(filteredCategories, adminCategoryContainer as HTMLElement);
                    }
                });

                searchInput.addEventListener('blur', e => {
                    if (!(e.target as HTMLInputElement).value) {
                        renderAdminCategory(filteredCategories, adminCategoryContainer as HTMLElement);
                    }
                });
            }
        }
    }
}

run();





