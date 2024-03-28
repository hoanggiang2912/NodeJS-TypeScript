import { products, categories, renderCategoryProduct } from '/dist/assets/main.js';

const categoryProductContainer = document.querySelector('.category__product__wrapper');
const categoryName = document.querySelector('.hero__banner__overlay .category__name');
const categoryId = window.location.search.split('=')[1];
const resultAmount = document.querySelector('.result__amount');
if (categoryId) {
    const categoryProduct = await products.filter(p => p.idCategory == categoryId);

    if (categoryProductContainer) {
        renderCategoryProduct(products, categoryId, categoryProductContainer);
        categoryName.innerText = categories.filter(c => c.id == categoryId)[0].name;
        resultAmount.innerText = `${categoryProduct.length} results`;
    }
} else {
    resultAmount.innerText = `${products.length} results`;
}