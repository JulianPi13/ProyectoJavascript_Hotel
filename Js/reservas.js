document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector(".formulario-reserva");

    formulario.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Capturar los valores ingresados por el usuario
        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const habitacion = document.getElementById("habitacion").value;
        const huespedes = document.getElementById("huespedes").value;
        const peticiones = document.getElementById("peticiones").value;
        
        // Convertimos las fechas ingresadas a objetos Date para poder compararlas matemáticamente
        const checkinNueva = new Date(document.getElementById("checkin").value);
        const checkoutNueva = new Date(document.getElementById("checkout").value);

        // Validación básica: Que la fecha de salida no sea antes de la de entrada
        if (checkoutNueva <= checkinNueva) {
            alert("❌ Error: La fecha de salida (Check-Out) debe ser posterior a la fecha de entrada (Check-In).");
            return;
        }

        // 2. Obtener las reservas existentes del localStorage (o crear un arreglo vacío si es la primera)
        const reservasExistentes = JSON.parse(localStorage.getItem("reservas_hotel")) || [];

        // 3. Verificar si hay un choque de fechas para la MISMA habitación
        const existeChoque = reservasExistentes.some(reserva => {
            // Solo nos interesan las reservas previas de la MISMA habitación elegida
            if (reserva.habitacion === habitacion) {
                const checkinExistente = new Date(reserva.checkin);
                const checkoutExistente = new Date(reserva.checkout);

                return (checkinNueva <= checkoutExistente && checkoutNueva >= checkinExistente);
            }
            return false;
        });

        // 4. Actuar según el resultado de la verificación
        if (existeChoque) {
            alert(`⚠️ Lo sentimos. La habitación "${formatearNombreHabitacion(habitacion)}" ya está reservada en las fechas seleccionadas. Por favor, intenta con otro rango de días.`);
        } else {
            // Si no hay choque, construimos el objeto de la nueva reserva
            const nuevaReserva = {
                id: Date.now(), // ID único basado en el tiempo exacto
                nombre,
                email,
                habitacion,
                huespedes,
                peticiones,
                checkin: document.getElementById("checkin").value, // Guardamos como texto para recuperarlo fácil
                checkout: document.getElementById("checkout").value
            };

            // Guardamos la nueva reserva en nuestra lista y la subimos al localStorage
            reservasExistentes.push(nuevaReserva);
            localStorage.setItem("reservas_hotel", JSON.stringify(reservasExistentes));

            alert(`✅ ¡Reserva confirmada con éxito, ${nombre}! Te esperamos para tu estadía.`);
            formulario.reset(); // Limpia los campos del formulario automáticamente
        }
    });
});

// Función auxiliar para que las alertas muestren el nombre de la habitación elegante
function formatearNombreHabitacion(slug) {
    const nombres = {
        "suite-presidencial": "Suite Presidencial",
        "suite-junior": "Suite Junior",
        "doble-deluxe": "Doble Deluxe",
        "familiar-superior": "Familiar Superior",
        "individual-ejecutiva": "Individual Ejecutiva"
    };
    return nombres[slug] || slug;
}