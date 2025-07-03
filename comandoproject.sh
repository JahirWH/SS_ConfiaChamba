#!/bin/bash

# Nombre del proyecto
NAME="confi_chamba"
PORT="8000"

# Elimina contenedor si existe
echo "🔄 Eliminando contenedor anterior si existe..."
sudo docker rm -f $NAME 2>/dev/null || true

# Construye la imagen y etiqueta correctamente (usa --pull si quieres forzar imagen base nueva)
echo "⚙️ Construyendo imagen Docker..."
sudo docker build -t $NAME .

# Ejecuta el contenedor
echo "🚀 Iniciando contenedor $NAME en puerto $PORT..."
sudo docker run -d --name $NAME -p $PORT:$PORT $NAME

# Ejecuta migraciones Django dentro del contenedor
echo "🛠️ Ejecutando migraciones..."
sudo docker exec $NAME python3 manage.py migrate

# Limpia imágenes intermedias (opcional)
echo "🧹 Limpiando imágenes sin uso..."
sudo docker image prune -f

echo "✅ Proyecto $NAME levantado en http://localhost:$PORT"
