import { createStorage } from "./main.js";
const signupAPI = `http://127.0.0.1:3000/api/v1/auth/register`;
const usersSignupStorage = createStorage('usersSignup');
const userLoginStorage = createStorage('userLogin');
(_ => {
    const usersSignupArray = JSON.parse(localStorage.getItem('usersSignup'))?.usersSignup || [];
    const signupForm = document.querySelector('.form--signup');
    const signupBtn = signupForm.querySelector('.form__btn.signup-btn');
    const phoneInput = signupForm.querySelector('.phone__input');
    const passwordInput = signupForm.querySelector('.password__input');
    const emailInput = signupForm.querySelector('.email__input');
    const errorMessageEle = signupForm.querySelector('.form__error__message');
    const signup = async () => {
        const phone = phoneInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const user = {
            phone,
            email,
            password
        };
        const res = await fetch(signupAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!res.ok) {
            const data = await res.json();
            errorMessageEle.innerHTML = data.message;
            return;
        }
        ;
        usersSignupArray.push(user);
        usersSignupStorage.set('usersSignup', usersSignupArray);
        window.location.href = '/login';
    };
    signupBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await signup();
    });
})();
