import {Validator} from '/src/js/validator.js';
import {getData} from '/dist/assets/main.js';

const userLoginInfo = JSON.parse(localStorage.getItem('userLogin'))?.userLogin ?? null;

if (!userLoginInfo) 
    window.location.href = '/src/template/login.html';

if (userLoginInfo) {
    const { id } = userLoginInfo;

    const getUser = async (id) => {
        const userAPI = `http://localhost:3000/Users/${id}`;
        const user = await getData(userAPI);
        return { user, userAPI };
    }

    const handleUserAccountDetailForm = async (id) => {
        /**
            -> get user data from form
            -> create update user variable with new data
            -> user put method to update user information by id
         */
        const { user, userAPI } = await getUser(id);

        const userFirstName = document.querySelector('#first-name').value;
        const userLastName = document.querySelector('#last-name').value;
        const userEmail = document.querySelector('#email').value;

        const userUpdated = {
            ...user,
            firstName: userFirstName,
            lastName: userLastName,
            email: userEmail,
        }

        // console.log(userUpdated, userAPI);

        const res = await fetch(userAPI, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userUpdated)
        })

        if (!res.ok) console.log('Something went wrong: ' + res.status);

        res
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(e => console.log('Something went wrong: ' + e));
    }

    const { user } = await getUser(id);

    const userFirstNameInput = document.querySelector('#first-name');
    const userLastNameInput = document.querySelector('#last-name');
    const userEmailInput = document.querySelector('#email');

    userFirstNameInput.value = user.firstName;
    userLastNameInput.value = user.lastName;
    userEmailInput.value = user.email;

    const saveChangesBtn = document.querySelector('.save-change-btn');

    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', e => {
            Validator({
                formSelector: '.user__account__details__form',
                formGroupSelector: '.form__group',
                formMessage: '.form__message',
                redirectUrl: '/src/template/user_accountDetail.html',

                rules: [
                    Validator.isRequired('#first-name', "Please fill in the blank"),
                    Validator.isRequired('#last-name', "Please fill in the blank"),
                    Validator.isRequired('#email', "Please fill in the blank"),
                    Validator.isEmail('#email', "Your email is invalid!"),
                ],
            }, async () => {
                await handleUserAccountDetailForm(id)
            })
        })
    }
}