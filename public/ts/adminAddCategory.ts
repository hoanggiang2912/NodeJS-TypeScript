import { categoriesEndpoint, App } from "./main.js";
import { Data_Image } from "./interfaces.js";
const app = new App();

(() => {
    const categoryBannerInput = document.querySelector('.form__input--category__banner') as HTMLInputElement;
    const categoryBannerContainer = document.querySelector('.admin__category__banner') as HTMLInputElement;
    
    const categoryBannerPreview = document.querySelector('label[for="category-banner"]') as HTMLElement;

    if (categoryBannerInput) {
        categoryBannerInput.addEventListener('change', async (e: Event) => {
            const target = e.target as HTMLInputElement;
            const fileInput = target.closest('#category-banner') as HTMLInputElement;
            // console.log(fileInput.files!);

            const formData = new FormData();
            for (let i = 0; i < fileInput.files!.length; i++) {
                formData.append('category-banner', fileInput.files![i]);
            }
            // console.log(formData);

            const uploadAPI = `http://localhost:3000/upload/categories/`;

            const res = await fetch(uploadAPI, {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            } else {
                const data = await res.json();

                if (data) {
                    const image = data as Data_Image;
                    const imageSrc = image.originalname;
                    // console.log(image);

                    const banner = `
        <label class="abs-full banner-cover rounded-8 oh"
                                style="background-image: url('/uploads/${imageSrc}');"></label>
    `
                    categoryBannerContainer.insertAdjacentHTML('afterbegin', banner);

                    if (addCategoryBtn) {
                        addCategoryBtn.addEventListener('click', async e => {
                            e.preventDefault();
                            app.handleToastMessage('waiting', 'Adding category...');
                            const res = await handleAddCategory(imageSrc);

                            const data = await res?.json();

                            if (data.success) {   
                                app.handleToastMessage('success', 'Category added successfully');
                                setTimeout(() => {
                                    window.location.href = `/admin/categories`;
                                }, 1000);
                            } else {
                                app.handleToastMessage('failure', `Failed: ${data.message}`);
                            }
                        });
                    }
                }
            }
        })
    }
})()

const addCategoryBtn = document.querySelector('.add__category__btn');

const handleAddCategory = async (banner: string) => {
    const categoryNameInput = document.querySelector('.form__input--category__name') as HTMLInputElement;
    const categoryDescriptionInput = document.querySelector('.form__input--category__description') as HTMLTextAreaElement;
    const categoryDescription = categoryDescriptionInput?.value;
    const categoryName = categoryNameInput?.value;

    // console.log(categoryBanner);
    const category = {
        name: categoryName,
        banner,
        description: categoryDescription
    };
    // console.log(category);

    try {
        const res = await fetch(categoriesEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category)
        })

        return res;
    } catch (error) {
        console.log(error)
    }
}




// Validator({
//     formSelector: '.add-category__form',
//     formGroupSelector: '.form__group',
//     formMessage: '.form__message',
//     redirectUrl: `/src/template/admin_category.html`,

//     rules: [
//         Validator.isRequired('.form__input--category__name', 'Please fill in the blank'),
//         Validator.isRequired('.form__input--category__description', 'Please fill in the blank'),
//     ]
// })
