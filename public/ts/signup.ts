import { createStorage } from "./main.js";
// import { Validator } from "./validator.js";
const signupAPI = `http://127.0.0.1:3000/api/v1/auth/register`;
const usersSignupStorage = createStorage('usersSignup');
const userLoginStorage = createStorage('userLogin');

(_ => {
    const usersSignupArray = JSON.parse(localStorage.getItem('usersSignup') as string)?.usersSignup || [];
    const signupForm = document.querySelector('.form--signup') as HTMLFormElement;
    const signupBtn = signupForm.querySelector('.form__btn.signup-btn') as HTMLButtonElement;
    const phoneInput = signupForm.querySelector('.phone__input') as HTMLInputElement;
    const passwordInput = signupForm.querySelector('.password__input') as HTMLInputElement;
    const emailInput = signupForm.querySelector('.email__input') as HTMLInputElement;
    const errorMessageEle = signupForm.querySelector('.form__error__message') as HTMLSpanElement;

    const signup = async () => {
        const phone = phoneInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;

        const user = {
            phone,
            email,
            password
        }

        const res = await fetch(signupAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (!res.ok) {
            const data = await res.json();
            errorMessageEle.innerHTML = data.message;
            return;
        };

        // save user data to local storage named 'userSignup'
        usersSignupArray.push(user);
        usersSignupStorage.set('usersSignup', usersSignupArray);
        
        window.location.href = '/login';
    }

    signupBtn.addEventListener('click', async (e: Event) => {
        e.preventDefault();
        await signup();

        // Validator(
        //     {
        //         formSelector: '.form--signup',
        //         formGroupSelector: '.form__group',
        //         formMessage: '.form__message',
        //         redirectUrl: `/login`,

        //         rules: [
        //             Validator.isRequired('.email__input', 'Please fill in the blank'),
        //             Validator.isEmail('.email__input', 'Your email is invalid!'),
        //             Validator.isRequired('.password__input', 'Please fill in the blank'),
        //             Validator.isPassword('.password__input', 8, 'Password has at least 8 characters'),
        //             Validator.isRequired('.firstname__input', 'Please fill in the blank'),
        //             Validator.isRequired('.lastname__input', 'Please fill in the blank'),
        //         ]
        //     },
        //     async () => {
        //         await signup();
        //     }
        // )
    });
})();