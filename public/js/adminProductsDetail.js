import { productsEndpoint, checkToken, getNewToken, App } from "./main.js";
const app = new App();
const run = async () => {
    const productNameInput = document.querySelector('.form__input--name');
    const productPriceInput = document.querySelector('.form__input--price');
    const productCategoryInput = document.querySelector('.form__input--category');
    const productDescriptionInput = document.querySelector('.form__input--description');
    const productPromotionInput = document.querySelector('.form__input--promotion');
    const productQtyInput = document.querySelector('.form__input--qty');
    const updateBtn = document.querySelector('.save-btn');
    const deleteBtn = document.querySelector('.delete__btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = updateBtn.getAttribute('data-id');
            const productName = productNameInput.value;
            const productPrice = productPriceInput.value;
            const productCategory = productCategoryInput.value;
            const productDescription = productDescriptionInput.value.split('.');
            const productPromotion = productPromotionInput.value;
            const productQty = productQtyInput.value;
            const updatedProduct = {
                title: productName,
                price: productPrice,
                idCategory: productCategory,
                description: productDescription,
                salePrice: productPromotion,
                qty: productQty
            };
            try {
                app.handleToastMessage('waiting', 'Updating product...');
                await updateProduct(productId, updatedProduct);
                app.handleToastMessage('success', 'Product updated!');
                window.location.reload();
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = deleteBtn.getAttribute('data-id');
            const confirmed = confirm('Are you sure you want to delete this product?');
            if (confirmed) {
                try {
                    app.handleToastMessage('waiting', 'Deleting product...');
                    const res = await handleRemoveProduct(productId);
                    const data = await res.json();
                    if (data.success) {
                        app.handleToastMessage('success', 'Product deleted!');
                        window.location.href = '/admin/products';
                    }
                    else {
                        app.handleToastMessage('failure', `Update failed: ${data.message}`);
                    }
                }
                catch (error) {
                    app.handleToastMessage('failure', `Update failed: ${error}`);
                    console.log(error);
                }
            }
        });
    }
};
const updateProduct = async (id, data) => {
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
        const productAPI = `${productsEndpoint}/${id}`;
        const res = await fetch(productAPI, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error('Error updating product!');
        }
    }
    catch (error) {
        console.log(error);
    }
};
const handleRemoveProduct = async (id) => {
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
    const api = `${productsEndpoint}/${id}`;
    const res = await fetch(api, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
        }
    });
    return res;
};
run();
