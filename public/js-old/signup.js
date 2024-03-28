import { Validator } from '/src/js/validator.js';
import { getData, createStorage } from '/dist/assets/main.js';

const userStorage = createStorage('user');

const userAPI = 'http://localhost:3000/Users';
const firstNameInput = document.querySelector('.firstname__input');
const lastNameInput = document.querySelector('.lastname__input');
const emailInput = document.querySelector('.email__input');
const passwordInput = document.querySelector('.password__input');


const createUser = async (user) => {
    const res = await fetch(userAPI, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    const data = await res.json();
    return data;
}

const users = await getData(userAPI);
const indexList = users.map((_, i) => i);
const index = indexList ? Number(indexList.pop() + 1).toString() : "1";

const signupBtn = document.querySelector('.signup-btn');

if (signupBtn) {
    signupBtn.addEventListener('click', e => {
        Validator(
            {
                formSelector: '.form--signup',
                formGroupSelector: '.form__group',
                formMessage: '.form__message',
                redirectUrl: `/src/template/login.html`,

                rules: [
                    Validator.isRequired('.email__input', 'Please fill in the blank'),
                    Validator.isEmail('.email__input', 'Your email is invalid!'),
                    Validator.isRequired('.password__input', 'Please fill in the blank'),
                    Validator.isPassword('.password__input', 8, 'Password has at least 8 characters'),
                    Validator.isRequired('.firstname__input', 'Please fill in the blank'),
                    Validator.isRequired('.lastname__input', 'Please fill in the blank'),
                ]
            },
            async () => {
                const user = {
                    id: index,
                    firstName: firstNameInput.value,
                    lastName: lastNameInput.value,
                    email: emailInput.value,
                    password: passwordInput.value,
                    role: 'user'
                }
                await createUser(user);
                userStorage.set('user', user);
            }
        )
    })
}

Validator({
    formSelector: '.form--signup',
    formGroupSelector: '.form__group',
    formMessage: '.form__message',
    redirectUrl: `/src/template/login.html`,

    rules: [
        Validator.isRequired('.email__input', 'Please fill in the blank'),
        Validator.isEmail('.email__input', 'Your email is invalid!'),
        Validator.isRequired('.password__input', 'Please fill in the blank'),
        Validator.isPassword('.password__input', 8, 'Password has at least 8 characters'),
        Validator.isRequired('.firstname__input', 'Please fill in the blank'),
        Validator.isRequired('.lastname__input', 'Please fill in the blank'),
    ]
})


