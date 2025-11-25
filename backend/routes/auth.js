const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, nombre, ciudad, telefono, tipo_usuario } = req.body;
    const supabase = req.app.locals.supabase;

    // Validaciones
    if (!email || !password || !nombre) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos' });
    }

    // Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: hashedPassword,
          nombre,
          ciudad: ciudad || '',
          telefono: telefono || '',
          tipo_usuario: tipo_usuario || 'trabajador',
          promedio_calificacion: 0,
          total_trabajos: 0
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error de Supabase en registro:', error);
      return res.status(500).json({ 
        error: 'Error al registrar usuario',
        details: error.message,
        code: error.code
      });
    }

    // Generar JWT
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        nombre: newUser.nombre,
        ciudad: newUser.ciudad,
        tipo_usuario: newUser.tipo_usuario
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/login - Iniciar sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const supabase = req.app.locals.supabase;

    // Validaciones
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
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
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/auth/logout - Cerrar sesión (opcional, manejado en frontend)
router.post('/logout', (req, res) => {
  res.json({ message: 'Sesión cerrada correctamente' });
});

module.exports = router;