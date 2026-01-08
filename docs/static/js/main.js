// ============================================
// NAVIGATION
// ============================================
// Nota: El hamburger menu ahora se maneja en navbar.js
// Este código se mantiene como fallback si navbar.js no se carga
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Solo inicializar si navbar.js no lo ha hecho ya
if (hamburger && navMenu && !hamburger.hasAttribute('data-navbar-initialized')) {
    hamburger.setAttribute('data-navbar-initialized', 'true');
    
    hamburger.addEventListener('click', () => {
        const isActive = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isActive);
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            // Actualizar aria-expanded
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !e.target.closest('.nav-menu') && 
            !e.target.closest('.hamburger')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Calcular offset dinámico según el tamaño de pantalla
            const isMobile = window.innerWidth < 768;
            const offset = isMobile ? 60 : 80;
            const offsetTop = target.offsetTop - offset;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// BACK TO TOP BUTTON
// ============================================
const backToTopButton = document.getElementById('backToTop');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .property-card, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your server
        console.log('Form data:', data);
        
        // Show success message
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
        
        // Reset form
        contactForm.reset();
    });
}

// ============================================
// NEWSLETTER FORM
// ============================================
const newsletterForms = document.querySelectorAll('.newsletter-form');

newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;
        
        // Here you would typically send the email to your server
        console.log('Newsletter subscription:', email);
        
        alert('¡Gracias por suscribirte!');
        form.reset();
    });
});

// ============================================
// SCROLL INDICATOR
// ============================================
const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    });
}

// ============================================
// PROPERTY CARD INTERACTIONS
// ============================================
document.querySelectorAll('.btn-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Here you would typically open the virtual tour
        alert('¡Próximamente! El paseo virtual estará disponible aquí.');
    });
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================
// CATEGORIES TOGGLE
// ============================================
document.querySelectorAll('.category-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevenir que se propague el evento
        
        const categoryCard = this.closest('.category-card');
        const subcategories = categoryCard.querySelector('.category-subcategories');
        const isActive = categoryCard.classList.contains('active');
        
        // Si la categoría actual está activa, cerrarla
        if (isActive) {
            categoryCard.classList.remove('active');
            this.setAttribute('aria-expanded', 'false');
            if (subcategories) {
                subcategories.style.maxHeight = '0px';
                subcategories.style.marginTop = '0px';
            }
            return;
        }
        
        // Cerrar todas las demás categorías primero
        document.querySelectorAll('.category-card').forEach(card => {
            if (card !== categoryCard) {
                card.classList.remove('active');
                const button = card.querySelector('.category-toggle');
                const subcats = card.querySelector('.category-subcategories');
                if (button) {
                    button.setAttribute('aria-expanded', 'false');
                }
                if (subcats) {
                    subcats.style.maxHeight = '0px';
                    subcats.style.marginTop = '0px';
                }
            }
        });
        
        // Abrir la categoría actual
        categoryCard.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
        
        // Calcular altura dinámica
        if (subcategories) {
            // Resetear primero para calcular correctamente
            subcategories.style.maxHeight = '0px';
            subcategories.style.marginTop = '0px';
            // Usar requestAnimationFrame para asegurar que el reset se aplique
            requestAnimationFrame(() => {
                const tempHeight = subcategories.scrollHeight;
                subcategories.style.maxHeight = tempHeight + 'px';
                subcategories.style.marginTop = '1.5rem';
            });
        }
    });
});

// Cerrar categorías al hacer click fuera
document.addEventListener('click', (e) => {
    if (!e.target.closest('.category-card') && !e.target.closest('.category-toggle')) {
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
            const button = card.querySelector('.category-toggle');
            const subcategories = card.querySelector('.category-subcategories');
            if (button) {
                button.setAttribute('aria-expanded', 'false');
            }
            if (subcategories) {
                subcategories.style.maxHeight = '0px';
                subcategories.style.marginTop = '0px';
            }
        });
    }
});

// ============================================
// LOADING ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

