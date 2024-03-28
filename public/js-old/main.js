

export const createStorage = key => {
    const store = JSON.parse(localStorage.getItem(key)) ?? {};

    const save = () => {
        localStorage.setItem(key, JSON.stringify(store));
    }

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
}

export const renderGeneralProduct = async (products, container, alternative = '') => {
    let html = '';
    if (products && products.length > 0) {
        await products.forEach(product => {
            html += `
                    <!-- single product card start -->
                    <div class="product primary__product col l-3 m-4 c-12 flex-center mt30" data-id="${product.id}">
                        <a href="" class="product__link width-full">
                            <div class="product__inner flex-column flex-full height-full">
                                <div class="product__banner__wrapper por oh">
                                    <div class="product__banner banner-contain poa" style="background-image: url('/src/assets/image/products/${product.background.main}"></div>
                                    <div class="product__banner product__banner--sub__banner banner-contain poa" style="background-image: url('/src/assets/image/products/${product.background.sub}')"></div>
                                    <button class="add-cart-btn hover btn primary-fill-btn width-full poa" style="max-width: none;" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}" data-img="${product.background.main}" data-id-category="${product.idCategory}"><i class="fa fa-plus"></i> Add to cart</button>
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
        });
    } else {
        html = alternative;
    }

    if (container) {
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', html);
    }
}
const renderCategory = async (categories, container) => {
    let html = '';
    if (categories) {
        await categories.forEach(category => {
            html += `
            <!-- single item start -->
            <div class="category__item col carousel-cell l-2" data-id="${category.id}">
                <a href="#" class="category__link">
                    <div class="category__item__banner__wrapper por">
                        <div class="category__item__banner banner-cover poa" style="background-image: url('/src/assets/image/categories/${category.banner}');"></div>
                    </div>
                    <h5 class="category__item__name label-medium ttc tac mt12">${category.name}</h5>
                </a>
            </div>
            <!-- single item end -->
        `
        });
        if (container) {
            container.innerHTML = '';
            container.insertAdjacentHTML('afterbegin', html);
        }
    }
}

export const renderCategoryProduct = async (products, categoryId, container) => {
    let html = '';
    await products.forEach(product => {
        if (product.idCategory == categoryId) {
            html += `
                <!-- single product card start -->
                <div class="product primary__product col l-3 m-4 c-12 flex-center mt30" data-id="${product.id}">
                    <a href="/src/template/singleProduct.html?idProduct=${product.id}" class="product__link width-full">
                        <div class="product__inner flex-column flex-full height-full">
                            <div class="product__banner__wrapper por oh">
                                <div class="product__banner banner-contain poa" style="background-image: url('/src/assets/image/products/${product.background.main}"></div>
                                <div class="product__banner product__banner--sub__banner banner-contain poa" style="background-image: url('/src/assets/image/products/${product.background.sub}')"></div>
                                <button class="add-cart-btn hover btn primary-fill-btn width-full poa" style="max-width: none;" data-id="${product.id}" data-name="${product.title}" data-price="${product.price}" data-img="${product.background.main}" data-category="${product.category}"><i class="fa fa-plus"></i> Add to cart</button>
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
    });
    if (container) {
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', html);
    }
}

export const getJSON = async (url, errorMsg = "Something went wrong!") => {
    return fetch(url)
            .then(response => {
                if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
                return response.json();
            });
};

export const getData = async (url, limit = 0) => {
    try {
        const data = await getJSON(url);

        if (limit) return data.slice(0, limit);

        return data;
    } catch (error) {
        console.log(error)
        return null;
    }
}

export const products = await getData('http://localhost:3000/Products');
// render products
const container = document.querySelector('.product__wrapper');
if (products, container) {
    await renderGeneralProduct(products, container);
};

// render categories
export const categories = await getData('http://localhost:3000/Categories');
const categoryContainer = document.querySelector('.category__wrapper');
if (categories, categoryContainer) {
    await renderCategory(categories, categoryContainer);
};

export const discountCode = await getData('http://localhost:3000/DiscountCode');


const query = location.search.slice(1).split('&');

const _get = {};

query.forEach(q => {
    const temp = q.split('=')
    _get[temp[0]] = temp[1]
});

const myApp = {
    cart: JSON.parse(localStorage.getItem('userCart'))?.userCart || [],
    storage: createStorage('userCart'),
    /** <------ function to listen event -------> */
    eventsHandler() {
        /** show / hide header search box */
        const openSearchBoxBtn = document.querySelector('.open-searchbox')
        const closeSearchBoxBtn = document.querySelector('.close-searchbox');
        if (openSearchBoxBtn && closeSearchBoxBtn) {
            openSearchBoxBtn.addEventListener('click', () => {
                this.toggleFloatBox('.header__search-box');
                openSearchBoxBtn.classList.add('display-none');
                closeSearchBoxBtn.classList.remove('display-none');
            })
            closeSearchBoxBtn.addEventListener('click', () => {
                this.toggleFloatBox('.header__search-box');
                openSearchBoxBtn.classList.remove('display-none');
                closeSearchBoxBtn.classList.add('display-none');
            })
        }
        /** show / hide cart popup */
        const toggleCartBoxBtn = document.querySelectorAll('.toggle-cart-btn')
        if (toggleCartBoxBtn) {
            toggleCartBoxBtn.forEach(btn => {
                btn.addEventListener('click', () => {
                    this.toggleFloatBox('.header__cart-box', '.header__cart__inner')
                })
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

        // toggle open header respon nav with hamburger button
        const hamburgerButton = document.querySelector('.hamburger-icon');
        if (hamburgerButton) {
            hamburgerButton.addEventListener('click', () => {
                const pusher = document.getElementById('mp-pusher');
                if (pusher.classList.contains('mp-pushed')) {
                    document.querySelectorAll('.under').forEach(item => {
                        item.style.zIndex = '-1';
                    })
                } else {
                    setTimeout(() => {
                        document.querySelectorAll('.under').forEach(item => {
                            item.style.zIndex = '1';
                        })
                    }, 500);
                }
                this.toggleFloatBox('.hamburger-icon', '.float-nav__content', '.float-nav__underlay');
            })
        }

        const floatNavUnderlay = document.querySelector('.float-nav__underlay');
        if (floatNavUnderlay) {
            floatNavUnderlay.addEventListener('click', (event) => {
                event.stopPropagation();
                this.toggleFloatBox('.hamburger-icon', '.float-nav__content', '.float-nav__underlay');
            });
        }
        
        // Get the motion reduce button
        const motionReduceBtn = document.querySelector('.motion-reduce-btn');

        // Get the video iframe
        const videoIframe = document.querySelector('.js-youtube');

        if (motionReduceBtn) {
            // Add click event to the motion reduce button
            motionReduceBtn.addEventListener('click', function () {
                // Play the video in the iframe
                videoIframe.src += "&autoplay=1";

                // Hide the motion reduce button and thumbnail
                motionReduceBtn.style.opacity = 0;
                motionReduceBtn.style.visisbility = 'hidden';

                document.querySelector('.introduction__video__thumbnail__wrapper').style.display = 'none';
            });
        }

        // toggle product option list by clicking product option button
        this.toggleClassBox('.product__option--btn', 'click', ['.option__list'], 'active');

        // handle product option change by clicking product option
        this.selectBoxHandler('.custom__select--product-type', '.option__link', 'current-choosed', '.option__text')

        // handle product size options
        const options = document.querySelectorAll('.productOptionSize')
        if (options) {
            options.forEach(option => {
                option.addEventListener('change', (e) => {
                    option.parentElement.parentElement.querySelector('.option__btn.current-choosed').classList.remove('current-choosed');
                    option.parentElement.classList.toggle('current-choosed')
                })
            });
        }

        // custom checkbox
        // Get the necessary DOM elements
        const checkboxWrapper = document.querySelector('.custom__checkbox__wrapper');
        const checkboxInput = document.querySelector('#contactCheckbox');
        const customCheckbox = document.querySelector('.custom__checkbox');
        const customCheckboxLabel = document.querySelector('.custom__checkbox__label');

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

        // Add to cart
        const addCartBtns = document.querySelectorAll('.add-cart-btn');

        addCartBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                e.preventDefault(); // prevent
                e.stopPropagation();

                this.addCart(btn, this.cart, this.storage);
            })
        });

        // discount handler
        const couponInput = document.querySelector('.coupon__input');
        const couponBtn = document.querySelector('.coupon-btn');

        if (couponBtn && couponInput) {
            couponBtn.addEventListener('click', e => {
                e.preventDefault();

                const couponCodes = discountCode.map(item => item.code);
                // console.log(value);
                if (couponCodes.includes(couponInput.value)) {
                    // console.log(couponInput.value);
                    // console.log(couponCodes.filter(item => couponInput.value == item.code));
                    const {value: discountValue} = discountCode.filter(item => item.code === couponInput.value)[0];
                    this.calcSubtotal(discountValue);
                    discountCode.splice(
                        discountCode.indexOf(discountCode.filter(item => item.code === couponInput.value)[0]),
                        1);
                } else {
                    console.log('your code is wrong');
                }
            })
        }

        // Initialize shipping method radio checkbox
        this.initializeCustomRadioCheckboxes('.shipping__method', 'input[type="radio"]');
        const shippingMethodItems = document.querySelectorAll('.shipping__method');
        const shippingFeeElement = document.querySelectorAll('.shipping__fee');
        const shippingMethodActived = document.querySelector('.shipping__method input[type="radio"]:checked');
        const shippingInputs = document.querySelectorAll('.shipping__method input[name="shippingMethod"]');

        const totalEles = document.querySelectorAll('.total');

        if (shippingMethodActived) {
            shippingFeeElement.forEach(ele => {
                ele.innerText = `$${shippingMethodActived.closest('.shipping__method').dataset.value}`;
            });
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
                    
                    const subTotal = this.cart.reduce((a, c) => a + Number(c.price * c.qty), 0);
                    
                    if (totalEles) {
                        totalEles.forEach(item => {
                            item.innerText = `$${Number(subTotal) + Number(value)}`;
                        });
                    }
                })
            });
        }

        // show - hide summary
        const toggleSummaryBtn = document.querySelector('.toggle__respon__box');
        const summaryElement = document.querySelector('.respon__checkout__box--inner');
        if (toggleSummaryBtn && summaryElement) {
            toggleSummaryBtn.addEventListener('click', e => {
                this.toggleModal(e, summaryElement);
            });
        }

        // show - hide admin sidebar
        const openSidebarBtn = document.querySelector('.open__sidebar__btn');
        const closeSidebarBtn = document.querySelector('.close__sidebar__btn');
        const sidebarOverlay = document.querySelector('.sidebar__overlay');
        const sidebarMobile = document.querySelector('.admin__sidebar--mobile');

        if (openSidebarBtn && closeSidebarBtn && sidebarMobile && sidebarOverlay) {
            openSidebarBtn.addEventListener('click', e => {
                this.openModal(e, sidebarMobile, sidebarOverlay);
            });
            closeSidebarBtn.addEventListener('click', e => {
                this.closeModal(sidebarMobile, sidebarOverlay);
            });
            sidebarOverlay.addEventListener('click', e => {
                this.closeModal(sidebarMobile, sidebarOverlay);
            });
        }

        // handle nav item active
        const navItems = document.querySelectorAll('.sidebar__item');
        if (navItems) {
            const dataPage = document.querySelector('html').dataset.pageId;
            navItems.forEach((item, index) => {
                if (index == dataPage) {
                    item.classList.add('active');
                }
            }); 
        }

        // handle category clicking to redirect
        const categories = document.querySelectorAll('.category__item');
        if (categories) {
            categories.forEach(category => {
                const categoryId = category.dataset.id;
                category.addEventListener('click', e => {
                    e.preventDefault();

                    window.location.href = `/src/template/category.html?id=${categoryId}`;
                })
            });
        }

        // handle product clicking to redirect
        const products = document.querySelectorAll('.product');
        if (products) {
            products.forEach(product => {
                const productId = product.dataset.id;
                product.addEventListener('click', e => {
                    e.preventDefault();
                    window.location.href = `/src/template/singleProduct.html?productId=${productId}`;
                })
            });
        }

        // checkout 
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', e => {
                e.preventDefault();
                window.location.href = '/src/template/checkout.html';

                const html = '';
            })
        }

        // form input ontyping handler
        const inputs = document.querySelectorAll('.form--user__info .form__input');
        if (inputs) {
            inputs.forEach(input => {
                input.addEventListener('input', e => {
                    input.parentElement.querySelector('.form__group__title').classList.add('show');
                });
                input.addEventListener('blur', e => {
                    if (!input.value) {
                        input.parentElement.querySelector('.form__group__title').classList.remove('show');
                    }
                });
            });
        }

        // handle product search
        const searchInput = document.querySelector('.search__popdown__input');
        const searchResultContainer = document.querySelector('.search__result__wrapper');   

        if (searchInput) {
            searchInput.addEventListener('input', e => {
                const query = e.target.value;
                if (query) {
                    const searchResult = this.searchProduct(query);
                    this.renderSearchProduct(searchResult, searchResultContainer);
                } else {
                    searchResultContainer.innerHTML = '';
                }
            })
        }
    },
    handleUserWidget() {
        // handle render user widget
        const userDropdown = document.querySelector('.dropdown__list--user');

        const userOptions = {
            guest: [
                {
                    name: 'Login',
                    link: '/src/template/login.html'
                },
                {
                    name: 'Sign up',
                    link: '/src/template/signup.html'
                }
            ],
            user: [
                {
                    name: 'My Account',
                    link: '/src/template/user_accountDetail.html'
                },
                {
                    name: 'Order History',
                    link: '/src/template/user_order.html'
                },
                {
                    name: 'Logout',
                    link: '',
                    handler: "logout"
                }
            ]
        }

        const renderOption = options => {
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

        const userLoginInfo = JSON.parse(localStorage.getItem('userLogin'))?.userLogin || null;

        if (userLoginInfo) {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner');
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                userDropDownInner.insertAdjacentHTML('afterbegin', renderOption(userOptions.user));
            }
        } else {
            const userDropDownInner = document.querySelector('.dropdown__list--user .dropdown__list__inner');
            if (userDropDownInner) {
                userDropDownInner.innerHTML = '';
                userDropDownInner.insertAdjacentHTML('afterbegin', renderOption(userOptions.guest, userDropdown));
            }
        }

        // handle show hide user widget
        const userBtn = document.querySelector('.user-btn');

        if (userBtn) {
            userBtn.addEventListener('click', e => {
                e.stopPropagation();

                myApp.toggleModal(e, userDropdown);
            });
        }

        // handle user logout

        const logout = () => {
            localStorage.removeItem('userLogin');
            location.reload();
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
    },
    renderHeader () {
        const headerDesktopContainer = document.querySelector('.header.header__desktop');
        const headerMobileContainer = document.querySelector('.header.header__mobile');

        const headerDesktopContent = `
            <div class="header__inner por">
                <div class="header__bar header__desktop__bar header__bar--l">
                    <div class="header__logo flex-center">
                        <a href="../../index.html" class="header__link">
                            <img src="/src/assets/image/logo.svg" alt="equator logo" class="logo">
                        </a>
                    </div>
                </div>
                <div class="header__bar header__desktop__bar header__bar--c">
                    <nav class="header__menu flex-center">
                        <div class="header__menu__inner flex">
                            <div class="menu__item flex-center">
                                <a href="#" class="menu__link top-level__link ttu label-small fw-bold">shop</a>
                                <div class="header__dropdown__wrapper poa width-full">
                                    <div class="header__dropdown__inner p60 grid">
                                        <div class="row">
                                            <div class="header__dropdown__links">
                                                <div class="row flex-between">
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">coffee</a>
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">New arrivals</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Shop by roast</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Blends</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Single origins</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Espressos</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Chef collabs</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Decaf</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Cold brew</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Instant</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Espresso Pods</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Variety sets</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                    <div class="col col-4 link__item" style="transition-delay: .4s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">Subscribe</a>
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Subscription Coffees</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Curated blend</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Curated single origin</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Curated espresso</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Seasonal blend</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Manage my subscription</a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="col col-4 link__item" style="transition-delay: .5s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">Gifts</a>
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Gift Bundles</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Gifts Under $20</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Gift a Subscription</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Home brew equipment</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Drinkware</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Apparel & accessories</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Organic matcha</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Artisan teas</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Gift cards</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="header__dropdown__image--wrapper flex-full oh">
                                                <div class="banner-cover dropdown__banner" style="padding-top: 50%;background-image: url('/src/assets/image/banners/Subscribe_Save-Nav_1_900x.webp'); width: 100%; height: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="menu__item flex-center">
                                <a href="#" class="menu__link top-level__link ttu label-small fw-bold">visit cafes</a>
                                <div class="header__dropdown__wrapper poa width-full">
                                    <div class="header__dropdown__inner p60 grid">
                                        <div class="row g60">
                                            <div class="col col-6 header__dropdown__image--wrapper flex-full flex-column oh">
                                                <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">find a cafe</a>
                                                <div class="banner-cover dropdown__banner mt30" style="padding-top: 50%;background-image: url('/src/assets/image/banners/Mega_Menu_Visit_Us_900x.webp'); width: 100%; height: 100%;"></div>
                                            </div>
                                            <div class="col col-6 header__dropdown__links" style="padding-left: clamp(10rem, 6.429rem + 9.524vw, 15rem);">
                                                <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">Order ahead</a>
                                                <div class="row flex-between">
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Mill Valley</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Sausalito</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Proof Lab</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Larkspur</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Fort Mason</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Round House</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">SOMA</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Burlingame</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Lake Merritt</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Culver City</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Fairfax LA</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Laguna Beach</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="menu__item flex-center">
                                <a href="#" class="menu__link top-level__link ttu label-small fw-bold">wholesale</a>
                                <div class="header__dropdown__wrapper poa width-full">
                                    <div class="header__dropdown__inner p60 grid">
                                        <div class="row">
                                            <div class="header__dropdown__links" style="width: 30%; padding-left: clamp(8rem, 5.143rem + 7.619vw, 12rem);">
                                                <div class="row flex-between">
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">wholesale</a>
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Inquiries</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Wholesale login</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                </div>
                                            </div>
                                            <div class="header__dropdown__image--wrapper flex-full flex-column oh por">
                                                <div class="banner-cover dropdown__banner" style="padding-top: 30%;background-image: url('/src/assets/image/banners/nicola-parisi_equator-coffee_fall2019_1384_1.webp'); width: 100%; height: 100%;"></div>
                                                <div class="float-text poa" style="width: 200px; top: 55%; right: 25%; color: white; text-shadow: 0 0 0 2px #000">
                                                    <div class="body-large fw-bold">Need a coffe partner</div>
                                                    <div class="body-small fw-light">We'll work with you to create a customized program with best-in-class training & support.</div>
                                                </div>
                                                <a href="#" class="menu__link body-small fw-smb text pt12">Wholesale Inquiries</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="menu__item flex-center">
                                <a href="#" class="menu__link top-level__link ttu label-small fw-bold">Brew guides</a>
                                <div class="header__dropdown__wrapper poa width-full">
                                    <div class="header__dropdown__inner p60 grid">
                                        <div class="row">
                                            <div class="header__dropdown__links" style="width: 30%; padding-left: clamp(8rem, 5.143rem + 7.619vw, 12rem);">
                                                <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">Brew guides</a>
                                                <div class="row flex-between">
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Aeropress</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Chemex</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Clever</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Cold brew</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">French press</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Hario mizudashi</a></li>
                                                        </ul>
                                                    </div>
                                                    <div class="col col-4 link__item" style="transition-delay: .4s;">
                                                        <ul class="pb20">
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Hario V60</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Kalita wave</a></li>
                                                            <li><a href="#" class="menu__link body-small fw-smb text">Origami</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                </div>
                                            </div>
                                            <div class="header__dropdown__image--wrapper flex-full flex-column oh por">
                                                <div class="banner-cover dropdown__banner" style="padding-top: 30%;background-image: url('/src/assets/image/banners/Brew-Guides-Megamenu-Header_2_1296x.webp'); width: 100%; height: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="menu__item flex-center">
                                <a href="#" class="menu__link top-level__link ttu label-small fw-bold">about</a>
                                <div class="header__dropdown__wrapper poa width-full">
                                    <div class="header__dropdown__inner p60 grid">
                                        <div class="row">
                                            <div class="header__dropdown__links" style="width: 50%; padding-inline: clamp(8rem, 5.143rem + 7.619vw, 12rem);">
                                                <div class="row flex-between">
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">about</a>
                                                        <ul class="pb20">
                                                            <li><About href="#" class="menu__link body-small fw-smb text">About us</a></li>
                                                            <li><Careers href="#" class="menu__link body-small fw-smb text">Careers</a></li>
                                                            <li><FAQ href="#" class="menu__link body-small fw-smb text">FAQ</a></li>
                                                            <li><Impact href="#" class="menu__link body-small fw-smb text">Impact</a></li>
                                                            <li><Tiger href="#" class="menu__link body-small fw-smb text">Tiger collective</a></li>
                                                            <li><Women href="#" class="menu__link body-small fw-smb text">Women in coffee</a></li>
                                                            <li><Cafe href="#" class="menu__link body-small fw-smb text">Cafe rewards</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                    <!-- single children list start -->
                                                    <div class="col col-4 link__item" style="transition-delay: .3s;">
                                                        <a href="#" class="menu__link dropdown__link__title title-large fw-bold ttu text">blog</a>
                                                        <ul class="pb20">
                                                            <li><Cafe href="#" class="menu__link body-small fw-smb text">Cafe</a></li>
                                                            <li><Coffee href="#" class="menu__link body-small fw-smb text">Coffee education</a></li>
                                                            <li><Friends href="#" class="menu__link body-small fw-smb text">Friends of Equator</a></li>
                                                            <li><Origin href="#" class="menu__link body-small fw-smb text">Origin stories</a></li>
                                                        </ul>
                                                    </div>
                                                    <!-- single children list end -->
                                                </div>
                                            </div>
                                            <div class="header__dropdown__image--wrapper flex-full flex-column oh por">
                                                <div class="banner-cover dropdown__banner" style="padding-top: 50%;background-image: url('/src/assets/image/banners/She-Owns-Certified_1_900x.webp'); width: 100%; height: 100%;"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
                <div class="header__bar header__desktop__bar header__bar--l flex-full j-end v-center">
                    <div class="header__button__bar row">
                        <button class="icon-btn hover open-searchbox"><i class="far fa-search"></i></button>
                        <button class="icon-btn hover close-searchbox display-none"><i class="fas fa-times"></i></button>
                        <button class="icon-btn hover user-btn por">
                            <i class="far fa-user"></i>
                            <div class="poa t100-10 dropdown__list dropdown__list--user rounded-8 primary-bg box-shadow1">
                                <div class="dropdown__list__inner">
                                    <div class="dropdown__list__item">
                                        <a href="/src/template/login.html" class="dropdown__list__link width-max body-small fw-smb text display-block p12">Log in</a>
                                    </div>
                                    <div class="dropdown__list__item">
                                        <a href="/src/template/signup.html" class="dropdown__list__link width-max body-small fw-smb text display-block p12">Sign up</a>
                                    </div>
                                </div>
                            </div>
                        </button>
                        <button class="icon-btn hover toggle-cart-btn por">
                            <i class="far fa-shopping-cart"></i>
                            <span class="cart__amount poa label-medium"></span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        if (headerDesktopContainer) {
            headerDesktopContainer.innerHTML = '';
            headerDesktopContainer.innerHTML = headerDesktopContent;
        }
    },
    searchProduct (query) {
        const searchResult = products.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
        return searchResult;
    },
    renderSearchProduct (products, container) {
        if (products) {
            const html = products.map(p => {
                const {id, title, price, background: {main}} = p;
                
                return `
                    <!-- single search item start -->
                    <div class="search__result__item col l-12 m-12 c-12 por">
                        <a href="/src/template/singleProduct.html?productId=${id}" class="search__result__item__link abs-full text title-small fw-bold"></a>
                        <div class="search__result__item__inner p12 row">
                            <div class="search__result__item__banner col l-1 m-1 c-1 por pt-10">
                                <div class="banner-cover abs-full" style="background-image: url('/src/assets/image/products/${main}')"></div>
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
    },
    toggleFloatBox(...classNames) {
        classNames.forEach(className => {
            const target = document.querySelector(className)
            if (target) {
                target.classList.toggle('is-visible');
            }
        });
    },
    toggleClassBox(eventTargetSelector, eventName, classList = [], toggleClass) {
        const validEvents = ['click', 'mouseover', 'change'];
        const eventTarget = document.querySelector(eventTargetSelector);
        if (!eventTarget) {
            // console.error('Event target is not available');
            return;
        }

        if (!validEvents.includes(eventName)) {
            throw new Error('Invalid event name');
        }

        eventTarget.addEventListener(eventName, (e) => {
            e.preventDefault();
            if (!Array.isArray(classList)) {
                classList = [classList];
            }
            classList.forEach(className => {
                const element = document.querySelector(className);
                if (element) {
                    element.classList.toggle(toggleClass);
                }
            });
        });
    },
    selectBoxHandler(wrapperSelector, optionSelector, activeOptionSelector, changeTargetSelector) {
        // loop through options with optionSelector and change target text, using wrapperSelector to select change target correctly
        const wrapper = document.querySelector(wrapperSelector);
        const optionList = document.querySelectorAll(optionSelector);
        if (!optionList) {
            throw new Error('Option list is not available in DOM')
        } else {
            optionList.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    // console.log(option.parentElement.parentElement)
                    if (option.parentElement.parentElement.querySelector(`${optionSelector}.${activeOptionSelector}`)) {
                        option.parentElement.parentElement
                            .querySelector(`${optionSelector}.${activeOptionSelector}`)
                            .classList.remove(activeOptionSelector)
                    } 
                    option.classList.toggle(activeOptionSelector);
                    const changeTarget = wrapper.querySelector(changeTargetSelector)
                    if (changeTarget) {
                        changeTarget.innerText = option.innerText;
                    } else {
                        throw new Error('Your change target is not available')
                    }
                })
            });
        }
    },
    initializeSlider(selector, flickityOptions) {
        const screenWidth = window.innerWidth;
        const sliderElement = document.querySelector(selector);

        if (screenWidth < 767 && sliderElement) {
            // Initialize Flickity slider
            new Flickity(sliderElement, flickityOptions);
        }
    },
    calcSubtotal (discount = 0) {
        // subtotal element
        const subTotal = document.querySelector('.cart__subtotal');
        if (subTotal) {
            discount !== 0 
            ? subTotal.innerText = `$${this.cart.reduce((acc, item) => acc += Number(item.price * item.qty), 0) - discount}`
            : subTotal.innerText = `$${this.cart.reduce((acc, item) => acc += Number(item.price * item.qty), 0)}`
        }
    },
    cartQty () {
        const cartAmount = document.querySelectorAll('.cart__amount');

        if (cartAmount) {
            cartAmount.forEach(item => {
                if (this.cart.length === 0) {
                    item.innerText = '';
                } else {
                    item.innerText = this.cart.length;
                }
            });
        }

        const itemsAmount = document.querySelector('.item__amount');
        if (itemsAmount) itemsAmount.innerText = `Subtotal (${this.cart.reduce((a , c) => a + Number(c.qty), 0)} item)`;
    },
    renderProduct () {
        // cart product container
        const cartProductContainer = document.querySelector('.cart__product__wrapper');
        let html = '';

        if (this.cart.length > 0) {
            this.cart.forEach((product, index) => {
                const category = categories.filter(category => category.id == product.idCategory)[0].name;

                html += `
                    <!-- single cart product start -->
                    <div class="cart__product flex width-full pb12">
                        <div class="cart__product__banner">
                            <div class="banner-cover" style="background-image: url(/src/assets/image/products/${product.bg}); height: 100%"></div>
                        </div>
                        <div class="cart__product__info pl20 flex-column flex-full">
                            <div class="flex-between v-center">
                                <h4 class="title-small ttc">${product.title}</h4>
                                <button class="icon-btn cart__product__remove-btn" data-index="${index}"><i class="far fa-trash"></i></button>
                            </div>
                            <p class="body-small cart__product__category fw-light ttc">${category}</p>
                            <div class="flex-between v-center">
                                <form action="#" class="form qty-form flex-between v-center">
                                    <button data-id="${product.id}" class="icon-btn minus-btn"><i class="fas fa-minus"></i></button>
                                    <input type="number" class="qty-input tac" value="${product.qty}">
                                    <button data-id="${product.id}" class="icon-btn plus-btn"><i class="fas fa-plus"></i></button>
                                </form>
                                <div class="cart__product__price body-medium fw-light"">$${product.price}</div>
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
            cartProductContainer.insertAdjacentHTML('afterBegin', html);

            // remove product
            const removeBtns = document.querySelectorAll('.cart__product__remove-btn');

            removeBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataIndex = btn.dataset.index;

                    this.cart.splice(dataIndex, 1);
                    this.storage.set("userCart", this.cart);

                    this.renderUI();
                    this.calcSubtotal();
                })
            });

            // handle increase - decrease product quantity
            const plusBtn = document.querySelectorAll('.qty-form .plus-btn');
            const minusBtn = document.querySelectorAll('.qty-form .minus-btn');
            const qtyInput = document.querySelector('.qty-input');

            plusBtn.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataId = btn.dataset.id

                    this.cart.filter(item => item.id === dataId)[0].qty++;
                    this.storage.set('userCart', this.cart);
                    this.renderProduct();
                    this.calcSubtotal();
                })
            });

            minusBtn.forEach(btn => {
                btn.addEventListener('click', e => {
                    e.preventDefault();

                    const dataId = btn.dataset.id

                    if (qtyInput.value > 1) {
                        this.cart.filter(item => item.id === dataId)[0].qty--;
                        this.storage.set('userCart', this.cart);
                        this.renderProduct();
                        this.calcSubtotal();
                    } else {
                        this.cart.filter(item => item.id === dataId)[0].qty = 1
                        this.storage.set('userCart', this.cart);
                        this.renderProduct();
                        this.calcSubtotal();
                    }
                })
            });
        }
    },
    renderUI () {
        this.calcSubtotal();
        this.cartQty();
        this.renderProduct();
    },
    addCart(btn, cart, storage) {
        // get product infomation
        const id = btn.dataset.id;
        const title = btn.dataset.name;
        const price = btn.dataset.price;
        const bg = btn.dataset.img;
        const idCategory = btn.dataset.idCategory;
        const qty = btn.dataset.qty || 1;

        const product = {
            id,
            title,
            price,
            bg,
            idCategory,
            qty
        }
        // push product into cart array
        if (!cart.some(product => product.id === id)) {
            cart.push(product);
            storage.set("userCart", cart);
        } else {
            cart.filter(product => product.id === id)[0].qty++;
            storage.set("userCart", cart);
        }

        // update cart UI
        this.renderUI();
    },
    initializeCustomRadioCheckboxes(containerSelector, inputSelector) {
        try {
            const containers = document.querySelectorAll(containerSelector);

            if (containers) {
                containers.forEach(container => {
                    const inputs = container.querySelectorAll(inputSelector);

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
    },
    openModal (e, modal, overlay) {
        e.preventDefault();
        modal.classList.add('show');
        overlay.classList.add('show');
    },
    closeModal (modal, overlay) {
        modal.classList.remove('show');
        overlay.classList.remove('show');
    },
    toggleModal (e, modal) {
        e.preventDefault();
        modal.classList.toggle('show');
    },
    renderSidebar() {
        const sidebarDesktopContainer = document.querySelector('.admin__sidebar.admin__sidebar--desktop');
        const sidebarMobileContainer = document.querySelector('.admin__sidebar.admin__sidebar--mobile');

        // console.log(sidebarDesktopContainer, sidebarMobileContainer);
        const sidebarDesktop = `
        <div class="admin__sidebar__inner flex-column g60 pb60 flex-center">
            <button class="open__sidebar__btn hide-on-desktop hide-on-tablet por oh">
                <div class="btn__background banner-cover abs-full"></div>
                <i class="fa-solid fa-bars abs-center"></i>
            </button>
            <a href="index.html" class="logo__link hide-on-tablet hide-on-mobile">
                <img src="/src/assets/image/icon-logo.png" alt="Equator logo with icon" class="sidebar__logo" width="90px">
            </a>
            <nav class="sidebar__nav">
                <ul class="flex-column g30">
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.57399L12 2.57399L21 9.57399V20.574C21 21.1044 20.7893 21.6131 20.4142 21.9882C20.0391 22.3633 19.5304 22.574 19 22.574H5C4.46957 22.574 3.96086 22.3633 3.58579 21.9882C3.21071 21.6131 3 21.1044 3 20.574V9.57399Z" stroke="#232323" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22.574V12.574H15V22.574" stroke="#232323" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <a href="/src/template/admin_dashboard.html" data-page="0" class="sidebar__item__link hide-on-table hide-on-mobile text body-large fw-medium">Dashboard</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 8.57399V21.574H3V8.57399" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23 3.57399H1V8.57399H23V3.57399Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 12.574H14" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_product.html" data-page="1" class="sidebar__item__link hide-on-table hide-on-mobile text body-large fw-medium">Products</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 4.57399H18C18.5304 4.57399 19.0391 4.7847 19.4142 5.15978C19.7893 5.53485 20 6.04356 20 6.57399V20.574C20 21.1044 19.7893 21.6131 19.4142 21.9882C19.0391 22.3633 18.5304 22.574 18 22.574H6C5.46957 22.574 4.96086 22.3633 4.58579 21.9882C4.21071 21.6131 4 21.1044 4 20.574V6.57399C4 6.04356 4.21071 5.53485 4.58579 5.15978C4.96086 4.7847 5.46957 4.57399 6 4.57399H8" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 2.57399H9C8.44772 2.57399 8 3.02171 8 3.57399V5.57399C8 6.12627 8.44772 6.57399 9 6.57399H15C15.5523 6.57399 16 6.12627 16 5.57399V3.57399C16 3.02171 15.5523 2.57399 15 2.57399Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_category.html" data-page="2" class="sidebar__item__link hide-on-table hide-on-mobile text body-large fw-medium">Categories</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.21 16.464C20.5739 17.9685 19.5788 19.2942 18.3119 20.3253C17.045 21.3564 15.5448 22.0614 13.9425 22.3788C12.3401 22.6961 10.6845 22.6161 9.12018 22.1458C7.55591 21.6754 6.13066 20.8291 4.96906 19.6806C3.80745 18.5322 2.94485 17.1167 2.45667 15.5579C1.96849 13.9991 1.8696 12.3445 2.16863 10.7386C2.46767 9.13277 3.15553 7.62462 4.17208 6.34602C5.18863 5.06742 6.50292 4.05731 8.00004 3.40399" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 12.574C22 11.2608 21.7413 9.96041 21.2388 8.74716C20.7362 7.5339 19.9997 6.43151 19.0711 5.50292C18.1425 4.57434 17.0401 3.83774 15.8268 3.33519C14.6136 2.83265 13.3132 2.57399 12 2.57399V12.574H22Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_order.html" data-page="3" class="sidebar__item__link hide-on-table hide-on-mobile text body-large fw-medium">Orders</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="12" cy="9" r="3" stroke="#1C274C" stroke-width="2"/>
<path d="M17.9691 20C17.81 17.1085 16.9247 15 11.9999 15C7.07521 15 6.18991 17.1085 6.03076 20" stroke="#1C274C" stroke-width="2" stroke-linecap="round"/>
<path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#1C274C" stroke-width="2" stroke-linecap="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_user.html" data-page="4" class="sidebar__item__link hide-on-table hide-on-mobile text body-large fw-medium">Users</a>
                    </li>
                </ul>
            </nav>
        </div>
        `;
        const sidebarMobile = `
        <div class="admin__sidebar__inner flex-column g60 pb60 flex-center por">
            <button class="icon-btn close__sidebar__btn">
                <i class="fal fa-times"></i>
            </button>
            <a href="index.html" class="logo__link">
                <img src="/src/assets/image/icon-logo.png" alt="Equator logo with icon" class="sidebar__logo" width="90px">
            </a>
            <nav class="sidebar__nav">
                <ul class="flex-column g30">
                    <li class="sidebar__item active flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.57399L12 2.57399L21 9.57399V20.574C21 21.1044 20.7893 21.6131 20.4142 21.9882C20.0391 22.3633 19.5304 22.574 19 22.574H5C4.46957 22.574 3.96086 22.3633 3.58579 21.9882C3.21071 21.6131 3 21.1044 3 20.574V9.57399Z" stroke="#232323" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 22.574V12.574H15V22.574" stroke="#232323" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <a href="/src/template/admin_dashboard.html" class="sidebar__item__link text body-large fw-medium">Dashboard</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 8.57399V21.574H3V8.57399" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23 3.57399H1V8.57399H23V3.57399Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 12.574H14" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_product.html" class="sidebar__item__link text body-large fw-medium">Products</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 4.57399H18C18.5304 4.57399 19.0391 4.7847 19.4142 5.15978C19.7893 5.53485 20 6.04356 20 6.57399V20.574C20 21.1044 19.7893 21.6131 19.4142 21.9882C19.0391 22.3633 18.5304 22.574 18 22.574H6C5.46957 22.574 4.96086 22.3633 4.58579 21.9882C4.21071 21.6131 4 21.1044 4 20.574V6.57399C4 6.04356 4.21071 5.53485 4.58579 5.15978C4.96086 4.7847 5.46957 4.57399 6 4.57399H8" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M15 2.57399H9C8.44772 2.57399 8 3.02171 8 3.57399V5.57399C8 6.12627 8.44772 6.57399 9 6.57399H15C15.5523 6.57399 16 6.12627 16 5.57399V3.57399C16 3.02171 15.5523 2.57399 15 2.57399Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_category.html" class="sidebar__item__link text body-large fw-medium">Categories</a>
                    </li>
                    <li class="sidebar__item flex v-center rounded-4">
                        <div class="sidebar__item__icon">
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.21 16.464C20.5739 17.9685 19.5788 19.2942 18.3119 20.3253C17.045 21.3564 15.5448 22.0614 13.9425 22.3788C12.3401 22.6961 10.6845 22.6161 9.12018 22.1458C7.55591 21.6754 6.13066 20.8291 4.96906 19.6806C3.80745 18.5322 2.94485 17.1167 2.45667 15.5579C1.96849 13.9991 1.8696 12.3445 2.16863 10.7386C2.46767 9.13277 3.15553 7.62462 4.17208 6.34602C5.18863 5.06742 6.50292 4.05731 8.00004 3.40399" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22 12.574C22 11.2608 21.7413 9.96041 21.2388 8.74716C20.7362 7.5339 19.9997 6.43151 19.0711 5.50292C18.1425 4.57434 17.0401 3.83774 15.8268 3.33519C14.6136 2.83265 13.3132 2.57399 12 2.57399V12.574H22Z" stroke="#656565" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
                        </div>
                        <a href="/src/template/admin_order.html" class="sidebar__item__link text body-large fw-medium">Orders</a>
                    </li>
                </ul>
            </nav>
        </div>
        `;

        if (sidebarDesktopContainer) {
            sidebarDesktopContainer.innerHTML = '';
            sidebarDesktopContainer.innerHTML = sidebarDesktop;
        }

        if (sidebarMobileContainer) {
            sidebarMobileContainer.innerHTML = '';
            sidebarMobileContainer.innerHTML = sidebarMobile;
            // sidebarMobileContainer.insertAdjacentHTML("beforeend", sidebarMobile);
        }
    }
    ,
    start () {
        this.renderUI();
        this.handleUserWidget();
        this.eventsHandler();
    }
}

myApp.start();

export {myApp};