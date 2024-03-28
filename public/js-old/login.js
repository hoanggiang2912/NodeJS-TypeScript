import {Validator} from '/src/js/validator.js';
import {createStorage, getData} from '/dist/assets/main.js';

const userLoginStorage = createStorage('userLogin');

const login = async () => {
    const userList = await getData('http://localhost:3000/Users');
    const emailInput = document.querySelector('.email__input');
    const passwordInput = document.querySelector('.password__input');

    const [user] = userList.filter(u => u.email === emailInput.value && u.password === passwordInput.value);
    
    if (!user) {
        const formMessage = document.querySelector('.form__message--top');
        formMessage.innerText = 'Your email or password is incorrect!';
    } else {
        userLoginStorage.set('userLogin', user);
        
        if (user.role === "admin") {
            window.location.href = '/src/template/admin_dashboard.html';
        } else if (user.role === "user") {
            window.location.href = '/';
        }
    }
}

const loginBtn = document.querySelector('.login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', e => {
        Validator({
            formSelector: '.form--login',
            formGroupSelector: '.form__group',
            formMessage: '.form__message',

            rules: [
                Validator.isRequired('.email__input', 'Please fill in the blank'),
                Validator.isEmail('.email__input', 'Your email is invalid!'),
                Validator.isRequired('.password__input', 'Please fill in the blank'),
                Validator.isPassword('.password__input', 8, 'Password has at least 8 characters'),
            ]
        }, login)
    })
}

Validator({
    formSelector: '.form--login',
    formGroupSelector: '.form__group',
    formMessage: '.form__message',

    rules: [
        Validator.isRequired('.email__input', 'Please fill in the blank'),
        Validator.isEmail('.email__input', 'Your email is invalid!'),
        Validator.isRequired('.password__input', 'Please fill in the blank'),
        Validator.isPassword('.password__input', 8, 'Password has at least 8 characters'),
    ]
})