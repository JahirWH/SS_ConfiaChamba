# 💬 Sistema de Chat - ConfiaChamba

## ✨ ¿Qué se creó?

Un **sistema de chat en tiempo real** que permite a los usuarios comunicarse directamente entre sí en la plataforma ConfiaChamba.

---

## 🎯 Características Principales

### 👥 Conversaciones

- Lista de todas tus conversaciones
- Buscar contactos
- Ver último mensaje de cada conversación
- Contador de mensajes no leídos

### 💬 Chat

- Historial completo de mensajes
- Mensajes ordenados por hora
- Distingue mensajes enviados y recibidos
- Auto-scroll al último mensaje
- Timestamps en cada mensaje

### ⚡ Actualizaciones Automáticas

- Conversaciones actualizan cada 3 segundos
- Mensajes actualizan cada 2 segundos
- Contador de no leídos cada 5 segundos
- **Sin necesidad de recargar la página**

### 🔔 Indicadores

- Badge rojo en navbar con número de mensajes sin leer
- Botón "💬 Mensajes" siempre visible
- Conversación activa resaltada

---

## 📱 Cómo Usar

### 1. Acceder al Chat

```
http://localhost:3000/msg.html
```

### 2. Ver Conversaciones

- Se cargan automáticamente
- Haz clic en una para abrirla
- Se actualizan automáticamente cada 3 segundos

### 3. Enviar un Mensaje

1. Selecciona una conversación
2. Escribe en la caja de texto
3. Presiona "Enviar" o Enter
4. ✅ El mensaje se envía inmediatamente

### 4. Recibir Mensajes

- Se reciben automáticamente cada 2 segundos
- Aparecen en la ventana de chat
- Se marcan como leído automáticamente

---

## 📊 Estructura Técnica

### Backend (Node.js + Express)

**Archivo:** `backend/routes/messages.js`

**Endpoints:**

- `POST /api/messages` - Enviar mensaje
- `GET /api/messages/list` - Obtener conversaciones
- `GET /api/messages/conversation/:id` - Obtener mensajes
- `PUT /api/messages/:id` - Marcar como leído

### Base de Datos (Supabase)

**Tabla:** `messages`

```
- id (Primary Key)
- emisor_id (Usuario que envía)
- receptor_id (Usuario que recibe)
- contenido (Texto del mensaje)
- trabajo_id (Referencia al trabajo - opcional)
- leido (Boolean - si fue leído)
- creado_en (Timestamp)
```

### Frontend (HTML + JavaScript)

**Archivos:** `frontend/msg.html` y `frontend/chat.html`

**Componentes:**

- Sidebar de conversaciones
- Ventana de chat
- Input de mensaje
- Indicadores de estado

---

## 🚀 Instalación Rápida

### Paso 1: Crear la tabla en Supabase

1. Ve a https://app.supabase.com
2. Abre tu proyecto
3. SQL Editor → Nueva Query
4. Copia el contenido de `backend/database-messages.sql`
5. Pega y ejecuta (Ctrl+Enter)

```sql
-- Copia ESTE contenido:
CREATE TABLE IF NOT EXISTS messages (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  emisor_id BIGINT NOT NULL,
  receptor_id BIGINT NOT NULL,
  contenido TEXT NOT NULL,
  trabajo_id BIGINT,
  leido BOOLEAN DEFAULT false,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ...
)
```

### Paso 2: Reiniciar Backend

```bash
npm run dev
```

### Paso 3: ¡A Usar!

```
http://localhost:3000/msg.html
```

---

## 🧪 Testing

### Crear 2 Usuarios de Prueba

**Usuario 1:**

- Email: `user1@test.com`
- Contraseña: `Test123!`
- Nombre: Juan

**Usuario 2:**

- Email: `user2@test.com`
- Contraseña: `Test123!`
- Nombre: Pedro

### Probar Conversación

**En la Pestaña 1 (como Juan):**

1. Login con `user1@test.com`
2. Abre `/msg.html`
3. Escribe un mensaje a Pedro
4. Haz clic "Enviar"

**En la Pestaña 2 (como Pedro):**

1. Login con `user2@test.com`
2. Abre `/msg.html`
3. ✅ En 2 segundos verás el mensaje de Juan
4. Responde
5. ✅ Juan lo recibe automáticamente

---

## 🔒 Seguridad

### Autenticación

- Requiere token JWT
- Almacenado en `localStorage`
- Se valida en cada request

### Base de Datos

- Row Level Security (RLS) habilitado
- Los usuarios solo ven sus propios mensajes
- No se puede acceder a mensajes de otros

### Validación

- Los mensajes vacíos se rechazan
- Se valida emisor y receptor
- Se previene inyección SQL

---

## 📲 Integración en tu App

### Ya Incluido ✅

- Botón en navbar
- Contador de no leídos
- Link directo al chat

### Opcional - Botón en Perfil

```html
<a href="msg.html" class="btn btn-primary"> Enviar Mensaje </a>
```

### Opcional - Botón en Oferta

```html
<button onclick="window.location.href='msg.html'" class="btn">
  Contactar al Trabajador
</button>
```

---

## 🐛 Troubleshooting

### "401 No autenticado"

```
✓ Verifica que estés logueado
✓ Abre DevTools (F12) → Console
✓ Verifica que haya un token en localStorage
```

### "No hay conversaciones"

```
✓ Crea un mensaje primero
✓ O verifica que la tabla existe en Supabase
```

### "Mensajes no se guardan"

```
✓ Abre DevTools (F12) → Network
✓ Busca la request POST /api/messages
✓ Verifica que no tenga error 5xx
```

### "Muy lento"

```
✓ Es normal (refresco cada 2-3 segundos)
✓ Si quieres más rápido, edita en msg.html:
  setInterval(loadConversations, 1000) // 1 segundo
```

---

## 📚 Documentación

Tenemos 4 documentos para ti:

1. **CHAT-RAPIDO.md** ← Instrucciones simples (START HERE)
2. **CHAT-VISUAL.md** ← Diagramas y explicaciones
3. **CHAT-IMPLEMENTADO.md** ← Resumen de cambios
4. **SISTEMA-CHAT.md** ← Documentación completa

---

## ✨ Mejoras Futuras (Opcionales)

```
Ideas para mejorar el chat:

☐ Indicador de "Usuario X está escribiendo..."
☐ Reacciones con emoji (👍 ❤️ etc)
☐ Compartir fotos/archivos
☐ WebSockets para tiempo real 100%
☐ Cifrado de mensajes
☐ Búsqueda en historial de mensajes
☐ Bloquear usuarios
☐ Notificaciones push
☐ Typings indicators
☐ Voice messages (mensajes de voz)
```

---

## 📁 Archivos Relacionados

```
Backend:
  backend/routes/messages.js          ← API endpoints
  backend/server.js                   ← Integración (actualizado)
  backend/database-messages.sql       ← Schema de BD

Frontend:
  frontend/msg.html                   ← Chat interface
  frontend/chat.html                  ← Chat (respaldo)
  frontend/config.js                  ← Funciones globales
  frontend/index.html                 ← Homepage (actualizado)

Documentación:
  info/CHAT-RAPIDO.md                 ← Guía rápida
  info/CHAT-VISUAL.md                 ← Diagramas
  info/CHAT-IMPLEMENTADO.md           ← Resumen
  info/SISTEMA-CHAT.md                ← Documentación completa
```

---

## 🎯 Checklist de Implementación

```
ANTES DE EMPEZAR:
□ Node.js instalado
□ Backend corriendo (npm run dev)
□ Supabase configurado

INSTALACIÓN:
□ Ejecutar SQL en Supabase
□ Reiniciar backend
□ Abrir http://localhost:3000/msg.html

VERIFICACIÓN:
□ Chat carga sin errores
□ Puedo ver conversaciones
□ Puedo enviar mensajes
□ Los mensajes aparecen al otro usuario
□ Contador de no leídos funciona
□ Navbar muestra botón de chat

¡COMPLETADO!:
□ ¡Sistema de chat 100% operacional! 🎉
```

---

## 💡 Tips y Trucos

### Hacer el chat más rápido:

Edita `msg.html` línea ~170:

```javascript
// Cambiar esto:
setInterval(loadConversations, 3000);

// A esto:
setInterval(loadConversations, 1000); // 1 segundo en lugar de 3
```

### Ver logs del backend:

```bash
npm run dev
```

Busca mensajes sobre `/api/messages`

### Debugging en navegador:

1. Abre DevTools (F12)
2. Pestana "Console"
3. Busca errores rojos
4. Copia y pega en un archivo para revisión

### Ver las transacciones HTTP:

1. DevTools (F12)
2. Pestaña "Network"
3. Filtra por "messages"
4. Verifica que los requests tengan 200/201 OK

---

## 📞 Soporte

Si algo no funciona:

1. **Verifica error en Console (F12)**
   - Abre DevTools
   - Pestaña Console
   - Busca mensaje rojo

2. **Verifica logs del backend**
   - Terminal: `npm run dev`
   - Busca errores

3. **Verifica tabla en Supabase**
   - SQL Editor
   - `SELECT * FROM messages LIMIT 5;`
   - ¿Aparece algún mensaje?

4. **Verifica autenticación**
   - DevTools Console
   - `localStorage.getItem('token')`
   - ¿Hay un token largo?

---

## 🎉 ¡Listo!

El chat está 100% funcional y listo para usar.

**Próximos pasos:**

1. Ejecuta el SQL en Supabase
2. Reinicia el backend
3. Abre http://localhost:3000/msg.html
4. ¡A chatear!

Si necesitas ayuda, revisa los 4 documentos incluidos.

---

**Creado:** 6 de febrero, 2026  
**Versión:** 1.0  
**Estado:** ✅ Producción Ready
