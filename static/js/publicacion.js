// ============================================
// GESTIÓN DE PUBLICACIÓN - JAVASCRIPT
// ============================================

// ============================================
// VARIABLES GLOBALES
// ============================================
let currentStep = 1;
const totalSteps = 3;
let publicationData = {
    // Step 1
    titulo: '',
    precio: '',
    area: '',
    habitaciones: '',
    banos: '',
    garajes: '',
    pisos: '',
    antiguedad: '',
    descripcion: '',
    caracteristicas: [],
    // Step 2
    categoria: '',
    subcategoria: '',
    estado: 'draft',
    ubicacion: '',
    googleMapsLink: '',
    // Step 3
    imagenPrincipal: null,
    galeriaImagenes: [],
    imagenesVirtual: [],
    enlaceVirtual: ''
};

let isEditMode = false;
let publicationId = null;

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si estamos en modo edición
    checkEditMode();
    
    // Inicializar eventos
    initializeEvents();
    
    // Inicializar campos condicionales
    initializeConditionalFields();
    
    // Inicializar drag and drop
    initializeDragAndDrop();
    
    // Actualizar UI
    updateStepDisplay();
});

// ============================================
// VERIFICAR MODO EDICIÓN
// ============================================
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const action = urlParams.get('action');
    
    if (id && action === 'edit') {
        isEditMode = true;
        publicationId = parseInt(id);
        loadPublicationData(publicationId);
        document.getElementById('pageTitle').textContent = 'Editar Publicación';
        document.getElementById('btnDelete').style.display = 'flex';
    } else if (id && action === 'delete') {
        deletePublication(parseInt(id));
    }
}

// ============================================
// CARGAR DATOS DE PUBLICACIÓN (MODO EDICIÓN)
// ============================================
function loadPublicationData(id) {
    // En producción, esto vendría de una API
    // Por ahora, simulamos cargar datos del localStorage o de una variable global
    const savedPublications = JSON.parse(localStorage.getItem('publications') || '[]');
    const pub = savedPublications.find(p => p.id === id);
    
    if (pub) {
        publicationData = { ...pub };
        fillFormWithData();
    } else {
        // Si no hay datos guardados, usar datos de ejemplo
        console.warn('Publicación no encontrada, usando datos de ejemplo');
    }
}

function fillFormWithData() {
    // Step 1
    if (publicationData.titulo) document.getElementById('titulo').value = publicationData.titulo;
    if (publicationData.precio) document.getElementById('precio').value = publicationData.precio;
    if (publicationData.area) document.getElementById('area').value = publicationData.area;
    if (publicationData.habitaciones) document.getElementById('habitaciones').value = publicationData.habitaciones;
    if (publicationData.banos) document.getElementById('banos').value = publicationData.banos;
    if (publicationData.garajes) document.getElementById('garajes').value = publicationData.garajes;
    if (publicationData.pisos) document.getElementById('pisos').value = publicationData.pisos;
    if (publicationData.antiguedad) document.getElementById('antiguedad').value = publicationData.antiguedad;
    if (publicationData.descripcion) document.getElementById('descripcion').value = publicationData.descripcion;
    
    // Características
    if (publicationData.caracteristicas && Array.isArray(publicationData.caracteristicas)) {
        publicationData.caracteristicas.forEach(caracteristica => {
            const checkbox = document.querySelector(`input[value="${caracteristica}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
    
    // Step 2
    if (publicationData.categoria) document.getElementById('categoria').value = publicationData.categoria;
    if (publicationData.subcategoria) document.getElementById('subcategoria').value = publicationData.subcategoria;
    if (publicationData.estado) document.getElementById('estado').value = publicationData.estado;
    if (publicationData.ubicacion) document.getElementById('ubicacion').value = publicationData.ubicacion;
    if (publicationData.googleMapsLink) {
        document.getElementById('googleMapsLink').value = publicationData.googleMapsLink;
        updateMapPreview(publicationData.googleMapsLink);
    }
    
    // Step 3
    if (publicationData.enlaceVirtual) document.getElementById('enlaceVirtual').value = publicationData.enlaceVirtual;
}

// ============================================
// NAVEGACIÓN ENTRE PASOS
// ============================================
function nextStep() {
    try {
        if (validateCurrentStep()) {
            if (currentStep < totalSteps) {
                saveStepData();
                currentStep++;
                updateStepDisplay();
            }
        }
    } catch (error) {
        console.error('Error al avanzar al siguiente paso:', error);
        // Aún así permitir avanzar en desarrollo
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        saveStepData();
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Actualizar pasos en el progreso
    document.querySelectorAll('.step-item').forEach((item, index) => {
        const stepNum = index + 1;
        item.classList.remove('active', 'completed');
        
        if (stepNum < currentStep) {
            item.classList.add('completed');
        } else if (stepNum === currentStep) {
            item.classList.add('active');
        }
    });
    
    // Actualizar líneas entre pasos
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index + 1 < currentStep) {
            line.classList.add('completed');
        } else {
            line.classList.remove('completed');
        }
    });
    
    // Mostrar/ocultar formularios
    document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });
    
    // Scroll al inicio del formulario
    document.querySelector('.form-step.active')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// VALIDACIÓN DE PASOS
// ============================================
function validateCurrentStep() {
    // En desarrollo: No se validan campos requeridos
    // TODO: Restaurar validaciones cuando esté en producción
    return true;
}

function isValidGoogleMapsLink(url) {
    if (!url) return false;
    return url.includes('maps.google.com') || url.includes('goo.gl/maps') || url.includes('google.com/maps');
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

function showFieldError(field, message) {
    clearFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentElement.appendChild(errorDiv);
}

function clearFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// ============================================
// GUARDAR DATOS DEL PASO
// ============================================
function saveStepData() {
    if (currentStep === 1) {
        publicationData.titulo = document.getElementById('titulo')?.value || '';
        // Precio ya no está en el Paso 1, se maneja en Paso 2 según categoría
        publicationData.area = document.getElementById('area')?.value || '';
        publicationData.habitaciones = document.getElementById('habitaciones')?.value || '';
        publicationData.banos = document.getElementById('banos')?.value || '';
        publicationData.garajes = document.getElementById('garajes')?.value || '';
        publicationData.pisos = document.getElementById('pisos')?.value || '';
        publicationData.antiguedad = document.getElementById('antiguedad')?.value || '';
        publicationData.descripcion = document.getElementById('descripcion')?.value || '';
        
        // Características
        publicationData.caracteristicas = Array.from(
            document.querySelectorAll('input[name="caracteristicas"]:checked')
        ).map(cb => cb.value);
    } else if (currentStep === 2) {
        // Categorías múltiples
        publicationData.categorias = Array.from(
            document.querySelectorAll('input[name="categorias"]:checked')
        ).map(cb => cb.value);
        
        // Subcategorías múltiples
        publicationData.subcategorias = Array.from(
            document.querySelectorAll('input[name="subcategorias"]:checked')
        ).map(cb => cb.value);
        
        // Guardar datos específicos de cada categoría seleccionada
        
        // Si Venta está seleccionada
        if (publicationData.categorias.includes('venta')) {
            publicationData.venta = {
                precio: document.getElementById('precioVenta')?.value || '',
                contado: document.querySelector('input[name="ventaContado"]')?.checked || false,
                credito: document.querySelector('input[name="ventaCredito"]')?.checked || false,
                negociable: document.querySelector('input[name="ventaNegociable"]')?.checked || false
            };
        }
        
        // Si Alquiler está seleccionada
        if (publicationData.categorias.includes('alquiler')) {
            publicationData.alquiler = {
                cuotaMensual: document.getElementById('cuotaMensual')?.value || '',
                mesesGarantia: document.getElementById('mesesGarantia')?.value || '',
                negociable: document.querySelector('input[name="alquilerNegociable"]')?.checked || false
            };
        }
        
        // Si Anticrético está seleccionada
        if (publicationData.categorias.includes('anticretico')) {
            publicationData.anticretico = {
                monto: document.getElementById('montoAnticretico')?.value || '',
                meses: document.getElementById('mesesAnticretico')?.value || ''
            };
        }
    } else if (currentStep === 3) {
        publicationData.estado = document.getElementById('estado')?.value || 'draft';
        publicationData.ubicacion = document.getElementById('ubicacion')?.value || '';
        publicationData.googleMapsLink = document.getElementById('googleMapsLink')?.value || '';
        publicationData.enlaceVirtual = document.getElementById('enlaceVirtual')?.value || '';
    }
}

// ============================================
// CAMPOS CONDICIONALES POR CATEGORÍA
// ============================================
function initializeConditionalFields() {
    // Event listeners para checkboxes de categorías
    const categoriaCheckboxes = document.querySelectorAll('input[name="categorias"]');
    
    categoriaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateConditionalFields);
    });
}

function updateConditionalFields() {
    const ventaCheckbox = document.querySelector('input[name="categorias"][value="venta"]');
    const alquilerCheckbox = document.querySelector('input[name="categorias"][value="alquiler"]');
    const anticreticoCheckbox = document.querySelector('input[name="categorias"][value="anticretico"]');
    
    const ventaChecked = ventaCheckbox ? ventaCheckbox.checked : false;
    const alquilerChecked = alquilerCheckbox ? alquilerCheckbox.checked : false;
    const anticreticoChecked = anticreticoCheckbox ? anticreticoCheckbox.checked : false;
    
    // Mostrar/ocultar campos de Venta
    const ventaFields = document.getElementById('ventaFields');
    if (ventaFields) {
        ventaFields.style.display = ventaChecked ? 'block' : 'none';
        
        // En desarrollo: No se establecen campos como required
        // TODO: Restaurar cuando esté en producción
        // const ventaInputs = ventaFields.querySelectorAll('.category-required');
        // ventaInputs.forEach(input => {
        //     input.required = ventaChecked;
        // });
    }
    
    // Mostrar/ocultar campos de Alquiler
    const alquilerFields = document.getElementById('alquilerFields');
    if (alquilerFields) {
        alquilerFields.style.display = alquilerChecked ? 'block' : 'none';
        
        // En desarrollo: No se establecen campos como required
        // TODO: Restaurar cuando esté en producción
        // const alquilerInputs = alquilerFields.querySelectorAll('.category-required');
        // alquilerInputs.forEach(input => {
        //     input.required = alquilerChecked;
        // });
    }
    
    // Mostrar/ocultar campos de Anticrético
    const anticreticoFields = document.getElementById('anticreticoFields');
    if (anticreticoFields) {
        anticreticoFields.style.display = anticreticoChecked ? 'block' : 'none';
        
        // En desarrollo: No se establecen campos como required
        // TODO: Restaurar cuando esté en producción
        // const anticreticoInputs = anticreticoFields.querySelectorAll('.category-required');
        // anticreticoInputs.forEach(input => {
        //     input.required = anticreticoChecked;
        // });
    }
}

// ============================================
// CONVERTIR MESES A AÑOS
// ============================================
function convertirMesesAAnios(meses) {
    const mesesNum = parseInt(meses) || 0;
    const anios = mesesNum / 12;
    const aniosTexto = document.getElementById('aniosTexto');
    
    if (aniosTexto) {
        if (mesesNum === 0) {
            aniosTexto.textContent = '0 años';
        } else if (anios < 1) {
            aniosTexto.textContent = `${mesesNum} ${mesesNum === 1 ? 'mes' : 'meses'}`;
        } else if (mesesNum % 12 === 0) {
            aniosTexto.textContent = `${anios} ${anios === 1 ? 'año' : 'años'}`;
        } else {
            const aniosEnteros = Math.floor(anios);
            const mesesRestantes = mesesNum % 12;
            aniosTexto.textContent = `${aniosEnteros} ${aniosEnteros === 1 ? 'año' : 'años'} y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}`;
        }
    }
}

// Hacer la función global para que pueda ser llamada desde el HTML
window.convertirMesesAAnios = convertirMesesAAnios;

// ============================================
// INICIALIZAR EVENTOS
// ============================================
function initializeEvents() {
    // Formulario
    const form = document.getElementById('publicationForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Google Maps Link
    const mapsLinkInput = document.getElementById('googleMapsLink');
    if (mapsLinkInput) {
        mapsLinkInput.addEventListener('input', (e) => {
            if (e.target.value) {
                updateMapPreview(e.target.value);
            }
        });
    }
    
    // Imagen principal
    const imagenPrincipal = document.getElementById('imagenPrincipal');
    if (imagenPrincipal) {
        imagenPrincipal.addEventListener('change', (e) => {
            handleMainImageUpload(e.target.files[0]);
        });
    }
    
    // Galería de imágenes
    const galeriaImagenes = document.getElementById('galeriaImagenes');
    if (galeriaImagenes) {
        galeriaImagenes.addEventListener('change', (e) => {
            handleGalleryUpload(Array.from(e.target.files));
        });
    }
    
    // Imágenes virtuales
    const imagenesVirtual = document.getElementById('imagenesVirtual');
    if (imagenesVirtual) {
        imagenesVirtual.addEventListener('change', (e) => {
            handleVirtualTourUpload(Array.from(e.target.files));
        });
    }
    
    // Botón eliminar
    const btnDelete = document.getElementById('btnDelete');
    if (btnDelete) {
        btnDelete.addEventListener('click', () => {
            if (publicationId) {
                deletePublication(publicationId);
            }
        });
    }
}

// ============================================
// ACTUALIZAR VISTA PREVIA DEL MAPA
// ============================================
function updateMapPreview(url) {
    const mapPreview = document.getElementById('mapPreview');
    if (!mapPreview) return;
    
    if (url && isValidGoogleMapsLink(url)) {
        // Convertir enlace compartir a iframe embed
        let embedUrl = url;
        
        // Si es un enlace compartir, convertirlo a embed
        if (url.includes('/maps/place/')) {
            embedUrl = url.replace('/maps/place/', '/maps/embed?pb=!1m18!1m12!1m3!1d');
        } else if (url.includes('?q=')) {
            const query = url.split('?q=')[1];
            embedUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(query)}`;
        }
        
        mapPreview.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
    } else {
        mapPreview.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Ingresa el enlace de Google Maps para ver la vista previa</p>
            </div>
        `;
    }
}

function testMapLink() {
    const mapsLink = document.getElementById('googleMapsLink').value;
    if (mapsLink && isValidGoogleMapsLink(mapsLink)) {
        window.open(mapsLink, '_blank');
    } else {
        showNotification('Por favor, ingresa un enlace válido de Google Maps primero', 'error');
    }
}

// ============================================
// MANEJO DE IMÁGENES
// ============================================
function handleMainImageUpload(file) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('Por favor, selecciona un archivo de imagen válido', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showNotification('La imagen es demasiado grande. Máximo 5MB', 'error');
        return;
    }
    
    publicationData.imagenPrincipal = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const preview = document.getElementById('mainImagePreview');
        const previewImg = document.getElementById('mainImagePreviewImg');
        const uploadContent = document.querySelector('#mainImageUpload .upload-content');
        
        previewImg.src = e.target.result;
        preview.style.display = 'block';
        uploadContent.style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeMainImage() {
    publicationData.imagenPrincipal = null;
    document.getElementById('imagenPrincipal').value = '';
    document.getElementById('mainImagePreview').style.display = 'none';
    document.querySelector('#mainImageUpload .upload-content').style.display = 'block';
}

function handleGalleryUpload(files) {
    if (files.length === 0) return;
    
    const maxFiles = 10;
    const currentCount = publicationData.galeriaImagenes.length;
    
    if (currentCount + files.length > maxFiles) {
        showNotification(`Máximo ${maxFiles} imágenes en la galería`, 'error');
        return;
    }
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`${file.name} no es una imagen válida`, 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`${file.name} es demasiado grande. Máximo 5MB`, 'error');
            return;
        }
        
        publicationData.galeriaImagenes.push(file);
        addGalleryPreview(file);
    });
}

function addGalleryPreview(file) {
    const galleryPreview = document.getElementById('galleryPreview');
    if (!galleryPreview) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${e.target.result}" alt="Galería">
            <button type="button" class="btn-remove-image" onclick="removeGalleryImage(this, ${publicationData.galeriaImagenes.length - 1})">
                <i class="fas fa-times"></i>
            </button>
        `;
        galleryPreview.appendChild(galleryItem);
    };
    reader.readAsDataURL(file);
}

function removeGalleryImage(button, index) {
    publicationData.galeriaImagenes.splice(index, 1);
    button.closest('.gallery-item').remove();
    updateGalleryPreviews();
}

function updateGalleryPreviews() {
    const galleryPreview = document.getElementById('galleryPreview');
    galleryPreview.innerHTML = '';
    publicationData.galeriaImagenes.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <img src="${e.target.result}" alt="Galería">
                <button type="button" class="btn-remove-image" onclick="removeGalleryImage(this, ${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            galleryPreview.appendChild(galleryItem);
        };
        reader.readAsDataURL(file);
    });
}

function handleVirtualTourUpload(files) {
    if (files.length === 0) return;
    
    const maxFiles = 20;
    const currentCount = publicationData.imagenesVirtual.length;
    
    if (currentCount + files.length > maxFiles) {
        showNotification(`Máximo ${maxFiles} imágenes para el paseo virtual`, 'error');
        return;
    }
    
    files.forEach(file => {
        if (!file.type.startsWith('image/')) {
            showNotification(`${file.name} no es una imagen válida`, 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`${file.name} es demasiado grande. Máximo 5MB`, 'error');
            return;
        }
        
        publicationData.imagenesVirtual.push(file);
        addVirtualTourPreview(file);
    });
}

function addVirtualTourPreview(file) {
    const virtualPreview = document.getElementById('virtualTourPreview');
    if (!virtualPreview) return;
    
    // Remover mensaje de "no hay imágenes"
    const noImagesText = virtualPreview.querySelector('.no-images-text');
    if (noImagesText) {
        noImagesText.remove();
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const virtualItem = document.createElement('div');
        virtualItem.className = 'gallery-item';
        virtualItem.innerHTML = `
            <img src="${e.target.result}" alt="Paseo Virtual">
            <button type="button" class="btn-remove-image" onclick="removeVirtualTourImage(this, ${publicationData.imagenesVirtual.length - 1})">
                <i class="fas fa-times"></i>
            </button>
        `;
        virtualPreview.appendChild(virtualItem);
    };
    reader.readAsDataURL(file);
}

function removeVirtualTourImage(button, index) {
    publicationData.imagenesVirtual.splice(index, 1);
    button.closest('.gallery-item').remove();
    
    const virtualPreview = document.getElementById('virtualTourPreview');
    if (publicationData.imagenesVirtual.length === 0) {
        virtualPreview.innerHTML = '<p class="no-images-text">No hay imágenes 360° cargadas aún</p>';
    } else {
        updateVirtualTourPreviews();
    }
}

function updateVirtualTourPreviews() {
    const virtualPreview = document.getElementById('virtualTourPreview');
    virtualPreview.innerHTML = '';
    publicationData.imagenesVirtual.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const virtualItem = document.createElement('div');
            virtualItem.className = 'gallery-item';
            virtualItem.innerHTML = `
                <img src="${e.target.result}" alt="Paseo Virtual">
                <button type="button" class="btn-remove-image" onclick="removeVirtualTourImage(this, ${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            virtualPreview.appendChild(virtualItem);
        };
        reader.readAsDataURL(file);
    });
}

// ============================================
// DRAG AND DROP
// ============================================
function initializeDragAndDrop() {
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            
            const files = Array.from(e.dataTransfer.files);
            const input = area.querySelector('.file-input');
            
            if (input.id === 'imagenPrincipal') {
                if (files.length > 0) {
                    handleMainImageUpload(files[0]);
                }
            } else if (input.id === 'galeriaImagenes') {
                handleGalleryUpload(files);
            } else if (input.id === 'imagenesVirtual') {
                handleVirtualTourUpload(files);
            }
        });
    });
}

// ============================================
// ENVIAR FORMULARIO
// ============================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar paso actual
    if (!validateCurrentStep()) {
        return;
    }
    
    // Guardar datos del paso 3
    saveStepData();
    
    // Preparar datos finales
    const finalData = {
        ...publicationData,
        fecha: new Date().toISOString().split('T')[0],
        visitas: isEditMode ? (publicationData.visitas || 0) : 0
    };
    
    // Guardar publicación
    if (isEditMode) {
        updatePublication(finalData);
    } else {
        createPublication(finalData);
    }
}

function createPublication(data) {
    // En producción, esto haría una petición al servidor
    const savedPublications = JSON.parse(localStorage.getItem('publications') || '[]');
    const newId = savedPublications.length > 0 
        ? Math.max(...savedPublications.map(p => p.id)) + 1 
        : 1;
    
    const newPublication = {
        id: newId,
        ...data
    };
    
    savedPublications.push(newPublication);
    localStorage.setItem('publications', JSON.stringify(savedPublications));
    
    showNotification('Publicación creada correctamente', 'success');
    
    setTimeout(() => {
        window.location.href = '/Panel.html#publicaciones';
    }, 1500);
}

function updatePublication(data) {
    // En producción, esto haría una petición al servidor
    const savedPublications = JSON.parse(localStorage.getItem('publications') || '[]');
    const index = savedPublications.findIndex(p => p.id === publicationId);
    
    if (index !== -1) {
        savedPublications[index] = {
            ...savedPublications[index],
            ...data,
            id: publicationId
        };
        localStorage.setItem('publications', JSON.stringify(savedPublications));
        
        showNotification('Publicación actualizada correctamente', 'success');
        
        setTimeout(() => {
            window.location.href = '/Panel.html#publicaciones';
        }, 1500);
    }
}

function deletePublication(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.')) {
        return;
    }
    
    // En producción, esto haría una petición al servidor
    const savedPublications = JSON.parse(localStorage.getItem('publications') || '[]');
    const filtered = savedPublications.filter(p => p.id !== id);
    localStorage.setItem('publications', JSON.stringify(filtered));
    
    showNotification('Publicación eliminada correctamente', 'success');
    
    setTimeout(() => {
        window.location.href = '/Panel.html#publicaciones';
    }, 1500);
}

// ============================================
// MODAL DE AYUDA
// ============================================
function showMapsHelp() {
    const modal = document.getElementById('mapsHelpModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeMapsHelp() {
    const modal = document.getElementById('mapsHelpModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('mapsHelpModal');
    if (modal && e.target === modal) {
        closeMapsHelp();
    }
});

// ============================================
// NOTIFICACIONES
// ============================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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
                max-width: 400px;
            }
            .notification-success {
                border-left: 4px solid #28a745;
            }
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }
            .notification-success i {
                color: #28a745;
            }
            .notification-error i {
                color: #dc3545;
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
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.nextStep = nextStep;
window.prevStep = prevStep;
window.removeMainImage = removeMainImage;
window.removeGalleryImage = removeGalleryImage;
window.removeVirtualTourImage = removeVirtualTourImage;
window.testMapLink = testMapLink;
window.showMapsHelp = showMapsHelp;
window.closeMapsHelp = closeMapsHelp;

