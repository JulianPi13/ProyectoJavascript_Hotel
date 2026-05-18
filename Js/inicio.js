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

            const getSlideOffset = () => {
                const anchoImagen = imagenes[0]?.clientWidth || contenedor.clientWidth;
                return anchoImagen + gap;
            };

            if (imagenes.length > 1) {
                setInterval(() => {
                    indiceActual = (indiceActual + 1) % imagenes.length;
                    const offset = getSlideOffset() * indiceActual;
                    track.style.transform = `translateX(-${offset}px)`;
                }, 4000);
            }
        }
    });

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

    async function obtenerUsuarioActivo() {
        const emailActivo = sessionStorage.getItem('usuario_activo');
        if (!emailActivo) return null;

        const admin = await cargarAdmin();
        if (admin && admin.email === emailActivo) {
            return admin;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios_plataforma') || '[]');
        return usuarios.find(u => u.email === emailActivo) || null;
    }

    async function actualizarVisiblePanelControl() {
        const enlacePanel = document.getElementById('nav-panelcontrol');
        if (!enlacePanel) return;

        const usuario = await obtenerUsuarioActivo();
        if (!usuario || usuario.rol !== 'admin') {
            enlacePanel.style.display = 'none';
        } else {
            enlacePanel.style.display = '';
        }
    }


    const enlaceCerrar = document.getElementById('cerrar-sesion');
    if (enlaceCerrar) {
        enlaceCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Cerraste sesión correctamente');
            sessionStorage.removeItem('usuario_activo');
            window.location.href = 'index.html';
        });
    }

    actualizarVisiblePanelControl();

});