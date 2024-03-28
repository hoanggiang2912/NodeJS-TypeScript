(_ => {
    const oldPasswordInput = document.querySelector('#old-password') as HTMLInputElement;
    const newPasswordInput = document.querySelector('#new-password') as HTMLInputElement;
    const formMessage = document.querySelector('.form__error__message') as HTMLDivElement;
    const saveBtn = document.querySelector('.save-change-btn') as HTMLButtonElement;
    const userId = location.pathname.split('/').pop();

    if (saveBtn) {
        saveBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault(); 
            
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;

            const api = `http://127.0.0.1:3000/user/account-detail/password/${userId}`
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
        })
    }
})();