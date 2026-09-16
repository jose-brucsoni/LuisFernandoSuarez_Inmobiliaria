/**
 * Navbar Component Loader
 * Carga y configura el navbar reutilizable para todas las páginas
 */

// Configuración del navbar por página (Django: data-active-nav o pathname)
const navbarConfig = {
    'inicio': {
        logoHref: '#inicio',
        showDestacadas: true,
        showSobreMi: true,
        activeItem: 'inicio'
    },
    'portafolio': {
        logoHref: '/',
        showDestacadas: false,
        showSobreMi: true,
        activeItem: 'portafolio'
    },
    'inmueble': {
        logoHref: '/',
        showDestacadas: false,
        showSobreMi: false,
        activeItem: null
    },
    // Compatibilidad con rutas antiguas (archivos estáticos)
    'index.html': { logoHref: '#inicio', showDestacadas: true, showSobreMi: true, activeItem: 'inicio' },
    'Inmueble.html': { logoHref: '/', showDestacadas: false, showSobreMi: false, activeItem: null },
    'Portafolio.html': { logoHref: '/', showDestacadas: false, showSobreMi: true, activeItem: 'portafolio' }
};

/**
 * Obtiene la clave de configuración según pathname (Django URLs)
 */
function pathnameToPageKey(pathname) {
    if (!pathname || pathname === '/') return 'inicio';
    if (pathname.startsWith('/portafolio')) return 'portafolio';
    if (pathname.startsWith('/inmueble')) return 'inmueble';
    return pathname.split('/').filter(Boolean).pop() || 'inicio';
}

/**
 * Navbar: si ya está en el DOM (Django include), solo configurar e inicializar.
 * Si hay placeholder, cargar por fetch (modo estático).
 */
async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    const navbarInDom = document.querySelector('nav.navbar');

    if (navbarInDom && !placeholder) {
        // Django: navbar ya incluido en la plantilla
        configureNavbar();
        initializeNavbar();
        return;
    }

    try {
        const possiblePaths = ['/templates/components/navbar.html', 'templates/components/navbar.html', '/components/navbar.html', 'components/navbar.html'];
        let html = null;
        for (const path of possiblePaths) {
            try {
                const response = await fetch(path);
                if (response.ok) {
                    html = await response.text();
                    break;
                }
            } catch (e) { continue; }
        }
        if (!html) throw new Error('No se pudo cargar el navbar');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const navbar = tempDiv.firstElementChild;
        if (placeholder) placeholder.replaceWith(navbar);
        else document.body.insertBefore(navbar, document.body.firstChild);
        configureNavbar();
        initializeNavbar();
    } catch (error) {
        console.error('Error al cargar el navbar:', error);
    }
}

/**
 * Configura el navbar según la página actual
 */
function configureNavbar() {
    const dataNav = document.body.getAttribute('data-active-nav');
    const currentPage = (dataNav !== null && dataNav !== undefined) ? dataNav : pathnameToPageKey(window.location.pathname);
    const config = navbarConfig[currentPage] || navbarConfig['inicio'];
    
    if (!config) {
        console.warn(`No hay configuración para la página: ${currentPage}`);
        return;
    }
    
    // Configurar logo
    const logo = document.querySelector('.navbar .logo');
    if (logo) {
        logo.href = config.logoHref;
    }
    
    // Mostrar/ocultar items según la configuración
    const destacadasItem = document.querySelector('.nav-item-destacadas');
    const sobreMiItem = document.querySelector('.nav-item-sobre-mi');
    
    if (destacadasItem) {
        destacadasItem.style.display = config.showDestacadas ? 'list-item' : 'none';
    }
    
    if (sobreMiItem) {
        sobreMiItem.style.display = config.showSobreMi ? 'list-item' : 'none';
    }
    
    // Marcar item activo
    if (config.activeItem) {
        const activeLink = document.querySelector(`[data-nav-item="${config.activeItem}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

/**
 * Inicializa la funcionalidad del navbar (hamburger menu)
 */
function initializeNavbar() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Marcar como inicializado para evitar duplicación con main.js
    hamburger.setAttribute('data-navbar-initialized', 'true');
    
    // Cerrar menú al hacer clic en un enlace (móvil)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Cerrar menú al hacer clic fuera (móvil)
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 768) {
            if (navMenu.classList.contains('active') && 
                !e.target.closest('.nav-menu') && 
                !e.target.closest('.hamburger')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // Cerrar menú al redimensionar la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Cargar el navbar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNavbar);
} else {
    loadNavbar();
}

