import { getData } from '/dist/assets/main.js';

const renderUser = (users, container, callback = _ => {}) => {
    try {
        const html = users.map(user => {
            return `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><span class="role role--${user.role}">${user.role}</span></td>
                    <td class="flex v-center g12 flex-center">
                        <a href="/src/template/admin_userDetail.html?userId=${user.id}" class="btn primary-text-btn detail-btn auto-set-width" data-user-id="${user.id}">Detail</a>
                        |
                        <button class="btn auto-set-width primary-text-btn delete-btn" data-user-id="${user.id}">Delete</button>
                    </td>
                </tr>
            `
        });

        if (container) {
            container.innerHTML = html.join('');

            if (typeof callback === 'function') {
                callback();
            }
        }
    } catch (error) {
        console.log(error)
    }
}

const userContainer = document.querySelector('.user__table tbody');
const userAPI = 'http://localhost:3000/Users';
const user = await getData(userAPI);

renderUser(user, userContainer);

const deleteBtns = document.querySelectorAll('.delete-btn');

function handleDeleteBtn () {
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async e => {
            const userId = e.target.dataset.userId;
            const user = await getData(`${userAPI}/${userId}`);
            const confirmDelete = confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`);

            if (confirmDelete) {
                await fetch(`${userAPI}/${userId}`, {
                    method: 'DELETE'
                });

                renderUser(user, userContainer);
            }
        });
    });
}
handleDeleteBtn();

(function handleUserSearching() {
    const searchInput = document.querySelector('.form__input--search');
    const searchForm = document.querySelector('.form--search');
    // console.log(searchForm);
    // console.log(searchInput);
    if (searchForm) {
        searchForm.addEventListener('submit', e => {
            e.preventDefault();
        })
    }

    if (searchInput) {
        searchInput.addEventListener('input', async e => {
            const users = await getData(userAPI);
            const searchValue = e.target.value.toLowerCase();
            const filteredUserList = users.filter(user => {
                const userName = user.firstName + ' ' + user.lastName;
                const userEmail = user.email;
                return userName.toLowerCase().includes(searchValue) || userEmail.toLowerCase().includes(searchValue);
            });

            renderUser(filteredUserList, userContainer, handleDeleteBtn());
        })
        
        searchInput.addEventListener('blur', e => {
            if (e.target.value === '') {
                renderUser(user, userContainer, handleDeleteBtn());
            }
        })
    }
})();


