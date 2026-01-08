// ============================================
// INMUEBLE - JAVASCRIPT
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentProperty = null;
let currentImageIndex = 0;
let propertyImages = [];

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadPropertyData();
    initializeEventListeners();
    initializeHamburger();
    initializeBackToTop();
});

// ============================================
// CARGAR DATOS DE LA PROPIEDAD
// ============================================
function loadPropertyData() {
    // Obtener ID de la propiedad desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const propertyId = urlParams.get('id');
    
    if (propertyId) {
        // Intentar cargar desde localStorage primero
        const savedProperties = JSON.parse(localStorage.getItem('publications') || '[]');
        currentProperty = savedProperties.find(p => p.id == propertyId);
        
        if (!currentProperty) {
            // Datos de ejemplo si no se encuentra
            currentProperty = getExampleProperty(propertyId);
        }
    } else {
        // Propiedad de ejemplo por defecto
        currentProperty = getExampleProperty(1);
    }
    
    // Renderizar los datos
    renderPropertyData();
    loadRelatedProperties();
}

// ============================================
// OBTENER PROPIEDAD DE EJEMPLO
// ============================================
function getExampleProperty(id) {
    const examples = {
        1: {
            id: 1,
            titulo: 'Casa Moderna en Zona Norte',
            categoria: 'venta',
            ubicacion: 'Zona Norte, Ciudad Principal',
            precio: 250000,
            area: 180,
            habitaciones: 3,
            banos: 2,
            descripcion: 'Hermosa casa moderna con acabados de primera calidad. Cuenta con amplios espacios, excelente iluminación natural y una ubicación privilegiada en una de las mejores zonas de la ciudad.\n\nLa propiedad incluye sala de estar amplia, comedor, cocina equipada, 3 habitaciones con closets, 2 baños completos, área de lavandería y estacionamiento para 2 vehículos.\n\nIdeal para familias que buscan confort, seguridad y cercanía a colegios, supermercados y centros comerciales.',
            ano: 2022,
            fecha: '2024-01-15',
            caracteristicas: [
                { label: 'Tipo de Propiedad', value: 'Casa', icon: 'home' },
                { label: 'Área Construida', value: '180 m²', icon: 'ruler-combined' },
                { label: 'Área de Terreno', value: '220 m²', icon: 'vector-square' },
                { label: 'Pisos', value: '2 Niveles', icon: 'layer-group' },
                { label: 'Estacionamientos', value: '2 Espacios', icon: 'car' },
                { label: 'Año de Construcción', value: '2022', icon: 'calendar' },
            ],
            amenidades: [
                'Cocina Equipada',
                'Closets Empotrados',
                'Balcón/Terraza',
                'Área de Lavandería',
                'Patio/Jardín',
                'Sistema de Seguridad',
                'Agua Caliente',
                'Internet Fibra Óptica',
            ],
            ubicacionMapa: 'https://maps.google.com/?q=Zona+Norte+Ciudad',
            imagenes: [],
            tourVirtual: null
        },
        2: {
            id: 2,
            titulo: 'Departamento con Vista Panorámica',
            categoria: 'alquiler',
            ubicacion: 'Centro, Edificio Premium',
            precio: 1800,
            area: 120,
            habitaciones: 2,
            banos: 2,
            descripcion: 'Moderno departamento con vista panorámica de la ciudad. Ubicado en el piso 15 de un edificio premium con todas las comodidades.\n\nIncluye 2 habitaciones, 2 baños, sala-comedor integrada, cocina americana equipada, balcón con vista espectacular y 1 estacionamiento.\n\nEl edificio cuenta con seguridad 24/7, ascensores, áreas comunes y gimnasio.',
            ano: 2021,
            fecha: '2024-01-12',
            caracteristicas: [
                { label: 'Tipo de Propiedad', value: 'Departamento', icon: 'building' },
                { label: 'Área Construida', value: '120 m²', icon: 'ruler-combined' },
                { label: 'Piso', value: '15to Piso', icon: 'layer-group' },
                { label: 'Estacionamientos', value: '1 Espacio', icon: 'car' },
                { label: 'Año de Construcción', value: '2021', icon: 'calendar' },
                { label: 'Amoblado', value: 'Semi-Amoblado', icon: 'couch' },
            ],
            amenidades: [
                'Vista Panorámica',
                'Balcón',
                'Cocina Equipada',
                'Closets Empotrados',
                'Gimnasio del Edificio',
                'Seguridad 24/7',
                'Ascensores',
                'Área Social',
            ],
            ubicacionMapa: 'https://maps.google.com/?q=Centro+Ciudad',
            imagenes: [],
            tourVirtual: null
        }
    };
    
    return examples[id] || examples[1];
}

// ============================================
// RENDERIZAR DATOS DE LA PROPIEDAD
// ============================================
function renderPropertyData() {
    if (!currentProperty) return;
    
    // Título de la página
    document.title = `${currentProperty.titulo} | Luis Fernando Suarez Brucsoni`;
    
    // Breadcrumb
    document.getElementById('breadcrumbTitle').textContent = currentProperty.titulo;
    
    // Header
    document.getElementById('propertyBadge').textContent = getCategoryName(currentProperty.categoria);
    document.getElementById('propertyBadge').className = `property-badge badge-${currentProperty.categoria}`;
    document.getElementById('propertyTitle').textContent = currentProperty.titulo;
    document.getElementById('propertyLocation').textContent = currentProperty.ubicacion;
    
    // Precio
    const formattedPrice = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(currentProperty.precio);
    document.getElementById('propertyPrice').textContent = formattedPrice;
    
    // Stats
    document.getElementById('statBedrooms').textContent = currentProperty.habitaciones;
    document.getElementById('statBathrooms').textContent = currentProperty.banos;
    document.getElementById('statArea').textContent = currentProperty.area;
    document.getElementById('statYear').textContent = currentProperty.ano || 'N/A';
    
    // Descripción
    const description = currentProperty.descripcion.split('\n').map(p => `<p>${p}</p>`).join('');
    document.getElementById('propertyDescription').innerHTML = description;
    
    // Características
    if (currentProperty.caracteristicas) {
        renderFeatures(currentProperty.caracteristicas);
    }
    
    // Amenidades
    if (currentProperty.amenidades) {
        renderAmenities(currentProperty.amenidades);
    }
    
    // Mapa
    if (currentProperty.ubicacionMapa) {
        document.getElementById('mapAddress').textContent = currentProperty.ubicacion;
        document.getElementById('mapLink').href = currentProperty.ubicacionMapa;
    }
    
    // Tour virtual
    if (currentProperty.tourVirtual) {
        document.getElementById('virtualTourSection').style.display = 'block';
    }
    
    // Galería de imágenes
    loadGallery();
    
    // Info sidebar
    document.getElementById('infoId').textContent = `LFS-${String(currentProperty.id).padStart(3, '0')}`;
    document.getElementById('infoDate').textContent = getTimeAgo(currentProperty.fecha);
    document.getElementById('infoViews').textContent = Math.floor(Math.random() * 500) + 50;
    document.getElementById('infoStatus').textContent = 'Disponible';
}

// ============================================
// RENDERIZAR CARACTERÍSTICAS
// ============================================
function renderFeatures(features) {
    const grid = document.getElementById('featuresGrid');
    grid.innerHTML = '';
    
    features.forEach(feature => {
        const item = document.createElement('div');
        item.className = 'feature-item';
        item.innerHTML = `
            <i class="fas fa-${feature.icon}"></i>
            <div class="feature-content">
                <div class="feature-label">${feature.label}</div>
                <div class="feature-value">${feature.value}</div>
            </div>
        `;
        grid.appendChild(item);
    });
}

// ============================================
// RENDERIZAR AMENIDADES
// ============================================
function renderAmenities(amenities) {
    const grid = document.getElementById('amenitiesGrid');
    grid.innerHTML = '';
    
    amenities.forEach(amenity => {
        const item = document.createElement('div');
        item.className = 'amenity-item';
        item.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${amenity}</span>
        `;
        grid.appendChild(item);
    });
}

// ============================================
// CARGAR GALERÍA DE IMÁGENES
// ============================================
function loadGallery() {
    // Si hay imágenes guardadas, usarlas
    if (currentProperty.imagenes && currentProperty.imagenes.length > 0) {
        propertyImages = currentProperty.imagenes;
    } else {
        // Usar placeholder gradient
        propertyImages = [
            { url: '', isPlaceholder: true }
        ];
    }
    
    currentImageIndex = 0;
    renderGallery();
}

function renderGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.getElementById('galleryThumbnails');
    const currentImageEl = document.getElementById('currentImage');
    const totalImagesEl = document.getElementById('totalImages');
    
    // Imagen principal
    if (propertyImages[currentImageIndex].isPlaceholder) {
        mainImage.style.display = 'none';
        mainImage.parentElement.style.background = 'linear-gradient(135deg, #9F564C 0%, #D84846 50%, #86817B 100%)';
    } else {
        mainImage.src = propertyImages[currentImageIndex].url;
        mainImage.style.display = 'block';
    }
    
    // Contador
    currentImageEl.textContent = currentImageIndex + 1;
    totalImagesEl.textContent = propertyImages.length;
    
    // Thumbnails
    if (propertyImages.length > 1) {
        thumbnails.innerHTML = '';
        propertyImages.forEach((img, index) => {
            const thumb = document.createElement('div');
            thumb.className = `gallery-thumb ${index === currentImageIndex ? 'active' : ''}`;
            
            if (!img.isPlaceholder) {
                const thumbImg = document.createElement('img');
                thumbImg.src = img.url;
                thumbImg.alt = `Vista ${index + 1}`;
                thumb.appendChild(thumbImg);
            } else {
                thumb.style.background = 'linear-gradient(135deg, #9F564C 0%, #D84846 50%, #86817B 100%)';
            }
            
            thumb.addEventListener('click', () => {
                currentImageIndex = index;
                renderGallery();
            });
            
            thumbnails.appendChild(thumb);
        });
    }
}

// ============================================
// CARGAR PROPIEDADES RELACIONADAS
// ============================================
function loadRelatedProperties() {
    const grid = document.getElementById('relatedPropertiesGrid');
    
    // Obtener propiedades del mismo tipo
    const savedProperties = JSON.parse(localStorage.getItem('publications') || '[]');
    let related = savedProperties.filter(p => 
        p.id !== currentProperty.id && 
        p.categoria === currentProperty.categoria &&
        p.estado === 'active'
    ).slice(0, 3);
    
    // Si no hay suficientes, agregar ejemplos
    if (related.length < 3) {
        const examples = [
            {
                id: 3,
                titulo: 'Villa con Jardín y Piscina',
                categoria: currentProperty.categoria,
                ubicacion: 'Zona Sur',
                precio: currentProperty.categoria === 'venta' ? 420000 : 3500,
                habitaciones: 4,
                banos: 3,
                area: 280
            },
            {
                id: 4,
                titulo: 'Casa Familiar Amplia',
                categoria: currentProperty.categoria,
                ubicacion: 'Zona Este',
                precio: currentProperty.categoria === 'venta' ? 180000 : 1500,
                habitaciones: 3,
                banos: 2,
                area: 150
            },
            {
                id: 5,
                titulo: 'Departamento Moderno',
                categoria: currentProperty.categoria,
                ubicacion: 'Centro',
                precio: currentProperty.categoria === 'venta' ? 150000 : 1200,
                habitaciones: 2,
                banos: 2,
                area: 95
            }
        ];
        related = [...related, ...examples].slice(0, 3);
    }
    
    grid.innerHTML = '';
    related.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
}

function createPropertyCard(property) {
    const card = document.createElement('a');
    card.href = `Inmueble.html?id=${property.id}`;
    card.className = 'property-card';
    
    const formattedPrice = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(property.precio);
    
    card.innerHTML = `
        <div class="property-image" style="background: linear-gradient(135deg, #9F564C 0%, #D84846 50%, #86817B 100%); height: 200px;"></div>
        <div class="property-info" style="padding: 1.5rem;">
            <h3 style="font-size: 1.125rem; margin-bottom: 0.5rem;">${property.titulo}</h3>
            <p style="color: var(--text-light); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-map-marker-alt"></i> ${property.ubicacion}
            </p>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap;">
                <span style="color: var(--text-light); font-size: 0.875rem;">
                    <i class="fas fa-bed"></i> ${property.habitaciones}
                </span>
                <span style="color: var(--text-light); font-size: 0.875rem;">
                    <i class="fas fa-bath"></i> ${property.banos}
                </span>
                <span style="color: var(--text-light); font-size: 0.875rem;">
                    <i class="fas fa-ruler-combined"></i> ${property.area} m²
                </span>
            </div>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--scarlet-rush);">${formattedPrice}</div>
        </div>
    `;
    
    return card;
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Navegación de galería
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    
    if (galleryPrev) {
        galleryPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + propertyImages.length) % propertyImages.length;
            renderGallery();
        });
    }
    
    if (galleryNext) {
        galleryNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            renderGallery();
        });
    }
    
    // Fullscreen/Lightbox
    const btnFullscreen = document.getElementById('btnFullscreen');
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (btnFullscreen) {
        btnFullscreen.addEventListener('click', () => {
            if (!propertyImages[currentImageIndex].isPlaceholder) {
                lightbox.classList.add('active');
                lightboxImage.src = propertyImages[currentImageIndex].url;
                updateLightboxCounter();
            }
        });
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => {
            lightbox.classList.remove('active');
        });
    }
    
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
            }
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + propertyImages.length) % propertyImages.length;
            if (!propertyImages[currentImageIndex].isPlaceholder) {
                lightboxImage.src = propertyImages[currentImageIndex].url;
                updateLightboxCounter();
                renderGallery();
            }
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % propertyImages.length;
            if (!propertyImages[currentImageIndex].isPlaceholder) {
                lightboxImage.src = propertyImages[currentImageIndex].url;
                updateLightboxCounter();
                renderGallery();
            }
        });
    }
    
    // Formulario de contacto
    const contactForm = document.getElementById('propertyContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }
    
    // Compartir
    const shareWhatsapp = document.getElementById('shareWhatsapp');
    const shareFacebook = document.getElementById('shareFacebook');
    const shareTwitter = document.getElementById('shareTwitter');
    const shareLink = document.getElementById('shareLink');
    
    const currentUrl = window.location.href;
    const shareText = `Mira esta propiedad: ${currentProperty.titulo}`;
    
    if (shareWhatsapp) {
        shareWhatsapp.addEventListener('click', () => {
            window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank');
        });
    }
    
    if (shareFacebook) {
        shareFacebook.addEventListener('click', () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        });
    }
    
    if (shareTwitter) {
        shareTwitter.addEventListener('click', () => {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
        });
    }
    
    if (shareLink) {
        shareLink.addEventListener('click', () => {
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('¡Enlace copiado al portapapeles!');
            });
        });
    }
    
    // Tour virtual
    const btnStartTour = document.getElementById('btnStartTour');
    if (btnStartTour) {
        btnStartTour.addEventListener('click', () => {
            if (currentProperty.tourVirtual) {
                window.open(currentProperty.tourVirtual, '_blank');
            } else {
                alert('Tour virtual próximamente disponible');
            }
        });
    }
}

// ============================================
// UTILIDADES
// ============================================
function getCategoryName(category) {
    const names = {
        'venta': 'Venta',
        'alquiler': 'Alquiler',
        'anticretico': 'Anticrético'
    };
    return names[category] || category;
}

function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
}

function updateLightboxCounter() {
    document.getElementById('lightboxCurrent').textContent = currentImageIndex + 1;
    document.getElementById('lightboxTotal').textContent = propertyImages.length;
}

// ============================================
// HAMBURGER MENU
// ============================================
function initializeHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// ============================================
// BACK TO TOP
// ============================================
function initializeBackToTop() {
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

