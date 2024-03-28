import { productsEndpoint, App } from "./main.js";
const app = new App();
const run = async () => {
    const galleryInput = document.getElementById('product-gallery');
    const productGalleryContainer = document.querySelector('.admin__product__gallery');
    const renderGalleryPreview = (images) => {
        return images.map(img => {
            return `
                <div class="admin__product__gallery__item col l-4 m-4 c-6">
                    <div class="col__inner admin__product__image rounded-8 oh por">
                        <label for="" id="product-banner--1__label"
                            class="abs-full banner-cover admin__product__gallery__item__preview" style="background-image: url(/uploads/${img})"></label>
                    </div>
                </div>
            `;
        }).join('');
    };
    if (galleryInput) {
        galleryInput.addEventListener('change', async (e) => {
            const target = e.target;
            const fileInput = target.closest('#product-gallery');
            const formData = new FormData();
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('productImages', fileInput.files[i]);
            }
            const uploadAPI = `http://localhost:3000/upload/products`;
            const res = await fetch(uploadAPI, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            else {
                const data = await res.text();
                if (data) {
                    const jsonData = JSON.parse(data);
                    const images = jsonData.map(i => i.originalname);
                    productGalleryContainer.insertAdjacentHTML('afterbegin', renderGalleryPreview(images));
                    const addProductBtn = document.querySelector('.add-product-btn');
                    if (addProductBtn) {
                        addProductBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            app.handleToastMessage('waiting', 'Adding product...');
                            const res = await handleAddingProduct(images);
                            const data = await res?.json();
                            if (!data) {
                                app.handleToastMessage('failure', 'Adding failed! There is no data return!');
                            }
                            if (data.success) {
                                app.handleToastMessage('success', 'Product added!');
                                window.location.href = '/admin/products/create';
                            }
                            else {
                                app.handleToastMessage('failure', `Adding failed: ${data.message}`);
                            }
                        });
                    }
                }
                else {
                    console.log('No data returned from server');
                }
            }
        });
    }
};
run();
const handleAddingProduct = async (gallery) => {
    const productName = document.querySelector('.form__input--name').value;
    const productCategory = document.querySelector('.form__input--category').value;
    const productPrice = document.querySelector('.form__input--price').value;
    const productPromotion = document.querySelector('.form__input--promotion').value;
    const productQty = document.querySelector('.form__input--quantity').value;
    const productDescription = document.querySelector('.form__input--description').value.split('.');
    const newProduct = {
        idCategory: productCategory,
        title: productName,
        price: productPrice,
        qty: productQty,
        salePrice: productPromotion,
        background: {
            "lazy-load": '',
            "main": gallery[0],
            "sub": gallery[1],
        },
        thumbnails: [
            ...gallery
        ],
        description: productDescription
    };
    try {
        const res = await fetch(productsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });
        return res;
    }
    catch (error) {
        app.handleToastMessage('failure', `Error: ${error}`);
    }
};
