import { getData, createStorage, myApp } from '/dist/assets/main.js';
import { Validator } from "/src/js/validator.js";


const addBtn = document.querySelector('.add-product-btn');
if (addBtn) {
    addBtn.addEventListener('click', async e => {
        // e.preventDefault();
        // await handleAddingProduct();
        Validator({
            formSelector: '.admin__add__product__form',
            formGroupSelector: '.form__group',
            formMessage: '.form__message',
            redirectUrl: `/src/template/admin_product.html`,

            rules: [
                Validator.isRequired('.form__input--name', 'Please fill in the blank'),
                Validator.isProductNameAlreadyExist('.form__input--name', 'http://localhost:3000/Products'),
                Validator.isRequired('.form__input--price', 'Please fill in the blank'),
                Validator.isPrice('.form__input--price'),
                Validator.isRequired('.form__input--promotion', 'Please fill in the blank'),
                Validator.isPromotion('.form__input--promotion'),
                Validator.isRequired('.form__input--quantity', 'Please fill in the blank'),
                Validator.isPositiveNumber('.form__input--quantity'),
                Validator.isRequired('.form__input--description', 'Please fill in the blank'),
            ]
        }, async _ => {
            await handleAddingProduct();
        })
    })
}


const productAPI = `http://localhost:3000/Products`;
const products = await getData(productAPI);

// console.log(indexList)
// console.log(indexList, index);

// handle adding product
const handleAddingProduct = async e => {
    const productName = document.querySelector('.form__input--name').value;
    const productCategory = document.querySelector('.form__input--category').value;
    const productPrice = document.querySelector('.form__input--price').value;
    const productPromotion = document.querySelector('.form__input--promotion').value;
    const productQty = document.querySelector('.form__input--quantity').value;
    const productDescription = document.querySelector('.form__input--description').value.split('.');
    const galleryInput = document.getElementById('product-gallery');
    
    const [...productGallery] = galleryInput.files;
    const productGallerySrc = productGallery.map(file => file.name);
    // console.log(productGallerySrc);
    // console.log(productGallery);

    // console.log(productName, productCategory, productPrice, productPromotion, productDescription, galleryInput);

    const indexList = products.map((_, i) => i);
    const index = (+indexList.slice().pop() + 1).toString();

    // console.log(indexList, index);

    
    const newProduct = {
        id: index,
        idCategory: productCategory,
        title: productName,
        price: productPrice,
        qty: productQty,
        salePrice: productPromotion,
        background: {
            "lazy-load": '',
            "main": productGallery[0].name,
            "sub": productGallery[1].name,
        },
        thumbnails: [
            ...productGallerySrc
        ],
        description: productDescription
    }

    // console.log(newProduct);
    try {
        const res = await fetch('http://localhost:3000/Products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!res.ok) {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.log(error)
    }
}

// handle upload product images
/**
 * retrieve the file input
 * listen for the change event
 * get the file
 * render the image
 */

const galleryInput = document.getElementById('product-gallery');
const galleryPreview = document.querySelectorAll('.admin__product__gallery__item__preview');
const imgProductPath = `/src/assets/image/products/`;
const imgBannerPath = `/src/assets/image/banners/`;

if (galleryInput)  {
    galleryInput.addEventListener('change', e => {
        const numsOfFiles = e.target.files.length;
        const files = e.target.files;
        console.log(files);
        galleryPreview.forEach((item, i) => {
            if (i < numsOfFiles) {
                item.style.backgroundImage = `url(${imgProductPath}${files[i].name})`;
            } else {
                item.style.backgroundImage = `url(${imgBannerPath}no-image.png)`;
            }
        });
    })
}

// handle render category options
const renderCategoryOptions = (categories) => {
    return categories.map(category => {
        const categoryId = window.location.search.split('=')[1];
        if (categoryId) {
            if (category.id === categoryId) {
                return `<option class="ttc" value="${category.id}" selected>${category.name}</option>`;
            }
        }
        return `<option class="ttc" value="${category.id}">${category.name}</option>`;
    }).join('');
}

const categorySelect = document.querySelector('.form__input--category');
// console.log(categorySelect);
if (categorySelect) {
    const categoryAPI = `http://localhost:3000/Categories`;
    const categories = await getData(categoryAPI);
    // console.log(categories);
    categorySelect.insertAdjacentHTML('beforeend' ,renderCategoryOptions(categories));
} else {
    console.log('No category select found')
}

Validator({
    formSelector: '.admin__add__product__form',
    formGroupSelector: '.form__group',
    formMessage: '.form__message',
    redirectUrl: `/src/template/admin_addProduct.html`,

    rules: [
        Validator.isRequired('.form__input--name', 'Please fill in the blank'),
        Validator.isProductNameAlreadyExist('.form__input--name', 'Product name already exist', 'http://localhost:3000/Products'),
        Validator.isRequired('.form__input--price', 'Please fill in the blank'),
        Validator.isPrice('.form__input--price'),
        Validator.isRequired('.form__input--promotion', 'Please fill in the blank'),
        Validator.isPromotion('.form__input--promotion'),
        Validator.isRequired('.form__input--quantity', 'Please fill in the blank'),
        Validator.isPositiveNumber('.form__input--quantity'),
        Validator.isRequired('.form__input--description', 'Please fill in the blank'),
    ]
})