import { getData } from "./main.js";

(_ => {
    const billAPI = '/api/v1/bills/';
    const idBill = location.pathname.split('/').pop();
    const errorMessage = document.querySelector('.payment__error__message') as HTMLElement;

    const updateBill = async () => {
        // get elements
        const shippingMethodInput = document.querySelector('.shipping__method input[name="shippingMethod"]:checked') as HTMLInputElement;
        const shippingMethod = shippingMethodInput.closest('.shipping__method') as HTMLElement;

        const paymentMethodInput = document.querySelector('.payment__method input[name="paymentMethod"]:checked') as HTMLInputElement;
        const paymentMethod = paymentMethodInput.closest('.payment__method') as HTMLElement;

        // get values
        const bill = await getData(`${billAPI}${idBill}`);
        // console.log(bill);
        
        const shippingFee = shippingMethod.dataset.value as unknown as number;
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
        } catch (error) {
            return null
        }
    }

    const buyBtn = document.querySelector('.buy-now-btn');

    if (buyBtn) {
        buyBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();

            const res = await updateBill();
            const data = res ? await res.json() : null;
            if (data && data.success) {
                // clear cart
                localStorage.removeItem('userCart');
                
                location.href = `/checkout/confirmation/${idBill}`;
            } else {
                errorMessage.textContent = 'Error occurred while create bill. Please try again later!';
            }
        })
    }
})();