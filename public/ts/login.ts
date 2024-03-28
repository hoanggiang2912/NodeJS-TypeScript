import { createStorage } from "./main.js";
// import { Validator } from "./validator.js";
const loginAPI = `/api/v1/auth/login`;
const userSignupStorage = createStorage('userSignup');
const userLoginStorage = createStorage('userLogin');

// localStorage.removeItem('usersSignup');

(_ => {
    const usersSignupArray = JSON.parse(localStorage.getItem('usersSignup') as string)?.usersSignup || [];
    // console.log(usersSignupArray);
    const loginForm = document.querySelector('.form--login') as HTMLFormElement;
    const emailInput = loginForm.querySelector('.email__input') as HTMLInputElement;
    const passwordInput = loginForm.querySelector('.password__input') as HTMLInputElement;
    const loginBtn = loginForm.querySelector('.login-btn') as HTMLButtonElement;
    const errorMessageEle = loginForm.querySelector('.form__error__message') as HTMLSpanElement;

    if (usersSignupArray.length > 0) {
        const recentUser = usersSignupArray.pop();
        emailInput.value = recentUser.email;
        passwordInput.value = recentUser.password;
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();
            await login();
        });
    }
    
    const login = async () => {
        const email = emailInput.value;
        const password = passwordInput.value;

        const user = {
            email,
            password
        }

        const res = await fetch(loginAPI, {
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
        };

        const data = await res.json();
        userLoginStorage.set('userLogin', data.user);

        if (data.user.role == 'user') {
            window.location.href = '/';
        } else if (data.user.role == 'admin') {
            window.location.href = '/admin/dashboard';
        }
    }
})();