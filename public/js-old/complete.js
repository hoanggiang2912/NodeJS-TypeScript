import { products, getJSON, getData, myApp, createStorage } from "../../dist/assets/main.js";
import { renderAddedProduct, renderBillProduct, updateUI } from "/src/js/checkout.js";

const billId = window.location.search.split('=')[1];

const billAPI = `http://localhost:3000/Bill/${billId}`;

const bill = await getData(billAPI);

const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}

const storage = createStorage('userLogin');

// update bill info with user id
// (async _ => {
//     const billId = window.location.search.split('=')[1];

//     const billAPI = `http://localhost:3000/Bill/${billId}`;

//     const bill = await getData(billAPI);
    
//     const userLoginInfo = JSON.parse(localStorage.getItem('userLogin')) ?? null;
//     if (!userLoginInfo) {
//         const userAPI = 'http://localhost:3000/Users';
//         const users = await getData(userAPI);
//         const indexList = users.map((_, i) => i);
//         const index = indexList ? Number(indexList.pop() + 1).toString() : "1";

//         const newUser = {
//             "id": index,
//             "firstName": firstnameInput.value,
//             "lastName": lastnameInput.value,
//             "email": emailInput.value,
//             "password": generatePassword(),
//             "role": "user",
//         }

//         // add new user base on the bill info
//         const res = await fetch(userAPI, {
//             method: 'POST',
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(newUser)
//         })

//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }

//         storage.set('userLogin', newUser);

//         // update bill info with user id
//         const data = await res.json();

//         const billUpdated = {
//             ...bill,
//             "idUser": data.id
//         }

//         const billUrl = `http://localhost:3000/Bill/${billId}`;

//         const billRes = await fetch(billUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(billUpdated),
//         })

//         if (!billRes.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const dataBill = await billRes.json();
//     }
//     if (userLoginInfo) {
//         const billUpdated = {
//             ...bill,
//             "idUser": userLoginInfo.id
//         }

//         const billUrl = `http://localhost:3000/Bill/${billId}`;

//         const res = await fetch(billUrl, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(billUpdated),
//         })

//         if (!res.ok) {
//             throw new Error('Network response was not ok');
//         }

//         res
//             .json()
//             .then(data => {
//                 console.log(data);
//             })
//             .catch(error => {
//                 console.error('Error updating data:', error);
//             });
//     }
// })()

const { id, name, email, address, products: billProducts, total, subtotal, shippingMethod, shippingFee, paymentMethod} = bill;

const trackingIdEle = document.querySelector('.trackingId');
const customerNameEle = document.querySelector('.customer__name');
const emailEle = document.querySelector('.user__email');
const addressEle = document.querySelector('.user__address');
const paymentMethodNameEle = document.querySelector('.payment__method__name');
const shippingMethodNameEle = document.querySelector('.shipping__method__name');
const shippingFeeEle = document.querySelectorAll('.shipping__fee');
const subtotalEle = document.querySelectorAll('.subtotal');
const totalEle = document.querySelectorAll('.total');

trackingIdEle.innerText = id;
customerNameEle.innerText = name;
emailEle.innerText = email;
addressEle.innerText = address;
paymentMethodNameEle.innerText = paymentMethod;
shippingMethodNameEle.innerText = shippingMethod;

shippingFeeEle.forEach(item => {
    item.innerText = `$${shippingFee}`;
});
subtotalEle.forEach(item => {
    item.innerText = `$${subtotal}`;
});
totalEle.forEach(item => {
    item.innerText = `$${total}`;
});

const continueBtn = document.querySelector('.continue-btn');
continueBtn.addEventListener('click', () => {
    myApp.storage.remove('userCart');
    window.location.href = '/';
});