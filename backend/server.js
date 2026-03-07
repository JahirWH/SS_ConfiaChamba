require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 4000;

/* =========================
   CONEXIÓN A POSTGRESQL
========================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

/* =========================
   CORS
========================= */

const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? [
        'https://www.confiachamba.online',
        'https://confiachamba.online',
        'https://ss-confiachamba.onrender.com'
      ]
    : [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://127.0.0.1:3000'
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
// const jobRoutes = require('./routes/jobs');
// const messagesRoutes = require('./routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/messages', messagesRoutes);

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

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

module.exports = app;