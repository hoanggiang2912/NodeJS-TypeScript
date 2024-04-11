export const categoriesEndpoint = 'http://127.0.0.1:3000/api/v1/categories';
export const productsEndpoint = 'http://127.0.0.1:3000/api/v1/products';
// const billsEndpoint = 'http://localhost:3000/bill';
// const usersEndpoint = 'http://localhost:3000/user';

import { Category, Product } from './interfaces';
import { CartProduct } from './type';

export const createStorage = (key: string) => {
    const store = JSON.parse(localStorage.getItem(key)!) ?? {};

    const save = () => {
        localStorage.setItem(key, JSON.stringify(store));
    }

    const storage = {
        get(key: string) {
            return store[key];
        },
        set(key: string, val: unknown) {
            store[key] = val;
            save();
        },
        remove(key: string) {
            delete store[key];
            save();
        }
    };

    return storage;
}

export async function getJSON(url: string, errorMsg: string = "Something went wrong!") {
    return fetch(url)
        .then(response => {
            if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
            return response.json();
        });
}

export async function getData(url: string, limit: number = 0) {
    try {
        const data = await getJSON(url);

        if (limit) return data.slice(0, limit);

        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const checkToken = async (token: string) => {
    const res = await fetch(`/api/v1/auth/check-token`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return res;
}

export const getNewToken = async (refreshToken: string) => {
    const refreshRes = await fetch(`/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    })

    return refreshRes;
}


class Cart {
    cart: CartProduct[] = JSON.parse(localStorage.getItem('userCart')!)?.userCart || [] as CartProduct[];

    storage;

    public constructor() {
        this.storage = createStorage('userCart');

        this.renderUI();
    }

    async addProduct(btn: HTMLButtonElement, cart: CartProduct[], storage = this.storage) {
        // get product infomation
        const _id = btn.dataset.id as string;
        const title = btn.dataset.name as string;
        const price = Number(btn.dataset.price);
        const promotion = Number(btn.dataset.promotion);
        const image = btn.dataset.img as string;
        const idCategory = btn.dataset.idCategory as string;
        // console.log(idCategory);
        const qty = Number(btn.dataset.qty) || 1;
        // console.log(this.categories);
        const categoriesAPI = `${categoriesEndpoint}/${idCategory}`;
        const category = await getData(categoriesAPI);

        // console.log(category);
        const {name: categoryName} = category;
        // console.log(categoryName);

        const product: CartProduct = {
            _id,
            title,
            price,
            image,
            idCategory: {
                _id: category._id,
                name: categoryName
            },
            promotion,
            qty
        };

        // push product into cart array
        if (!this.cart.some(product => product._id === _id)) {
            this.cart.push(product);
            storage.set("userCart", this.cart);
        } else {
            this.cart.filter(product => product._id === _id)[0].qty++;
            storage.set("userCart", this.cart);
        }

        // update cart UI
        this.renderUI();
    }

    calcSubtotal(discount = 0) {
        // subtotal element
        const subTotal = document.querySelector('.cart__subtotal') as HTMLElement;
        if (subTotal) {
            discount !== 0
                ? subTotal.innerText = `$${this.cart.reduce((acc: number, item: CartProduct) => acc += Number(item.price * item.qty), 0) - discount}`
                : subTotal.innerText = `$${this.cart.reduce((acc: number, item: CartProduct) => acc += Number(item.price * item.qty), 0)}`
        }
    }

    cartQty() {
        const cartAmount = Array.from(document.querySelectorAll('.cart__amount')) as HTMLElement[];

        if (cartAmount) {
            cartAmount.forEach(item => {
                if (this.cart.length === 0) {
                    item.innerText = '';
                } else {
                    item.innerText = this.cart.length.toString();
                }
            });
        }

        const itemsAmount = document.querySelector('.item__amount') as HTMLElement;

        const productAmount = this.cart.reduce((a: number, c: CartProduct) => a + Number(c.qty), 0);
        if (itemsAmount) itemsAmount.innerText = `Tạm tính (${productAmount} ${productAmount > 1 ? 'sản phẩm' : 'sản phẩm'})`;
    }

    renderUI() {
        this.renderCartProduct();
        this.cartQty();
        this.calcSubtotal();
    }

    renderCartProduct() {
        // console.log(this.cart);
        // cart product container
        const cartProductContainer = document.querySelector('.cart__product__wrapper') as HTMLElement;
        let html = '';

        if (this.cart.length > 0) {
            // console.log(this.cart)
            // console.log(this.categories)
            // console.log(categories);
            this.cart.forEach((product: CartProduct, index: number) => {
                html += `
                    <!-- single cart product start -->
                    <div class="cart__product flex width-full pb12">
                        <div class="cart__product__banner">
                            <div class="banner-cover" style="background-image: url(/uploads/${product.image}); height: 100%"></div>
                        </div>
                        <div class="cart__product__info pl20 flex-column flex-full">
                            <div class="flex-between v-center">
                                <h4 class="title-small ttc">${product.title}</h4>
                                <button class="icon-btn cart__product__remove-btn" data-index="${index}"><i class="far fa-trash"></i></button>
                            </div>
                            <p class="body-small cart__product__category fw-light ttc">${product.idCategory.name}</p>
                            <div class="flex-between v-center">
                                <form action="#" class="form qty-form flex-between v-center">
                                    <button data-id="${product._id}" class="icon-btn minus-btn"><i class="fas fa-minus"></i></button>
                                    <input type="number" class="qty-input tac" value="${product.qty}">
                                    <button data-id="${product._id}" class="icon-btn plus-btn"><i class="fas fa-plus"></i></button>
                                </form>
                                <div class="cart__product__price body-medium fw-light">$${product.price}</div>
                            </div>
                        </div>
                    </div>
                    <!-- single cart product end -->
                `
            });
        } else {
            html = `
            <div class="tac sub-font">
                <h4 class="title-medium fw-bold">Your cart is empty!</h4>
            </div>
            `
        }

        if (cartProductContainer) {
            // render cart product
            cartProductContainer.innerHTML = '';
            cartProductContainer.insertAdjacentHTML('afterbegin', html);

            // remove product
            const removeBtns = Array.from(document.querySelectorAll('.cart__product__remove-btn')) as HTMLButtonElement[];

            removeBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataIndex: number = Number(btn.dataset.index);

                    this.cart.splice(dataIndex, 1);
                    this.storage.set("userCart", this.cart);

                    this.renderUI();
                    this.calcSubtotal();
                })
            });

            // handle increase - decrease product quantity
            const plusBtn = Array.from(document.querySelectorAll('.qty-form .plus-btn')) as HTMLButtonElement[];
            const minusBtn = Array.from(document.querySelectorAll('.qty-form .minus-btn')) as HTMLButtonElement[];
            const qtyInput = document.querySelector('.qty-input') as HTMLButtonElement;
            const subtotalItem = document.querySelector('.item__amount') as HTMLElement;

            plusBtn.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataId = btn.dataset.id;

                    this.cart.filter(item => item._id === dataId)[0].qty++;
                    this.storage.set('userCart', this.cart);
                    this.renderCartProduct();
                    this.calcSubtotal();

                    const itemAmount = this.cart.reduce((acc, cur) => acc += cur.qty, 0);
                    subtotalItem.innerText = `Subtotal (${itemAmount}) ${itemAmount > 1 ? 'items' : 'item'}`;
                })
            });

            minusBtn.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataId = btn.dataset.id;

                    if (Number(qtyInput.value) > 1) {
                        this.cart.filter(item => item._id === dataId)[0].qty--;
                        this.storage.set('userCart', this.cart);
                        this.renderCartProduct();
                        this.calcSubtotal();
                    } else {
                        this.cart.filter(item => (item._id as string) === dataId)[0].qty = 1
                        this.storage.set('userCart', this.cart);
                        this.renderCartProduct();
                        this.calcSubtotal();
                    }
                })
            });

            if (qtyInput) {
                qtyInput.addEventListener('change', _ => {
                    if (qtyInput.value <= '1') {
                        qtyInput.value = '1';
                    }
                })
            }
        }
    }
}

export class App {
    // categories: Category[] = [];
    // products: Product[] = [];
    cart;
    userStorage;
    userLoginInfo;
    public constructor () {
        // this.categories = categories;
        // this.products = products;
        this.cart = new Cart();
        this.userStorage = createStorage('userLogin');
        this.userLoginInfo = JSON.parse(localStorage.getItem('userLogin') as string)?.userLogin || {};
        this.eventsHandler();
        this.handleUserWidget();
        this.renderUserSidebar();
    }
    eventsHandler () {
        /** handle search box */
        const openSearchBoxBtn = document.querySelector('.open-searchbox') as HTMLButtonElement;
        const closeSearchBoxBtn = document.querySelector('.close-searchbox') as HTMLButtonElement;
        const searchBox = document.querySelector('.header__search-box') as HTMLElement;
        const searchInput = document.querySelector('.search__popdown__input') as HTMLInputElement;

        if (openSearchBoxBtn && closeSearchBoxBtn && searchBox) {
            openSearchBoxBtn.addEventListener('click', e => {
                e.preventDefault();
                this.openModal(searchBox);

                this.hide(openSearchBoxBtn);
                this.show(closeSearchBoxBtn);
            });
            closeSearchBoxBtn.addEventListener('click', e => {
                e.preventDefault();
                this.closeModal(searchBox);
                this.show(openSearchBoxBtn);
                this.hide(closeSearchBoxBtn);
            });
        }

        /** handle search input */
        let timeoutId: NodeJS.Timeout | null = null;
        if (searchInput) {
            searchInput.addEventListener('input' , async () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                let searchResult: Product[] = [];

                timeoutId = setTimeout(async () => {
                    if (searchInput.value !== '') {
                        searchResult = await this.searchProduct(searchInput.value);
                        const searchResultContainer = document.querySelector('.search__result__wrapper') as HTMLElement;

                        if (searchResultContainer) {
                            if (searchInput.value) {
                                this.renderSearchProduct(searchResult, searchResultContainer);
                            } else {
                                searchResultContainer.innerHTML = '';
                            }
                        }
                        // console.log(searchResult);
                    }
                }, 500);
            });
        }

        /** add to cart */
        const addCartBtns = [...document.querySelectorAll('.add-cart-btn')] as HTMLButtonElement[];
        // console.log(addCartBtns);

        if (addCartBtns) {
            addCartBtns.forEach(btn => {
                btn.addEventListener('click', async e => {
                    e.preventDefault(); 
                    e.stopPropagation();

                    await this.cart.addProduct(btn, this.cart.cart);
                });
            });
        }

        /** checkout */
        const url = '/checkout';
        const checkoutBtn = document.querySelector('.checkout-btn') as HTMLButtonElement;

        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', e => {
                e.preventDefault();

                if (this.cart.cart.length > 0) {
                    window.location.href = url;
                } else {
                    
                }
            })
        }

        /**
         * Category filter:
         */
        const categoryOptions = [...document.querySelectorAll('#shop__filter--category option')] as HTMLOptionElement[];
        // console.log(categoryOptions);

        if (categoryOptions) {
            categoryOptions.forEach(option => {
                option.addEventListener('click', async () => {
                    // console.log(option.value);
                    if (option.value != '0') {
                        const idCategory = option.value;
                        // console.log(idCategory);    
                        const categoryProducts = await getData(`${productsEndpoint}/category/${idCategory}`);
                        // console.log(this.products); 
                        // console.log(categoryProducts);
                        this.renderGeneralProduct(categoryProducts, document.querySelector('.product__wrapper') as HTMLElement, '<p class="title-medium fw-bold neutral-text40">This category is now empty! We will update soon!</p>');

                        (document.querySelector('.result__amount') as HTMLElement).innerText = `${categoryProducts.length} ${categoryProducts.length > 
                            1 ? 'results' : 'result'}`;
                    } else {
                        const products = await getData(productsEndpoint);
                        this.renderGeneralProduct(products, document.querySelector('.product__wrapper') as HTMLElement, '<p class="title-medium fw-bold neutral-text40">This category is now empty! We will update soon!</p>');
                    }
                });
            });
        }

        /** sorting filter */
        // const sortingOptions = [...document.querySelectorAll('#shop__filter--price option')] as HTMLOptionElement[];
        // enum PriceOptions {Default, Low, High};
        // if (sortingOptions) {
        //     sortingOptions.forEach(option => {
        //         option.addEventListener('click', () => {
        //             const productContainer = document.querySelector('.product__wrapper') as HTMLElement;
        //             if (+option.value === PriceOptions.Low) {
        //                 const sortedProducts = this.products.sort((a , b) => a.price - b.price);
        //                 this.renderGeneralProduct(sortedProducts, productContainer);
        //             } else if (+option.value === PriceOptions.High) {
        //                 const sortedProducts = this.products.sort((a , b) => b.price - a.price);
        //                 this.renderGeneralProduct(sortedProducts, productContainer);
        //             } else if (+option.value === PriceOptions.Default) {
        //                 this.renderGeneralProduct(this.products, productContainer);
        //             }
        //         })
        //     });
        // }

        /** show / hide cart popup */
        const toggleCartBoxBtn = [...document.querySelectorAll('.toggle-cart-btn')] as HTMLButtonElement[];
        if (toggleCartBoxBtn) {
            toggleCartBoxBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    // console.log(btn);
                    this.toggleFloatBox('.header__cart-box', '.header__cart__inner')
                })
            });
        }
        const cartBox = document.querySelector('.header__cart-box') as HTMLElement;
        if (cartBox) {
            cartBox.addEventListener('click', (event) => {
                if (event.target === cartBox) {
                    this.toggleFloatBox('.header__cart-box', '.header__cart__inner');
                }
            });
        }

        /** handle update product views*/
        const products = [...document.querySelectorAll('.product')] as HTMLElement[];
        // console.log(products);
        if (products) {
            products.forEach(product => {
                product.addEventListener('click', async (e: Event) => {
                    const productId = (product.querySelector('.add-cart-btn') as HTMLElement)?.dataset.id;
                    // console.log(productId);
                    if (productId) {
                        const productAPI = `${productsEndpoint}/${productId}/views`;
                        const product = await getData(`${productsEndpoint}/${productId}`);
                        // console.log(product);
                        let currentViews = product?.viewed;
                        // console.log(currentViews);
                        const updatedViews = +currentViews + Math.floor(((Math.random() + 1) * 10));
                        // console.log(updatedViews);
                        const res = await fetch(productAPI, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                viewed: updatedViews
                            })
                        });

                        if (!res.ok) {
                            throw new Error('Failed to update product views');
                        }

                        window.location.href = `/singleProduct/${productId}`;
                    }
                })
            });
        }

        /** handle show hide password */
        const passwordBtn = document.querySelector('.toggle-password');
        if (passwordBtn) {
            passwordBtn.addEventListener('click', (e: Event) => {
                e.preventDefault();
                const target = e.target as HTMLElement;
                const btn = target.closest('.toggle-password') as HTMLElement;
                const passwordInput = btn.parentElement?.querySelector('.password__input') as HTMLInputElement;
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                } else {
                    passwordInput.type = 'password';
                }
            });
        }

        // custom checkbox
        // Get the necessary DOM elements
        const checkboxWrapper = document.querySelector('.custom__checkbox__wrapper') as HTMLElement;
        const checkboxInput = document.querySelector('#contactCheckbox') as HTMLInputElement;
        const customCheckbox = document.querySelector('.custom__checkbox') as HTMLElement;
        const customCheckboxLabel = document.querySelector('.custom__checkbox__label') as HTMLElement;

        if (checkboxInput && checkboxWrapper && customCheckbox && customCheckboxLabel) {
            const checkboxHandler = () => {
                // Toggle the checked state of the checkbox input
                checkboxInput.checked = !checkboxInput.checked;

                // Toggle the appearance of the custom checkbox
                customCheckbox.classList.toggle('checked');
            }

            customCheckboxLabel.style.userSelect = 'none';
            customCheckboxLabel.addEventListener('click', () => {
                checkboxHandler();
            })

            // Add a click event listener to the checkbox wrapper
            checkboxWrapper.addEventListener('click', () => {
                checkboxHandler();
            });

            // Add a change event listener to the checkbox input
            checkboxInput.addEventListener('change', () => {
                // Toggle the appearance of the custom checkbox based on the checkbox input's checked state
                customCheckbox.classList.toggle('checked', checkboxInput.checked);
            });
        }

        // Initialize shipping method radio checkbox
        this.initializeCustomRadioCheckboxes('.shipping__method', 'input[type="radio"]');
        const shippingMethodItems = [...document.querySelectorAll('.shipping__method')] as HTMLElement[];
        const shippingFeeElement = [...document.querySelectorAll('.shipping__fee')] as HTMLElement[];
        const shippingMethodActived = document.querySelector('.shipping__method input[type="radio"]:checked') as HTMLInputElement;
        const shippingInputs = [...document.querySelectorAll('.shipping__method input[name="shippingMethod"]')] as HTMLInputElement[];

        const totalEles = [...document.querySelectorAll('.total')] as HTMLElement[];
        const userCart: CartProduct[] = JSON.parse(localStorage.getItem('userCart')!)?.userCart || [] as CartProduct[];
        const subTotal = userCart.reduce((a: number, c: CartProduct) => a + Number(c.price * c.qty), 0);

        if (shippingMethodActived) {
            shippingFeeElement.forEach(ele => {
                const shippingMethod = shippingMethodActived.closest('.shipping__method') as HTMLElement;
                ele.innerText = `$${shippingMethod.dataset.value}`;
            });


            if (totalEles) {
                const shippingMethod = shippingMethodActived.closest('.shipping__method') as HTMLElement;
                const value = shippingMethod.dataset.value;
                totalEles.forEach(item => {
                    item.innerText = `$${Number(subTotal) + Number(value)}`;
                });
            }
        }

        if (shippingMethodItems) {
            shippingMethodItems.forEach(item => {
                item.addEventListener('click', e => {
                    const target = e.target as HTMLElement;
                    const it = target.closest('.shipping__method') as HTMLElement;
                    const value = it.dataset.value;

                    if (shippingFeeElement) {
                        shippingFeeElement.forEach(element => {
                            element.innerText = `$${value}`;
                        });
                    }

                    if (totalEles) {
                        totalEles.forEach(item => {
                            item.innerText = `$${Number(subTotal) + Number(value)}`;
                        });
                    }
                })
            });
        }

        // show - hide summary
        const toggleSummaryBtn = document.querySelector('.toggle__respon__box') as HTMLButtonElement;
        const summaryElement = document.querySelector('.respon__checkout__box--inner') as HTMLElement;
        if (toggleSummaryBtn && summaryElement) {
            toggleSummaryBtn.addEventListener('click', e => {
                this.toggleModal(summaryElement);
            });
        }
    }
    handleUserWidget () {
        // handle render user widget
        const userDropdown = document.querySelector('.dropdown__list--user') as HTMLElement;

        const userOptions = {
            guest: [
                {
                    name: 'Login',
                    link: '/login'
                },
                {
                    name: 'Sign up',
                    link: '/signup'
                },
                {
                    name: 'Forgot password',
                    link: '/forgot-password'
                }
            ],
            user: [
                {
                    name: 'My Account',
                    link: `/user/account-detail/${this.userLoginInfo._id}`
                },
                {
                    name: 'Order History',
                    link: `/user/account-detail/order-history/${this.userLoginInfo._id}`
                },
                {
                    name: 'Forgot Password',
                    link: '/forgot-password',
                },
                {
                    name: 'Logout',
                    link: '',
                    handler: "logout"
                },
            ]
        }

        interface UserOption {
            name: string;
            link: string;
            handler?: string;
        }

        const renderOption = (options: UserOption[]) => {
            if (options) {
                const html = options.map(option => {
                    return `
                            <div class="dropdown__list__item">
                                <a href="${option.link}" data-handler="${option?.handler}" class="dropdown__list__link width-max body-small fw-smb text display-block p12 tac ttc">${option.name}</a>
                            </div>
                        `
                })

                return html.join('');
            }
        }

        const userLoginInfo = JSON.parse(localStorage.getItem('userLogin') as string)?.userLogin || null;

        if (userLoginInfo) {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner') as HTMLElement;
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                const userOptionHtml = renderOption(userOptions.user) || '';
                userDropDownInner.insertAdjacentHTML('afterbegin', userOptionHtml);
            }
        } else {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner') as HTMLElement;
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                const guestOptionHtml = renderOption(userOptions.guest) || '';
                userDropDownInner.insertAdjacentHTML('afterbegin', guestOptionHtml);
            }
        }

        // handle show hide user widget
        const userBtn = document.querySelector('.user-btn');

        if (userBtn) {
            userBtn.addEventListener('click', e => {
                e.stopPropagation();

                this.toggleModal(userDropdown);
            });
        }

        // handle user logout

        const logout = () => {
            localStorage.removeItem('userLogin');
            window.location.href = '/';
        }

        const logoutBtns = document.querySelectorAll('[data-handler="logout"]');

        if (logoutBtns) {
            logoutBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    logout();
                })
            });
        }

        // handle link clicking
        document.querySelectorAll('.dropdown__list__link').forEach(link => {
            link.addEventListener('click', e => {
                e.stopPropagation();
            });
        });
    }
    renderUserSidebar () {
        const html = `
            <div class="user__sidebar__inner">
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/${ this.userLoginInfo._id }" class="user__sidebar__link text label-medium fw-bold">Account Details</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/order-history/${ this.userLoginInfo._id }"
                        class="user__sidebar__link text label-medium fw-bold">Order History</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/password/${ this.userLoginInfo._id }" class="user__sidebar__link text label-medium fw-bold">Password</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/addresses/${ this.userLoginInfo._id }" class="user__sidebar__link text label-medium fw-bold">Addresses</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/forgot-password/${ this.userLoginInfo._id }" class="user__sidebar__link text label-medium fw-bold">Forgot password</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="#" data-handler="logout" class="user__sidebar__link text label-medium fw-bold">Log
                        Out</a>
                </div>
            </div>
        `;

        const userSidebar = document.querySelector('.user__sidebar') as HTMLElement;
        if (userSidebar) {
            userSidebar.innerHTML = '';
            userSidebar.insertAdjacentHTML('afterbegin', html);
        }
    }
    async searchProduct (query: string) {
        const api = `${productsEndpoint}?keyword=${query}`;
        const searchResult = await getData(api);
        return searchResult;
    }
    renderSearchProduct(products: Product[], container: HTMLElement) {
        if (products) {
            const html = products.map(p => {
                const { _id, title, price, background: { main } } = p;

                return `
                    <!-- single search item start -->
                    <div class="search__result__item col l-12 m-12 c-12 por">
                        <a href="/singleProduct/${_id}" class="search__result__item__link abs-full text title-small fw-bold"></a>
                        <div class="search__result__item__inner p12 row">
                            <div class="search__result__item__banner col l-1 m-1 c-1 por pt-10">
                                <div class="banner-cover abs-full" style="background-image: url('/uploads/${main}')"></div>
                            </div>
                            <div class="search__result__item__info col l-11 m-11 c-11">
                                <a href="#" class="search__result__item__link text title-small fw-bold">${title}</a>
                                <div class="search__result__item__price body-medium fw-light">$${price}</div>
                            </div>
                        </div>
                    </div>
                    <!-- single search item end -->
                `
            })
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('afterbegin', html.join(''));
            }
        }
    }
    selectBoxHandler(wrapperSelector: string, optionSelector: string, activeOptionSelector: string, changeTargetSelector: string) {
        // loop through options with optionSelector and change target text, using wrapperSelector to select change target correctly
        // const wrapper = document.querySelector(wrapperSelector);
        // const optionList = document.querySelectorAll(optionSelector);
        // if (!optionList) {
        //     throw new Error('Option list is not available in DOM')
        // } else {
        //     optionList.forEach(option => {
        //         option.addEventListener('click', (e) => {
        //             e.preventDefault();
        //             // console.log(option.parentElement.parentElement)
        //             if (option.parentElement.parentElement.querySelector(`${optionSelector}.${activeOptionSelector}`)) {
        //                 option.parentElement.parentElement
        //                     .querySelector(`${optionSelector}.${activeOptionSelector}`)
        //                     .classList.remove(activeOptionSelector)
        //             }
        //             option.classList.toggle(activeOptionSelector);
        //             const changeTarget = wrapper.querySelector(changeTargetSelector)
        //             if (changeTarget) {
        //                 changeTarget.innerText = option.innerText;
        //             } else {
        //                 throw new Error('Your change target is not available')
        //             }
        //         })
        //     });
        // }
    }
    toggleFloatBox(...classNames: string[]) {
        classNames.forEach(className => {
            const target = document.querySelector(className)
            if (target) {
                target.classList.toggle('is-visible');
            }
        });
    }
    initializeCustomRadioCheckboxes(containerSelector: string, inputSelector: string) {
        try {
            const containers = document.querySelectorAll(containerSelector);

            if (containers) {
                containers.forEach(container => {
                    const inputs = Array.from(container.querySelectorAll(inputSelector)) as HTMLInputElement[];

                    if (!inputs.length) {
                        throw new Error(`No elements found with the selector '${inputSelector}' inside the container element`);
                    }

                    inputs.forEach(input => {
                        const method = input.closest(containerSelector);

                        if (!method) {
                            throw new Error(`The container element for the input '${inputSelector}' was not found`);
                        }

                        method.addEventListener('click', () => {
                            inputs.forEach(input => {
                                input.checked = false;
                            });

                            input.checked = true;

                            containers.forEach(container => {
                                container.classList.remove('checked');
                            });

                            method.classList.add('checked');
                        });
                    });
                });
            }
        } catch (error) {
            console.error('An error occurred while initializing custom radio checkboxes:', error);
        }
    }
    openModal(modal: HTMLElement, overlay?: HTMLElement) {
        modal.classList.add('active');

        if (overlay) {
            modal.classList.add('active');
        }
    }
    closeModal(modal: HTMLElement, overlay?: HTMLElement) {
        modal.classList.remove('active');
        if (overlay) {
            modal.classList.remove('active');
        }
    }
    show(element: HTMLElement) {
        element.classList.remove('display-none');
    }
    hide(element: HTMLElement) {
        element.classList.add('display-none');
    }
    toggleModal(modal: HTMLElement) {
        modal.classList.toggle('show');
    }
    renderGeneralProduct (products: Product[], container: HTMLElement, alternative = '') {
        let html = '';
        if (products && products.length > 0) {
            html = products.map(product => {
                return `
                    <!-- single product card start -->
                    <div class="product primary__product col l-3 m-4 c-12 flex-center mt30" data-id="${product._id}">
                        <a href="/singleProduct/${product._id}" class="product__link width-full">
                            <div class="product__inner flex-column flex-full height-full">
                                <div class="product__banner__wrapper por oh">
                                    <div class="product__banner banner-contain poa" style="background-image: url('/uploads/${product.background.main}"></div>
                                    <div class="product__banner product__banner--sub__banner banner-contain poa" style="background-image: url('/uploads/${product.background.sub}')"></div>
                                    <button class="add-cart-btn hover btn primary-fill-btn width-full poa" style="max-width: none;" data-id="${product._id}" data-name="${product.title}" data-price="${product.price}" data-img="${product.background.main}" data-id-category="${product.idCategory._id}"><i class="fa fa-plus"></i> Add to cart</button>
                                </div>
                                <div class="product__info">
                                    <div class="product__name ttu tal label-medium fw-bold mt6 text">${product.title}</div>
                                    <div class="product__price tal body-small mt6 text primary-text">$${product.price}</div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <!-- single product card end -->
            `
            }).join(' ');
        } else {
            html = alternative;
        }

        if (container) {
            container.innerHTML = '';
            container.insertAdjacentHTML('afterbegin', html);
        }
    }
    renderCategory (categories: Category[], container: HTMLElement) {
        let html = '';
        if (categories) {
            html = categories.map(category => {
                return `
                    <!-- single item start -->
                    <div class="category__item col carousel-cell l-2" data-id="${category._id}">
                        <a href="/shop/category/${category._id}" class="category__link">
                            <div class="category__item__banner__wrapper por">
                                <div class="category__item__banner banner-cover poa" style="background-image: url('/assets/image/categories/${category.banner}');"></div>
                            </div>
                            <h5 class="category__item__name label-medium ttc tac mt12">${category.name}</h5>
                        </a>
                    </div>
                    <!-- single item end -->
                `
            }).join('');
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('afterbegin', html);
            }
        }
    }
    renderCategoryProduct (products: Product[], categoryId: string, container: HTMLElement) {
        let html = '';
        html = products.map(product => {
            if (product.idCategory._id == categoryId) {
                html += `
                    <!-- single product card start -->
                    <div class="product primary__product col l-3 m-4 c-12 flex-center mt30" data-id="${product._id}">
                        <a href="/singleProduct/${product._id}" class="product__link width-full">
                            <div class="product__inner flex-column flex-full height-full">
                                <div class="product__banner__wrapper por oh">
                                    <div class="product__banner banner-contain poa" style="background-image: url('/assets/image/products/${product.background.main}"></div>
                                    <div class="product__banner product__banner--sub__banner banner-contain poa" style="background-image: url('/assets/image/products/${product.background.sub}')"></div>
                                    <button class="add-cart-btn hover btn primary-fill-btn width-full poa" style="max-width: none;" data-id="${product._id}" data-name="${product.title}" data-price="${product.price}" data-img="${product.background.main}" data-id-category="${product.idCategory._id}"><i class="fa fa-plus"></i> Add to cart</button>
                                </div>
                                <div class="product__info">
                                    <div class="product__name ttu tal label-medium fw-bold mt6 text">${product.title}</div>
                                    <div class="product__price tal body-small mt6 text primary-text">$${product.price}</div>
                                </div>
                            </div>
                        </a>
                    </div>
                    <!-- single product card end -->
                    `
                }
            }).join('');
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('afterbegin', html);
            }
    }
    handleToastMessage (type: string, message: string = type, duration: number = 2) {
        const toast = `
        <div class="toast-message toast-message--${type}" style="animation: toastMessage ${duration}s forwards;">
            <div class="toast-message__inner flex g20 p20 v-center">
                <div class="toast-message__icon">
                    <i class="fal fa-check-circle"></i>
                </div>
                <div class="toast-message__text body-large fw-medium">${message}</div>
            </div>
        </div> 
        `

        const toastContainer = document.querySelector('.toast-message__container') as HTMLElement;

        if (toastContainer) {
            toastContainer.insertAdjacentHTML('beforeend', toast);

            setTimeout(() => {
                const toastMessage = document.querySelector('.toast-message') as HTMLElement;
                if (toastMessage) {
                    toastMessage.remove();
                }
            }, duration * 1000);
        }
    }
};

const app = new App();
export default app;