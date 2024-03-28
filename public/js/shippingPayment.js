import { getData } from "./main.js";
(_ => {
    const billAPI = '/api/v1/bills/';
    const idBill = location.pathname.split('/').pop();
    const errorMessage = document.querySelector('.payment__error__message');
    const updateBill = async () => {
        const shippingMethodInput = document.querySelector('.shipping__method input[name="shippingMethod"]:checked');
        const shippingMethod = shippingMethodInput.closest('.shipping__method');
        const paymentMethodInput = document.querySelector('.payment__method input[name="paymentMethod"]:checked');
        const paymentMethod = paymentMethodInput.closest('.payment__method');
        const bill = await getData(`${billAPI}${idBill}`);
        const shippingFee = shippingMethod.dataset.value;
        const shippingName = shippingMethod.dataset.name;
        const paymentName = paymentMethod.dataset.name;
        const total = +bill.subTotal + +shippingFee;
        try {
            const res = await fetch(`${billAPI}${idBill}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shippingFee,
                    shippingMethod: shippingName,
                    paymentMethod: paymentName,
                    total
                })
            });
            return res;
        }
        catch (error) {
            return null;
        }
    };
    const buyBtn = document.querySelector('.buy-now-btn');
    if (buyBtn) {
        buyBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const res = await updateBill();
            const data = res ? await res.json() : null;
            if (data && data.success) {
                localStorage.removeItem('userCart');
                location.href = `/checkout/confirmation/${idBill}`;
            }
            else {
                errorMessage.textContent = 'Error occurred while create bill. Please try again later!';
            }
        });
    }
})();
