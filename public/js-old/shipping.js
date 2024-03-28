import { products, getJSON, getData } from "../../dist/assets/main.js";
import { renderAddedProduct, renderBillProduct, updateUI } from "/src/js/checkout.js";


// render bill products
const billId = window.location.search.split('=')[1];
const billAPI = `http://localhost:3000/Bill/${billId}`;

const bills = await getData('http://localhost:3000/Bill');

const [bill] = await bills.filter(bill => bill.id === billId);

const { email, address, products: billProducts } = bill;

const addProductContainers = document.querySelectorAll('.bill__products__holder');

const addProducts = await products.filter(p => !billProducts.some(c => c.id == p.id)).slice(0, 3);

if (addProductContainers) {
    addProductContainers.forEach(container => {
        container.innerHTML = '';
        renderAddedProduct(addProducts, container);
    });
}

// update checkout informations
const subtotalEle = document.querySelectorAll('.subtotal');
const totalEle = document.querySelectorAll('.total');

const subtotal = billProducts.reduce((acc, cur) => acc + cur.price * cur.qty, 0);

updateUI();

const emailEle = document.querySelector('.user__email');
const addressEle = document.querySelector('.user__address');
emailEle.innerText = email;
addressEle.innerText = address;

const buyNowBtn = document.querySelector('.buy-now-btn');

const shippingFee = document.querySelector('.shipping__method input[type="radio"]:checked').closest('.shipping__method').dataset.value;


const total = subtotal + Number(parseFloat(shippingFee).toFixed(2));

const getOrderDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const event = new Date(year, month, day);

    return event.toDateString();
}
// const date = getOrderDate();

buyNowBtn.addEventListener('click', async () => {
    fetch(billAPI)
        .then(response => response.json())
        .then(bill => {

            const shippingMethodInput = document.querySelector('.shipping__method input[type="radio"]:checked');
            const paymentMethodInput = document.querySelector('.payment__method input[type="radio"]:checked');
            // const shippingFee = shippingMethodInput.closest('.shipping__method').dataset.value;
            const shippingName = shippingMethodInput.closest('.shipping__method').dataset.name;
            const paymentMethod = paymentMethodInput.closest('.payment__method').dataset.name;

            const shippingFee = document.querySelector('.shipping__method input[type="radio"]:checked').closest('.shipping__method').dataset.value;


            const total = +subtotal + Number(parseFloat(shippingFee).toFixed(2));

            // console.log(total);

            const date = getOrderDate();
            
            const updatedBill = {
                ...bill,
                shippingMethod: shippingName,
                shippingFee: shippingFee,
                paymentMethod: paymentMethod,
                total: total,
                date: date,
            };

            fetch(billAPI, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBill)
            })
                .then(response => response.json())
                .then(updatedBill => {
                    window.location.href = `/src/template/complete.html?billId=${billId}`;
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
});