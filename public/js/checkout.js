(_ => {
    const renderBillProduct = async (cart, container) => {
        if (cart) {
            const html = cart.map(p => {
                return `
                    <!-- single bill product start -->
                        <div class="bill__product flex v-center g20">
                            <div class="bill__product__banner__wrapper por" style="padding-top: 20%">
                                <div class="banner-contain bill__product__banner poa abs-full" style="background-image: url('/uploads/${p.image}');"></div>
                                <span class="label-small poa bill__product__qty">${p.qty}</span>
                            </div>
                            <div class="bill__product__info flex-full flex-between v-center g12">
                                <div class="flex-column">
                                    <div class="title-medium fw-normal bill__product__name ttu">${p.title}</div>
                                    <div class="label-medium fw-normal bill__product__category neutral-text60 ttc">${p.idCategory.name}</div>
                                </div>
                                <div class="label-large fw-normal bill__product__price">$${p.price}</div>
                            </div>
                        </div>
                    <!-- single bill product end -->
                `;
            }).join('');
            if (container) {
                container.insertAdjacentHTML('afterbegin', html);
            }
        }
    };
    const checkUser = () => {
        const { userLogin } = JSON.parse(localStorage.getItem('userLogin'));
        if (!userLogin) {
            window.location.href = '/login';
        }
        else {
            return userLogin;
        }
    };
    const checkout = async (cart) => {
        const emailInput = document.querySelector('.email__input');
        const addressInput = document.querySelector('.address__input');
        const addressDetailInput = document.querySelector('.subaddress__input');
        const phoneInput = document.querySelector('.phone__input');
        const firstNameInput = document.querySelector('.firstname__input');
        const lastNameInput = document.querySelector('.lastname__input');
        const user = checkUser();
        const idUser = user._id;
        const email = emailInput.value;
        const address = addressInput.value;
        const addressDetail = addressDetailInput.value;
        const phone = phoneInput.value;
        const name = `${firstNameInput.value} ${lastNameInput.value}`;
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const subTotal = +cart.reduce((acc, cur) => acc += +cur.price * +cur.qty, 0);
        const bill = {
            idUser,
            email,
            address: `${address} ${addressDetail}`,
            addressDetail,
            phone,
            firstName,
            lastName,
            products: cart,
            subTotal
        };
        const res = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bill)
        });
        return res;
    };
    const updateUser = async (id, user) => {
        try {
            const api = `/api/v1/auth/update-profile/${id}`;
            const res = await fetch(api, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    address: user?.address,
                    addressDetail: user?.addressDetail
                })
            });
            return res;
        }
        catch (error) {
            console.log(error);
        }
    };
    const updateUI = (cart) => {
        const subtotal = cart.reduce((acc, cur) => acc + cur?.price * cur?.qty, 0);
        const subtotalEle = [...document.querySelectorAll('.subtotal')];
        const totalEle = [...document.querySelectorAll('.total')];
        subtotalEle.forEach(elm => elm.innerText = `$${subtotal}`);
        totalEle.forEach(elm => elm.innerText = `$${subtotal}`);
        const user = checkUser();
        const emailInput = document.querySelector('.email__input');
        const phoneInput = document.querySelector('.phone__input');
        const firstNameInput = document.querySelector('.firstname__input');
        const lastNameInput = document.querySelector('.lastname__input');
        if (user) {
            const { email, phone, firstName, lastName } = user;
            emailInput.value = email;
            phoneInput.value = phone;
            firstNameInput.value = firstName;
            lastNameInput.value = lastName;
        }
    };
    const { userCart } = JSON.parse(localStorage.getItem('userCart'));
    if (!userCart) {
        window.location.href = '/';
        return;
    }
    const cartProductContainers = [...document.querySelectorAll('.bill__products')];
    updateUI(userCart);
    cartProductContainers.forEach(container => {
        renderBillProduct(userCart, container);
    });
    const continueBtn = document.querySelector('.continue-btn');
    const formErrorMessage = document.querySelector('.checkout__form > .form__error__message');
    if (continueBtn) {
        continueBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const res = await checkout(userCart);
                const data = await res.json();
                if (!res.ok) {
                    formErrorMessage.innerText = data.errorMessage;
                    return;
                }
                const { bill: { _id: idBill } } = data;
                if (data.success) {
                    const user = checkUser();
                    const { _id: idUser, firstName, lastName, address, addressDetail } = user;
                    if (user.firstName == '' || user.lastName == '') {
                        const updateUserRes = await updateUser(idUser, {
                            firstName,
                            lastName,
                            address,
                            addressDetail
                        });
                        if (!updateUserRes?.ok) {
                            const errorData = await updateUserRes?.json();
                            formErrorMessage.innerText = errorData.errorMessage;
                            return;
                        }
                        const dataUpdatedUser = await updateUserRes.json();
                        if (dataUpdatedUser.success) {
                            window.location.href = `/checkout/shipping-payment/${idBill}`;
                        }
                    }
                }
                if (data.errorMessage) {
                    formErrorMessage.innerText = data.errorMessage;
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    formErrorMessage.innerText = error.message;
                }
                else {
                    formErrorMessage.innerText = 'An unexpected error occurred. Please try again.';
                }
            }
        });
    }
})();
export {};
