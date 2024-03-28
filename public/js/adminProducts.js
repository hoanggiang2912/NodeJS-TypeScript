import { productsEndpoint, App } from "./main.js";
const run = async () => {
    const app = new App();
    const deleteBtns = [...document.querySelectorAll('.delete__btn')];
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const target = e.target;
            const btn = target.closest('.delete__btn');
            const id = btn.dataset.id;
            if (id) {
                const confirmed = confirm('Are you sure you want to delete this product?');
                if (confirmed) {
                    handleRemoveProduct(id)
                        .then(() => {
                        window.location.reload();
                    })
                        .catch(err => {
                        console.log(err);
                    });
                }
            }
        });
    });
    const searchInput = document.querySelector('.form__input--search');
    let timeoutId = null;
    if (searchInput) {
        searchInput.addEventListener('input', async () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            let searchResult = [];
            timeoutId = setTimeout(async () => {
                if (searchInput.value !== '') {
                    searchResult = await app.searchProduct(searchInput.value);
                    const container = document.querySelector('.admin__product__panel');
                    if (searchResult.length > 0) {
                        renderAdminProduct(searchResult, container);
                    }
                }
            }, 500);
        });
    }
};
const handleRemoveProduct = async (id, callback = async () => { }) => {
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const productAPI = `${productsEndpoint}/${id}`;
    await fetch(productAPI, options)
        .then(res => {
        return res.json();
    })
        .then((data) => (data.id).toString());
};
const renderAdminProduct = (products, container) => {
    const html = products.map(product => {
        let price = '';
        if (product.salePrice) {
            `<del>$ ${product.price} </del>
            <p class="body-medium fw-smb" > ${product.salePrice} </p>`;
        }
        else {
            price = `<p class="body-medium fw-smb" > ${product.price} </p>`;
        }
        return `
        <div class="admin__product col l-4 m-6 c-12 por">
                <a href="/admin/products/${product._id}" class="abs-full"></a>
                <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12">
                    <div class="flex">
                        <div class="admin__product__image por">
                            <div class="abs-full banner-cover"
                                style="background-image: url('/uploads/${product.background.main}');">
                            </div>
                        </div>
                        <div class="admin__product__info flex-full flex-column flex-between g20">
                            <h4 class="admin__product__name text body-large fw-smb ttc">${product.title}</h4>
                            <div class="flex-between">
                                <div class="admin__product__price flex g20 v-center">
                                    <span class="admin__product__price__old text body-large fw-medium flex g30 v-center">
                                        ${price}
                                    </span>
                                </div>
                                <div class="admin__product__action flex-between v-center">
                                    <button class="icon-btn edit__btn">
                                        <i class="fal fa-edit"></i>
                                    </button>
                                    <button class="icon-btn delete__btn por z-index10" data-id="{{this._id}}">
                                        <i class="fal fa-trash-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            
                    <div class="admin__product__info">
                        <div class="body-large fw-smb">
                            Category:
                            <span class="text fw-normal product__category__name neutral-text60 ttc">${product.idCategory.name}</span>
                        </div>
                    </div>
                    <div class="admin__product__info">
                        <div class="body-large fw-smb">
                            Description:
                            <p class="text fw-normal product__category__name neutral-text60 ">
                                ${product.description.map((desc) => desc).join(' ')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    `;
    }).join('');
    if (container) {
        container.innerHTML = '';
        container.innerHTML = html;
    }
};
run();
