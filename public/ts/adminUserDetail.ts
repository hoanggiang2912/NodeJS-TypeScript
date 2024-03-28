import {getData , App} from './main.js';
import { User } from './interfaces.js';
const app = new App();

(async _ => {
    // update user infomation view
    const id = location.pathname.split('/').pop();
    const user = await getData(`/api/v1/auth/${id}`);
    // console.log(user);
    const form = document.querySelector('.form.admin__user__form') as HTMLFormElement; 
    const roleInput = form.querySelector('.form__input--role') as HTMLInputElement;
    roleInput.value = user.role;

    // update user infomation
    const updateBtn = form.querySelector('.save-user-info-btn') as HTMLButtonElement;
    
    const handleUpdateUser = async () => {
        const updateUserAPI = `/api/v1/auth/update-user-admin/${id}`
        // get elements
        const firstNameInput = form.querySelector('.form__input--firstName') as HTMLInputElement;
        const lastNameInput = form.querySelector('.form__input--lastName') as HTMLInputElement;
        const emailInput = form.querySelector('.form__input--email') as HTMLInputElement;
        const noteInput = form.querySelector('.form__input--note') as HTMLInputElement;
        const roleInput = form.querySelector('.form__input--role') as HTMLInputElement;
        const phoneInput = form.querySelector('.form__input--phone') as HTMLInputElement;

        // get values
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
        }

        // console.log(updatedUser);
        const res = await fetch(updateUserAPI, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        return res;
    }

    if (updateBtn) {
        updateBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();
            const res = await handleUpdateUser();

            const data = await res.json();

            if (data.success) {
                app.handleToastMessage('success', 'User updated successfully');
                location.reload();
            } else {
                app.handleToastMessage('failure', data.message);
            }
        });
    }

    const resetPasswordBtn = form.querySelector('.reset-password__strigger') as HTMLButtonElement;

    const passwordGenerator = (passLength: number) => {
        const length = +passLength;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let password = '';
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

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
                    } else {
                        app.handleToastMessage('failure', sendMailData.message);
                    }
                } catch (error) {
                    app.handleToastMessage('failure', error as string);
                }
            }

            if (resetPasswordData.message) {
                app.handleToastMessage('failure', resetPasswordData.message);
            }
        } catch (error) {
            app.handleToastMessage('failure', error as string);
        }
    }

    const sendMail = async (user: User) => {
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
        } catch (error) {
            app.handleToastMessage('failure', error as string);
        }
    }

    if (resetPasswordBtn) {
        resetPasswordBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();
            const confirm = window.confirm('Are you sure you want to reset this user password?');
            if (confirm) {
                await handleResetPassword();
            }
        });
    }
})();