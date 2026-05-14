function switchTab(tab) {
    const btnLogin = document.querySelectorAll('.tab-btn')[0];
    const btnRegistro = document.querySelectorAll('.tab-btn')[1];
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

        if (tab === 'login') {
            btnLogin.classList.add('active');
            btnRegistro.classList.remove('active');
            formLogin.classList.add('active');
            formRegistro.classList.remove('active');
        } else {
            btnRegistro.classList.add('active');
            btnLogin.classList.remove('active');
            formRegistro.classList.add('active');
            formLogin.classList.remove('active');
        }
    }