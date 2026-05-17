document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // CARRUSEL AUTOMÁTICO
    // =====================================================
    const contenedores = [
        ".buffet-img-container",
        ".gym-img-container",
        ".spa-img-container",
        ".zonas-humedas-img-container"
    ];

    contenedores.forEach(selector => {
        const contenedor = document.querySelector(selector);
        if (contenedor) {
            const track = contenedor.querySelector(".carrusel-track");
            const imagenes = track.querySelectorAll("img");
            let indiceActual = 0;
            const gap = 20; // debe coincidir con el gap del CSS

            if (imagenes.length > 1) {
                setInterval(() => {
                    indiceActual = (indiceActual + 1) % imagenes.length;
                    track.style.transform = `translateX(calc(-${indiceActual * 100}% - ${indiceActual * gap}px))`;
                }, 4000);
            }
        }
    });

    // =====================================================
    // SCROLL SUAVE — MENÚ RÁPIDO
    // =====================================================
    const botonesMenu = document.querySelectorAll(".btn-menu");

    botonesMenu.forEach(boton => {
        boton.addEventListener("click", () => {
            const targetId = boton.getAttribute("data-target");
            const destino = document.getElementById(targetId);
            if (destino) {
                // Offset para que el header sticky no tape el título
                const headerAltura = document.querySelector("header").offsetHeight;
                const posicion = destino.getBoundingClientRect().top + window.scrollY - headerAltura - 20;
                window.scrollTo({ top: posicion, behavior: "smooth" });
            }
        });
    });

});