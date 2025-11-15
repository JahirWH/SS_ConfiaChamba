# Confía Chamba - Plataforma de Empleos

Aplicación Django para gestionar ofertas de empleo y perfiles de usuarios.

## Stack Tecnológico

- **Backend**: Django 5.2.3
- **Servidor Web**: Gunicorn
- **Servidor Estático**: WhiteNoise
- **Base de Datos**: SQLite (desarrollo) / PostgreSQL (producción)
- **Contenedor**: Docker
- **Despliegue**: Heroku

## Configuración Local

### Requisitos

- Python 3.11+
- pip
- virtualenv (opcional pero recomendado)

### Pasos de Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd SS_ConfiaChamba
```

2. Crea un entorno virtual:
```bash
python3 -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

3. Instala dependencias:
```bash
pip install -r requirements.txt
```

4. Copia y configura variables de entorno:
```bash
cp .env.example .env
# Edita .env y rellena valores (DJANGO_SECRET_KEY, DEBUG=1 para desarrollo, etc.)
```

5. Aplica migraciones:
```bash
python manage.py migrate
```

6. Ejecuta el servidor de desarrollo:
```bash
python manage.py runserver
```

Accede a http://127.0.0.1:8000 en tu navegador.

## Variables de Entorno

Copia `.env.example` a `.env` y rellena los valores necesarios:

```
DJANGO_SECRET_KEY=<tu-clave-secreta-aqui>
DEBUG=1                          # 1 en desarrollo, 0 en producción
ALLOWED_HOSTS=127.0.0.1,localhost
DATABASE_URL=                    # Vacío usa SQLite; llena con postgres://... para Postgres
CSRF_TRUSTED_ORIGINS=            # Para producción: https://tu-app.herokuapp.com
```

**Importante**: No commits el archivo `.env` real al repositorio (está en `.gitignore`).

## Despliegue en Heroku

### Requisitos Previos

1. Cuenta en [Heroku](https://www.heroku.com)
2. [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) instalado
3. Repositorio Git iniciado

### Pasos de Despliegue

#### 1. Auténticate con Heroku:
```bash
heroku login
```

#### 2. Crea una app en Heroku:
```bash
heroku create tu-app-nombre
# Si la app ya existe, establécela:
heroku apps:info -a tu-app-nombre
```

#### 3. Configura variables de entorno en Heroku:

**Genera una SECRET_KEY segura:**
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

**Establece las variables en Heroku:**
```bash
heroku config:set DJANGO_SECRET_KEY='<tu-clave-generada>' -a tu-app-nombre
heroku config:set DEBUG=0 -a tu-app-nombre
heroku config:set ALLOWED_HOSTS='tu-app-nombre.herokuapp.com' -a tu-app-nombre
heroku config:set CSRF_TRUSTED_ORIGINS='https://tu-app-nombre.herokuapp.com' -a tu-app-nombre
```

#### 4. (Opcional) Configura base de datos PostgreSQL:

Si quieres usar Postgres en lugar de SQLite:

```bash
heroku addons:create heroku-postgresql:hobby-dev -a tu-app-nombre
```

Heroku automáticamente añadirá `DATABASE_URL` a tu configuración. Verifica con:
```bash
heroku config -a tu-app-nombre
```

#### 5. Despliega (Git Push):

Asegúrate de que todos los cambios estén comiteados:
```bash
git add .
git commit -m "Preparado para Heroku"
git push heroku main  # o 'master' si tu rama es master
```

Heroku usará `heroku.yml` (que incluye Docker) o `Procfile` para ejecutar:
- `release`: migra la BD
- `web`: inicia gunicorn

#### 6. Verifica el despliegue:

```bash
heroku logs -a tu-app-nombre --tail
```

Si todo va bien, accede a `https://tu-app-nombre.herokuapp.com`.

### Mantenimiento en Heroku

**Ver logs en tiempo real:**
```bash
heroku logs -a tu-app-nombre --tail
```

**Ejecutar comandos (ej: crear superuser):**
```bash
heroku run "python manage.py createsuperuser" -a tu-app-nombre
```

**Escalar dyos (aumentar capacidad):**
```bash
heroku ps:scale web=2 -a tu-app-nombre
```

## Estructura del Proyecto

```
SS_ConfiaChamba/
├── confia_chamba/          # Configuración principal de Django
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── jobs/                   # Aplicación de empleos
│   ├── models.py
│   ├── views.py
│   ├── forms.py
│   ├── urls.py
│   └── templates/jobs/
├── static/                 # CSS, JS, imágenes (recolectados por collectstatic)
├── media/                  # Archivos subidos por usuarios
├── requirements.txt        # Dependencias Python
├── Dockerfile
├── Procfile               # Instrucciones para Heroku
├── runtime.txt            # Versión de Python
├── heroku.yml             # Configuración Docker para Heroku
├── .env.example           # Plantilla de variables de entorno
├── .gitignore
└── manage.py
```

## Troubleshooting

### Error: "DEBUG=False, SECRET_KEY not set"
- Asegúrate de que `DJANGO_SECRET_KEY` esté establecida en Heroku:
  ```bash
  heroku config:set DJANGO_SECRET_KEY='<valor>' -a tu-app-nombre
  ```

### Error: "DisallowedHost" en Heroku
- Verifica que `ALLOWED_HOSTS` incluya tu dominio de Heroku:
  ```bash
  heroku config:set ALLOWED_HOSTS='tu-app.herokuapp.com' -a tu-app-nombre
  ```

### Error: "ConnectionError" en migraciones
- Heroku ejecuta migraciones automáticamente via `release` en el `Procfile` o `heroku.yml`.
- Si falla, revisa los logs: `heroku logs -a tu-app-nombre --tail`

### Error: Static files no se sirven
- WhiteNoise está configurado en `settings.py` para servir estáticos en producción.
- Ejecuta localmente:
  ```bash
  python manage.py collectstatic --noinput
  ```

## Próximos Pasos (Mejoras)

- [ ] Mover media a AWS S3 o similar (usar `django-storages`)
- [ ] Implementar tests automatizados
- [ ] Configurar CI/CD (GitHub Actions, GitLab CI)
- [ ] Añadir monitoreo y alertas (Sentry, New Relic)
- [ ] Hacer backup automático de BD

## Licencia

MIT (o la que uses)

## Contacto

Para preguntas o contribuciones, contacta al equipo de desarrollo.
