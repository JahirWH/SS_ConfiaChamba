// Detectar si está en desarrollo o producción
var isDevelopment = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    
if (typeof CONFIG === 'undefined') {
  var CONFIG = {
    // API URL para las llamadas HTTP
    API_URL: isDevelopment 
      ? 'http://localhost:4000' 
      : 'https://confiachamba.online',
    
    // API URL con /api para rutas
    API_ENDPOINT: isDevelopment
      ? 'http://localhost:4000/api'
      : 'https://confiachamba.online/api',
    
    // URLs de la plataforma
    APP_NAME: 'ConfiaChamba',
    SUPPORT_EMAIL: 'soporte@confiacham.local'
  };
  
  // Hacer disponible globalmente
  window.CONFIG = CONFIG;
}

// Función global para obtener API URL
function getApiUrl() {
  return CONFIG.API_URL || 'http://localhost:4000';
}

// Función global para verificar si el usuario está logueado
function isLoggedIn() {
  return !!localStorage.getItem('token') && !!localStorage.getItem('user');
}

// Función para logout
function logout() {
  if(confirm('¿Seguro que quieres salir?')) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }
}

// Actualizar contador de mensajes no leídos
async function updateUnreadCount() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${getApiUrl()}/api/messages/list`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) return;

    const conversations = await response.json();
    const unreadCount = conversations.reduce((sum, conv) => sum + (conv.noLeidos || 0), 0);
    
    const badge = document.getElementById('unreadBadge');
    if (badge) {
      if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }
  } catch (error) {
    console.error('Error al actualizar contador:', error);
  }
}

// Función global para renderizar navbar
function renderNavLinks() {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  if (isLoggedIn()) {
    const user = JSON.parse(localStorage.getItem('user'));
    navLinks.innerHTML = `
      <div class="flex gap-4 items-center">
        <a href="create-job.html" class="text-gray-700 hover:text-orange-600">Publicar</a>
        <a href="msg.html" class="text-gray-700 hover:text-orange-600 relative">
          💬 Mensajes
          <span id="unreadBadge" class="hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"></span>
        </a>
        <a href="profile.html" class="text-gray-700 hover:text-orange-600">Perfil</a>
        <div class="flex items-center gap-2 bg-orange-100 px-3 py-1.5 rounded-full">
          <span class="text-sm font-medium">${user.nombre.split(' ')[0]}</span>
        </div>
        <button onclick="logout()" class="text-gray-500 hover:text-red-600">Salir</button>
      </div>
    `;
    
    // Cargar contador de mensajes no leídos
    updateUnreadCount();
  } else {
    navLinks.innerHTML = `
      <div class="flex gap-3 items-center">
        <a href="login.html" class="text-gray-700 hover:text-gray-900">Entrar</a>
        <a href="register.html" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
          Registrarme
        </a>
      </div>
    `;
  }
}

// Actualizar navbar cuando cambia localStorage
window.addEventListener('storage', renderNavLinks);

// Actualizar contador cada 5 segundos si está logueado
if (isLoggedIn()) {
  setInterval(updateUnreadCount, 5000);
}
