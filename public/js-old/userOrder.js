import {getData} from '/dist/assets/main.js';

const orders = await getData('http://localhost:3000/Bill');

const renderOrder = orders => {
    if (orders) {
        const html = orders.map(order => {
            return `
                <!-- single order start -->
                <div class="order__item sub-font pb20 border-top por">
                    <div class="order__item__header flex-between v-center">
                        <div class="order__item__id label-large fw-bold">Order: ${order.id}</div>
                        <div class="order__item__date label-medium fw-smb">${order.date}</div>
                    </div>
                    <div class="order__item__body">
                        <div class="order__item__content mt30">
                            <div class="order__item__content__header">
                                <div class="order__item__content__header__title label-medium fw-bold">Order details</div>
                            </div>
                            <div class="order__item__content__body mt12">
                                <div class="order__item__content__body__item flex-between mt6 v-center">
                                    <div class="order__item__content__body__item__title label-medium fw-bold">Order number:</div>
                                    <div class="order__item__content__body__item__value label-medium fw-smb">${order.id}</div>
                                </div>
                                <div class="order__item__content__body__item flex-between mt6 v-center">
                                    <div class="order__item__content__body__item__title label-medium fw-bold">Date:</div>
                                    <div class="order__item__content__body__item__value label-medium fw-smb">${order.date}</div>
                                </div>
                                <div class="order__item__content__body__item flex-between mt6 v-center">
                                    <div class="order__item__content__body__item__title label-medium fw-bold">Total:</div>
                                    <div class="order__item__content__body__item__value label-medium fw-smb">$${order.total}</div>
                                </div>
                                <div class="order__item__content__body__item flex-between mt6 v-center">
                                    <div class="order__item__content__body__item__title label-medium fw-bold">Payment method:</div>
                                    <div class="order__item__content__body__item__value label-medium fw-smb">${order.paymentMethod}</div>
                                </div>
                                <div class="order__item__content__body__item flex-between mt6 v-center">
                                    <div class="order__item__content__body__item__title label-medium fw-bold">Status:</div>
                                    <div class="order__item__content__body__item__value status status--${order.status} label-medium fw-smb ttc">${order.status}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- single order end -->
            `
        })

        return html.join('');
    }
}

const orderContainer = document.querySelector('.order__wrapper');

if (orderContainer) orderContainer.innerHTML = renderOrder(orders);
