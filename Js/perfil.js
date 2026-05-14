
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


// CARGAR USUARIOS LOCALES

function cargarUsuariosLocal() {
    const datos = localStorage.getItem('usuarios_plataforma');
    return datos ? JSON.parse(datos) : [];
}


// OBTENER USUARIO ACTIVO
// Guarda el email del usuario al iniciar sesión en sessionStorage

async function obtenerUsuarioActivo() {
    const emailActivo = sessionStorage.getItem('usuario_activo');
    if (!emailActivo) return null;

    // Revisar si es admin
    const admin = await cargarAdmin();
    if (admin && admin.email === emailActivo) {
        return admin;
    }

    // Revisar en usuarios locales
    const usuarios = cargarUsuariosLocal();
    return usuarios.find(u => u.email === emailActivo) || null;
}

// ========================
// RENDERIZAR PERFIL
// ========================
async function renderizarPerfil() {
    const usuario = await obtenerUsuarioActivo();

    if (!usuario) {
        alert("No hay sesión activa. Redirigiendo al login...");
        window.location.href = "index.html";
        return;
    }

    // Nombre
    document.getElementById("perfil-nombres").textContent = usuario.nombres;

    // Email
    document.getElementById("perfil-email").textContent = usuario.email;

    // Rol badge y texto
    const rol = usuario.rol || "usuario";
    const badge = document.getElementById("perfil-rol-badge");
    badge.textContent = rol === "admin" ? "Administrador" : "Usuario";
    if (rol === "admin") badge.classList.add("admin");
    document.getElementById("perfil-rol-texto").textContent =
        rol === "admin" ? "Administrador de la plataforma" : "Usuario estándar";

    // Campos exclusivos de usuario normal
    if (rol === "admin") {
        document.getElementById("fila-identificacion").style.display = "none";
        document.getElementById("fila-telefono").style.display = "none";
        document.getElementById("fila-nacionalidad").style.display = "none";
    } else {
        document.getElementById("perfil-identificacion").textContent = usuario.identificacion || "—";
        document.getElementById("perfil-telefono").textContent = usuario.telefono || "—";
        document.getElementById("perfil-nacionalidad").textContent = usuario.nacionalidad || "—";
    }

}

document.addEventListener("DOMContentLoaded", function () {
    renderizarPerfil();
});