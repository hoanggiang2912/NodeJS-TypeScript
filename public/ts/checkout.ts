import { CartProduct } from "./type";

(_ => {
    const renderBillProduct = async (cart: CartProduct[], container: HTMLElement) => {
        if (cart) {
            const html = cart.map(p => {
                return `
                    <!-- single bill product start -->
                        <div class="bill__product flex v-center g20">
                            <div class="bill__product__banner__wrapper por">
                                <div class="banner-contain bill__product__banner poa abs-full" style="background-image: url('/uploads/${p.image}')"></div>
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
                `
            }).join('');

            if (container) {
                container.insertAdjacentHTML('afterbegin', html);
            }
        }
    }

    const checkUser = () => {
        const {userLogin} = JSON.parse(localStorage.getItem('userLogin') as string);
        if (!userLogin) {
            window.location.href = '/login';
        } else {
            return userLogin;
        }
    }

    const checkout = async (cart: CartProduct[]) => {
        const emailInput = document.querySelector('.email__input') as HTMLInputElement;
        const addressInput = document.querySelector('.address__input') as HTMLInputElement;
        const addressDetailInput = document.querySelector('.subaddress__input') as HTMLInputElement;
        const phoneInput = document.querySelector('.phone__input') as HTMLInputElement;
        const firstNameInput = document.querySelector('.firstname__input') as HTMLInputElement;
        const lastNameInput = document.querySelector('.lastname__input') as HTMLInputElement;

        const user = checkUser();
        const idUser = user._id;
        const email = emailInput.value;
        const address = addressInput.value;
        const addressDetail = addressDetailInput.value;
        const phone = phoneInput.value;
        const name = `${firstNameInput.value} ${lastNameInput.value}`;
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const subTotal = +cart.reduce((acc: number, cur: CartProduct) => acc += +cur.price * +cur.qty, 0);

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
        }

        const res = await fetch('/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bill)
        });
        return res;
    }

    const updateUser = async (id: string, user: {
        firstName: string, 
        lastName: string
        address?: string,
        addressDetail?: string,
    }) => {
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

            // if (!res.ok) throw new Error('Something went wrong');

            return res;
        } catch (error) {
            console.log(error);
        }
    }

    // update checkout ui
    const updateUI = (cart: CartProduct[]) => {
        const subtotal = cart.reduce((acc: number, cur: CartProduct) => acc + cur?.price * cur?.qty, 0);
        const subtotalEle = [...document.querySelectorAll('.subtotal')] as HTMLElement[];
        const totalEle = [...document.querySelectorAll('.total')] as HTMLElement[];
        
        subtotalEle.forEach(elm => elm.innerText = `$${subtotal}`);
        totalEle.forEach(elm => elm.innerText = `$${subtotal}`);

        const user = checkUser();
        const emailInput = document.querySelector('.email__input') as HTMLInputElement;
        const phoneInput = document.querySelector('.phone__input') as HTMLInputElement;
        const firstNameInput = document.querySelector('.firstname__input') as HTMLInputElement;
        const lastNameInput = document.querySelector('.lastname__input') as HTMLInputElement;
        
        if (user) {
            const {email, phone, firstName, lastName} = user;
            emailInput.value = email;
            phoneInput.value = phone;
            firstNameInput.value = firstName;
            lastNameInput.value = lastName;
        }
    }

    // check if local storage userCart is exist, if not --> redirect to home page
    const {userCart} = JSON.parse(localStorage.getItem('userCart') as string);

    if (!userCart) {
        window.location.href = '/';
        return;
    }

    const cartProductContainers = [...document.querySelectorAll('.bill__products')] as HTMLElement[];

    updateUI(userCart);

    cartProductContainers.forEach(container => {
        renderBillProduct(userCart, container);
    });

    const continueBtn = document.querySelector('.continue-btn') as HTMLButtonElement;
    const formErrorMessage = document.querySelector('.checkout__form > .form__error__message') as HTMLElement;

    if (continueBtn) {
        continueBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();

            try {
                // console.log((await checkout(userCart)));
                const res = await checkout(userCart);
                const data = await res.json();
                // console.log(data);
                if (!res.ok) {
                    formErrorMessage.innerText = data.errorMessage;
                    return;
                }

                const { bill: {_id: idBill} } = data;

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
                            // console.log('update user success');
                            window.location.href = `/checkout/shipping-payment/${idBill}`;
                        }
                    }
                }

                if (data.errorMessage) {
                    formErrorMessage.innerText = data.errorMessage;
                }
            } catch (error) {
                // console.error(error);
                if (error instanceof Error) {
                    formErrorMessage.innerText = error.message;
                } else {
                    formErrorMessage.innerText = 'An unexpected error occurred. Please try again.';
                }
            }
        });
    }
})();