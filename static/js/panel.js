// ============================================
// PANEL ADMINISTRACIÓN - JAVASCRIPT
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let publications = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentSection = 'dashboard';

// ============================================
// SIDEBAR TOGGLE
// ============================================
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const sidebarToggle = document.getElementById('sidebarToggle');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.add('active');
    });
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
}

// Cerrar sidebar al hacer click fuera en móviles
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (sidebar.classList.contains('active') && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle')) {
            sidebar.classList.remove('active');
        }
    }
});

// ============================================
// NAVEGACIÓN ENTRE SECCIONES
// ============================================
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        
        // Actualizar links activos
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Mostrar sección correspondiente
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            currentSection = sectionId;
            
            // Actualizar título de página
            const sectionNames = {
                'dashboard': 'Dashboard',
                'publicaciones': 'Publicaciones',
                'estadisticas': 'Estadísticas',
                'configuracion': 'Configuración'
            };
            pageTitle.textContent = sectionNames[sectionId] || 'Panel';
            
            // Cargar datos de la sección
            loadSectionData(sectionId);
        }
        
        // Cerrar sidebar en móviles
        if (window.innerWidth < 768) {
            sidebar.classList.remove('active');
        }
    });
});

// ============================================
// CARGAR DATOS DE SECCIÓN
// ============================================
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'publicaciones':
            loadPublications();
            break;
        case 'estadisticas':
            loadStatistics();
            break;
    }
}

// ============================================
// DASHBOARD DATA
// ============================================
function loadDashboardData() {
    // Simular datos (en producción vendrían del servidor)
    const stats = {
        totalPublicaciones: 24,
        totalVisitas: 1248,
        totalContactos: 18,
        tasaConversion: 12.5
    };
    
    // Actualizar estadísticas
    updateElement('totalPublicaciones', stats.totalPublicaciones);
    updateElement('totalVisitas', formatNumber(stats.totalVisitas));
    updateElement('totalContactos', stats.totalContactos);
    updateElement('tasaConversion', stats.tasaConversion + '%');
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        // Animación de conteo
        animateValue(element, 0, value, 1000);
    }
}

function animateValue(element, start, end, duration) {
    const isNumber = typeof end === 'number';
    const endValue = isNumber ? end : parseFloat(end.toString().replace(/[^0-9.]/g, ''));
    const suffix = isNumber ? '' : end.toString().replace(/[0-9.]/g, '');
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (endValue - start) + start);
        element.textContent = isNumber ? current : current + suffix;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// ============================================
// PUBLICACIONES - DATOS DE EJEMPLO
// ============================================
function initializePublications() {
    publications = [
        {
            id: 1,
            titulo: 'Casa Moderna en Zona Norte',
            categoria: 'venta',
            estado: 'active',
            visitas: 245,
            fecha: '2024-01-15',
            precio: 250000,
            ubicacion: 'Zona Norte'
        },
        {
            id: 2,
            titulo: 'Departamento con Vista Panorámica',
            categoria: 'alquiler',
            estado: 'active',
            visitas: 189,
            fecha: '2024-01-12',
            precio: 1800,
            ubicacion: 'Centro'
        },
        {
            id: 3,
            titulo: 'Villa con Jardín y Piscina',
            categoria: 'venta',
            estado: 'active',
            visitas: 312,
            fecha: '2024-01-10',
            precio: 420000,
            ubicacion: 'Zona Sur'
        },
        {
            id: 4,
            titulo: 'Casa en Anticrético',
            categoria: 'anticretico',
            estado: 'draft',
            visitas: 45,
            fecha: '2024-01-08',
            precio: 15000,
            ubicacion: 'Zona Este'
        },
        {
            id: 5,
            titulo: 'Oficina Comercial',
            categoria: 'venta',
            estado: 'inactive',
            visitas: 98,
            fecha: '2024-01-05',
            precio: 180000,
            ubicacion: 'Centro'
        }
    ];
}

// ============================================
// CARGAR PUBLICACIONES
// ============================================
function loadPublications() {
    if (publications.length === 0) {
        initializePublications();
    }
    
    renderPublicationsTable();
    updatePagination();
}

function renderPublicationsTable() {
    const tbody = document.getElementById('publicationsTableBody');
    if (!tbody) return;
    
    // Filtrar publicaciones
    const filtered = filterPublications();
    
    // Calcular paginación
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPublications = filtered.slice(startIndex, endIndex);
    
    // Limpiar tabla
    tbody.innerHTML = '';
    
    if (paginatedPublications.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    No se encontraron publicaciones
                </td>
            </tr>
        `;
        return;
    }
    
    // Renderizar filas
    paginatedPublications.forEach(pub => {
        const row = createPublicationRow(pub);
        tbody.appendChild(row);
    });
}

function createPublicationRow(pub) {
    const tr = document.createElement('tr');
    
    const categoryNames = {
        'venta': 'Venta',
        'alquiler': 'Alquiler',
        'anticretico': 'Anticrético'
    };
    
    const statusNames = {
        'active': 'Activa',
        'inactive': 'Inactiva',
        'draft': 'Borrador'
    };
    
    const formattedDate = new Date(pub.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    tr.innerHTML = `
        <td>#${pub.id}</td>
        <td><strong>${pub.titulo}</strong></td>
        <td><span class="status-badge">${categoryNames[pub.categoria] || pub.categoria}</span></td>
        <td><span class="status-badge status-${pub.estado}">${statusNames[pub.estado] || pub.estado}</span></td>
        <td>${pub.visitas}</td>
        <td>${formattedDate}</td>
        <td>
            <div class="table-actions">
                <button class="btn-table" onclick="editPublication(${pub.id})" aria-label="Editar publicación">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-table" onclick="deletePublication(${pub.id})" aria-label="Eliminar publicación">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn-table" onclick="viewPublication(${pub.id})" aria-label="Ver publicación">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// ============================================
// FILTROS
// ============================================
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterCategory = document.getElementById('filterCategory');

if (searchInput) {
    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderPublicationsTable();
        updatePagination();
    });
}

if (filterStatus) {
    filterStatus.addEventListener('change', () => {
        currentPage = 1;
        renderPublicationsTable();
        updatePagination();
    });
}

if (filterCategory) {
    filterCategory.addEventListener('change', () => {
        currentPage = 1;
        renderPublicationsTable();
        updatePagination();
    });
}

function filterPublications() {
    let filtered = [...publications];
    
    // Filtro de búsqueda
    const searchTerm = searchInput?.value.toLowerCase() || '';
    if (searchTerm) {
        filtered = filtered.filter(pub => 
            pub.titulo.toLowerCase().includes(searchTerm) ||
            pub.ubicacion.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtro de estado
    const statusFilter = filterStatus?.value || 'all';
    if (statusFilter !== 'all') {
        filtered = filtered.filter(pub => pub.estado === statusFilter);
    }
    
    // Filtro de categoría
    const categoryFilter = filterCategory?.value || 'all';
    if (categoryFilter !== 'all') {
        filtered = filtered.filter(pub => pub.categoria === categoryFilter);
    }
    
    return filtered;
}

// ============================================
// PAGINACIÓN
// ============================================
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');

if (prevPageBtn) {
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPublicationsTable();
            updatePagination();
        }
    });
}

if (nextPageBtn) {
    nextPageBtn.addEventListener('click', () => {
        const filtered = filterPublications();
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPublicationsTable();
            updatePagination();
        }
    });
}

function updatePagination() {
    const filtered = filterPublications();
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    
    if (pageInfo) {
        pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    }
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalPages;
    }
}

// ============================================
// MODAL DE PUBLICACIÓN
// ============================================
const publicationModal = document.getElementById('publicationModal');
const modalTitle = document.getElementById('modalTitle');
const publicationForm = document.getElementById('publicationForm');
const modalClose = document.getElementById('modalClose');
const modalCancel = document.getElementById('modalCancel');
const btnAgregarPublicacion = document.getElementById('btnAgregarPublicacion');
const btnNuevaPublicacion = document.getElementById('btnNuevaPublicacion');
let editingPublicationId = null;

if (btnAgregarPublicacion) {
    btnAgregarPublicacion.addEventListener('click', () => openPublicationModal());
}

if (btnNuevaPublicacion) {
    btnNuevaPublicacion.addEventListener('click', () => openPublicationModal());
}

if (modalClose) {
    modalClose.addEventListener('click', () => closePublicationModal());
}

if (modalCancel) {
    modalCancel.addEventListener('click', () => closePublicationModal());
}

// Cerrar modal al hacer click fuera
if (publicationModal) {
    publicationModal.addEventListener('click', (e) => {
        if (e.target === publicationModal) {
            closePublicationModal();
        }
    });
}

function openPublicationModal(publicationId = null) {
    editingPublicationId = publicationId;
    
    if (publicationId) {
        const pub = publications.find(p => p.id === publicationId);
        if (pub) {
            fillPublicationForm(pub);
            if (modalTitle) modalTitle.textContent = 'Editar Publicación';
        }
    } else {
        resetPublicationForm();
        if (modalTitle) modalTitle.textContent = 'Nueva Publicación';
    }
    
    if (publicationModal) {
        publicationModal.classList.add('active');
    }
}

function closePublicationModal() {
    if (publicationModal) {
        publicationModal.classList.remove('active');
    }
    editingPublicationId = null;
    resetPublicationForm();
}

function fillPublicationForm(pub) {
    document.getElementById('pubTitle').value = pub.titulo || '';
    document.getElementById('pubCategory').value = pub.categoria || '';
    document.getElementById('pubStatus').value = pub.estado || 'draft';
    document.getElementById('pubLocation').value = pub.ubicacion || '';
    document.getElementById('pubPrice').value = pub.precio || '';
    document.getElementById('pubArea').value = pub.area || '';
    document.getElementById('pubBedrooms').value = pub.habitaciones || '';
    document.getElementById('pubBathrooms').value = pub.banos || '';
    document.getElementById('pubDescription').value = pub.descripcion || '';
    document.getElementById('pubImage').value = pub.imagen || '';
}

function resetPublicationForm() {
    if (publicationForm) {
        publicationForm.reset();
    }
}

// ============================================
// GUARDAR PUBLICACIÓN
// ============================================
if (publicationForm) {
    publicationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        savePublication();
    });
}

function savePublication() {
    const formData = {
        titulo: document.getElementById('pubTitle').value,
        categoria: document.getElementById('pubCategory').value,
        estado: document.getElementById('pubStatus').value,
        ubicacion: document.getElementById('pubLocation').value,
        precio: parseFloat(document.getElementById('pubPrice').value) || 0,
        area: parseInt(document.getElementById('pubArea').value) || 0,
        habitaciones: parseInt(document.getElementById('pubBedrooms').value) || 0,
        banos: parseInt(document.getElementById('pubBathrooms').value) || 0,
        descripcion: document.getElementById('pubDescription').value,
        imagen: document.getElementById('pubImage').value,
        fecha: new Date().toISOString().split('T')[0],
        visitas: 0
    };
    
    if (editingPublicationId) {
        // Editar publicación existente
        const index = publications.findIndex(p => p.id === editingPublicationId);
        if (index !== -1) {
            publications[index] = { ...publications[index], ...formData };
            showNotification('Publicación actualizada correctamente', 'success');
        }
    } else {
        // Nueva publicación
        const newId = publications.length > 0 
            ? Math.max(...publications.map(p => p.id)) + 1 
            : 1;
        publications.push({ id: newId, ...formData });
        showNotification('Publicación creada correctamente', 'success');
    }
    
    closePublicationModal();
    renderPublicationsTable();
    loadDashboardData();
}

// ============================================
// ACCIONES DE PUBLICACIONES
// ============================================
function editPublication(id) {
    openPublicationModal(id);
}

function deletePublication(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
        publications = publications.filter(p => p.id !== id);
        renderPublicationsTable();
        updatePagination();
        loadDashboardData();
        showNotification('Publicación eliminada correctamente', 'success');
    }
}

function viewPublication(id) {
    const pub = publications.find(p => p.id === id);
    if (pub) {
        alert(`Ver publicación: ${pub.titulo}\n\nEsta funcionalidad se implementará para ver los detalles completos.`);
    }
}

// ============================================
// ESTADÍSTICAS
// ============================================
function loadStatistics() {
    // Simular carga de estadísticas
    console.log('Cargando estadísticas...');
    // Aquí se cargarían los gráficos reales (Chart.js, etc.)
}

// ============================================
// CONFIGURACIÓN
// ============================================
const generalSettingsForm = document.getElementById('generalSettingsForm');
const notificationsForm = document.getElementById('notificationsForm');

if (generalSettingsForm) {
    generalSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Configuración guardada correctamente', 'success');
    });
}

if (notificationsForm) {
    notificationsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Preferencias de notificaciones guardadas', 'success');
    });
}

// ============================================
// NOTIFICACIONES
// ============================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Agregar estilos si no existen
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                z-index: 3000;
                animation: slideInRight 0.3s ease;
            }
            .notification-success {
                border-left: 4px solid #28a745;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-success i {
                color: #28a745;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar publicaciones
    initializePublications();
    
    // Cargar datos del dashboard por defecto
    if (currentSection === 'dashboard') {
        loadDashboardData();
    }
    
    // Ajustar sidebar en resize
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('active');
        }
    });
});

