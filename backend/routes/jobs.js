const express = require('express');
const router = express.Router();

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
      LEFT JOIN users u ON j.user_id = u.id
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

    const jobs = result.rows.map(row => ({
      ...row,
      user: row.user_id
        ? {
          id: row.user_id,
          nombre: row.nombre,
          ciudad: row.user_ciudad,
          promedio_calificacion: row.promedio_calificacion,
          total_trabajos: row.total_trabajos
        }
        : null
    }));

    res.json(jobs);

  } catch (error) {
    console.error('Error al listar trabajos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});



/* =========================
   GET /api/jobs/:id
========================= */
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const jobId = req.params.id;

    console.log("ID recibido:", jobId);

    const result = await db.query(`
          SELECT 
            j.*,
            u.id as user_id,
            u.nombre,
            u.ciudad as user_ciudad,
            u.telefono,
            u.promedio_calificacion,
            u.total_trabajos,
            u.experiencia
          FROM jobs j
          LEFT JOIN users u ON j.user_id = u.id
          WHERE j.id = $1
        `, [jobId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    const row = result.rows[0];

    const job = {
      ...row,
      user: row.user_id
        ? {
          id: row.user_id,
          nombre: row.nombre,
          ciudad: row.user_ciudad,
          telefono: row.telefono,
          promedio_calificacion: row.promedio_calificacion,
          total_trabajos: row.total_trabajos,
          experiencia: row.experiencia
        }
        : null
    };

    res.json(job);

  } catch (error) {
    console.error("🔥 ERROR REAL:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;