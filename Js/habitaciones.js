// CARGAR DATOS DE LA HABITACIÓN DESDE EL JSON
async function cargarHabitacion(id) {
    try {
        const respuesta = await fetch('Json/habitaciones.json');
        const datos = await respuesta.json();
        const habitacion = datos.habitaciones.find(h => h.id === id);

        if (!habitacion) {
            console.error('Habitación no encontrada');
            return;
        }

        // Llenar los datos en la página
        document.getElementById('habitacion-nombre').textContent = habitacion.nombre;
        document.getElementById('habitacion-ubicacion').textContent = `Ubicación: ${habitacion.ubicacion}`;
        document.getElementById('habitacion-descripcion').textContent = habitacion.descripcion;
        document.getElementById('habitacion-numero').textContent = `Habitación #${habitacion.habitacion_numero}`;
        document.getElementById('habitacion-area').textContent = `${habitacion.area_m2} m²`;
        document.getElementById('habitacion-camas').textContent = habitacion.camas;
        document.getElementById('habitacion-personas').textContent = habitacion.max_personas;
        document.getElementById('habitacion-precio').textContent = `$${habitacion.precio_por_noche.toLocaleString('es-CO')}`;
        document.getElementById('habitacion-disponibilidad').textContent = habitacion.disponibilidad ? '✓ Disponible' : '✗ No disponible';
        
        // Servicios de la habitación
        const serviciosHabitacion = document.getElementById('servicios-habitacion');
        serviciosHabitacion.innerHTML = '';
        habitacion.servicios.forEach(servicio => {
            const li = document.createElement('li');
            li.textContent = '✓ ' + servicio;
            serviciosHabitacion.appendChild(li);
        });

        // Servicios del hotel
        const serviciosHotel = document.getElementById('servicios-hotel');
        serviciosHotel.innerHTML = '';
        habitacion.servicios_hotel.forEach(servicio => {
            const li = document.createElement('li');
            li.textContent = '✓ ' + servicio;
            serviciosHotel.appendChild(li);
        });

        // Contacto de reserva
        document.getElementById('contacto-reserva').textContent = habitacion.contacto_reserva;

    } catch (error) {
        console.error('Error al cargar la habitación:', error);
    }
}

function obtenerIdHabitacion() {
    // Primero leer el id explícito que se puede definir en el HTML
    const habitacionIdBody = parseInt(document.body.dataset.habitacionId, 10);
    if (Number.isInteger(habitacionIdBody) && habitacionIdBody >= 1) {
        return habitacionIdBody;
    }

    // Luego buscar un parámetro explícito en la URL
    const params = new URLSearchParams(window.location.search);
    const idParam = parseInt(params.get('id'), 10);
    if (Number.isInteger(idParam) && idParam >= 1) {
        return idParam;
    }

    // Valor por defecto
    return 1;
}

// Cargar la habitación solicitada por el atributo data-habitacion-id o por ?id=3
document.addEventListener('DOMContentLoaded', function () {
    const habitacionId = obtenerIdHabitacion();
    cargarHabitacion(habitacionId);
});