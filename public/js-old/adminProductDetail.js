import {getData} from '/dist/assets/main.js';
import { renderAdminProduct } from '/src/js/adminProduct.js';

const productId = window.location.search.split('=')[1];

const getProduct = async id => {
    const productAPI = `http://localhost:3000/Products/${id}`;
    const product = await getData(productAPI);
    return product;
}

const inputs = document.querySelectorAll('.form__input');
inputs.forEach(input => {
    input.style.lineHeight = '1.5';
});

export const renderCategory = (categories) => {
    if (categories) {
        return categories.map(c => `<option class="ttc" value="${c.id}">${c.name}</option>`).join('');
    }
}

if (productId) {
    const product = await getProduct(productId);
    const { title, price, salePrice: promotion, idCategory, description } = product;
    // console.log(promotion);
    // console.log(product);

    const categories = await getData('http://localhost:3000/Categories');

    const productNameInput = document.querySelector('.form__input--name');
    const productPriceInput = document.querySelector('.form__input--price');
    const productCategoryInput = document.querySelector('.form__input--category');
    const productDescriptionInput = document.querySelector('.form__input--description');
    const productPromotionInput = document.querySelector('.form__input--promotion');
    const categorySelect = document.querySelector('.form__input--category');

    productNameInput.value = title;
    productPriceInput.value = price;
    productPromotionInput.value = promotion;


    if (categorySelect) {
        categorySelect.innerHTML = renderCategory(categories);

        productCategoryInput.value = idCategory;
    }

    if (productDescriptionInput) {
        const desc = description.map(d => d).join('.');
        productDescriptionInput.value = desc;
    }

    const adminProductWrapper = document.querySelector('.admin__product__wrapper');
    if (adminProductWrapper) {
        const categoryName = categories.find(c => c.id == idCategory).name;
        
        let price = '';

        if (product.salePrice) {
            price = `
                    <span class="admin__product__price__old text body-large fw-medium"><del>$${product.price}</del></span>
                    <span class="admin__product__price__new text body-large fw-smb">$${product.salePrice}</span>
                `;
        } else {
            price = `<span class="admin__product__price__new text body-large fw-smb">$${product.price}</span>`;
        }

        const productDescription = description.map(d => d).join(' ');
        adminProductWrapper.innerHTML = `
            <div class="admin__product admin__product--detail-page mt60">
                <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12">
                    <div class="flex">
                        <div class="admin__product__image por">
                            <div class="abs-full banner-cover" style="background-image: url('/src/assets/image/products/${product.background.main}');"></div>
                        </div>
                        <div class="admin__product__info flex-column flex-between g20">
                            <h4 class="admin__product__name text body-large fw-smb ttc">${product.title}</h4>
                            <div class="admin__product__price flex g20 v-center">
                                ${price}
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
                            <p class="text fw-normal product__category__name neutral-text60">${productDescription}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    const updateProductBtn = document.querySelector('.save-btn');
    if (updateProductBtn) {
        updateProductBtn.addEventListener('click', async e => {
            e.preventDefault();
            const productName = productNameInput.value;
            const productPrice = productPriceInput.value;
            const productCategory = productCategoryInput.value;
            const productDescription = productDescriptionInput.value.split('.');
            const productPromotion = productPromotionInput.value;

            const category = await getData(`http://localhost:3000/Categories/${productCategory}`);
            const { name: categoryName } = category;

            const updatedProduct = {
                title: productName,
                price: productPrice,
                idCategory: productCategory,
                category: categoryName,
                description: productDescription,
                salePrice: productPromotion
            }

            try {
                await updateProduct(productId, updatedProduct);
                window.location.href = '/src/template/admin_product.html';
            } catch (error) {
                console.log(error);
            }
        });
    }
} else {
    window.location.href = '/src/template/admin_product.html';
}

const updateProduct = async (id, data) => {
    const productAPI = `http://localhost:3000/Products/${id}`;
    const product = await getData(productAPI);
    
    const updatedProduct = {
        ...product,
        ...data
    }

    const res = await fetch(productAPI, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProduct)
    });

    if (!res.ok) {
        throw new Error('Error updating product!');
    }
}
