// ============================================================
//  PANEL DE CONTROL — Hotel Rincón del Carmen
//  Fuente de verdad: localStorage['habitaciones']
//  Si no existe, se inicializa desde el JSON.
// ============================================================

const STORAGE_KEY = 'habitaciones';
const JSON_PATH   = 'Json/habitaciones.json';

// ── 1. Obtener datos (localStorage > JSON) ──────────────────
async function obtenerDatos() {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) {
        return JSON.parse(guardado);
    }
    // Primera vez: cargar desde el JSON y guardar en localStorage
    const respuesta = await fetch(JSON_PATH);
    const datos = await respuesta.json();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return datos;
}

// ── 2. Guardar datos en localStorage ───────────────────────
function guardarDatos(datos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
}

// ── 3. Rellenar formulario con datos de una habitación ──────
function rellenarFormulario(form, hab) {
    const item = form.closest('.room-item');

    // Campos simples
    setValue(form, 'precio',    hab.precio_por_noche);
    setValue(form, 'numero',    hab.habitacion_numero);
    setValue(form, 'area',      hab.area_m2);
    setValue(form, 'personas',  hab.max_personas);
    setValue(form, 'camas',     hab.camas);
    setValue(form, 'ubicacion', hab.ubicacion);
    setValue(form, 'descripcion', hab.descripcion);
    setValue(form, 'contacto',  hab.contacto_reserva);

    // Disponibilidad
    const radios = form.querySelectorAll(`input[name="disp_${hab.id}"]`);
    radios.forEach(r => { r.checked = (r.value === String(hab.disponibilidad)); });

    // Tags — servicios habitación
    rellenarTags(form.querySelector('[data-field="servicios"]'),       hab.servicios,       false);
    // Tags — servicios hotel
    rellenarTags(form.querySelector('[data-field="servicios_hotel"]'), hab.servicios_hotel, true);
}

function setValue(form, name, value) {
    const el = form.querySelector(`[name="${name}"]`);
    if (el) el.value = value ?? '';
}

function rellenarTags(contenedor, lista, esHotel) {
    if (!contenedor) return;
    contenedor.innerHTML = '';
    (lista || []).forEach(texto => {
        contenedor.appendChild(crearTag(texto, esHotel));
    });
}

function crearTag(texto, esHotel) {
    const span = document.createElement('span');
    span.className = 'tag' + (esHotel ? ' tag--hotel' : '');
    span.innerHTML = `${texto}<button type="button" class="tag-x">×</button>`;
    return span;
}

// ── 4. Leer formulario → objeto habitación actualizado ───────
function leerFormulario(form, habOriginal) {
    const get = name => form.querySelector(`[name="${name}"]`)?.value.trim() ?? '';

    const dispRadio = form.querySelector(`input[name="disp_${habOriginal.id}"]:checked`);
    const disponible = dispRadio ? dispRadio.value === 'true' : habOriginal.disponibilidad;

    const servicios = leerTags(form.querySelector('[data-field="servicios"]'));
    const servicios_hotel = leerTags(form.querySelector('[data-field="servicios_hotel"]'));

    return {
        ...habOriginal,
        precio_por_noche:  Number(get('precio'))   || habOriginal.precio_por_noche,
        habitacion_numero: Number(get('numero'))   || habOriginal.habitacion_numero,
        area_m2:           Number(get('area'))     || habOriginal.area_m2,
        max_personas:      Number(get('personas')) || habOriginal.max_personas,
        camas:             Number(get('camas'))    || habOriginal.camas,
        ubicacion:         get('ubicacion')        || habOriginal.ubicacion,
        descripcion:       get('descripcion')      || habOriginal.descripcion,
        contacto_reserva:  get('contacto')         || habOriginal.contacto_reserva,
        disponibilidad:    disponible,
        servicios,
        servicios_hotel,
    };
}

function leerTags(contenedor) {
    if (!contenedor) return [];
    return [...contenedor.querySelectorAll('.tag')].map(tag => {
        // Texto sin el botón ×
        const clone = tag.cloneNode(true);
        clone.querySelector('.tag-x')?.remove();
        return clone.textContent.trim();
    });
}

// ── 5. Actualizar cabecera del acordeón tras guardar ─────────
function actualizarCabecera(item, hab) {
    const badge = item.querySelector('.badge');
    const precio = item.querySelector('.room-price');
    const num   = item.querySelector('.room-num');
    const nombre = item.querySelector('.room-name');
    const meta  = item.querySelector('.room-meta');

    if (badge) {
        badge.textContent = hab.disponibilidad ? 'Disponible' : 'No disponible';
        badge.className   = 'badge ' + (hab.disponibilidad ? 'badge--on' : 'badge--off');
    }
    if (precio) {
        precio.innerHTML = `$${hab.precio_por_noche.toLocaleString('es-CO')}<small>/noche</small>`;
    }
    if (num)    num.textContent  = hab.habitacion_numero;
    if (nombre) nombre.textContent = hab.nombre;
    if (meta)   meta.textContent = `${hab.ubicacion} · ${hab.area_m2} m²`;
}

// ── 6. Toast de confirmación ─────────────────────────────────
function mostrarToast(texto, tipo = 'ok') {
    let toast = document.getElementById('pc-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'pc-toast';
        toast.style.cssText = `
            position:fixed; bottom:28px; right:28px; z-index:9999;
            padding:14px 22px; border-radius:10px; font-size:14px;
            font-weight:bold; font-family:Arial,sans-serif;
            box-shadow:0 4px 20px rgba(0,0,0,.5);
            transition:opacity .3s ease, transform .3s ease;
            opacity:0; transform:translateY(12px);
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = texto;
    toast.style.background = tipo === 'ok' ? '#1a3d10' : '#3d1010';
    toast.style.color       = tipo === 'ok' ? '#8ed06a' : '#e08080';
    toast.style.border      = `1px solid ${tipo === 'ok' ? '#2a5c18' : '#5c1818'}`;
    // Forzar reflow
    toast.offsetHeight;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateY(12px)';
    }, 2800);
}

// ── 7. INICIALIZACIÓN ────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

    const datos = await obtenerDatos();          // { habitaciones: [...] }
    const lista = datos.habitaciones;

    // 7a. Rellenar cada formulario con sus datos
    document.querySelectorAll('.room-form').forEach(form => {
        const roomId = parseInt(form.dataset.roomId, 10);
        const hab = lista.find(h => h.id === roomId);
        if (hab) rellenarFormulario(form, hab);
    });

    // 7b. Actualizar cabeceras con datos actuales
    document.querySelectorAll('.room-item').forEach(item => {
        const roomId = parseInt(item.dataset.id, 10);
        const hab = lista.find(h => h.id === roomId);
        if (hab) actualizarCabecera(item, hab);
    });

    // ── Acordeón ──
    document.querySelectorAll('.room-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.room-item');
            const isOpen = item.classList.contains('room-item--open');

            document.querySelectorAll('.room-item').forEach(i => {
                i.classList.remove('room-item--open');
                i.querySelector('.room-trigger').setAttribute('aria-expanded', 'false');
            });

            if (!isOpen) {
                item.classList.add('room-item--open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ── Tags: eliminar ──
    document.addEventListener('click', e => {
        if (e.target.classList.contains('tag-x')) {
            e.target.closest('.tag').remove();
        }
    });

    // ── Tags: agregar ──
    document.querySelectorAll('.tag-add').forEach(addRow => {
        const input = addRow.querySelector('.tag-input');
        const btnAdd = addRow.querySelector('.btn-add');
        const tagList = addRow.previousElementSibling;

        function addTag() {
            const val = input.value.trim();
            if (!val) return;
            const esHotel = tagList.dataset.field === 'servicios_hotel';
            tagList.appendChild(crearTag(val, esHotel));
            input.value = '';
            input.focus();
        }

        btnAdd.addEventListener('click', addTag);
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') { e.preventDefault(); addTag(); }
        });
    });

    // ── Guardar cambios ──
    document.querySelectorAll('.btn--save').forEach(btnSave => {
        btnSave.addEventListener('click', () => {
            const form   = btnSave.closest('.room-form');
            const item   = btnSave.closest('.room-item');
            const roomId = parseInt(form.dataset.roomId, 10);
            const idx    = lista.findIndex(h => h.id === roomId);

            if (idx === -1) return;

            const habActualizada = leerFormulario(form, lista[idx]);
            lista[idx] = habActualizada;
            guardarDatos({ habitaciones: lista });
            actualizarCabecera(item, habActualizada);
            mostrarToast('✓ Cambios guardados correctamente');
        });
    });

    // ── Cancelar: restaurar valores guardados ──
    document.querySelectorAll('.btn--cancel').forEach(btnCancel => {
        btnCancel.addEventListener('click', () => {
            const form   = btnCancel.closest('.room-form');
            const item   = btnCancel.closest('.room-item');
            const roomId = parseInt(form.dataset.roomId, 10);
            const hab    = lista.find(h => h.id === roomId);
            if (hab) {
                rellenarFormulario(form, hab);
                mostrarToast('Cambios descartados', 'err');
            }
            // Cerrar acordeón
            item.classList.remove('room-item--open');
            item.querySelector('.room-trigger').setAttribute('aria-expanded', 'false');
        });
    });

});