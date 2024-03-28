import { App } from './main.js';
(_ => {
    const app = new App();
    const api = '/api/v1/auth/create';
    const form = document.querySelector('form');
    const roleInput = form.querySelector('.form__input--role');
    const firstNameInput = form.querySelector('.form__input--firstName');
    const lastNameInput = form.querySelector('.form__input--lastName');
    const emailInput = form.querySelector('.form__input--email');
    const passwordInput = form.querySelector('.form__input--password');
    const phoneInput = form.querySelector('.form__input--phone');
    const noteInput = form.querySelector('.form__input--note');
    const handleAddUser = async () => {
        const role = roleInput.value;
        const firstName = firstNameInput.value;
        const lastName = lastNameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const newUser = {
            role,
            firstName,
            lastName,
            email,
            password,
            phone: phoneInput.value,
            note: noteInput.value
        };
        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        return res;
    };
    const addUserBtn = form.querySelector('.form__btn--addUser');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const res = await handleAddUser();
            app.handleToastMessage('waiting', 'Adding user...');
            const data = await res.json();
            if (data.success) {
                app.handleToastMessage('success', 'User added successfully');
                app.handleToastMessage('waiting', 'Redirecting to users page...');
                location.href = '/admin/users';
            }
            else {
                app.handleToastMessage('failure', `Adding failed: ${data.message}`);
            }
        });
    }
})();
