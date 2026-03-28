// db.js
require('dotenv').config(); // carga las variables de .env

const { Pool } = require('pg');

// Determinar si usar DATABASE_URL o parámetros separados
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
      connectionString: String(process.env.DATABASE_URL),
    }
    : {
      user: String(process.env.DB_USER),
      password: String(process.env.DB_PASSWORD),
      host: String(process.env.DB_HOST),
      port: Number(process.env.DB_PORT),
      database: String(process.env.DB_NAME),
    }
);

// Prueba rápida de conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error conectando a PostgreSQL:', err.message);
  } else {
    console.log('Conexión a PostgreSQL exitosa ✅');
    release();
  }
});

module.exports = pool;