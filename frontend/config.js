// Detectar si está en desarrollo o producción
const isDevelopment = window.location.hostname === 'localhost';

const CONFIG = {
  // API URL para las llamadas HTTP
  API_URL: isDevelopment 
    ? 'http://localhost:3000' 
    : 'https://ss-confia-chamba.vercel.app/',
  
  // URLs de la plataforma
  APP_NAME: 'ConfiaChamba',
  SUPPORT_EMAIL: 'soporte@confiacham.local'
};

// Exportar para uso en scripts (si se necesita)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
