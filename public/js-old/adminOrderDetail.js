const getBill = async (id) => {
    const response = await fetch(`http://localhost:3000/Bill/${id}`);
    return response.json();
}

const idBill = window.location.search.split('=')[1];

if (idBill) {
    const bill = await getBill(idBill);

    const renderBillProducts = billProducts => {
        if (!billProducts) console.log('No products founded');

        if (billProducts) {
            return billProducts.map(product => {
                let price;
                if (product.salePrice) {
                    price = `
                        <span class="admin__product__price__old text body-large fw-medium"><del>$${product.price}</del></span>
                        <span class="admin__product__price__new text body-large fw-smb">$${product.salePrice}</span>
                    `
                } else {
                    price = `
                        <span class="admin__product__price text body-large fw-smb">$${product.price}</span>
                    `
                }
                
                return `
                    <!-- single product start -->
                    <div class="admin__product admin__product--bill">
                        <div class="admin__product__inner glass rounded-8 oh p20 flex-column g12">
                            <div class="flex">
                                <div class="admin__product__image por">
                                    <div class="abs-full banner-cover" style="background-image: url('/src/assets/image/products/${product.bg}');"></div>
                                </div>
                                <div class="admin__product__info flex-column flex-between g20">
                                    <h4 class="admin__product__name text body-large fw-smb ttc">${product.title}</h4>
                                    <div class="flex-between">
                                        <div class="admin__product__price flex g20 v-center">
                                            ${price}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- single product end -->
                `
            }).join('')
        }
    }

    (function updateBillView (bill) {
        // render bill products
        const billProductsContainer = document.querySelector('.bill__product__wrapper');
        if (billProductsContainer) {
            billProductsContainer.insertAdjacentHTML("beforeend", renderBillProducts(bill.products));
        }

        // render bill info
        const billInfoForm = document.querySelector('.order-info-form');
        const billTrackingId = document.querySelector('.bill__tracking__id');
        const billStatusInput = document.querySelector('.form__input--bill-status');
        const billFullNameInput = document.querySelector('.form__input--fullname');
        const billEmailInput = document.querySelector('.form__input--email');
        const billPhoneInput = document.querySelector('.form__input--phone');
        const billAddressInput = document.querySelector('.form__input--address');
        const billShippingMethodInput = document.querySelector('.form__input--shipping-method');
        const billPaymentMethodInput = document.querySelector('.form__input--payment-method');

        if (billInfoForm) {
            billTrackingId.textContent = bill.id;
            billStatusInput.value = bill.status;
            billFullNameInput.value = bill.name;
            billEmailInput.value = bill.email;
            billPhoneInput.value = bill.phone;
            billAddressInput.value = bill.address;
            billShippingMethodInput.value = bill.shippingMethod;
            billPaymentMethodInput.value = bill.paymentMethod;
        }
    })(bill)

    const handleUpdateBill = async (e) => {
        const billStatus = document.querySelector('.form__input--bill-status').value;
        const billFullName = document.querySelector('.form__input--fullname').value;
        const billEmail = document.querySelector('.form__input--email').value;
        const billPhone = document.querySelector('.form__input--phone').value;
        const billAddress = document.querySelector('.form__input--address').value;
        const billShippingMethod = document.querySelector('.form__input--shipping-method').value;
        const billPaymentMethod = document.querySelector('.form__input--payment-method').value;

        const bill = await getBill(idBill);

        const updatedBill = {
            ...bill,
            status: billStatus,
            name: billFullName,
            email: billEmail,
            phone: billPhone,
            address: billAddress,
            shippingMethod: billShippingMethod,
            paymentMethod: billPaymentMethod
        }

        const res = await fetch(`http://localhost:3000/Bill/${idBill}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBill)
        });

        if (res.status === 200) {
            console.log('Update bill successfully');
        } else {
            console.log('Update bill failed');
        }
    }

    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', e => {
            e.preventDefault();
            handleUpdateBill(e);
        })
    }
} else {
    window.location.href = '/src/template/admin_order.html';
}