import { createStorage, getData, products, myApp, getJSON } from '/dist/assets/main.js';
import { Validator } from "/src/js/validator.js";

export const getCategoryName = async id => {
    const categoryAPI = 'http://localhost:3000/Categories';
    const categories = await getData(categoryAPI);
    const category = categories.find(c => c.id === id);
    return category.name;
}

export const renderBillProduct = async (cart, container) => {
    if (cart) {
        await cart.forEach(async p => {
            let categoryName;
            await getCategoryName(p.idCategory).then(name => {
                categoryName = name;
            });
            
            const html = `
            <!-- single bill product start -->
                <div class="bill__product flex v-center g20">
                    <div class="bill__product__banner__wrapper por">
                        <div class="banner-contain bill__product__banner poa abs-full" style="background-image: url('/src/assets/image/products/${p.bg}')"></div>
                        <span class="label-small poa bill__product__qty">${p.qty}</span>
                    </div>
                    <div class="bill__product__info flex-full flex-between v-center g12">
                        <div class="flex-column">
                            <div class="title-medium fw-normal bill__product__name">${p.title}</div>
                            <div class="label-medium fw-normal bill__product__category neutral-text60 ttc">${categoryName}</div>
                        </div>
                        <div class="label-large fw-normal bill__product__price">$${p.price}</div>
                    </div>
                </div>
            <!-- single bill product end -->
            `

            if (container) {
                container.insertAdjacentHTML('afterbegin', html);
            }
        });
    }
}
export const renderAddedProduct = async (products, container) => {
    await products.forEach(async p => {
        let categoryName;
        await getCategoryName(p.idCategory).then(name => {
            categoryName = name;
        });

        const html = `
            <!-- single frequently bought together product start -->
                <div class="bill__product border flex v-center g20 p20 rounded-8">
                    <div class="bill__product__banner__wrapper por">
                        <div class="banner-contain bill__product__banner poa abs-full" style="background-image: url('/src/assets/image/products/${p.background.main}')"></div>
                    </div>
                    <div class="bill__product__info flex-full flex-between v-center g12">
                        <div class="flex-column">
                            <div class="title-medium fw-normal bill__product__name">${p.title}</div>
                            <div class="label-medium fw-normal bill__product__category neutral-text60 ttc">${categoryName}</div>
                            <div class="label-large fw-normal bill__product__price primary-text">$${p.price}</div>
                        </div>
                        <button class="add-bill-btn secondary-fill-btn hover primary-text" data-id="${p.id}" data-name="${p.title}" data-price="${p.price}" data-id-category="${p.idCategory}" data-img="${p.background.main}">Add</button>
                    </div>
                </div>
            <!-- single frequently bought together product end -->
        `

        if (container) {
            container.insertAdjacentHTML('afterbegin', html);
        }
    });
}
const renderCheckoutProducts = () => {
    const billProductContainer = document.querySelectorAll('.bill__products');
    if (billProductContainer) {
        billProductContainer.forEach(container => {
            container.innerHTML = '';
            renderBillProduct(myApp.cart, container);
        });
    }

    const addProductContainers = document.querySelectorAll('.bill__products__holder');
    const addProducts = products.filter(p => !myApp.cart.some(c => c.id === p.id)).slice(0, 3);

    if (addProductContainers) {
        addProductContainers.forEach(container => {
            container.innerHTML = '';
            renderAddedProduct(addProducts, container);
        });
    }
}
renderCheckoutProducts();
// update checkout ui
const subtotalEle = document.querySelectorAll('.subtotal');
const totalEle = document.querySelectorAll('.total');

const subtotal = myApp.cart.reduce((acc, cur) => acc + cur.price * cur.qty, 0);
export const updateUI = () => {
    subtotalEle.forEach(elm => elm.innerText = `$${subtotal}`);
    totalEle.forEach(elm => elm.innerText = `$${subtotal}`);
}
updateUI();

// add product from frequently bought together section into bill products
const addBillBtns = document.querySelectorAll('.add-bill-btn');
addBillBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        const target = e.target;

        const btn = target.closest('.add-bill-btn');
        
        myApp.addCart(btn, myApp.cart, myApp.storage);
        renderCheckoutProducts();
        updateUI();
    });
});

const generateRandomBillId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let billId = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        billId += characters.charAt(randomIndex);
    }
    return billId;
};

const idBill = generateRandomBillId();

export const billing = async () => {
    const emailInput = document.querySelector('.email__input');
    const firstnameInput = document.querySelector('.firstname__input');
    const lastnameInput = document.querySelector('.lastname__input');
    const addressInput = document.querySelector('.address__input');
    const subAddressInput = document.querySelector('.subaddress__input');
    const phoneInput = document.querySelector('.phone__input');
    try {
        const billInfo = {
            "id": idBill,
            "name": firstnameInput.value + ' ' + lastnameInput.value,
            "phone": phoneInput.value,
            "address": addressInput.value + ' ' + subAddressInput.value,
            "email": emailInput.value,
            "products": myApp.cart,
            "subtotal": subtotal,
            "status": "pending"
        };

        const billUrl = 'http://localhost:3000/Bill';
        const billResponse = await fetch(billUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(billInfo),
        });

        if (!billResponse.ok) {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

const continueBtn = document.querySelector('.continue-btn');

if (continueBtn) {
    continueBtn.addEventListener('click', e => {
        Validator({
            formSelector: '.checkout__form',
            formGroupSelector: '.form__group',
            formMessage: '.form__message',
            redirectUrl: `/src/template/shipping.html?billId=${idBill}`,

            rules: [
                Validator.isRequired('.email__input', 'Please fill in the blank'),
                Validator.isEmail('.email__input', 'Your email is invalid!'),
                Validator.isRequired('.firstname__input', 'Please fill in the blank'),
                Validator.isRequired('.lastname__input', 'Please fill in the blank'),
                Validator.isRequired('.address__input', 'Please fill in the blank'),
                Validator.isRequired('.phone__input', 'Please fill in the blank'),
                Validator.isPhone('.phone__input', 'Your phone number is invalid!'),
            ]
        }, async () => {
            await billing();
        })
    })
}

Validator({
    formSelector: '.checkout__form',
    formGroupSelector: '.form__group',
    formMessage: '.form__message',
    submitUrl: '/src/template/shipping.html',
    redirectUrl: `/src/template/shipping.html?billId=${idBill}`,

    rules: [
        Validator.isRequired('.email__input', 'Please fill in the blank'),
        Validator.isEmail('.email__input', 'Your email is invalid!'),
        Validator.isRequired('.firstname__input', 'Please fill in the blank'),
        Validator.isRequired('.lastname__input', 'Please fill in the blank'),
        Validator.isRequired('.address__input', 'Please fill in the blank'),
        Validator.isRequired('.phone__input', 'Please fill in the blank'),
        Validator.isPhone('.phone__input', 'Your phone number is invalid!'),
    ]
})