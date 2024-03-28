"use strict";
(_ => {
    const qtySelector = document.querySelector('.qty__selector');
    const qtyInput = document.querySelector('.qty__input');
    const form = document.querySelector('.product__form');
    const addToCartBtn = document.querySelector('.add-cart__btn');
    addToCartBtn.dataset.qty = qtyInput.value;
    if (qtySelector && qtyInput && form) {
        qtySelector.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target;
            const plusBtn = target.closest('.plus-btn');
            const minusBtn = target.closest('.minus-btn');
            if (plusBtn) {
                qtyInput.value = (parseInt(qtyInput.value) + 1).toString();
                addToCartBtn.dataset.qty = qtyInput.value;
            }
            else if (minusBtn) {
                if (parseInt(qtyInput.value) > 1) {
                    qtyInput.value = (parseInt(qtyInput.value) - 1).toString();
                    addToCartBtn.dataset.qty = qtyInput.value;
                }
            }
        });
        form.addEventListener('submit', e => {
            e.preventDefault();
        });
    }
})();
