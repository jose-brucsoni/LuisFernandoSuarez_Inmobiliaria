/**
 * Navbar Component Loader
 * Carga y configura el navbar reutilizable para todas las páginas
 */

// Configuración del navbar por página
const navbarConfig = {
    'index.html': {
        logoHref: '#inicio',
        showDestacadas: true,
        showSobreMi: true,
        activeItem: 'inicio',
        menuItems: [
            { href: '#inicio', label: 'Inicio', ariaLabel: 'Ir a la sección de inicio' },
            { href: '/Portafolio.html', label: 'Portafolio', ariaLabel: 'Ver portafolio completo' },
            { href: '#propiedades', label: 'Destacadas', ariaLabel: 'Ver propiedades destacadas' },
            { href: '#servicios', label: 'Servicios', ariaLabel: 'Conocer nuestros servicios' },
            { href: '#sobre-mi', label: 'Sobre Mí', ariaLabel: 'Conocer más sobre mí' },
            { href: '#contacto', label: 'Contacto', ariaLabel: 'Ponerse en contacto', isCTA: true }
        ]
    },
    'Inmueble.html': {
        logoHref: '/index.html',
        showDestacadas: false,
        showSobreMi: false,
        activeItem: null,
        menuItems: [
            { href: '/index.html', label: 'Inicio', ariaLabel: 'Ir al inicio' },
            { href: '/Portafolio.html', label: 'Portafolio', ariaLabel: 'Ver portafolio completo' },
            { href: '/index.html#servicios', label: 'Servicios', ariaLabel: 'Conocer nuestros servicios' },
            { href: '/index.html#contacto', label: 'Contacto', ariaLabel: 'Ponerse en contacto', isCTA: true }
        ]
    },
    'Portafolio.html': {
        logoHref: '/index.html',
        showDestacadas: false,
        showSobreMi: true,
        activeItem: 'portafolio',
        menuItems: [
            { href: '/index.html', label: 'Inicio', ariaLabel: 'Ir al inicio' },
            { href: '/Portafolio.html', label: 'Portafolio', ariaLabel: 'Ver portafolio completo' },
            { href: '/index.html#servicios', label: 'Servicios', ariaLabel: 'Conocer nuestros servicios' },
            { href: '/index.html#sobre-mi', label: 'Sobre Mí', ariaLabel: 'Conocer más sobre mí' },
            { href: '/index.html#contacto', label: 'Contacto', ariaLabel: 'Ponerse en contacto', isCTA: true }
        ]
    }
};

/**
 * Carga el navbar desde el componente HTML
 */
async function loadNavbar() {
    try {
        // Intentar diferentes rutas posibles
        const possiblePaths = [
            '/templates/components/navbar.html',
            'templates/components/navbar.html',
            '/components/navbar.html',
            'components/navbar.html'
        ];
        
        let response = null;
        let html = null;
        
        for (const path of possiblePaths) {
            try {
                response = await fetch(path);
                if (response.ok) {
                    html = await response.text();
                    break;
                }
            } catch (e) {
                continue;
            }
        }
        
        if (!html) {
            throw new Error('No se pudo cargar el navbar desde ninguna ruta');
        }
        
        // Buscar el placeholder o insertar al inicio del body
        const placeholder = document.getElementById('navbar-placeholder');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const navbar = tempDiv.firstElementChild;
        
        if (placeholder) {
            // Reemplazar el placeholder con el navbar
            placeholder.replaceWith(navbar);
        } else {
            // Si no hay placeholder, insertar al inicio del body
            const body = document.body;
            body.insertBefore(navbar, body.firstChild);
        }
        
        // Configurar el navbar según la página actual
        configureNavbar();
        
        // Inicializar funcionalidad del hamburger menu
        initializeNavbar();
        
    } catch (error) {
        console.error('Error al cargar el navbar:', error);
        // Fallback: mantener el navbar original si existe
    }
}

/**
 * Configura el navbar según la página actual
 */
function configureNavbar() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const config = navbarConfig[currentPage];
    
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

