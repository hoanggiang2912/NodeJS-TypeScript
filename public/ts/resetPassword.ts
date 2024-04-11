(_ => {
    const form = document.querySelector('.form--reset') as HTMLFormElement;
    const passwordInput = form.querySelector('.password__input') as HTMLInputElement;
    const confirmPasswordInput = form.querySelector('.password__input--confirm') as HTMLInputElement;
    const updateBtn = form.querySelector('.form__btn--reset') as HTMLButtonElement;
    const errorMessage = form.querySelector('.form__error__message') as HTMLDivElement;

    if (updateBtn) {
        updateBtn.addEventListener('click', async (e: Event) => {
            e.preventDefault();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            const res = await updatePassword(password, confirmPassword);

            if (!res!.ok) {
                errorMessage.innerHTML = 'Network error, please try again later';
            }

            const data = await res!.json();
            if (data.success) {
                errorMessage.innerHTML = `
                    <span class="success-text display-block width-full body-medium fw-smb p12" style="background: rgba(32, 227, 178, .2); color: #20E3B2; border: 1px solid #20E3B2">
                        Password reset successfully!
                    </span>
                `
            }
            if (data.errorMessage) {
                errorMessage.innerHTML = data.errorMessage;
            }
        })
    }

    const updatePassword = async (password: string, confirmPassword: string) => {
        try {
            const idUser = window.location.pathname.split('/').pop();
            const token = window.location.search.split('=').pop();
            const res = await fetch(`/forgot-password/reset-password/${idUser}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token!
                },
                body: JSON.stringify({ password, confirmPassword })
            });

            return res;
        } catch (error) {
            console.log(error)
        }
    }
})();