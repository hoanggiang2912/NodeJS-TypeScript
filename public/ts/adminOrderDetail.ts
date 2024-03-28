import { getData, App } from './main.js';

(async _ => {
    const app = new App();
    // getting bill information
    const billId = location.pathname.split('/').pop();
    const bill = await getData(`/api/v1/bills/${billId}`);
    
    // setting bill information
    const statusInput = document.querySelector('.form__input--bill-status') as HTMLInputElement;
    const shippingMethodInput = document.querySelector('.form__input--shipping-method') as HTMLInputElement;
    const paymentMethodInput = document.querySelector('.form__input--payment-method') as HTMLInputElement;

    statusInput.value = bill.status;
    shippingMethodInput.value = bill.shippingMethod;
    paymentMethodInput.value = bill.paymentMethod;

    // update bill information
    const handleUpdateBill = async () => {
        const status = statusInput.value;

        const data = { status };
        const res = await fetch(`/api/v1/bills/update-status/${billId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        return res;
    }
    
    const updateBtn = document.querySelector('.save-btn') as HTMLButtonElement;
    const message = document.querySelector('.message--update') as HTMLElement;
    
    if (updateBtn) {
        updateBtn.addEventListener('click', async _ => {
            const res = await handleUpdateBill();
            // console.log(res);
            const data = await res.json();
            // console.log(data);
            if (data.success) {
                app.handleToastMessage('success', 'Bill updated!');
            }
            
            if (data.errorMessage) {
                app.handleToastMessage('failure', data.errorMessage);
            }
        })
    }
})();   