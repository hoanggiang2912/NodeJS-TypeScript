import { categories } from '/dist/assets/main.js';
import { Validator } from '/src/js/validator.js';

// console.log(categories)

(() => {
    const categoryBannerInput = document.querySelector('.form__input--category__banner');
    const categoryBannerPreview = document.querySelector('label[for="category-banner"]');
    
    if (categoryBannerInput) {
        categoryBannerInput.addEventListener('change', _ => {
            const file = categoryBannerInput.files[0].name;

            if (file)
                categoryBannerPreview.style.backgroundImage = `url('/src/assets/image/categories/${file}')`;
            else {
                categoryBannerPreview.style.backgroundImage = `url('/src/assets/image/banners/no-img.png')`;
            }
        }
    )}
})()

const addCategoryBtn = document.querySelector('.add__category__btn');

const handleAddCategory = async () => {
    const categoryName = document.querySelector('.form__input--category__name').value;
    const categoryDescription = document.querySelector('.form__input--category__description').value;
    const categoryBanner = [...document.querySelector('.form__input--category__banner').files].map(i => i.name);
    
    const indexList = categories.map((_, i) => i);
    const index = (+indexList.slice().pop() + 1).toString();
    
    console.log(categoryBanner)
    const category = {
        id: index,
        name: categoryName,
        description: categoryDescription,
        banner: categoryBanner
    }
    console.log(category)

    try {
        const categoryAPI = 'http://localhost:3000/Categories';
        const res = await fetch(categoryAPI, {
            method: 'POST',
            header: 'application/json',
            body: JSON.stringify(category)
        })

        if (!res.ok) console.log('Somethings went wrong!')
    } catch (error) {
        console.log(error)
    }
}

if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', async e => { 
        Validator({
            formSelector: '.add-category__form',
            formGroupSelector: '.form__group',
            formMessage: '.form__message',
            redirectUrl: `/src/template/admin_category.html`,

            rules: [
                Validator.isRequired('.form__input--category__name', 'Please fill in the blank'),
                Validator.isRequired('.form__input--category__description', 'Please fill in the blank'),
            ]
        }, async _ => {
            await handleAddCategory();
        })
    });
}


Validator({
    formSelector: '.add-category__form',
    formGroupSelector: '.form__group',
    formMessage: '.form__message',
    redirectUrl: `/src/template/admin_category.html`,

    rules: [
        Validator.isRequired('.form__input--category__name', 'Please fill in the blank'),
        Validator.isRequired('.form__input--category__description', 'Please fill in the blank'),
    ]
})
