const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

/* =========================
   GET /api/jobs
   Listar trabajos
========================= */

router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { ciudad, categoria, limite = 20 } = req.query;

    let query = `
      SELECT 
        j.*,
        u.id as user_id,
        u.nombre,
        u.ciudad as user_ciudad,
        u.promedio_calificacion,
        u.total_trabajos
      FROM jobs j
      JOIN users u ON j.user_id = u.id
      WHERE j.estado = 'activo'
    `;

    const params = [];
    let i = 1;

    if (ciudad) {
      query += ` AND j.ciudad = $${i++}`;
      params.push(ciudad);
    }

    if (categoria) {
      query += ` AND j.categoria = $${i++}`;
      params.push(categoria);
    }

    query += ` ORDER BY j.created_at DESC LIMIT $${i}`;
    params.push(parseInt(limite));

    const result = await db.query(query, params);

    res.json(result.rows);

  } catch (error) {
    console.error('Error al listar trabajos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


/* =========================
   GET /api/jobs/:id
   Obtener trabajo específico
========================= */

router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT 
        j.*,
        u.id as user_id,
        u.nombre,
        u.ciudad,
        u.telefono,
        u.promedio_calificacion,
        u.total_trabajos
      FROM jobs j
      JOIN users u ON j.user_id = u.id
      WHERE j.id = $1
      `,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al obtener trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


/* =========================
   POST /api/jobs
   Crear trabajo
========================= */

router.post('/', authenticateToken, async (req, res) => {
  try {
    const db = req.app.locals.db;

    const {
      titulo,
      descripcion,
      categoria,
      precio,
      tipo_precio,
      ubicacion,
      ciudad
    } = req.body;

    if (!titulo || !descripcion || !categoria || !precio || !tipo_precio) {
      return res.status(400).json({
        error: 'Faltan campos requeridos'
      });
    }

    const result = await db.query(
      `
      INSERT INTO jobs
      (user_id,titulo,descripcion,categoria,precio,tipo_precio,ubicacion,ciudad,estado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'activo')
      RETURNING *
      `,
      [
        req.user.userId,
        titulo,
        descripcion,
        categoria,
        precio,
        tipo_precio,
        ubicacion,
        ciudad
      ]
    );

    res.status(201).json({
      message: 'Trabajo creado',
      job: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


/* =========================
   PUT /api/jobs/:id
   Actualizar trabajo
========================= */

router.put('/:id', authenticateToken, async (req, res) => {
  try {

    const db = req.app.locals.db;

    const jobCheck = await db.query(
      'SELECT user_id FROM jobs WHERE id = $1',
      [req.params.id]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    if (jobCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        error: 'No tienes permiso'
      });
    }

    const { titulo, descripcion, precio, ubicacion, estado } = req.body;

    const result = await db.query(
      `
      UPDATE jobs
      SET titulo = COALESCE($1,titulo),
          descripcion = COALESCE($2,descripcion),
          precio = COALESCE($3,precio),
          ubicacion = COALESCE($4,ubicacion),
          estado = COALESCE($5,estado)
      WHERE id = $6
      RETURNING *
      `,
      [titulo, descripcion, precio, ubicacion, estado, req.params.id]
    );

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


/* =========================
   DELETE /api/jobs/:id
========================= */

router.delete('/:id', authenticateToken, async (req, res) => {
  try {

    const db = req.app.locals.db;

    const jobCheck = await db.query(
      'SELECT user_id FROM jobs WHERE id=$1',
      [req.params.id]
    );

    if (jobCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Trabajo no encontrado'
      });
    }

    if (jobCheck.rows[0].user_id !== req.user.userId) {
      return res.status(403).json({
        error: 'No tienes permiso'
      });
    }

    await db.query(
      'DELETE FROM jobs WHERE id=$1',
      [req.params.id]
    );

    res.json({
      message: 'Trabajo eliminado'
    });

  } catch (error) {
    console.error('Error al eliminar trabajo:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


/* =========================
   REVIEWS
========================= */

router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {

    const db = req.app.locals.db;
    const { calificacion, comentario } = req.body;

    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({
        error: 'Calificación inválida'
      });
    }

    const job = await db.query(
      'SELECT user_id FROM jobs WHERE id=$1',
      [req.params.id]
    );

    if (job.rows.length === 0) {
      return res.status(404).json({
        error: 'Trabajo no encontrado'
      });
    }

    const review = await db.query(
      `
      INSERT INTO reviews
      (job_id,user_id,reviewer_id,calificacion,comentario)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *
      `,
      [
        req.params.id,
        job.rows[0].user_id,
        req.user.userId,
        calificacion,
        comentario
      ]
    );

    res.status(201).json(review.rows[0]);

  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


router.get('/:id/reviews', async (req, res) => {
  try {

    const db = req.app.locals.db;

    const result = await db.query(
      `
      SELECT r.*, u.nombre
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE r.job_id = $1
      ORDER BY r.created_at DESC
      `,
      [req.params.id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({
      error: 'Error interno del servidor'
    });
  }
});


module.exports = router;