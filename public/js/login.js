import { createStorage } from "./main.js";
const loginAPI = `/api/v1/auth/login`;
const userLoginStorage = createStorage('userLogin');
(_ => {
    const usersSignupArray = JSON.parse(localStorage.getItem('usersSignup'))?.usersSignup || [];
    const loginForm = document.querySelector('.form--login');
    const emailInput = loginForm.querySelector('.email__input');
    const passwordInput = loginForm.querySelector('.password__input');
    const loginBtn = loginForm.querySelector('.login-btn');
    const errorMessageEle = loginForm.querySelector('.form__error__message');
    if (usersSignupArray.length > 0) {
        const recentUser = usersSignupArray.pop();
        emailInput.value = recentUser.email;
        passwordInput.value = recentUser.password;
    }
    if (loginBtn) {
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const res = await login();
                const data = await res.json();
                if (!res.ok) {
                    errorMessageEle.innerHTML = data.message;
                }
                ;
                userLoginStorage.set('userLogin', data.user);
                localStorage.setItem('authToken', data.authToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                if (data.user.role == 'user') {
                    window.location.href = '/';
                }
                else if (data.user.role == 'admin') {
                    window.location.href = '/admin/dashboard';
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    const login = async () => {
        const email = emailInput.value;
        const password = passwordInput.value;
        const user = {
            email,
            password
        };
        const res = await fetch(loginAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        return res;
    };
})();
