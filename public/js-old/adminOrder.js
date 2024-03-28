import {renderOrder, billAPI, bills} from '/src/js/dashboard.js'
import {getData} from '/dist/assets/main.js'

const orderContainer = document.querySelector('.order__table');
bills.forEach(bill => {
    if (orderContainer) {
        orderContainer.insertAdjacentHTML("beforeend", renderOrder(bill));
    }
});