import {getData, createStorage, myApp, products} from '/dist/assets/main.js';
import { getCategoryName } from './checkout.js';

export const renderAdminProduct = async (products, container) => {
    const categories = await getData('http://localhost:3000/Categories');
    if (products) {
        let html = '';
        // console.log(products)
        products.forEach(p => {
            // console.log(p);
            let categoryName = '';
            categories.forEach(c => {
                if (c.id === p.idCategory) {
                    categoryName = c.name;
                }
            })
            
            let price = '';
            
            if (p.salePrice) {
                price = `
                    <span class="admin__product__price__old text body-large fw-medium"><del>$${p.price}</del></span>
                    <span class="admin__product__price__new text body-large fw-smb">$${p.salePrice}</span>
                `;
            } else {
                price = `<span class="admin__product__price__new text body-large fw-smb">$${p.price}</span>`;
            }
            
            html += `
                <!-- single product start -->
                <div class="admin__product col l-4 m-6 c-12">
                    <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12 por">
                        <a href="/src/template/admin_productDetail.html?productId=${p.id}" class="abs-full"></a>
                        <div class="flex por z100">
                            <div class="admin__product__image por">
                                <div class="abs-full banner-cover" style="background-image: url('/src/assets/image/products/${p.background.main}');"></div>
                            </div>
                            <div class="admin__product__info flex-full flex-column flex-between g20">
                                <h4 class="admin__product__name text body-large fw-smb ttc">${p.title}</h4>
                                <div class="flex-between">
                                    <div class="admin__product__price flex g20 v-center">
                                        ${price}
                                    </div>
                                    <div class="admin__product__action flex-between v-center">
                                        <a href="/src/template/admin_productDetail.html?productId=${p.id}" class="icon-btn edit__btn">
                                            <i class="fal fa-edit"></i>
                                        </a>
                                        <button class="icon-btn delete__btn" data-id="${p.id}">
                                            <i class="fal fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="admin__product__info">
                            <div class="body-large fw-smb">
                                Category:
                                <span class="text fw-normal product__category__name neutral-text60 ttc">${categoryName}</span>
                            </div>
                        </div>
                        <div class="admin__product__info">
                            <div class="body-large fw-smb">
                                Description:
                                <p class="text fw-normal product__category__name neutral-text60 ">${p.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- single product end -->
            `;
        })
        // console.log(html);
        
        if (container) container.innerHTML = html;
    }
}

export const removeProduct = async _ => {
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

        const productsAPI = `http://localhost:3000/Products`;
        const adminProductContainer = document.querySelector('.admin__panel__main.admin__product__panel');

        await getData(productsAPI)
            .then(async products => {
                await renderAdminProduct(products, adminProductContainer);

                const deleteBtns = document.querySelectorAll('.delete__btn');

                deleteBtns.forEach(btn => {
                    btn.addEventListener('click', e => {
                        console.log(e.target);
                        // open popup
                        myApp.openModal(e, popup, overlay);

                        // find and delete if confirmed
                        const id = btn.dataset.id;

                        // confirm
                        const confirmBtn = document.querySelector('.confirm-btn');
                        confirmBtn.addEventListener('click', async () => {
                            await handleRemoveProduct(
                                id,
                                renderAdminProduct(products, adminProductContainer)
                            );
                        });

                        // discard
                        const discardBtn = document.querySelector('.discard-btn');
                        discardBtn.addEventListener('click', e => {
                            myApp.closeModal(popup, overlay);
                        })
                    })
                });
            })
            .catch(err => console.log(err));
    }
}
removeProduct();
const handleRemoveProduct = async (id, callback = async () => {}) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const productAPI = `http://localhost:3000/Products/${id}`;
    await fetch(productAPI, options)
        .then(res => {
            console.log(res)
            return res.json();
        })
        .then((data ) => (data.id).toString());
}

/** handle search product */
const searchForm = document.querySelector('.form--search');

if (searchForm) {
    searchForm.addEventListener('submit', e => {
        e.preventDefault();
    })

    const searchInput = searchForm.querySelector('.form__input--search');
    
    if (searchInput) {
        const searchResultContainer = document.querySelector('.admin__product__panel');
        searchInput.addEventListener('input', _ => {
            const query = searchInput.value;
            if (query) {
                const result = myApp.searchProduct(query, searchResultContainer);
                renderAdminProduct(result, searchResultContainer);
            }
        }) 
        
        searchInput.addEventListener('blur', _ => {
            if (!searchInput.value) {
                renderAdminProduct(products, searchResultContainer);
            }
        })
    }
}

