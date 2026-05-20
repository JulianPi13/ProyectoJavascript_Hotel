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

// CARGAR ADMIN DESDE JSON
async function cargarAdmin() {
    try {
        const respuesta = await fetch('Json/index.json');
        const datos = await respuesta.json();
        return datos.admin || null;
    } catch (error) {
        console.error('Error al cargar el admin desde JSON:', error);
        return null;
    }
}

// USUARIOS NORMALES — SOLO LOCALSTORAGE
function guardarUsuariosLocal(usuarios) {
    localStorage.setItem('usuarios_plataforma', JSON.stringify(usuarios));
}

function cargarUsuariosLocal() {
    const datos = localStorage.getItem('usuarios_plataforma');
    return datos ? JSON.parse(datos) : [];
}

// REGISTRAR USUARIO
async function registrarUsuario(event) {
    event.preventDefault();

    const nombres = document.getElementById("nombres").value.trim();
    const identificacion = document.getElementById("identificacion").value.trim();
    const email = document.getElementById("email").value.trim();
    const contraseña = document.getElementById("contraseña").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const nacionalidad = document.getElementById("nacionalidad").value.trim();

    if (!nombres || !identificacion || !email || !contraseña || !telefono || !nacionalidad) {
        mostrarAlerta("Por favor complete todos los campos.");
        return;
    }

    const admin = await cargarAdmin();
    if (admin && admin.email === email) {
        mostrarAlerta("No puedes registrarte con ese correo electrónico.");
        return;
    }

    const usuarios = cargarUsuariosLocal();
    const existe = usuarios.find(u => u.email === email);
    if (existe) {
        mostrarAlerta("Ya existe una cuenta registrada con ese correo electrónico.");
        return;
    }

    const nuevoUsuario = {
        nombres,
        identificacion,
        email,
        contraseña,
        telefono,
        nacionalidad,
        rol: "usuario"
    };

    usuarios.push(nuevoUsuario);
    guardarUsuariosLocal(usuarios);

    mostrarAlerta("¡Cuenta registrada correctamente! Ya puedes iniciar sesión.");
    document.getElementById("formRegistro").reset();
    switchTab('login');
}

// INICIAR SESIÓN
async function iniciarSesion() {
    const correo = document.getElementById("login-correo").value.trim();
    const contraseña = document.getElementById("login-password").value.trim();

    if (!correo || !contraseña) {
        mostrarAlerta("Por favor ingresa tu correo y contraseña.");
        return;
    }

    // 1. Verificar si es el admin (desde JSON)
    const admin = await cargarAdmin();
    if (admin && admin.email === correo && admin.contraseña === contraseña) {
        sessionStorage.setItem('usuario_activo', admin.email);
        sessionStorage.setItem('usuario_rol', 'admin');
        mostrarAlerta(`¡Bienvenido/a, ${admin.nombres}!`);
        window.location.href = "Inicio.html";
        return;
    }

    // 2. Verificar si es un usuario normal (desde localStorage)
    const usuarios = cargarUsuariosLocal();
    const usuario = usuarios.find(u => u.email === correo && u.contraseña === contraseña);

    if (usuario) {
        sessionStorage.setItem('usuario_activo', usuario.email);
        sessionStorage.setItem('usuario_rol', usuario.rol || 'usuario');
        mostrarAlerta(`¡Bienvenido/a, ${usuario.nombres}!`);
        window.location.href = "Inicio.html";
    } else {
        mostrarAlerta("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
    }
}

// MOSTRAR ALERTA
function mostrarAlerta(mensaje) {
    alert(mensaje);
}

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("formRegistro").addEventListener("submit", registrarUsuario);
    document.getElementById("btnLogin").addEventListener("click", iniciarSesion);
});