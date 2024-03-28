import {
    getData
} from '/dist/assets/main.js';

const userId = window.location.search.split('=')[1];

// console.log(userId);

(async function renderUserDetailView () {
    if (userId) {
        try {
            const user = await getData(`http://localhost:3000/Users/${userId}`);
            const { id, firstName, lastName, email, password, role } = user;
            // console.log(id, firstName, lastName, email, password, role);

            // console.log(user);

            const firstNameInput = document.querySelector('.form__input--firstName');
            const lastNameInput = document.querySelector('.form__input--lastName');
            const emailInput = document.querySelector('.form__input--email');
            const passwordInput = document.querySelector('.form__input--password');
            const roleInput = document.querySelector('.form__input--role');

            // console.log(firstNameInput, lastNameInput, emailInput, passwordInput, roleInput);

            firstNameInput.value = firstName;
            lastNameInput.value = lastName;
            emailInput.value = email;
            passwordInput.value = password;
            roleInput.value = role;


            const adminUserUsername = document.querySelector('.admin__user__info--userName');
            const adminUserEmail = document.querySelector('.admin__user__info--email');
            const adminUserPassword = document.querySelector('.admin__user__info--password');

            // console.log(adminUserUsername, adminUserEmail, adminUserPassword);

            adminUserUsername.textContent = `${firstName} ${lastName}`;
            adminUserEmail.textContent = email;
            adminUserPassword.textContent = password;
        } catch (error) {
            console.log(error)
        }
    }
})()

if (userId) {
    const saveUserBtn = document.querySelector('.save-user-info-btn');
    
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', e => {
            e.preventDefault();
            handleSaveUser();
        });
    }
} else {
    window.location.href = '/src/template/admin_user.html';
}

const handleSaveUser = async () => {
    const firstName = document.querySelector('.form__input--firstName').value;
    const lastName = document.querySelector('.form__input--lastName').value;
    const email = document.querySelector('.form__input--email').value;
    const password = document.querySelector('.form__input--password').value;
    const role = document.querySelector('.form__input--role').value;

    const updatedUser = {
        firstName,
        lastName,
        email,
        password,
        role
    }

    try {
        const updateRes = await fetch(`http://localhost:3000/Users/${userId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        if (updateRes.ok) {
            console.log('User updated successfully');
        } else {
            throw new Error('Failed to update user');
        }
    } catch (error) {
        console.log(error);
    }
}