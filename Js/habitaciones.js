// ============================================================
//  HABITACIONES — Hotel Rincón del Carmen
//  Lee desde localStorage['habitaciones'] si existe,
//  si no, carga el JSON (igual que la primera vez en el panel).
// ============================================================

const STORAGE_KEY = 'habitaciones';
const JSON_PATH   = 'Json/habitaciones.json';

async function obtenerDatos() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
        return JSON.parse(guardado);
    }
    // Fallback: cargar desde JSON e inicializar localStorage
    const respuesta = await fetch(JSON_PATH);
    const datos = await respuesta.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return datos;
}

// ── Rellenar la página con los datos de la habitación ────────
async function cargarHabitacion(id) {
    try {
        const datos = await obtenerDatos();
        const habitacion = datos.habitaciones.find(h => h.id === id);

        if (!habitacion) {
            console.error('Habitación no encontrada. ID:', id);
            return;
        }

        // Datos básicos
        setTexto('habitacion-nombre',        habitacion.nombre);
        setTexto('habitacion-ubicacion',     `Ubicación: ${habitacion.ubicacion}`);
        setTexto('habitacion-descripcion',   habitacion.descripcion);
        setTexto('habitacion-numero',        `Habitación #${habitacion.habitacion_numero}`);
        setTexto('habitacion-area',          `${habitacion.area_m2} m²`);
        setTexto('habitacion-camas',         habitacion.camas);
        setTexto('habitacion-personas',      habitacion.max_personas);
        setTexto('habitacion-precio',        `$${habitacion.precio_por_noche.toLocaleString('es-CO')}`);

        // Disponibilidad
        const dispEl = document.getElementById('habitacion-disponibilidad');
        if (dispEl) {
            dispEl.textContent = habitacion.disponibilidad ? '✓ Disponible' : '✗ No disponible';
            dispEl.style.color = habitacion.disponibilidad ? '#8ed06a' : '#e08080';
        }

        // Servicios de la habitación
        rellenarLista('servicios-habitacion', habitacion.servicios);

        // Servicios del hotel
        rellenarLista('servicios-hotel', habitacion.servicios_hotel);

        // Contacto de reserva
        setTexto('contacto-reserva', habitacion.contacto_reserva);

        // Enlace tel: en botón/link de WhatsApp (si existe)
        const linkWa = document.getElementById('link-whatsapp');
        if (linkWa) {
            const numero = habitacion.contacto_reserva.replace(/\D/g, '');
            linkWa.href = `https://wa.me/${numero}`;
        }

    } catch (error) {
        console.error('Error al cargar la habitación:', error);
    }
}

function setTexto(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor ?? '';
}

function rellenarLista(id, items) {
    const ul = document.getElementById(id);
    if (!ul) return;
    ul.innerHTML = '';
    (items || []).forEach(texto => {
        const li = document.createElement('li');
        li.textContent = '✓ ' + texto;
        ul.appendChild(li);
    });
}

// ── Detectar qué habitación mostrar ─────────────────────────
function obtenerIdHabitacion() {
    // 1. Atributo data-habitacion-id en <body>
    const fromBody = parseInt(document.body.dataset.habitacionId, 10);
    if (Number.isInteger(fromBody) && fromBody >= 1) return fromBody;

    // 2. Parámetro ?id=N en la URL
    const params = new URLSearchParams(window.location.search);
    const fromUrl = parseInt(params.get('id'), 10);
    if (Number.isInteger(fromUrl) && fromUrl >= 1) return fromUrl;

    // 3. Default
    return 1;
}

document.addEventListener('DOMContentLoaded', () => {
    cargarHabitacion(obtenerIdHabitacion());
});