#!/bin/bash
# Ejecuta el servidor Django usando el entorno virtual (no hace falta activarlo antes)
cd "$(dirname "$0")"

if [ ! -d ".venv" ]; then
    echo "Creando entorno virtual .venv..."
    python3 -m venv .venv
fi

echo "Instalando dependencias..."
.venv/bin/pip install -q -r requirements.txt

echo "Iniciando servidor en http://127.0.0.1:8000/"
.venv/bin/python manage.py runserver
