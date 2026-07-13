async function router() {
    // 1. Obtener el hash de la URL actual (ej: 'sobre-mi') o ir a 'inicio' por defecto
    const hash = window.location.hash.replace('#', '') || 'inicio';
    const container = document.getElementById('content');

    try {
        // 2. Buscar e importar el archivo HTML correspondiente desde la carpeta de componentes
        const response = await fetch(`components/${hash}.html`);
        
        if (!response.ok) {
            throw new Error('Página no encontrada');
        }

        const htmlContent = await response.text();
        
        // 3. Inyectar el código HTML dentro de la sección principal con una animación
        container.innerHTML = `<div class="animate-fade-in">${htmlContent}</div>`;

    } catch (error) {
        console.error(error);
        container.innerHTML = `
            <div class="text-center py-20">
                <h2 class="text-2xl font-bold text-red-400">Error 404</h2>
                <p class="text-slate-400">La sección solicitada no existe.</p>
            </div>`;
    }

    // 4. Actualizar visualmente qué pestaña está seleccionada en el menú
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const tabName = link.getAttribute('data-tab');

        // Si el elemento no tiene data-tab (como el botón principal de Experiencia), lo saltamos
        if (!tabName) return;

        // CASO ESPECIAL: Si es el botón de "Contactar"
        if (tabName === 'contacto') {
            if (hash === 'contacto') {
                link.classList.remove('bg-blue-600');
                link.classList.add('bg-blue-500', 'ring-2', 'ring-blue-400');
            } else {
                link.classList.remove('bg-blue-500', 'ring-2', 'ring-blue-400');
                link.classList.add('bg-blue-600');
            }
            return;
        }

        // CASO NORMAL Y DROPDOWNS: Para el resto de las pestañas de texto
        if (tabName === hash) {
            // Si es un link dentro del dropdown, dale un fondo sutil además del texto azul
            if (hash === 'experiencia-academica' || hash === 'experiencia-laboral') {
                link.classList.add('text-blue-400', 'bg-slate-900/50');
                link.classList.remove('text-slate-400');
            } else {
                link.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
                link.classList.remove('text-slate-400');
            }
        } else {
            link.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400', 'bg-slate-900/50');
            link.classList.add('text-slate-400');
        }
    });

    // Mover la pantalla al inicio de la pestaña suavemente
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Escuchar cambios en la URL y al cargar el sitio por primera vez
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);