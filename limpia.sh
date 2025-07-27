#!/bin/bash

echo "🧹 Limpiando imágenes y contenedores innecesarios..."

# Lista de imágenes a eliminar
IMAGENES=("ss_confiachamba_web" "ss_confiachamba-web" "vps-service-app")

# Paso 1: Detener y eliminar contenedores que usan esas imágenes
for img in "${IMAGENES[@]}"; do
    echo "🔍 Buscando contenedores que usen la imagen: $img"
    CONTAINERS=$(sudo docker ps -a --filter "ancestor=$img" --format "{{.ID}}")

    for container in $CONTAINERS; do
        echo "🛑 Eliminando contenedor $container que usa $img"
        sudo docker rm -f "$container"
    done

    echo "🗑️ Eliminando imagen $img"
    sudo docker rmi "$img" || true
done

# Paso 2: Eliminar imágenes sin nombre (<none>)
echo "🧼 Eliminando imágenes sin etiqueta (<none>)..."
sudo docker image prune -a --filter "dangling=true" -f

echo "✅ Limpieza completada."
