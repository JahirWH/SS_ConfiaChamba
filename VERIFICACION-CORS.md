# ✅ VERIFICACIÓN DE CONEXIÓN

Sigue estos pasos para verificar que todo está funcionando:

## 1️⃣ **Verificar Backend en Render**

Abre en tu navegador:

```
https://ss-confiachamba.onrender.com/api/health
```

Deberías ver:

```json
{ "status": "ok", "message": "Backend funcionando correctamente" }
```

---

## 2️⃣ **Verificar Frontend en Vercel**

Abre en tu navegador:

```
https://ss-confia-chamba.vercel.app
```

Deberías ver la página de inicio funcionando.

---

## 3️⃣ **Probar Registro**

1. Abre: https://ss-confia-chamba.vercel.app/register.html
2. Llena el formulario
3. Click en "Crear Cuenta"
4. **Abre la Consola (F12)** para ver si hay errores

Si ves un error CORS, revisa que:

- ✅ Backend URL en `config.js` es: `https://ss-confiachamba.onrender.com`
- ✅ Variables de entorno en Render están correctas
- ✅ Push los cambios a GitHub

---

## 4️⃣ **Checklist de CORS Arreglado**

Estos archivos ya fueron actualizados:

- ✅ `frontend/config.js` - Apunta a Render correctamente
- ✅ `backend/server.js` - CORS configurado para Vercel
- ✅ `frontend/register.html` - Usa CONFIG.API_ENDPOINT
- ✅ `frontend/login.html` - Usa CONFIG.API_ENDPOINT
- ✅ `frontend/index.html` - Usa CONFIG.API_ENDPOINT
- ✅ `frontend/create-job.html` - Usa CONFIG.API_ENDPOINT
- ✅ `frontend/profile.html` - Usa CONFIG.API_ENDPOINT
- ✅ `frontend/job-detail.html` - Usa CONFIG.API_ENDPOINT

---

## 5️⃣ **Pasos Finales**

1. Haz commit de los cambios:

```bash
git add .
git commit -m "Fix: CORS configuration for Vercel-Render integration"
git push
```

2. Vercel redeploy automático
3. Render redeploy automático (o manual si necesario)
4. Espera 2-3 minutos
5. Prueba nuevamente en https://ss-confia-chamba.vercel.app/register.html

---

## 🆘 Si Sigue Sin Funcionar

### Paso 1: Revisar Console en Navegador

- Abre https://ss-confia-chamba.vercel.app
- Presiona F12
- Ve a "Console"
- Intenta registrarte
- Copia el mensaje de error exacto

### Paso 2: Revisar Logs en Render

- Ve a: https://dashboard.render.com
- Selecciona: ss-confiachamba
- Abre: Logs
- Copia cualquier error

### Paso 3: Revisar Variables de Entorno en Render

- Render Dashboard → ss-confiachamba → Environment
- Verifica que todas estén presentes

---

## 📝 Resumen de Cambios

**config.js:**

- Ahora detecta si es desarrollo (localhost) o producción (Vercel/Render)
- Apunta a `https://ss-confiachamba.onrender.com` en producción
- Exporta `CONFIG.API_ENDPOINT` con `/api` incluido

**server.js:**

- CORS ahora permite:
  - https://ss-confia-chamba.vercel.app (Frontend)
  - https://ss-confiachamba.onrender.com (Backend)
  - http://localhost:3000 (Desarrollo)

**HTML Files:**

- Todos cargan `config.js`
- Todos usan `${CONFIG.API_ENDPOINT}` en lugar de URLs hardcodeadas
- Cambios: register.html, login.html, index.html, create-job.html, profile.html, job-detail.html

---

¡Ahora debería funcionar! 🚀
