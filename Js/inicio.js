document.addEventListener("DOMContentLoaded", () => {
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
            const gap = 20; // DEBE SER EL MISMO QUE PUSISTE EN EL CSS

            if (imagenes.length > 1) {
                setInterval(() => {
                    indiceActual = (indiceActual + 1) % imagenes.length;
                    
                    // CÁLCULO MÁGICO: 
                    // Movemos el 100% del ancho + los pixeles del gap
                    track.style.transform = `translateX(calc(-${indiceActual * 100}% - ${indiceActual * gap}px))`;
                }, 4000);
            }
        }
    });
});