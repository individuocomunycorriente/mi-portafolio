/* ==========================================================================
   Navegación por pestañas (#hash)
   Todo el contenido ya está escrito en index.html (scrapeable). Este script
   solo muestra la sección del #hash actual y marca el enlace activo del menú.
   ========================================================================== */

const DEFAULT_SECTION = 'inicio';

const sections = document.querySelectorAll('.page-section');
const tabLinks = document.querySelectorAll('[data-tab]');
const experienceToggle = document.querySelector('[data-group="experiencia"]');
const main = document.getElementById('content');

const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

function showSection(id) {
    const target = document.getElementById(id);
    const isSection = target !== null && target.classList.contains('page-section');

    // 1. Ocultar todas las secciones y mostrar solo la solicitada (con animación)
    sections.forEach(section => section.classList.remove('is-active', 'animate-fade-in'));

    const oldNotFound = document.getElementById('not-found');
    if (oldNotFound) oldNotFound.remove();

    if (isSection) {
        void target.offsetWidth; // reinicia la animación de entrada
        target.classList.add('is-active', 'animate-fade-in');
    } else {
        // 2. Si la sección no existe, mostrar el mensaje de error
        main.insertAdjacentHTML('beforeend', `
            <div id="not-found" class="not-found animate-fade-in">
                <h2 class="not-found__title">Error 404</h2>
                <p class="not-found__text">La sección solicitada no existe.</p>
            </div>`);
    }

    // 3. Marcar el enlace activo en el menú de escritorio y en el móvil
    tabLinks.forEach(link => {
        const active = link.dataset.tab === id;
        link.classList.toggle('is-active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    if (experienceToggle) {
        experienceToggle.classList.toggle('is-active', id.startsWith('experiencia-'));
    }
}

function router() {
    const id = decodeURIComponent(window.location.hash.slice(1)) || DEFAULT_SECTION;
    showSection(id);

    // Volver al inicio de la página al cambiar de pestaña
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Menú móvil ---------------------------------------------------------------- */

function setMobileMenu(open) {
    mobileMenu.hidden = !open;
    mobileMenuButton.setAttribute('aria-expanded', String(open));
    mobileMenuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    menuIcon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}

mobileMenuButton.addEventListener('click', () => setMobileMenu(mobileMenu.hidden));

// Cerrar el menú al elegir cualquier enlace
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => setMobileMenu(false));
});

// Cerrar el menú si la pantalla pasa a tamaño escritorio
window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
    if (event.matches) setMobileMenu(false);
});

/* Inicio -------------------------------------------------------------------- */

window.addEventListener('hashchange', router);
router();

// Al cargar con un #hash el navegador salta solo a la sección; se corrige para partir arriba
window.addEventListener('load', () => window.scrollTo(0, 0));
