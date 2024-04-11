import { categoriesEndpoint, App } from "./main.js";
const app = new App();
(() => {
    const categoryBannerInput = document.querySelector('.form__input--category__banner');
    const categoryBannerContainer = document.querySelector('.admin__category__banner');
    const categoryBannerPreview = document.querySelector('label[for="category-banner"]');
    if (categoryBannerInput) {
        categoryBannerInput.addEventListener('change', async (e) => {
            const target = e.target;
            const fileInput = target.closest('#category-banner');
            const formData = new FormData();
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('category-banner', fileInput.files[i]);
            }
            const uploadAPI = `http://localhost:3000/upload/categories/`;
            const res = await fetch(uploadAPI, {
                method: 'POST',
                body: formData
            });
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            else {
                const data = await res.json();
                if (data) {
                    const image = data;
                    const imageSrc = image.originalname;
                    const banner = `
        <label class="abs-full banner-cover rounded-8 oh"
                                style="background-image: url('/uploads/${imageSrc}');"></label>
    `;
                    categoryBannerContainer.insertAdjacentHTML('afterbegin', banner);
                    if (addCategoryBtn) {
                        addCategoryBtn.addEventListener('click', async (e) => {
                            e.preventDefault();
                            app.handleToastMessage('waiting', 'Adding category...');
                            const res = await handleAddCategory(imageSrc);
                            const data = await res?.json();
                            if (data.success) {
                                app.handleToastMessage('success', 'Category added successfully');
                                setTimeout(() => {
                                    window.location.href = `/admin/categories`;
                                }, 1000);
                            }
                            else {
                                app.handleToastMessage('failure', `Failed: ${data.message}`);
                            }
                        });
                    }
                }
            }
        });
    }
})();
const addCategoryBtn = document.querySelector('.add__category__btn');
const handleAddCategory = async (banner) => {
    const categoryNameInput = document.querySelector('.form__input--category__name');
    const categoryDescriptionInput = document.querySelector('.form__input--category__description');
    const categoryDescription = categoryDescriptionInput?.value;
    const categoryName = categoryNameInput?.value;
    const category = {
        name: categoryName,
        banner,
        description: categoryDescription
    };
    try {
        const authToken = localStorage.getItem('authToken');
        const res = await fetch(categoriesEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer + ${authToken}`
            },
            body: JSON.stringify(category)
        });
        return res;
    }
    catch (error) {
        console.log(error);
    }
};
