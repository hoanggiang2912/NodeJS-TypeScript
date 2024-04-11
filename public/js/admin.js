(_ => {
    const userLogin = JSON.parse(localStorage.getItem('userLogin')).userLogin;
    if (userLogin.role !== 'admin') {
        window.location.href = '/';
    }
})();
export {};
