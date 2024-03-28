import {products, categories, myApp} from '/dist/assets/main.js';
// console.log(products, categories, myApp);

const renderThumbnail = (thumbnails, container) => {
    thumbnails.forEach(thumbnail => {
        const html = `
            <div class="gallery__thumbnail">
                <img class="img-cover" src="/src/assets/image/products/${thumbnail}" alt="Image 1">
            </div>
        `;
        if (container) {
            container.insertAdjacentHTML('afterbegin', html);
        }
    });
}

const renderSpotlight = (spotlights, container) => {
    let html = '';
    spotlights.forEach(spotlight => {
        html += `
            <div class="gallery__spotlight__holder por">
                <img src="/src/assets/image/products/${spotlight}" alt="" class="image-cover">
            </div>
        `;
    });
    if (container) {
        container.innerHTML = html;

        // Initialize Flickity for spotlight image
        var spotlight = new Flickity('.gallery__spotlight', {
            cellAlign: 'left',
            contain: true,
            wrapAround: true,
            prevNextButtons: false,
            pageDots: false
        });

        const thumbnails = document.querySelectorAll('.gallery__thumbnail');

        // Handle Flickity change event
        spotlight.on('change', function () {
            const currentSlideIndex = spotlight.selectedIndex;
            const spotlightHolders = document.querySelectorAll('.gallery__spotlight__holder');

            // Highlight the current thumbnail
            thumbnails.forEach(function (thumbnail, index) {
                thumbnail.classList.remove('active');
                if (index === currentSlideIndex) {
                    thumbnail.classList.add('active');
                }
            });

            // Delay the addition of fade-in class to spotlight image holder
            setTimeout(function () {
                spotlightHolders.forEach(function (holder, index) {
                    if (index === currentSlideIndex) {
                        holder.classList.add('fade-in');
                    } else {
                        holder.classList.remove('fade-in');
                    }
                });
            }, 300); // Adjust the delay duration as needed
        });

        // Handle thumbnail click event
        thumbnails.forEach(function (thumbnail, index) {
            thumbnail.addEventListener('click', function () {
                spotlight.select(index);
            });
        });

        // Handle swipe event
        spotlight.on('dragEnd', function () {
            var direction = spotlight.x < 0 ? 'next' : 'previous';
            if (spotlight.isFreeScrolling) {
                var currentSlideIndex = spotlight.selectedIndex;
                var numSlides = spotlight.slides.length;

                // Infinite loop for swipe
                if (direction === 'next' && currentSlideIndex === numSlides - 1) {
                    spotlight.select(0);
                } else if (direction === 'previous' && currentSlideIndex === 0) {
                    spotlight.select(numSlides - 1);
                }
            }
        });
    }
};
const productId = window.location.search.split('=')[1];
if (productId) {
    // render product gallery
    const productThumbnailContainer = document.querySelector('.gallery__thumbnails');
    const [product] = products.filter(item => item.id == productId);
    console.log(product);

    const thumbnails = product.thumbnails;
    console.log(thumbnails);

    if (productThumbnailContainer) {
        renderThumbnail(thumbnails, productThumbnailContainer);
    }

    const productSpotlightContainer = document.querySelector('.gallery__spotlight');
    if (productSpotlightContainer) {
        renderSpotlight(thumbnails, productSpotlightContainer);
    }

    // handle product quantity
    const qtySelector = document.querySelector('.qty__selector');
    const qtyInput = document.querySelector('.qty__input');
    const form = document.querySelector('.product__form');

    if (qtySelector && qtyInput && form) {
        qtySelector.addEventListener('click', e => {
            e.preventDefault();

            const target = e.target;
            const plusBtn = target.closest('.plus-btn');
            const minusBtn = target.closest('.minus-btn');

            if (plusBtn) {
                qtyInput.value = parseInt(qtyInput.value) + 1;
            } else if (minusBtn) {
                if (parseInt(qtyInput.value) > 1) {
                    qtyInput.value = parseInt(qtyInput.value) - 1;
                }
            }
        });

        form.addEventListener('submit', e => {
            e.preventDefault();
            // Handle the form submission or perform any additional actions
        });
    }

    // handle add to cart data
    const addCartContainer = document.querySelector('.add-cart__group');
    const { id, title, price, description, category, background: { main } } = product;
    const addCartBtnHtml = `
        <button class="add-cart__btn add-cart-btn btn primary-fill-btn hover width-full fw-bold body-medium" data-id="${id}" data-name="${title}" data-price="${price}" data-id-category="${id}" data-img="${main}" data-qty="${qtyInput.value}"><i class="far fa-plus"></i>Add to cart</button>
    `
    addCartContainer.insertAdjacentHTML('afterbegin', addCartBtnHtml);
    const addCartBtn = document.querySelector('.add-cart__group .add-cart-btn');
    
    addCartBtn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();

        myApp.addCart(addCartBtn, myApp.cart, myApp.storage);
    })

    // insert product information
    const productName = document.querySelector('.product__name');
    productName.innerText = title;
    const productDesc = document.querySelector('.product__description');
    productDesc.innerText = description;
    const productPrice = document.querySelector('.product__price');
    productPrice.innerText = `$${price}`;
}