# 🚀 Guía de Despliegue en Render

## Problema CORS - YA ARREGLADO ✅

El error que recibías era porque:

- Frontend en Vercel no podía comunicarse con Backend en Render
- Las URLs no estaban configuradas correctamente
- CORS no permitía las solicitudes

**Solución aplicada:**

- ✅ `config.js` ahora apunta a `https://ss-confiachamba.onrender.com`
- ✅ `server.js` acepta CORS desde Vercel
- ✅ `vercel.json` y `render.yaml` configurados correctamente

---

## 📋 Pasos para Actualizar en Render

### 1. **Ir a Render Dashboard**

```
https://dashboard.render.com
```

### 2. **Selecciona tu servicio: `ss-confiachamba`**

### 3. **Actualiza las Variables de Entorno**

En la sección **"Environment Variables"**, asegúrate de que estas existan:

```
SUPABASE_URL = https://szuvqvgfwrzizcenxmvb.supabase.co
SUPABASE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dXZxdmdmd3J6aXpjZW54bXZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODUzMjQsImV4cCI6MjA3OTY2MTMyNH0.OKzKYJCQQCjbtcgQ_sy-u7KcRPR0l8bgV1PONFnqLjc
JWT_SECRET = PETaGuDvnhz1LVgSdDIac7b7KlsvztIgN6dLYtcEwDQ=
FRONTEND_URL = https://ss-confia-chamba.vercel.app
NODE_ENV = production
```

### 4. **Hacer Deploy**

- Opción A: Push a GitHub → Render redeploy automático
- Opción B: Click "Manual Deploy" en Render dashboard

### 5. **Verificar que funciona**

```bash
# En la terminal local, probar la API:
curl https://ss-confiachamba.onrender.com/api/health

# Deberías ver:
# {"status":"ok","message":"Backend funcionando correctamente"}
```

---

## 🔧 Qué se Arregló

### **config.js (Frontend)**

```javascript
// ❌ ANTES (apuntaba mal)
API_URL: "https://ss-confia-chamba.vercel.app/";

// ✅ DESPUÉS (ahora apunta correctamente a Render)
API_URL: "https://ss-confiachamba.onrender.com";
```

### **server.js (Backend CORS)**

```javascript
// ✅ Ahora acepta solicitudes desde:
origin: [
  "https://ss-confia-chamba.vercel.app", // Frontend en Vercel
  "https://ss-confiachamba.onrender.com", // Backend en Render
  "http://localhost:3000", // Desarrollo local
];
```

---

## ✅ Checklist de Verificación

- [ ] Variables de entorno en Render actualizadas
- [ ] Push a GitHub con los cambios
- [ ] Render redeploy automático completado
- [ ] Probar `/api/health` desde navegador
- [ ] Ir a `https://ss-confia-chamba.vercel.app`
- [ ] Intentar registrarse nuevamente
- [ ] Debería funcionar sin errores CORS ✨

---

## 🐛 Si Sigue Sin Funcionar

### Opción 1: Revisar Logs en Render

```
Render Dashboard → ss-confiachamba → Logs
```

Busca mensajes de error

### Opción 2: Probar en Desarrollo Local

```bash
cd backend
npm install
npm start

# En otra terminal:
cd frontend
# Abre http://localhost:3000 en navegador
```

### Opción 3: Revisar Consola del Navegador

- Abre DevTools (F12)
- Ve a "Console" (Consola)
- Intenta registrarte
- Busca errores exactos

---

## 🎯 URLs Finales

| Servicio     | URL                                             |
| ------------ | ----------------------------------------------- |
| Frontend     | https://ss-confia-chamba.vercel.app             |
| Backend API  | https://ss-confiachamba.onrender.com            |
| Health Check | https://ss-confiachamba.onrender.com/api/health |
| Supabase     | https://szuvqvgfwrzizcenxmvb.supabase.co        |

---

## 💡 Próximos Pasos

Una vez que el registro funcione:

1. Prueba login
2. Crea un perfil
3. Intenta publicar un trabajo
4. Verifica que todo se guarde en Supabase

¡Listo! 🚀
