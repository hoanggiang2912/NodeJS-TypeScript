import { getData, App } from './main.js';
(async (_) => {
    const app = new App();
    const billId = location.pathname.split('/').pop();
    const bill = await getData(`/api/v1/bills/${billId}`);
    const statusInput = document.querySelector('.form__input--bill-status');
    const shippingMethodInput = document.querySelector('.form__input--shipping-method');
    const paymentMethodInput = document.querySelector('.form__input--payment-method');
    statusInput.value = bill.status;
    shippingMethodInput.value = bill.shippingMethod;
    paymentMethodInput.value = bill.paymentMethod;
    const handleUpdateBill = async () => {
        const status = statusInput.value;
        const data = { status };
        const res = await fetch(`/api/v1/bills/update-status/${billId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return res;
    };
    const updateBtn = document.querySelector('.save-btn');
    const message = document.querySelector('.message--update');
    if (updateBtn) {
        updateBtn.addEventListener('click', async (_) => {
            const res = await handleUpdateBill();
            const data = await res.json();
            if (data.success) {
                app.handleToastMessage('success', 'Bill updated!');
            }
            if (data.errorMessage) {
                app.handleToastMessage('failure', data.errorMessage);
            }
        });
    }
})();
