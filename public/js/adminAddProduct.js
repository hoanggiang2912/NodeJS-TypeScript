import { productsEndpoint, checkToken, getNewToken, App } from "./main.js";
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
            const uploadRes = await handleUploadImage(e);
            if (!uploadRes.ok) {
                throw new Error(`HTTP error! status: ${uploadRes.status}`);
            }
            else {
                const data = await uploadRes.text();
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
const handleUploadImage = async (e) => {
    const target = e.target;
    const fileInput = target.closest('#product-gallery');
    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append('productImages', fileInput.files[i]);
    }
    const uploadAPI = `http://localhost:3000/upload/products`;
    const token = localStorage.getItem('authToken');
    const res = await fetch(uploadAPI, {
        method: 'POST',
        body: formData
    });
    return res;
};
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
        let authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const checkTokenRes = await checkToken(authToken);
        const checkTokenData = await checkTokenRes.json();
        if (checkTokenData.success == false || checkTokenData.message === 'Token expired') {
            const newTokenRes = await getNewToken(refreshToken);
            if (!newTokenRes || !newTokenRes.ok) {
                app.handleToastMessage('failure', 'Unauthorized! Please login again!');
                window.location.href = '/login';
            }
            const newTokenData = await newTokenRes.json();
            authToken = newTokenData.authToken;
            localStorage.setItem('authToken', newTokenData.authToken);
        }
        const res = await fetch(productsEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(newProduct)
        });
        if (!res.ok) {
            throw new Error('Error adding product!');
        }
        return res;
    }
    catch (error) {
        app.handleToastMessage('failure', `Error: ${error}`);
    }
};
