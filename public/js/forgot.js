"use strict";
(_ => {
    const forgotForm = document.querySelector('.form--forgot');
    const emailInput = forgotForm.querySelector('.email__input');
    const errorMessageEle = forgotForm.querySelector('.form__error__message');
    const sendBtn = forgotForm.querySelector('.send-btn');
    const formMessageEle = forgotForm.querySelector('.form__message');
    const forgotAPI = `/forgot-password`;
    const overlay = document.querySelector('.overlay.overlay--main');
    if (sendBtn) {
        sendBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            overlay.classList.add('show');
            errorMessageEle.innerHTML = '';
            try {
                const data = await send();
                if (data.sendMail) {
                    const html = `
                        <span class="success-text body-medium fw-smb p12 width-full display-block tac" style="background: rgba(32, 227, 178, .2); color: #20E3B2; border: 1px solid #20E3B2">Sending email successfully!
                        <p class="body-small neutral-text40 p12 width-full display-block tac">Please check your email to reset your password.</p>
                        </span>
                    `;
                    formMessageEle.innerHTML = html;
                }
                else {
                    errorMessageEle.innerHTML = data.errorMessage;
                }
            }
            catch (error) {
                errorMessageEle.innerHTML = error;
            }
            finally {
                overlay.classList.remove('show');
                sendBtn.innerText = 'Resend';
            }
        });
    }
    const send = async () => {
        const email = emailInput.value;
        const user = {
            email
        };
        const res = await fetch(forgotAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        if (!res.ok) {
            const data = await res.json();
            errorMessageEle.innerHTML = data.errorMessage;
            throw new Error(data.errorMessage);
        }
        ;
        const data = await res.json();
        return data;
    };
})();
