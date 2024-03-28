import { App } from './main.js';

(_ => {
    const app = new App();
    const api = '/api/v1/auth/create';

    const form = document.querySelector('form') as HTMLFormElement; 
    const roleInput = form.querySelector('.form__input--role') as HTMLInputElement;
    const firstNameInput = form.querySelector('.form__input--firstName') as HTMLInputElement;
    const lastNameInput = form.querySelector('.form__input--lastName') as HTMLInputElement;
    const emailInput = form.querySelector('.form__input--email') as HTMLInputElement;
    const passwordInput = form.querySelector('.form__input--password') as HTMLInputElement;
    const phoneInput = form.querySelector('.form__input--phone') as HTMLInputElement;
    const noteInput = form.querySelector('.form__input--note') as HTMLInputElement;
    
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
        }

        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        return res;
    }

    const addUserBtn = form.querySelector('.form__btn--addUser') as HTMLButtonElement;
    if (addUserBtn) {
        addUserBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();
            const res = await handleAddUser();

            app.handleToastMessage('waiting', 'Adding user...');
            const data = await res.json();
            if (data.success) {
                app.handleToastMessage('success', 'User added successfully');
                app.handleToastMessage('waiting', 'Redirecting to users page...');
                location.href = '/admin/users';
            } else {
                app.handleToastMessage('failure', `Adding failed: ${data.message}`);
            }
        })
    }
})();