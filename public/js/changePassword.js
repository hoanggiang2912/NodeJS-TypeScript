"use strict";
(_ => {
    const oldPasswordInput = document.querySelector('#old-password');
    const newPasswordInput = document.querySelector('#new-password');
    const formMessage = document.querySelector('.form__error__message');
    const saveBtn = document.querySelector('.save-change-btn');
    const userId = location.pathname.split('/').pop();
    if (saveBtn) {
        saveBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const api = `http://127.0.0.1:3000/user/account-detail/password/${userId}`;
            const res = await fetch(api, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ oldPassword, newPassword })
            });
            if (!res.ok) {
                const data = await res.json();
                formMessage.textContent = data.message;
                return;
            }
            const data = await res.json();
            formMessage.textContent = data.message;
        });
    }
})();
