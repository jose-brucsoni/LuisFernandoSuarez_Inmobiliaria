// ============================================
// PORTAFOLIO - JAVASCRIPT
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let allProperties = [];
let filteredProperties = [];
let currentPage = 1;
const propertiesPerPage = 12;
let filters = {
    categoria: 'todas',
    habitaciones: 'todas',
    banos: 'todas',
    precioMin: null,
    precioMax: null,
    search: '',
    sortBy: 'recientes'
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeProperties();
    initializeEventListeners();
    applyFilters();
    
    // Inicializar back to top
    initializeBackToTop();
    
    // Inicializar menú hamburguesa
    initializeHamburger();
});

// ============================================
// DATOS DE PROPIEDADES (EJEMPLO)
// ============================================
function initializeProperties() {
    // En producción, esto vendría de una API o localStorage
    const savedProperties = JSON.parse(localStorage.getItem('publications') || '[]');
    
    if (savedProperties.length > 0) {
        allProperties = savedProperties.filter(p => p.estado === 'active');
    } else {
        // Datos de ejemplo
        allProperties = [
            {
                id: 1,
                titulo: 'Casa Moderna en Zona Norte',
                categoria: 'venta',
                ubicacion: 'Zona Norte',
                precio: 250000,
                area: 180,
                habitaciones: 3,
                banos: 2,
                descripcion: 'Hermosa casa moderna con acabados de primera',
                imagen: null,
                fecha: '2024-01-15'
            },
            {
                id: 2,
                titulo: 'Departamento con Vista Panorámica',
                categoria: 'alquiler',
                ubicacion: 'Centro',
                precio: 1800,
                area: 120,
                habitaciones: 2,
                banos: 2,
                descripcion: 'Departamento moderno con vista increíble',
                imagen: null,
                fecha: '2024-01-12'
            },
            {
                id: 3,
                titulo: 'Villa con Jardín y Piscina',
                categoria: 'venta',
                ubicacion: 'Zona Sur',
                precio: 420000,
                area: 280,
                habitaciones: 4,
                banos: 3,
                descripcion: 'Lujosa villa con amplios espacios',
                imagen: null,
                fecha: '2024-01-10'
            },
            {
                id: 4,
                titulo: 'Casa en Anticrético',
                categoria: 'anticretico',
                ubicacion: 'Zona Este',
                precio: 15000,
                area: 150,
                habitaciones: 3,
                banos: 2,
                descripcion: 'Casa cómoda en zona tranquila',
                imagen: null,
                fecha: '2024-01-08'
            },
            {
                id: 5,
                titulo: 'Oficina Comercial',
                categoria: 'venta',
                ubicacion: 'Centro',
                precio: 180000,
                area: 95,
                habitaciones: 0,
                banos: 1,
                descripcion: 'Oficina en zona comercial',
                imagen: null,
                fecha: '2024-01-05'
            },
            {
                id: 6,
                titulo: 'Departamento Familiar',
                categoria: 'alquiler',
                ubicacion: 'Zona Norte',
                precio: 1200,
                area: 100,
                habitaciones: 3,
                banos: 2,
                descripcion: 'Ideal para familias',
                imagen: null,
                fecha: '2024-01-03'
            },
            {
                id: 7,
                titulo: 'Casa de Campo',
                categoria: 'venta',
                ubicacion: 'Afueras',
                precio: 150000,
                area: 200,
                habitaciones: 3,
                banos: 2,
                descripcion: 'Perfecta para descansar',
                imagen: null,
                fecha: '2024-01-01'
            },
            {
                id: 8,
                titulo: 'Loft Moderno',
                categoria: 'alquiler',
                ubicacion: 'Centro',
                precio: 2000,
                area: 80,
                habitaciones: 1,
                banos: 1,
                descripcion: 'Estilo contemporáneo',
                imagen: null,
                fecha: '2023-12-28'
            }
        ];
    }
    
    // Actualizar contador total
    document.getElementById('totalProperties').textContent = allProperties.length;
}

// ============================================
// EVENT LISTENERS
// ============================================
function initializeEventListeners() {
    // Mobile filter toggle
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const filtersContainer = document.getElementById('filtersContainer');
    const btnCloseFilters = document.getElementById('btnCloseFilters');
    const btnApplyFilters = document.getElementById('btnApplyFilters');
    
    // Create overlay for mobile
    const overlay = document.createElement('div');
    overlay.className = 'filters-overlay';
    overlay.id = 'filtersOverlay';
    document.body.appendChild(overlay);
    
    if (mobileFilterToggle) {
        mobileFilterToggle.addEventListener('click', () => {
            filtersContainer.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (btnCloseFilters) {
        btnCloseFilters.addEventListener('click', closeFiltersPanel);
    }
    
    if (btnApplyFilters) {
        btnApplyFilters.addEventListener('click', closeFiltersPanel);
    }
    
    overlay.addEventListener('click', closeFiltersPanel);
    
    function closeFiltersPanel() {
        filtersContainer.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Filtros de chips (incluyendo featured)
    document.querySelectorAll('.filter-chip, .filter-chip-featured').forEach(chip => {
        chip.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value');
            
            // Remover active de hermanos
            this.parentElement.querySelectorAll('.filter-chip, .filter-chip-featured').forEach(c => {
                c.classList.remove('active');
            });
            
            // Agregar active a este
            this.classList.add('active');
            
            // Actualizar filtro
            filters[filterType] = filterValue;
            currentPage = 1;
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        });
    });
    
    // Precio mínimo/máximo
    const precioMin = document.getElementById('precioMin');
    const precioMax = document.getElementById('precioMax');
    
    if (precioMin) {
        precioMin.addEventListener('input', debounce(() => {
            filters.precioMin = precioMin.value ? parseFloat(precioMin.value) : null;
            currentPage = 1;
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        }, 500));
    }
    
    if (precioMax) {
        precioMax.addEventListener('input', debounce(() => {
            filters.precioMax = precioMax.value ? parseFloat(precioMax.value) : null;
            currentPage = 1;
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        }, 500));
    }
    
    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(() => {
            filters.search = searchInput.value.toLowerCase();
            currentPage = 1;
            
            // Show/hide clear button
            if (searchClear) {
                searchClear.style.display = searchInput.value ? 'block' : 'none';
            }
            
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        }, 300));
    }
    
    if (searchClear) {
        searchClear.addEventListener('click', () => {
            searchInput.value = '';
            filters.search = '';
            searchClear.style.display = 'none';
            currentPage = 1;
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        });
    }
    
    // Ordenar
    const sortBy = document.getElementById('sortBy');
    if (sortBy) {
        sortBy.addEventListener('change', () => {
            filters.sortBy = sortBy.value;
            updateActiveFilters();
            applyFilters();
        });
    }
    
    // Reset filtros
    const btnResetFilters = document.getElementById('btnResetFilters');
    if (btnResetFilters) {
        btnResetFilters.addEventListener('click', resetAllFilters);
    }
    
    // Paginación
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    
    if (btnPrevPage) {
        btnPrevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProperties();
                scrollToTop();
            }
        });
    }
    
    if (btnNextPage) {
        btnNextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderProperties();
                scrollToTop();
            }
        });
    }
    
    // Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Gracias por suscribirte! Te mantendremos informado de las mejores ofertas.');
            newsletterForm.reset();
        });
    }
}

// ============================================
// APLICAR FILTROS
// ============================================
function applyFilters() {
    showLoading();
    
    // Filtrar propiedades
    filteredProperties = allProperties.filter(property => {
        // Filtro de categoría
        if (filters.categoria !== 'todas' && property.categoria !== filters.categoria) {
            return false;
        }
        
        // Filtro de habitaciones
        if (filters.habitaciones !== 'todas') {
            const minHabitaciones = parseInt(filters.habitaciones);
            if (property.habitaciones < minHabitaciones) {
                return false;
            }
        }
        
        // Filtro de baños
        if (filters.banos !== 'todas') {
            const minBanos = parseInt(filters.banos);
            if (property.banos < minBanos) {
                return false;
            }
        }
        
        // Filtro de precio mínimo
        if (filters.precioMin !== null && property.precio < filters.precioMin) {
            return false;
        }
        
        // Filtro de precio máximo
        if (filters.precioMax !== null && property.precio > filters.precioMax) {
            return false;
        }
        
        // Filtro de búsqueda
        if (filters.search) {
            const searchLower = filters.search;
            const matchTitle = property.titulo.toLowerCase().includes(searchLower);
            const matchLocation = property.ubicacion.toLowerCase().includes(searchLower);
            const matchDescription = property.descripcion && property.descripcion.toLowerCase().includes(searchLower);
            
            if (!matchTitle && !matchLocation && !matchDescription) {
                return false;
            }
        }
        
        return true;
    });
    
    // Ordenar
    sortProperties();
    
    // Actualizar contador
    updateResultsCount();
    updateFilterCount();
    updateActiveFilters();
    
    // Renderizar después de un pequeño delay para mostrar loading
    setTimeout(() => {
        hideLoading();
        renderProperties();
    }, 300);
}

// ============================================
// ORDENAR PROPIEDADES
// ============================================
function sortProperties() {
    switch(filters.sortBy) {
        case 'precio-asc':
            filteredProperties.sort((a, b) => a.precio - b.precio);
            break;
        case 'precio-desc':
            filteredProperties.sort((a, b) => b.precio - a.precio);
            break;
        case 'area-desc':
            filteredProperties.sort((a, b) => b.area - a.area);
            break;
        case 'habitaciones-desc':
            filteredProperties.sort((a, b) => b.habitaciones - a.habitaciones);
            break;
        case 'recientes':
        default:
            filteredProperties.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
            break;
    }
}

// ============================================
// RENDERIZAR PROPIEDADES
// ============================================
function renderProperties() {
    const grid = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Mostrar empty state si no hay resultados
    if (filteredProperties.length === 0) {
        emptyState.style.display = 'block';
        document.getElementById('paginationContainer').style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        document.getElementById('paginationContainer').style.display = 'flex';
    }
    
    // Calcular propiedades a mostrar
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const propertiesToShow = filteredProperties.slice(startIndex, endIndex);
    
    // Crear cards
    propertiesToShow.forEach(property => {
        const card = createPropertyCard(property);
        grid.appendChild(card);
    });
    
    // Actualizar paginación
    updatePagination();
}

// ============================================
// CREAR CARD DE PROPIEDAD
// ============================================
function createPropertyCard(property) {
    const card = document.createElement('a');
    card.href = `/Inmueble.html?id=${property.id}`;
    card.className = 'property-card';
    card.style.textDecoration = 'none';
    card.style.color = 'inherit';
    
    const categoryNames = {
        'venta': 'Venta',
        'alquiler': 'Alquiler',
        'anticretico': 'Anticrético'
    };
    
    const formattedPrice = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    }).format(property.precio);
    
    card.innerHTML = `
        <div class="property-image">
            ${property.imagen ? 
                `<img src="${property.imagen}" alt="${property.titulo}">` :
                ''
            }
            <span class="property-badge badge-${property.categoria}">
                ${categoryNames[property.categoria] || property.categoria}
            </span>
            <div class="property-overlay">
                <span class="btn-view-property">
                    <i class="fas fa-info-circle"></i> Ver Detalles
                </span>
            </div>
        </div>
        <div class="property-info">
            <h3>${property.titulo}</h3>
            <p class="property-location">
                <i class="fas fa-map-marker-alt"></i> ${property.ubicacion}
            </p>
            <div class="property-details">
                ${property.habitaciones > 0 ? `
                    <span><i class="fas fa-bed"></i> ${property.habitaciones} Habitaciones</span>
                ` : ''}
                ${property.banos > 0 ? `
                    <span><i class="fas fa-bath"></i> ${property.banos} Baños</span>
                ` : ''}
                <span><i class="fas fa-ruler-combined"></i> ${property.area} m²</span>
            </div>
            <div class="property-price">${formattedPrice}</div>
        </div>
    `;
    
    return card;
}

// ============================================
// ACTUALIZAR PAGINACIÓN
// ============================================
function updatePagination() {
    const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);
    const btnPrevPage = document.getElementById('btnPrevPage');
    const btnNextPage = document.getElementById('btnNextPage');
    const paginationPages = document.getElementById('paginationPages');
    
    // Actualizar botones
    if (btnPrevPage) {
        btnPrevPage.disabled = currentPage === 1;
    }
    
    if (btnNextPage) {
        btnNextPage.disabled = currentPage >= totalPages;
    }
    
    // Generar números de página
    if (paginationPages) {
        paginationPages.innerHTML = '';
        
        const maxPagesToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
        
        if (endPage - startPage < maxPagesToShow - 1) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-page ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderProperties();
                scrollToTop();
            });
            paginationPages.appendChild(pageBtn);
        }
    }
}

// ============================================
// ACTUALIZAR CONTADOR DE RESULTADOS
// ============================================
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const count = filteredProperties.length;
        resultsCount.textContent = `${count} ${count === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;
    }
}

// ============================================
// RESET FILTROS
// ============================================
function resetAllFilters() {
    // Reset filtros
    filters = {
        categoria: 'todas',
        habitaciones: 'todas',
        banos: 'todas',
        precioMin: null,
        precioMax: null,
        search: '',
        sortBy: 'recientes'
    };
    
    // Reset UI
    document.querySelectorAll('.filter-chip, .filter-chip-featured').forEach(chip => {
        chip.classList.remove('active');
        if (chip.getAttribute('data-value') === 'todas') {
            chip.classList.add('active');
        }
    });
    
    const precioMin = document.getElementById('precioMin');
    const precioMax = document.getElementById('precioMax');
    const searchInput = document.getElementById('searchInput');
    const searchClear = document.getElementById('searchClear');
    const sortBy = document.getElementById('sortBy');
    
    if (precioMin) precioMin.value = '';
    if (precioMax) precioMax.value = '';
    if (searchInput) searchInput.value = '';
    if (searchClear) searchClear.style.display = 'none';
    if (sortBy) sortBy.value = 'recientes';
    
    currentPage = 1;
    updateFilterCount();
    updateActiveFilters();
    applyFilters();
}

// ============================================
// ACTUALIZAR CONTADOR DE FILTROS ACTIVOS
// ============================================
function updateFilterCount() {
    const filterCount = document.getElementById('filterCount');
    if (!filterCount) return;
    
    let activeCount = 0;
    
    if (filters.categoria !== 'todas') activeCount++;
    if (filters.habitaciones !== 'todas') activeCount++;
    if (filters.banos !== 'todas') activeCount++;
    if (filters.precioMin !== null) activeCount++;
    if (filters.precioMax !== null) activeCount++;
    if (filters.search !== '') activeCount++;
    
    if (activeCount > 0) {
        filterCount.textContent = activeCount;
        filterCount.style.display = 'inline-block';
    } else {
        filterCount.style.display = 'none';
    }
}

// ============================================
// ACTUALIZAR FILTROS ACTIVOS (TAGS)
// ============================================
function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    if (!activeFiltersContainer) return;
    
    activeFiltersContainer.innerHTML = '';
    
    const filterLabels = {
        categoria: { venta: 'Venta', alquiler: 'Alquiler', anticretico: 'Anticrético' },
        habitaciones: (val) => `${val}+ Habitaciones`,
        banos: (val) => `${val}+ Baños`
    };
    
    // Categoría
    if (filters.categoria !== 'todas') {
        addFilterTag(filterLabels.categoria[filters.categoria], () => {
            document.querySelector('[data-filter="categoria"][data-value="todas"]').click();
        });
    }
    
    // Habitaciones
    if (filters.habitaciones !== 'todas') {
        addFilterTag(filterLabels.habitaciones(filters.habitaciones), () => {
            document.querySelector('[data-filter="habitaciones"][data-value="todas"]').click();
        });
    }
    
    // Baños
    if (filters.banos !== 'todas') {
        addFilterTag(filterLabels.banos(filters.banos), () => {
            document.querySelector('[data-filter="banos"][data-value="todas"]').click();
        });
    }
    
    // Precio
    if (filters.precioMin !== null || filters.precioMax !== null) {
        let priceText = 'Precio: ';
        if (filters.precioMin && filters.precioMax) {
            priceText += `$${filters.precioMin} - $${filters.precioMax}`;
        } else if (filters.precioMin) {
            priceText += `Desde $${filters.precioMin}`;
        } else {
            priceText += `Hasta $${filters.precioMax}`;
        }
        addFilterTag(priceText, () => {
            document.getElementById('precioMin').value = '';
            document.getElementById('precioMax').value = '';
            filters.precioMin = null;
            filters.precioMax = null;
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        });
    }
    
    // Búsqueda
    if (filters.search !== '') {
        addFilterTag(`"${filters.search}"`, () => {
            document.getElementById('searchInput').value = '';
            document.getElementById('searchClear').style.display = 'none';
            filters.search = '';
            updateFilterCount();
            updateActiveFilters();
            applyFilters();
        });
    }
    
    function addFilterTag(text, onRemove) {
        const tag = document.createElement('div');
        tag.className = 'active-filter-tag';
        tag.innerHTML = `
            ${text}
            <i class="fas fa-times"></i>
        `;
        tag.querySelector('i').addEventListener('click', onRemove);
        activeFiltersContainer.appendChild(tag);
    }
}

// ============================================
// FILTRAR POR CATEGORÍA (DESDE FOOTER)
// ============================================
function filterByCategory(categoria) {
    // Reset otros filtros
    resetAllFilters();
    
    // Aplicar filtro de categoría
    filters.categoria = categoria;
    
    // Actualizar UI del filtro
    document.querySelectorAll('[data-filter="categoria"]').forEach(chip => {
        chip.classList.remove('active');
        if (chip.getAttribute('data-value') === categoria) {
            chip.classList.add('active');
        }
    });
    
    // Scroll to filters
    document.querySelector('.filters-section').scrollIntoView({ behavior: 'smooth' });
    
    // Aplicar filtros
    applyFilters();
}

// ============================================
// LOADING STATE
// ============================================
function showLoading() {
    const loadingState = document.getElementById('loadingState');
    const grid = document.getElementById('propertiesGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (grid) grid.style.display = 'none';
    if (emptyState) emptyState.style.display = 'none';
    if (loadingState) loadingState.style.display = 'block';
}

function hideLoading() {
    const loadingState = document.getElementById('loadingState');
    const grid = document.getElementById('propertiesGrid');
    
    if (loadingState) loadingState.style.display = 'none';
    if (grid) grid.style.display = 'grid';
}

// ============================================
// UTILIDADES
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// BACK TO TOP BUTTON
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
            hamburger.setAttribute('aria-expanded', 
                navMenu.classList.contains('active'));
        });
        
        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
        
        // Cerrar menú al hacer clic fuera
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
    }
}

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.resetAllFilters = resetAllFilters;
window.filterByCategory = filterByCategory;

