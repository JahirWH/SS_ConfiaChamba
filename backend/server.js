require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./db'); // <- importa db.js
const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   CONEXIÓN A POSTGRESQL
========================= */

const isRemoteDb = process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1');


app.locals.db = pool;         // <- lo deja disponible en todas las rutas

pool.query('SELECT current_database(), current_user;')
  .then(res => console.log('🔥 Conectado a DB:', res.rows[0]))
  .catch(err => console.error('❌ Error DB:', err));

// const pool = new Pool(
//   process.env.DATABASE_URL
//     ? {
//       connectionString: process.env.DATABASE_URL,
//       ...(isRemoteDb ? { ssl: { rejectUnauthorized: false } } : {})
//     }
//     : {
//       host: process.env.DB_HOST,
//       port: parseInt(process.env.DB_PORT) || 5432,
//       database: process.env.DB_NAME,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD
//     }
// );

/* =========================
   CORS
========================= */

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
      'https://www.confiachamba.online',
      'https://confiachamba.online'
    ]
    : [
      'http://localhost:4000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:4000'
    ],
  credentials: true
};

/* =========================
   MIDDLEWARE
========================= */

app.use(cors(corsOptions));
app.use(express.json());

/* =========================
   STATIC FRONTEND
========================= */

app.use(express.static(path.join(__dirname, '../frontend')));

/* =========================
   PASAR DB A LAS RUTAS
========================= */

app.locals.db = pool;

/* =========================
   ROUTES
========================= */

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
// const messagesRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
// app.use('/api/messages', messagesRoutes);

/* =========================
   HEALTH CHECK
========================= */

app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      db: 'connected',
      time: result.rows[0].now
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

/* =========================
   SPA FALLBACK
========================= */

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* =========================
   START SERVER
========================= */

app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en puerto ${PORT}`));

// para el SEO
app.get('/sitemap.xml', async (req, res) => {
  const jobs = await db.query('SELECT id FROM jobs');

  let urls = jobs.rows.map(job => `
    <url>
      <loc>https://confiachamba.online/trabajo/${job.id}</loc>
    </url>
  `).join('');

  res.header('Content-Type', 'application/xml');
  res.send(`
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>
  `);
});

module.exports = app;