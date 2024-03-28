import { getData, App } from './main.js';
const app = new App();
(async (_) => {
    const id = location.pathname.split('/').pop();
    const user = await getData(`/api/v1/auth/${id}`);
    const form = document.querySelector('.form.admin__user__form');
    const roleInput = form.querySelector('.form__input--role');
    roleInput.value = user.role;
    const updateBtn = form.querySelector('.save-user-info-btn');
    const handleUpdateUser = async () => {
        const updateUserAPI = `/api/v1/auth/update-user-admin/${id}`;
        const firstNameInput = form.querySelector('.form__input--firstName');
        const lastNameInput = form.querySelector('.form__input--lastName');
        const emailInput = form.querySelector('.form__input--email');
        const noteInput = form.querySelector('.form__input--note');
        const roleInput = form.querySelector('.form__input--role');
        const phoneInput = form.querySelector('.form__input--phone');
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const note = noteInput.value;
        const role = roleInput.value;
        const phone = phoneInput.value;
        const updatedUser = {
            firstName,
            lastName,
            email,
            phone,
            note,
            role
        };
        const res = await fetch(updateUserAPI, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });
        return res;
    };
    if (updateBtn) {
        updateBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const res = await handleUpdateUser();
            const data = await res.json();
            if (data.success) {
                app.handleToastMessage('success', 'User updated successfully');
                location.reload();
            }
            else {
                app.handleToastMessage('failure', data.message);
            }
        });
    }
    const resetPasswordBtn = form.querySelector('.reset-password__strigger');
    const passwordGenerator = (passLength) => {
        const length = +passLength;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    };
    const handleResetPassword = async () => {
        const api = `/api/v1/auth/update-password/${id}`;
        const password = passwordGenerator(8);
        try {
            const resetPasswordRes = await fetch(api, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password
                })
            });
            app.handleToastMessage('waiting', 'Please wait...');
            const resetPasswordData = await resetPasswordRes.json();
            if (resetPasswordData.success) {
                try {
                    const sendMailRes = await sendMail(user);
                    const sendMailData = await sendMailRes?.json();
                    if (sendMailData.sendMail) {
                        app.handleToastMessage('success', 'Password reset successfully');
                    }
                    else {
                        app.handleToastMessage('failure', sendMailData.message);
                    }
                }
                catch (error) {
                    app.handleToastMessage('failure', error);
                }
            }
            if (resetPasswordData.message) {
                app.handleToastMessage('failure', resetPasswordData.message);
            }
        }
        catch (error) {
            app.handleToastMessage('failure', error);
        }
    };
    const sendMail = async (user) => {
        const forgotAPI = `/forgot-password`;
        try {
            const res = await fetch(forgotAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: user.email
                })
            });
            return res;
        }
        catch (error) {
            app.handleToastMessage('failure', error);
        }
    };
    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const confirm = window.confirm('Are you sure you want to reset this user password?');
            if (confirm) {
                await handleResetPassword();
            }
        });
    }
})();
