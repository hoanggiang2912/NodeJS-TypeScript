export const categoriesEndpoint = 'http://127.0.0.1:3000/api/v1/categories';
export const productsEndpoint = 'http://127.0.0.1:3000/api/v1/products';
export const createStorage = (key) => {
    const store = JSON.parse(localStorage.getItem(key)) ?? {};
    const save = () => {
        localStorage.setItem(key, JSON.stringify(store));
    };
    const storage = {
        get(key) {
            return store[key];
        },
        set(key, val) {
            store[key] = val;
            save();
        },
        remove(key) {
            delete store[key];
            save();
        }
    };
    return storage;
};
export async function getJSON(url, errorMsg = "Something went wrong!") {
    return fetch(url)
        .then(response => {
        if (!response.ok)
            throw new Error(`${errorMsg} (${response.status})`);
        return response.json();
    });
}
export async function getData(url, limit = 0) {
    try {
        const data = await getJSON(url);
        if (limit)
            return data.slice(0, limit);
        return data;
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
export const checkToken = async (token) => {
    const res = await fetch(`/api/v1/auth/check-token`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res;
};
export const getNewToken = async (refreshToken) => {
    const refreshRes = await fetch(`/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    });
    return refreshRes;
};
class Cart {
    cart = JSON.parse(localStorage.getItem('userCart'))?.userCart || [];
    storage;
    constructor() {
        this.storage = createStorage('userCart');
        this.renderUI();
    }
    async addProduct(btn, cart, storage = this.storage) {
        const _id = btn.dataset.id;
        const title = btn.dataset.name;
        const price = Number(btn.dataset.price);
        const promotion = Number(btn.dataset.promotion);
        const image = btn.dataset.img;
        const idCategory = btn.dataset.idCategory;
        const qty = Number(btn.dataset.qty) || 1;
        const categoriesAPI = `${categoriesEndpoint}/${idCategory}`;
        const category = await getData(categoriesAPI);
        const { name: categoryName } = category;
        const product = {
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
        if (!this.cart.some(product => product._id === _id)) {
            this.cart.push(product);
            storage.set("userCart", this.cart);
        }
        else {
            this.cart.filter(product => product._id === _id)[0].qty++;
            storage.set("userCart", this.cart);
        }
        this.renderUI();
    }
    calcSubtotal(discount = 0) {
        const subTotal = document.querySelector('.cart__subtotal');
        if (subTotal) {
            discount !== 0
                ? subTotal.innerText = `$${this.cart.reduce((acc, item) => acc += Number(item.price * item.qty), 0) - discount}`
                : subTotal.innerText = `$${this.cart.reduce((acc, item) => acc += Number(item.price * item.qty), 0)}`;
        }
    }
    cartQty() {
        const cartAmount = Array.from(document.querySelectorAll('.cart__amount'));
        if (cartAmount) {
            cartAmount.forEach(item => {
                if (this.cart.length === 0) {
                    item.innerText = '';
                }
                else {
                    item.innerText = this.cart.length.toString();
                }
            });
        }
        const itemsAmount = document.querySelector('.item__amount');
        const productAmount = this.cart.reduce((a, c) => a + Number(c.qty), 0);
        if (itemsAmount)
            itemsAmount.innerText = `Tạm tính (${productAmount} ${productAmount > 1 ? 'sản phẩm' : 'sản phẩm'})`;
    }
    renderUI() {
        this.renderCartProduct();
        this.cartQty();
        this.calcSubtotal();
    }
    renderCartProduct() {
        const cartProductContainer = document.querySelector('.cart__product__wrapper');
        let html = '';
        if (this.cart.length > 0) {
            this.cart.forEach((product, index) => {
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
                `;
            });
        }
        else {
            html = `
            <div class="tac sub-font">
                <h4 class="title-medium fw-bold">Your cart is empty!</h4>
            </div>
            `;
        }
        if (cartProductContainer) {
            cartProductContainer.innerHTML = '';
            cartProductContainer.insertAdjacentHTML('afterbegin', html);
            const removeBtns = Array.from(document.querySelectorAll('.cart__product__remove-btn'));
            removeBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    const dataIndex = Number(btn.dataset.index);
                    this.cart.splice(dataIndex, 1);
                    this.storage.set("userCart", this.cart);
                    this.renderUI();
                    this.calcSubtotal();
                });
            });
            const plusBtn = Array.from(document.querySelectorAll('.qty-form .plus-btn'));
            const minusBtn = Array.from(document.querySelectorAll('.qty-form .minus-btn'));
            const qtyInput = document.querySelector('.qty-input');
            const subtotalItem = document.querySelector('.item__amount');
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
                });
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
                    }
                    else {
                        this.cart.filter(item => item._id === dataId)[0].qty = 1;
                        this.storage.set('userCart', this.cart);
                        this.renderCartProduct();
                        this.calcSubtotal();
                    }
                });
            });
            if (qtyInput) {
                qtyInput.addEventListener('change', _ => {
                    if (qtyInput.value <= '1') {
                        qtyInput.value = '1';
                    }
                });
            }
        }
    }
}
export class App {
    cart;
    userStorage;
    userLoginInfo;
    constructor() {
        this.cart = new Cart();
        this.userStorage = createStorage('userLogin');
        this.userLoginInfo = JSON.parse(localStorage.getItem('userLogin'))?.userLogin || {};
        this.eventsHandler();
        this.handleUserWidget();
        this.renderUserSidebar();
    }
    eventsHandler() {
        const openSearchBoxBtn = document.querySelector('.open-searchbox');
        const closeSearchBoxBtn = document.querySelector('.close-searchbox');
        const searchBox = document.querySelector('.header__search-box');
        const searchInput = document.querySelector('.search__popdown__input');
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
        let timeoutId = null;
        if (searchInput) {
            searchInput.addEventListener('input', async () => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                let searchResult = [];
                timeoutId = setTimeout(async () => {
                    if (searchInput.value !== '') {
                        searchResult = await this.searchProduct(searchInput.value);
                        const searchResultContainer = document.querySelector('.search__result__wrapper');
                        if (searchResultContainer) {
                            if (searchInput.value) {
                                this.renderSearchProduct(searchResult, searchResultContainer);
                            }
                            else {
                                searchResultContainer.innerHTML = '';
                            }
                        }
                    }
                }, 500);
            });
        }
        const addCartBtns = [...document.querySelectorAll('.add-cart-btn')];
        if (addCartBtns) {
            addCartBtns.forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    await this.cart.addProduct(btn, this.cart.cart);
                });
            });
        }
        const url = '/checkout';
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', e => {
                e.preventDefault();
                if (this.cart.cart.length > 0) {
                    window.location.href = url;
                }
                else {
                }
            });
        }
        const categoryOptions = [...document.querySelectorAll('#shop__filter--category option')];
        if (categoryOptions) {
            categoryOptions.forEach(option => {
                option.addEventListener('click', async () => {
                    if (option.value != '0') {
                        const idCategory = option.value;
                        const categoryProducts = await getData(`${productsEndpoint}/category/${idCategory}`);
                        this.renderGeneralProduct(categoryProducts, document.querySelector('.product__wrapper'), '<p class="title-medium fw-bold neutral-text40">This category is now empty! We will update soon!</p>');
                        document.querySelector('.result__amount').innerText = `${categoryProducts.length} ${categoryProducts.length >
                            1 ? 'results' : 'result'}`;
                    }
                    else {
                        const products = await getData(productsEndpoint);
                        this.renderGeneralProduct(products, document.querySelector('.product__wrapper'), '<p class="title-medium fw-bold neutral-text40">This category is now empty! We will update soon!</p>');
                    }
                });
            });
        }
        const toggleCartBoxBtn = [...document.querySelectorAll('.toggle-cart-btn')];
        if (toggleCartBoxBtn) {
            toggleCartBoxBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.toggleFloatBox('.header__cart-box', '.header__cart__inner');
                });
            });
        }
        const cartBox = document.querySelector('.header__cart-box');
        if (cartBox) {
            cartBox.addEventListener('click', (event) => {
                if (event.target === cartBox) {
                    this.toggleFloatBox('.header__cart-box', '.header__cart__inner');
                }
            });
        }
        const products = [...document.querySelectorAll('.product')];
        if (products) {
            products.forEach(product => {
                product.addEventListener('click', async (e) => {
                    const productId = product.querySelector('.add-cart-btn')?.dataset.id;
                    if (productId) {
                        const productAPI = `${productsEndpoint}/${productId}/views`;
                        const product = await getData(`${productsEndpoint}/${productId}`);
                        let currentViews = product?.viewed;
                        const updatedViews = +currentViews + Math.floor(((Math.random() + 1) * 10));
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
                });
            });
        }
        const passwordBtn = document.querySelector('.toggle-password');
        if (passwordBtn) {
            passwordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = e.target;
                const btn = target.closest('.toggle-password');
                const passwordInput = btn.parentElement?.querySelector('.password__input');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                }
                else {
                    passwordInput.type = 'password';
                }
            });
        }
        const checkboxWrapper = document.querySelector('.custom__checkbox__wrapper');
        const checkboxInput = document.querySelector('#contactCheckbox');
        const customCheckbox = document.querySelector('.custom__checkbox');
        const customCheckboxLabel = document.querySelector('.custom__checkbox__label');
        if (checkboxInput && checkboxWrapper && customCheckbox && customCheckboxLabel) {
            const checkboxHandler = () => {
                checkboxInput.checked = !checkboxInput.checked;
                customCheckbox.classList.toggle('checked');
            };
            customCheckboxLabel.style.userSelect = 'none';
            customCheckboxLabel.addEventListener('click', () => {
                checkboxHandler();
            });
            checkboxWrapper.addEventListener('click', () => {
                checkboxHandler();
            });
            checkboxInput.addEventListener('change', () => {
                customCheckbox.classList.toggle('checked', checkboxInput.checked);
            });
        }
        this.initializeCustomRadioCheckboxes('.shipping__method', 'input[type="radio"]');
        const shippingMethodItems = [...document.querySelectorAll('.shipping__method')];
        const shippingFeeElement = [...document.querySelectorAll('.shipping__fee')];
        const shippingMethodActived = document.querySelector('.shipping__method input[type="radio"]:checked');
        const shippingInputs = [...document.querySelectorAll('.shipping__method input[name="shippingMethod"]')];
        const totalEles = [...document.querySelectorAll('.total')];
        const userCart = JSON.parse(localStorage.getItem('userCart'))?.userCart || [];
        const subTotal = userCart.reduce((a, c) => a + Number(c.price * c.qty), 0);
        if (shippingMethodActived) {
            shippingFeeElement.forEach(ele => {
                const shippingMethod = shippingMethodActived.closest('.shipping__method');
                ele.innerText = `$${shippingMethod.dataset.value}`;
            });
            if (totalEles) {
                const shippingMethod = shippingMethodActived.closest('.shipping__method');
                const value = shippingMethod.dataset.value;
                totalEles.forEach(item => {
                    item.innerText = `$${Number(subTotal) + Number(value)}`;
                });
            }
        }
        if (shippingMethodItems) {
            shippingMethodItems.forEach(item => {
                item.addEventListener('click', e => {
                    const target = e.target;
                    const it = target.closest('.shipping__method');
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
                });
            });
        }
        const toggleSummaryBtn = document.querySelector('.toggle__respon__box');
        const summaryElement = document.querySelector('.respon__checkout__box--inner');
        if (toggleSummaryBtn && summaryElement) {
            toggleSummaryBtn.addEventListener('click', e => {
                this.toggleModal(summaryElement);
            });
        }
    }
    handleUserWidget() {
        const userDropdown = document.querySelector('.dropdown__list--user');
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
        };
        const renderOption = (options) => {
            if (options) {
                const html = options.map(option => {
                    return `
                            <div class="dropdown__list__item">
                                <a href="${option.link}" data-handler="${option?.handler}" class="dropdown__list__link width-max body-small fw-smb text display-block p12 tac ttc">${option.name}</a>
                            </div>
                        `;
                });
                return html.join('');
            }
        };
        const userLoginInfo = JSON.parse(localStorage.getItem('userLogin'))?.userLogin || null;
        if (userLoginInfo) {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner');
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                const userOptionHtml = renderOption(userOptions.user) || '';
                userDropDownInner.insertAdjacentHTML('afterbegin', userOptionHtml);
            }
        }
        else {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner');
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                const guestOptionHtml = renderOption(userOptions.guest) || '';
                userDropDownInner.insertAdjacentHTML('afterbegin', guestOptionHtml);
            }
        }
        const userBtn = document.querySelector('.user-btn');
        if (userBtn) {
            userBtn.addEventListener('click', e => {
                e.stopPropagation();
                this.toggleModal(userDropdown);
            });
        }
        const logout = () => {
            localStorage.removeItem('userLogin');
            window.location.href = '/';
        };
        const logoutBtns = document.querySelectorAll('[data-handler="logout"]');
        if (logoutBtns) {
            logoutBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    logout();
                });
            });
        }
        document.querySelectorAll('.dropdown__list__link').forEach(link => {
            link.addEventListener('click', e => {
                e.stopPropagation();
            });
        });
    }
    renderUserSidebar() {
        const html = `
            <div class="user__sidebar__inner">
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/${this.userLoginInfo._id}" class="user__sidebar__link text label-medium fw-bold">Account Details</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/order-history/${this.userLoginInfo._id}"
                        class="user__sidebar__link text label-medium fw-bold">Order History</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/password/${this.userLoginInfo._id}" class="user__sidebar__link text label-medium fw-bold">Password</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/user/account-detail/addresses/${this.userLoginInfo._id}" class="user__sidebar__link text label-medium fw-bold">Addresses</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="/forgot-password/${this.userLoginInfo._id}" class="user__sidebar__link text label-medium fw-bold">Forgot password</a>
                </div>
                <div class="user__sidebar__item mt12">
                    <a href="#" data-handler="logout" class="user__sidebar__link text label-medium fw-bold">Log
                        Out</a>
                </div>
            </div>
        `;
        const userSidebar = document.querySelector('.user__sidebar');
        if (userSidebar) {
            userSidebar.innerHTML = '';
            userSidebar.insertAdjacentHTML('afterbegin', html);
        }
    }
    async searchProduct(query) {
        const api = `${productsEndpoint}?keyword=${query}`;
        const searchResult = await getData(api);
        return searchResult;
    }
    renderSearchProduct(products, container) {
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
                `;
            });
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('afterbegin', html.join(''));
            }
        }
    }
    selectBoxHandler(wrapperSelector, optionSelector, activeOptionSelector, changeTargetSelector) {
    }
    toggleFloatBox(...classNames) {
        classNames.forEach(className => {
            const target = document.querySelector(className);
            if (target) {
                target.classList.toggle('is-visible');
            }
        });
    }
    initializeCustomRadioCheckboxes(containerSelector, inputSelector) {
        try {
            const containers = document.querySelectorAll(containerSelector);
            if (containers) {
                containers.forEach(container => {
                    const inputs = Array.from(container.querySelectorAll(inputSelector));
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
        }
        catch (error) {
            console.error('An error occurred while initializing custom radio checkboxes:', error);
        }
    }
    openModal(modal, overlay) {
        modal.classList.add('active');
        if (overlay) {
            modal.classList.add('active');
        }
    }
    closeModal(modal, overlay) {
        modal.classList.remove('active');
        if (overlay) {
            modal.classList.remove('active');
        }
    }
    show(element) {
        element.classList.remove('display-none');
    }
    hide(element) {
        element.classList.add('display-none');
    }
    toggleModal(modal) {
        modal.classList.toggle('show');
    }
    renderGeneralProduct(products, container, alternative = '') {
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
            `;
            }).join(' ');
        }
        else {
            html = alternative;
        }
        if (container) {
            container.innerHTML = '';
            container.insertAdjacentHTML('afterbegin', html);
        }
    }
    renderCategory(categories, container) {
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
                `;
            }).join('');
            if (container) {
                container.innerHTML = '';
                container.insertAdjacentHTML('afterbegin', html);
            }
        }
    }
    renderCategoryProduct(products, categoryId, container) {
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
                    `;
            }
        }).join('');
        if (container) {
            container.innerHTML = '';
            container.insertAdjacentHTML('afterbegin', html);
        }
    }
    handleToastMessage(type, message = type, duration = 2) {
        const toast = `
        <div class="toast-message toast-message--${type}" style="animation: toastMessage ${duration}s forwards;">
            <div class="toast-message__inner flex g20 p20 v-center">
                <div class="toast-message__icon">
                    <i class="fal fa-check-circle"></i>
                </div>
                <div class="toast-message__text body-large fw-medium">${message}</div>
            </div>
        </div> 
        `;
        const toastContainer = document.querySelector('.toast-message__container');
        if (toastContainer) {
            toastContainer.insertAdjacentHTML('beforeend', toast);
            setTimeout(() => {
                const toastMessage = document.querySelector('.toast-message');
                if (toastMessage) {
                    toastMessage.remove();
                }
            }, duration * 1000);
        }
    }
}
;
const app = new App();
export default app;
