// ============================================================
//  PERFIL — Hotel Rincón del Carmen
// ============================================================

// ── Cargar admin desde JSON ──────────────────────────────────
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

// ── Cargar usuarios del localStorage ────────────────────────
function cargarUsuariosLocal() {
    const datos = localStorage.getItem('usuarios_plataforma');
    return datos ? JSON.parse(datos) : [];
}

// ── Obtener usuario activo (sessionStorage) ──────────────────
async function obtenerUsuarioActivo() {
    const emailActivo = sessionStorage.getItem('usuario_activo');
    if (!emailActivo) return null;

    const admin = await cargarAdmin();
    if (admin && admin.email === emailActivo) return admin;

    const usuarios = cargarUsuariosLocal();
    return usuarios.find(u => u.email === emailActivo) || null;
}

// ── Nombres legibles de habitaciones ────────────────────────
const NOMBRES_HABITACION = {
    'suite-presidencial':  'Suite Presidencial',
    'suite-junior':        'Suite Junior',
    'doble-deluxe':        'Doble Deluxe',
    'familiar-superior':   'Familiar Superior',
    'individual-ejecutiva':'Individual Ejecutiva',
};

function formatearNombre(slug) {
    return NOMBRES_HABITACION[slug] || slug;
}

// ── Renderizar reservas del usuario ──────────────────────────
function renderizarReservas(emailUsuario) {
    const seccion = document.getElementById('seccion-mis-reservas');
    const lista   = document.getElementById('lista-mis-reservas');

    // Todas las reservas guardadas
    const todasReservas = JSON.parse(localStorage.getItem('reservas_hotel')) || [];

    // Filtrar solo las del usuario activo (por email)
    const misReservas = todasReservas.filter(r => r.email === emailUsuario);

    if (misReservas.length === 0) {
        lista.innerHTML = `
            <div class="reserva-vacia">
                <span class="reserva-vacia-icono"></span>
                <p>No tienes reservas activas en este momento.</p>
            </div>
        `;
        return;
    }

    lista.innerHTML = '';

    misReservas.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        card.dataset.id = reserva.id;

        card.innerHTML = `
            <div class="reserva-card__header">
                <span class="reserva-hab-nombre">${formatearNombre(reserva.habitacion)}</span>
                <span class="reserva-badge">Activa</span>
            </div>
            <div class="reserva-card__body">
                <div class="reserva-dato">
                    <span class="reserva-icono">👤</span>
                    <div>
                        <span class="reserva-label">Titular</span>
                        <span class="reserva-valor">${reserva.nombre}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">👥</span>
                    <div>
                        <span class="reserva-label">Huéspedes</span>
                        <span class="reserva-valor">${reserva.huespedes}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">📅</span>
                    <div>
                        <span class="reserva-label">Check-in</span>
                        <span class="reserva-valor">${reserva.checkin}</span>
                    </div>
                </div>
                <div class="reserva-dato">
                    <span class="reserva-icono">📅</span>
                    <div>
                        <span class="reserva-label">Check-out</span>
                        <span class="reserva-valor">${reserva.checkout}</span>
                    </div>
                </div>
                ${reserva.peticiones ? `
                <div class="reserva-dato reserva-dato--full">
                    <span class="reserva-icono">📝</span>
                    <div>
                        <span class="reserva-label">Peticiones especiales</span>
                        <span class="reserva-valor">${reserva.peticiones}</span>
                    </div>
                </div>` : ''}
            </div>
        `;

        lista.appendChild(card);
    });
}

// ── Renderizar perfil completo ───────────────────────────────
async function renderizarPerfil() {
    const usuario = await obtenerUsuarioActivo();

    if (!usuario) {
        alert('No hay sesión activa. Redirigiendo al login...');
        window.location.href = 'index.html';
        return;
    }

    // Nombre
    document.getElementById('perfil-nombres').textContent = usuario.nombres;

    // Email
    document.getElementById('perfil-email').textContent = usuario.email;

    // Rol
    const rol = usuario.rol || 'usuario';
    const badge = document.getElementById('perfil-rol-badge');
    badge.textContent = rol === 'admin' ? 'Administrador' : 'Usuario';
    if (rol === 'admin') badge.classList.add('admin');
    document.getElementById('perfil-rol-texto').textContent =
        rol === 'admin' ? 'Administrador de la plataforma' : 'Usuario estándar';

    // Campos exclusivos de usuario normal
    if (rol === 'admin') {
        document.getElementById('fila-identificacion').style.display = 'none';
        document.getElementById('fila-telefono').style.display       = 'none';
        document.getElementById('fila-nacionalidad').style.display   = 'none';
        // Admin no ve la sección de reservas
        document.getElementById('seccion-mis-reservas').style.display = 'none';
    } else {
        document.getElementById('perfil-identificacion').textContent = usuario.identificacion || '—';
        document.getElementById('perfil-telefono').textContent       = usuario.telefono       || '—';
        document.getElementById('perfil-nacionalidad').textContent   = usuario.nacionalidad   || '—';
        // Mostrar reservas filtradas por email
        renderizarReservas(usuario.email);
    }
}

document.addEventListener('DOMContentLoaded', renderizarPerfil);