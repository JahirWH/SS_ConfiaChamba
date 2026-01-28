# ConfiaChamba - README Técnico para CV

> Plataforma de conexión entre trabajadores informales y clientes que necesitan servicios, con sistema de reputación y precios justos.

---

## 📋 Resumen Ejecutivo

Desarrollé **ConfiaChamba**, una plataforma full-stack que conecta a trabajadores informales con clientes que necesitan servicios puntuales. El proyecto incluye sistema de autenticación, gestión de perfiles, publicación de trabajos, y un sistema de reputación basado en calificaciones.

**Tipo de Proyecto**: Servicio Social (trabajo académico/comunitario)  
**Duración**: Desarrollo continuo con múltiples ciclos de debugging  
**Estado**: Funcional y desplegado en producción

---

## 🛠️ Stack Tecnológico

### **Frontend**

- **HTML5** - Estructura semántica
- **CSS3** - Estilos responsivos y modernos
- **JavaScript (Vanilla)** - Sin frameworks, código limpio y directo
- **Fetch API** - Comunicación HTTP con backend
- **LocalStorage** - Persistencia de sesión en cliente

**Archivos principales:**

- `index.html` - Página de inicio
- `login.html` - Autenticación de usuarios
- `register.html` - Registro con validación
- `profile.html` - Perfil de usuario y gestión de trabajos
- `create-job.html` - Publicación de nuevos servicios
- `job-detail.html` - Detalle completo de trabajos
- `config.js` - Configuración centralizada de URLs (desarrollo vs producción)

### **Backend**

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **Supabase** - Base de datos PostgreSQL + autenticación
- **JWT (jsonwebtoken)** - Tokens seguros para autenticación
- **Bcrypt** - Hash seguro de contraseñas
- **CORS** - Control de solicitudes cross-origin
- **Dotenv** - Gestión de variables de entorno

**Archivos principales:**

- `server.js` - Servidor Express con configuración CORS
- `routes/auth.js` - Endpoints de autenticación (registro, login, logout)
- `routes/jobs.js` - Endpoints CRUD de trabajos
- `routes/users.js` - Endpoints de perfiles de usuario
- `middleware/auth.js` - Verificación de tokens JWT
- `database-setup-v2.sql` - Schema de base de datos

### **Infraestructura & Deployment**

- **Supabase** - Base de datos PostgreSQL en la nube
- **Render** - Hosting del backend (Node.js)
- **Vercel** - Hosting del frontend (sitios estáticos)
- **Git/GitHub** - Control de versiones

---

## 🎯 Características Implementadas

### Autenticación y Autorización

✅ Registro de usuarios con validación de email  
✅ Login con contraseña hasheada (bcrypt)  
✅ Tokens JWT para sesiones seguras  
✅ Middleware de autenticación en rutas protegidas  
✅ Logout con limpieza de token en cliente

### Gestión de Perfiles

✅ Perfil de usuario con foto e información  
✅ Dos tipos de usuario: Trabajador y Cliente  
✅ Historial de trabajos realizados  
✅ Sistema de calificaciones y reseñas  
✅ Estadísticas de desempeño (promedio de calificación)

### Gestión de Trabajos

✅ Publicación de servicios con descripción y precio  
✅ Búsqueda y filtrado de trabajos disponibles  
✅ Detalle completo con información del trabajador  
✅ Sistema de contacto entre partes  
✅ Estado del trabajo (publicado, en progreso, completado)

### Sistema de Reputación

✅ Calificación por trabajo realizado  
✅ Promedio de calificaciones por usuario  
✅ Portafolio visible de trabajos anteriores  
✅ Reseñas textuales de clientes

---

## 🚀 Desafíos Técnicos Superados

### 1. **Problema CORS (Crítico) ⚠️**

**El Desafío:**

- Frontend en Vercel no podía comunicarse con backend en Render/localhost
- Error: `"Solicitud CORS bloqueada: Solicitud de origen cruzado bloqueada"`
- URLs hardcodeadas en cada archivo HTML causaban fallos al cambiar de entorno

**Lo que lo hacía difícil:**

- Diferentes dominios en desarrollo vs producción
- El backend solo permitía localhost
- Cada cambio de ambiente requería modificar múltiples archivos

**Solución Implementada:**

```javascript
// config.js - Detección automática de entorno
if (typeof isDevelopment === "undefined") {
  var isDevelopment = window.location.hostname === "localhost";

  var CONFIG = {
    API_ENDPOINT: isDevelopment
      ? "http://localhost:3000/api"
      : "https://ss-confiachamba.onrender.com/api",
  };
}
```

```javascript
// server.js - CORS configurado para múltiples orígenes
const corsOptions = {
  origin: [
    "https://ss-confia-chamba.vercel.app",
    "https://ss-confiachamba.onrender.com",
    "http://localhost:3000",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
```

**Impacto:**

- ✅ Frontend detecta automáticamente el entorno
- ✅ Ningún cambio manual de URLs necesario
- ✅ Múltiples ambientes soportados simultáneamente
- ✅ Reducción de bugs por variables hardcodeadas

---

### 2. **Redeclaración de Variables en JavaScript (Intermedio) 🔄**

**El Desafío:**

- Error: `"Uncaught SyntaxError: redeclaration of const isDevelopment"`
- `config.js` se cargaba múltiples veces en los HTML
- Variables `const` no pueden redeclararse en JavaScript

**Lo que lo hacía difícil:**

- Difícil de detectar sin ver la consola de errores
- El problema era semántico, no lógico
- El patrón de cargar archivos JS múltiples veces es común

**Solución Implementada:**

```javascript
// Cambio de const a var con protección
if (typeof isDevelopment === 'undefined') {
  var isDevelopment = ...;  // Solo se define si no existe
  var CONFIG = ...;
}
```

**Aprendizaje:**

- `var` se puede reasignar (aunque es menos seguro)
- `const` es mejor práctica pero menos tolerante
- Condicionales para cargar scripts múltiples veces son comunes

---

### 3. **Autenticación Stateless con JWT (Intermedio) 🔐**

**El Desafío:**

- Implementar autenticación sin sesiones del servidor (stateless)
- El token JWT debe almacenarse en cliente sin exponer datos sensibles
- Sincronización entre lo que el servidor espera y el cliente envía

**Lo que lo hacía difícil:**

- JWT es más complejo que cookies simples
- Headers deben incluir `Authorization: Bearer <token>`
- Expiración de token y refresh strategy
- Validación debe estar en cada ruta protegida

**Solución Implementada:**

```javascript
// Backend - Generar JWT
const token = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: "24h" },
);

// Backend - Middleware de verificación
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido" });
  }
};

// Frontend - Incluir token en solicitudes
fetch(`${CONFIG.API_ENDPOINT}/profile`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
```

**Impacto:**

- ✅ Autenticación estateless escalable
- ✅ No requiere sesiones en servidor
- ✅ Token persiste sin exponer datos sensibles
- ✅ Arquitectura lista para microservicios

---

### 4. **Integración con Supabase (Intermedio) 🗄️**

**El Desafío:**

- Conectar Node.js con base de datos PostgreSQL remota
- Gestionar credenciales de forma segura
- Implementar operaciones CRUD con SQL y Supabase SDK

**Lo que lo hacía difícil:**

- Supabase tiene su propio SDK pero también permite SQL directo
- Variables de entorno deben estar en múltiples lugares (local, Render, GitHub)
- Conexión requiere anon key y service role key (diferentes permisos)

**Solución Implementada:**

```javascript
// Inicializar cliente Supabase
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Operación ejemplo - Crear usuario
const { data, error } = await supabase
  .from('users')
  .insert([{ email, password_hash, role }]);

// Schema SQL
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'worker',
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Impacto:**

- ✅ Base de datos administrada en la nube
- ✅ No requiere servidor de base de datos propio
- ✅ Backups automáticos y escalabilidad
- ✅ Cumplimiento de seguridad WCAG

---

### 5. **Gestión de Entornos (Desarrollo/Producción) (Intermedio) 🌐**

**El Desafío:**

- Diferentes URLs para desarrollo local vs producción
- Diferentes credenciales de API (nunca compartir en GitHub)
- Múltiples plataformas de deployment (Vercel, Render)
- Variables de entorno en cada plataforma

**Lo que lo hacía difícil:**

- Fácil accidentalmente comitear `.env` real a GitHub
- Olvidar actualizar variables en Render/Vercel
- Debugging difícil cuando las variables no se cargan correctamente
- Sincronizar cambios entre local y producción

**Solución Implementada:**

```
Estructura de archivos:
├── .env                    ← (ignorado por .gitignore) Credenciales reales
├── .env.example           ← Plantilla pública sin valores
└── .gitignore             ← Previene subir .env

# En Render (interfaz web):
SUPABASE_URL = https://...
SUPABASE_KEY = ...
JWT_SECRET = ...

# En Vercel (interfaz web):
Automáticamente detecta entorno via config.js
```

**Aprendizaje:**

- `.env.example` como referencia de qué variables usar
- Nunca confiar en valores por defecto en producción
- Documentar cada variable de entorno requerida
- Validar que todas las variables existan al iniciar

---

### 6. **Validación de Formularios en Frontend (Básico) ✅**

**El Desafío:**

- Validar email, contraseña, confirmación de contraseña
- Mostrar errores específicos al usuario
- Evitar enviar datos inválidos al servidor
- Mantener código limpio sin frameworks

**Solución Implementada:**

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

async function handleRegister(event) {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validaciones
  if (!validateEmail(email)) {
    showError("Email inválido");
    return;
  }

  if (!validatePassword(password)) {
    showError("Contraseña mínimo 6 caracteres");
    return;
  }

  if (password !== confirmPassword) {
    showError("Contraseñas no coinciden");
    return;
  }

  // Enviar al servidor
  const response = await fetch(`${CONFIG.API_ENDPOINT}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}
```

---

### 7. **Sistema de Calificaciones y Reputación (Intermedio) ⭐**

**El Desafío:**

- Almacenar calificaciones por trabajo completado
- Calcular promedio dinámicamente
- Mostrar historial de trabajos con calificaciones
- Asegurar que solo clientes reales puedan calificar

**Solución Implementada:**

```sql
-- Tabla de trabajos
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES users(id),
  title VARCHAR NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  status VARCHAR DEFAULT 'published',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de calificaciones (separate)
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  rater_id UUID REFERENCES users(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Query para promedio de calificaciones de un trabajador
SELECT
  AVG(r.rating) as average_rating,
  COUNT(r.id) as total_ratings
FROM ratings r
JOIN jobs j ON r.job_id = j.id
WHERE j.worker_id = $1
```

---

## 📊 Estadísticas del Proyecto

| Métrica                | Valor                          |
| ---------------------- | ------------------------------ |
| Archivos HTML          | 6                              |
| Archivos JavaScript    | 1 (config.js) + backend routes |
| Rutas API              | 9+ endpoints                   |
| Funcionalidades Core   | 7                              |
| Problemas Solucionados | 7 principales                  |
| Entornos Soportados    | 3 (local, Render, Vercel)      |

---

## 🔒 Consideraciones de Seguridad

✅ **Contraseñas**: Hasheadas con bcrypt (no almacenadas en texto plano)  
✅ **Tokens**: JWT con expiración y firma criptográfica  
✅ **CORS**: Configurado explícitamente para orígenes conocidos  
✅ **Variables de Entorno**: Nunca en control de versiones  
✅ **Validación**: En frontend y backend (nunca confiar solo en cliente)  
✅ **SQL Injection**: Prevenido usando Supabase SDK y queries parametrizadas

---

## 🚀 Deployment

### Frontend

- **Plataforma**: Vercel
- **Trigger**: Git push a main
- **Carpeta**: `/frontend`
- **Build**: Static site (no build necesario)

### Backend

- **Plataforma**: Render
- **Trigger**: Git push a main
- **Carpeta**: `/backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Variables de Entorno**: Configuradas en Render dashboard

### Base de Datos

- **Plataforma**: Supabase (PostgreSQL)
- **Credenciales**: En variables de entorno
- **Backups**: Automáticos

---

## 📚 Aprendizajes Clave

### Técnicos

1. **Arquitectura Stateless** - Escalable y sin estado servidor
2. **CORS** - Comprender solicitudes cross-origin es crítico
3. **Autenticación JWT** - Mejor para APIs REST que sesiones
4. **Separación Frontend/Backend** - Permite despliegue independiente
5. **Variables de Entorno** - Seguridad desde el diseño

### No-Técnicos

1. **Debugging Sistemático** - Leer errores completos en consola
2. **Documentación** - Crucial para cambios futuros
3. **Testing Manual** - Importantes las pruebas en múltiples entornos
4. **Versionado** - Commits claros facilitan debugging posterior
5. **Iteración** - Primero MVP, luego mejoras

---

## 🎓 Competencias Desarrolladas

| Competencia                 | Nivel             | Descripción                           |
| --------------------------- | ----------------- | ------------------------------------- |
| **JavaScript Full-Stack**   | Intermedio        | Frontend y backend con Node.js        |
| **API REST**                | Intermedio        | Diseño y consumo de endpoints         |
| **Autenticación**           | Intermedio        | JWT, hashing, tokens seguros          |
| **Bases de Datos**          | Básico-Intermedio | SQL, CRUD, relaciones                 |
| **DevOps**                  | Básico            | Git, variables de entorno, deployment |
| **Debugging**               | Intermedio        | Consola, network tab, logs            |
| **HTML/CSS**                | Básico            | Estructura semántica, responsive      |
| **Resolución de Problemas** | Intermedio        | Análisis sistemático de errores       |

---

## 🔄 Ciclo de Desarrollo

```
1. ANÁLISIS
   └─ Entender requirements y casos de uso

2. DISEÑO
   └─ Estructura de base de datos, endpoints API, flujo HTML

3. IMPLEMENTACIÓN
   ├─ Backend (routes, auth, database)
   ├─ Frontend (HTML, JavaScript, config)
   └─ Integración (testear localmente)

4. DEBUGGING
   ├─ Encontrar errores
   ├─ Investigar causa raíz
   └─ Implementar solución

5. DEPLOYMENT
   ├─ Push a GitHub
   ├─ Deploy automático en Vercel/Render
   └─ Verificar en producción

6. MANTENIMIENTO
   └─ Monitoring y mejoras futuras
```

---

## 📝 Conclusión

**ConfiaChamba** fue un proyecto que requirió dominar múltiples aspectos del desarrollo web moderno: desde arquitectura de aplicaciones, seguridad, hasta deployment en plataformas cloud. Los desafíos enfrentados (especialmente CORS) enseñaron la importancia de entender cómo funciona la comunicación en la web a nivel profundo, no solo "hacer que funcione".

El proyecto está completamente funcional, desplegado en producción, y constituye un ejemplo sólido de una aplicación full-stack profesional.

---

**Última actualización:** Enero 2026  
**Repositorio:** GitHub - SS_ConfiaChamba  
**Estado:** ✅ Funcional y en producción
