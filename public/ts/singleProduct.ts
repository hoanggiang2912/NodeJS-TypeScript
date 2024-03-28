(_ => {
    // handle product quantity
    const qtySelector = document.querySelector('.qty__selector') as HTMLElement;
    const qtyInput = document.querySelector('.qty__input') as HTMLInputElement;
    const form = document.querySelector('.product__form') as HTMLFormElement;
    const addToCartBtn = document.querySelector('.add-cart__btn') as HTMLButtonElement;
    // console.log(form);
    addToCartBtn.dataset.qty = qtyInput.value;

    if (qtySelector && qtyInput && form) {
        qtySelector.addEventListener('click', e => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            const plusBtn = target.closest('.plus-btn') as HTMLButtonElement;
            const minusBtn = target.closest('.minus-btn') as HTMLButtonElement;

            if (plusBtn) {
                qtyInput.value = (parseInt(qtyInput.value) + 1).toString();

                addToCartBtn.dataset.qty = qtyInput.value;
            } else if (minusBtn) {
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