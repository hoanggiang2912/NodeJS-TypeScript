import { renderGeneralProduct , products } from '/dist/assets/main.js';

const query = window.location.search.split('=')[1];
// console.log(query);

if (query) {
    const filteredProducts = products.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
    const productContainer = document.querySelector('.search__product__wrapper');
    
    renderGeneralProduct(filteredProducts, productContainer, 'No product found!');

    const amountResult = document.querySelector('.result__amount');
    amountResult.textContent = `${filteredProducts.length} results`;
}