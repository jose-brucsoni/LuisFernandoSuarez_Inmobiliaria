# Cómo iniciar y desplegar el proyecto Django – Inmobiliaria

Guía paso a paso desde que ya tienes el proyecto y el entorno virtual creados.

---

## 1. Activar el entorno virtual

Cada vez que abras una terminal nueva para trabajar en el proyecto:

```bash
cd /home/joseca/Documentos/Proyecto_LuisFernandoSuarez/LuisFernandoSuarez_Inmobiliaria
source .venv/bin/activate   # si tu venv se llama .venv
# o: source venv/bin/activate
```

Verás algo como `(.venv)` al inicio del prompt cuando esté activo.

---

## 2. Instalar dependencias

Con el entorno virtual activado:

```bash
pip install -r requirements.txt
```

Esto instala Django (y cualquier otra dependencia que añadas al `requirements.txt`).

---

## 3. Aplicar migraciones (base de datos)

La primera vez y siempre que cambies modelos:

```bash
python manage.py migrate
```

Se crea o actualiza `db.sqlite3` en la raíz del proyecto (base de datos por defecto).

---

## 4. Crear un superusuario (opcional, para el admin)

Para acceder a `/admin/` y gestionar contenido:

```bash
python manage.py createsuperuser
```

Te pedirá usuario, email y contraseña.

---

## 5. Ejecutar el servidor de desarrollo

```bash
python manage.py runserver
```

- Sitio: **http://127.0.0.1:8000/**
- Admin: **http://127.0.0.1:8000/admin/**

Para escuchar en todas las interfaces (por ejemplo desde otro dispositivo en la red):

```bash
python manage.py runserver 0.0.0.0:8000
```

Para detener: `Ctrl+C`.

---

## 6. Rutas y plantillas ya configuradas

Las plantillas están en `templates/` y las rutas en `core/urls.py`:

| URL                    | Plantilla          | Descripción        |
|------------------------|--------------------|--------------------|
| `/`                    | index.html         | Inicio             |
| `/portafolio/`         | Portafolio.html    | Portafolio         |
| `/inmueble/<id>/`      | Inmueble.html      | Detalle de inmueble|
| `/iniciar-sesion/`     | InicioDeSesion.html| Login              |
| `/panel/`              | Panel.html         | Panel admin        |
| `/publicacion/`        | Publicacion.html   | Gestión publicación|
| `/admin/`              | (Django admin)     | Administración     |

Los enlaces internos usan `{% url 'inicio' %}`, `{% url 'portafolio' %}`, etc. Los estáticos usan `{% static 'css/style.css' %}`.

---

## 7. Archivos estáticos en desarrollo

En desarrollo, Django sirve los estáticos desde `static/` gracias a `STATICFILES_DIRS` en `core/settings.py`. No hace falta nada más para que se vean CSS, JS e imágenes.

---

## 8. Preparar para producción (estáticos)

En producción no se sirven desde `static/`; hay que recogerlos en una sola carpeta:

```bash
python manage.py collectstatic --noinput
```

Se crea la carpeta `staticfiles/` con todos los CSS, JS e imágenes. El servidor (Nginx, etc.) debe servir esa carpeta bajo la URL `STATIC_URL` (por defecto `static/`).

---

## 9. Producción: ajustes en `settings.py`

Antes de desplegar:

1. **DEBUG**: poner `DEBUG = False`.
2. **SECRET_KEY**: usar una clave distinta y guardarla en variable de entorno, nunca en el repo.
3. **ALLOWED_HOSTS**: añadir tu dominio y/o IP, por ejemplo:
   - `ALLOWED_HOSTS = ['tudominio.com', 'www.tudominio.com', '123.45.67.89']`
4. **Base de datos**: para producción suele usarse PostgreSQL o MySQL; en ese caso cambias `DATABASES` y vuelves a ejecutar migraciones en el servidor.
5. **Estáticos**: configurar `STATIC_ROOT` (ya está en `staticfiles/`) y que el servidor web sirva esa ruta.

---

## 10. Resumen de comandos útiles

```bash
# Activar entorno
source .venv/bin/activate

# Instalar deps
pip install -r requirements.txt

# Migraciones
python manage.py migrate

# Superusuario
python manage.py createsuperuser

# Servidor desarrollo
python manage.py runserver

# Recoger estáticos (producción)
python manage.py collectstatic --noinput
```

---

## Estructura del proyecto

- `core/` – Configuración Django (settings, urls, views).
- `templates/` – Plantillas HTML (incluye `components/navbar.html`).
- `static/` – CSS, JS e imágenes en desarrollo.
- `staticfiles/` – Salida de `collectstatic` para producción.
- `manage.py` – Punto de entrada para comandos Django.

Con esto puedes arrancar el proyecto en desarrollo y preparar el despliegue a producción.
