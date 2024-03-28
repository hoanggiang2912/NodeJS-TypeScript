import { getData } from '/dist/assets/main.js';
import { Validator } from '/src/js/validator.js';

const logger = data => console.log(data);

// logger(Validator);
// console.log(getData);
const userAPI = 'http://localhost:3000/Users';

const addUserBtn = document.querySelector('.form__btn--addUser');
// logger(addUserBtn);
if (addUserBtn) {
    addUserBtn.addEventListener('click', _ => {
        Validator({
            formSelector: '.admin__user__form',
            formGroupSelector: '.form__group',
            formMessage: '.form__message',
            redirectUrl: `/src/template/admin_user.html`,

            rules: [
                Validator.isRequired('.form__input--firstName', 'Please fill in the blank'),
                Validator.isRequired('.form__input--lastName', 'Please fill in the blank'),
                Validator.isRequired('.form__input--email', 'Please fill in the blank'),
                Validator.isEmail('.form__input--email', 'Please enter a valid email address'),
                Validator.isRequired('.form__input--password', 'Please fill in the blank'),
                Validator.isPassword('.form__input--password')
            ]
        }, async _ => {
            await handleAddUser();
        })
    })
}

const handleAddUser = async _ => {
    const firstName = document.querySelector('.form__input--firstName').value;
    const lastName = document.querySelector('.form__input--lastName').value;
    const email = document.querySelector('.form__input--email').value;
    const password = document.querySelector('.form__input--password').value;
    const role = document.querySelector('.form__input--role').value;

    const users = await getData(userAPI);
    const indexList = users.map((u) => +u.id);
    const index = (Math.max(...indexList) + 1).toString();

    logger(index)

    const user = {
        id: index,
        firstName,
        lastName,
        email,
        password,
        role
    }

    // logger(user);

    try {
        const addUserRes = await fetch(userAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (addUserRes.ok) {
            logger('User added successfully');
        }
    } catch (error) {
        console.log(error)
    }
}

(function handleInput () {
    const firstNameInput = document.querySelector('.form__input--firstName');
    const lastNameInput = document.querySelector('.form__input--lastName');
    const emailInput = document.querySelector('.form__input--email');
    const passwordInput = document.querySelector('.form__input--password');

    const adminUserNameEle = document.querySelector('.admin__user__info--userName');
    if (adminUserNameEle) {
        adminUserNameEle.textContent = firstNameInput.value + ' ' + lastNameInput.value;
        firstNameInput.addEventListener('input', _ => {
            adminUserNameEle.textContent = firstNameInput.value + ' ' + lastNameInput.value;
        });
        lastNameInput.addEventListener('input', _ => {
            adminUserNameEle.textContent = firstNameInput.value + ' ' + lastNameInput.value;
        });
    }

    const adminUserEmailEle = document.querySelector('.admin__user__info--email');
    if (adminUserEmailEle) {
        adminUserEmailEle.textContent = emailInput.value;
        emailInput.addEventListener('input', _ => {
            adminUserEmailEle.textContent = emailInput.value;
        });
    }

    const adminUserPassword = document.querySelector('.admin__user__info--password');
    if (adminUserPassword) {
        adminUserPassword.textContent = passwordInput.value;
        passwordInput.addEventListener('input', _ => {
            adminUserPassword.textContent = passwordInput.value;
        });
    }
})();

(function validateUserForm () {
    Validator({
        formSelector: '.admin__user__form',
        formGroupSelector: '.form__group',
        formMessage: '.form__message',
        redirectUrl: `/src/template/admin_user.html`,

        rules: [
            Validator.isRequired('.form__input--firstName', 'Please fill in the blank'),
            Validator.isRequired('.form__input--lastName', 'Please fill in the blank'),
            Validator.isRequired('.form__input--email', 'Please fill in the blank'),
            Validator.isEmail('.form__input--email', 'Please enter a valid email address'),
            Validator.isRequired('.form__input--password', 'Please fill in the blank'),
            Validator.isPassword('.form__input--password'),
        ]
    })
})();
