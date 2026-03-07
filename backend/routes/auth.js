const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, ciudad, telefono, tipo_usuario } = req.body;
    const db = req.app.locals.db;

    if (!email || !password || !nombre) {
      return res.status(400).json({
        error: 'Email, contraseña y nombre son requeridos'
      });
    }

    // verificar si ya existe
    const existingUser = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: 'El email ya está registrado'
      });
    }

    // hash contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // insertar usuario
    const result = await db.query(
      `INSERT INTO users 
      (email, password_hash, nombre, ciudad, telefono, tipo_usuario, promedio_calificacion, total_trabajos)
      VALUES ($1,$2,$3,$4,$5,$6,0,0)
      RETURNING id,email,nombre,ciudad,tipo_usuario`,
      [
        email,
        hashedPassword,
        nombre,
        ciudad || '',
        telefono || '',
        tipo_usuario || 'trabajador'
      ]
    );

    const newUser = result.rows[0];

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: newUser
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {

    const { email, password } = req.body;
    const db = req.app.locals.db;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email y contraseña son requeridos'
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        ciudad: user.ciudad,
        tipo_usuario: user.tipo_usuario,
        promedio_calificacion: user.promedio_calificacion,
        total_trabajos: user.total_trabajos
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


// logout (solo frontend realmente)
router.post('/logout', (req, res) => {
  res.json({
    message: 'Sesión cerrada correctamente'
  });
});

module.exports = router;