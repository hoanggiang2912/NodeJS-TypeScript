import { User } from "./interfaces";

(_ => {
    const userLogin = JSON.parse(localStorage.getItem('userLogin') as string).userLogin as User;
    if (userLogin.role !== 'admin') {
        window.location.href = '/';
    }
})();