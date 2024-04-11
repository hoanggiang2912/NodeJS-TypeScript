import {
    productsEndpoint,
    categoriesEndpoint,
    getData,
    getJSON,
    checkToken,
    getNewToken,
    App
} from "./main.js";
import { Data_Image } from "./interfaces.js";
const app = new App();

const run = async () => {
    // handle product gallery
    const galleryInput = document.getElementById('product-gallery') as HTMLInputElement;
    const productGalleryContainer = document.querySelector('.admin__product__gallery') as HTMLElement;

    const renderGalleryPreview = (images: string[]) => {
        return images.map(img => {
            return `
                <div class="admin__product__gallery__item col l-4 m-4 c-6">
                    <div class="col__inner admin__product__image rounded-8 oh por">
                        <label for="" id="product-banner--1__label"
                            class="abs-full banner-cover admin__product__gallery__item__preview" style="background-image: url(/uploads/${img})"></label>
                    </div>
                </div>
            `
        }).join('');
    }

    if (galleryInput) {
        galleryInput.addEventListener('change', async (e: Event) => {
            const uploadRes = await handleUploadImage(e);

            if (!uploadRes.ok) {
                throw new Error(`HTTP error! status: ${uploadRes.status}`);
            } else {
                const data = await uploadRes.text();
                // console.log('data' + data);
                if (data) {
                    // const data = [
                    //     { 
                    //         "fieldname": "productImages", 
                    //         "originalname": "background.jpg", 
                    //         "encoding": "7bit", 
                    //         "mimetype": "image/jpeg", 
                    //         "destination": "public/uploads/", 
                    //         "filename": "background.jpg", 
                    //         "path": "public\\uploads\\background.jpg", 
                    //         "size": 198335 
                    //     }
                    // ];
                    const jsonData = JSON.parse(data);

                    const images = ((jsonData as unknown) as Data_Image[]).map(i => i.originalname);

                    productGalleryContainer.insertAdjacentHTML('afterbegin', renderGalleryPreview(images));

                    const addProductBtn = document.querySelector('.add-product-btn') as HTMLButtonElement;
                    if (addProductBtn) {
                        addProductBtn.addEventListener('click', async (e: Event) => {
                            e.preventDefault();
                            app.handleToastMessage('waiting', 'Adding product...');
                            const res = await handleAddingProduct(images);
                            const data = await res?.json();

                            if (!data) {
                                app.handleToastMessage('failure', 'Adding failed! There is no data return!')
                            }
                            
                            if (data.success) {
                                app.handleToastMessage('success', 'Product added!');
                                // window.location.href = '/admin/products/create';
                            } else {
                                app.handleToastMessage('failure', `Adding failed: ${data.message}`);
                            }
                        })
                    }
                } else {
                    console.log('No data returned from server');
                }
            }
        })
    }
}

run();

const handleUploadImage = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const fileInput = target.closest('#product-gallery') as HTMLInputElement;
    // console.log(new FormData(files));
    // console.log(files);
    const formData = new FormData();
    for (let i = 0; i < fileInput.files!.length; i++) {
        formData.append('productImages', fileInput.files![i]);
    }

    const uploadAPI = `http://localhost:3000/upload/products`;
    const token = localStorage.getItem('authToken');

    const res = await fetch(uploadAPI, {
        method: 'POST',
        body: formData
    });

    return res;
}

// handle adding product
const handleAddingProduct = async (gallery: string[]) => {
    const productName = (document.querySelector('.form__input--name') as HTMLInputElement).value;
    const productCategory = (document.querySelector('.form__input--category') as HTMLInputElement).value;
    const productPrice = (document.querySelector('.form__input--price') as HTMLInputElement).value;
    const productPromotion = (document.querySelector('.form__input--promotion') as HTMLInputElement).value;
    const productQty = (document.querySelector('.form__input--quantity') as HTMLInputElement).value;
    const productDescription = (document.querySelector('.form__input--description') as HTMLInputElement).value.split('.');

    // console.log(productName, productCategory, productPrice, productPromotion, productDescription, galleryInput);

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
    }

    // console.log(newProduct);
    try {
        let authToken = localStorage.getItem('authToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const checkTokenRes = await checkToken(authToken as string);

        const checkTokenData = await checkTokenRes.json();

        if (checkTokenData.success == false || checkTokenData.message === 'Token expired') {
            const newTokenRes = await getNewToken(refreshToken as string);

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
    } catch (error) {
        app.handleToastMessage('failure', `Error: ${error}`);
    }
}