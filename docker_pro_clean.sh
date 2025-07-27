#!/bin/bash

echo "🚀 Docker Clean Pro - Limpieza avanzada de contenedores, imágenes y más"

# 1. Eliminar contenedores detenidos
echo "🗑️ Eliminando contenedores detenidos..."
sudo docker container prune -f

# 2. Eliminar imágenes sin etiqueta (dangling: <none>)
echo "🧼 Eliminando imágenes colgadas (<none>)..."
sudo docker image prune -f

# 3. Eliminar redes no usadas
echo "🔌 Eliminando redes sin uso..."
sudo docker network prune -f

# 4. Eliminar volúmenes sin uso
echo "🧱 Eliminando volúmenes no utilizados..."
sudo docker volume prune -f

# 5. (Opcional) Eliminar imágenes de proyectos antiguos
IMAGENES_A_BORRAR=("ss_confiachamba_web" "ss_confiachamba-web" "vps-service-app")
echo "🗂️ Eliminando imágenes de proyectos que ya no uso..."
for img in "${IMAGENES_A_BORRAR[@]}"; do
    echo "🔎 Buscando imagen: $img"
    IMG_ID=$(sudo docker images -q $img)
    if [ -n "$IMG_ID" ]; then
        echo "❌ Eliminando imagen $img"
        sudo docker rmi -f $img
    else
        echo "✅ Imagen $img no existe o ya fue eliminada"
    fi
done

# 6. Mostrar resumen
echo "📦 Imágenes actuales:"
sudo docker images

echo "🐳 Contenedores actuales:"
sudo docker ps -a

echo "✅ Limpieza completa."
