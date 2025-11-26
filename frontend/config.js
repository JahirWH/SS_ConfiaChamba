// Detectar si está en desarrollo o producción
if (typeof isDevelopment === 'undefined') {
  var isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

if (typeof CONFIG === 'undefined') {
  var CONFIG = {
    // API URL para las llamadas HTTP
    API_URL: isDevelopment 
      ? 'http://localhost:3000' 
      : 'https://ss-confiachamba.onrender.com',
    
    // API URL con /api para rutas
    API_ENDPOINT: isDevelopment
      ? 'http://localhost:3000/api'
      : 'https://ss-confiachamba.onrender.com/api',
    
    // URLs de la plataforma
    APP_NAME: 'ConfiaChamba',
    SUPPORT_EMAIL: 'soporte@confiacham.local'
  };
  
  // Hacer disponible globalmente
  window.CONFIG = CONFIG;
}
