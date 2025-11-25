const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

// GET /api/jobs - Listar todos los trabajos (con filtros opcionales)
router.get('/', async (req, res) => {
  try {
    const { ciudad, categoria, limite = 20 } = req.query;
    const supabase = req.app.locals.supabase;

    let query = supabase
      .from('jobs')
      .select(`
        *,
        user:user_id (id, nombre, ciudad, promedio_calificacion, total_trabajos)
      `)
      .eq('estado', 'activo')
      .order('created_at', { ascending: false })
      .limit(parseInt(limite));

    if (ciudad) {
      query = query.eq('ciudad', ciudad);
    }

    if (categoria) {
      query = query.eq('categoria', categoria);
    }

    const { data: jobs, error } = await query;

    if (error) {
      return res.status(500).json({ error: 'Error al obtener trabajos' });
    }

    res.json(jobs);
  } catch (error) {
    console.error('Error al listar trabajos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/jobs/:id - Obtener un trabajo específico
router.get('/:id', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    const { data: job, error } = await supabase
      .from('jobs')
      .select(`
        *,
        user:user_id (id, nombre, ciudad, telefono, promedio_calificacion, total_trabajos, experiencia)
      `)
      .eq('id', req.params.id)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error al obtener trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/jobs - Crear un nuevo trabajo (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion, categoria, precio, tipo_precio, ubicacion, ciudad } = req.body;
    const supabase = req.app.locals.supabase;

    // Validaciones
    if (!titulo || !descripcion || !categoria || !precio || !tipo_precio) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    if (!['por_hora', 'por_trabajo'].includes(tipo_precio)) {
      return res.status(400).json({ error: 'tipo_precio debe ser "por_hora" o "por_trabajo"' });
    }

    const { data: newJob, error } = await supabase
      .from('jobs')
      .insert([
        {
          user_id: req.user.userId,
          titulo,
          descripcion,
          categoria,
          precio: parseFloat(precio),
          tipo_precio,
          ubicacion,
          ciudad
        }
      ])
      .select(`
        *,
        user:user_id (id, nombre, ciudad, promedio_calificacion)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al crear trabajo', details: error.message });
    }

    res.status(201).json({
      message: 'Trabajo publicado exitosamente',
      job: newJob
    });
  } catch (error) {
    console.error('Error al crear trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/jobs/:id - Actualizar un trabajo (solo el creador)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { titulo, descripcion, precio, ubicacion, estado } = req.body;
    const supabase = req.app.locals.supabase;

    // Verificar que el trabajo pertenece al usuario
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!job || job.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permiso para editar este trabajo' });
    }

    const updates = {};
    if (titulo) updates.titulo = titulo;
    if (descripcion) updates.descripcion = descripcion;
    if (precio) updates.precio = parseFloat(precio);
    if (ubicacion) updates.ubicacion = ubicacion;
    if (estado) updates.estado = estado;

    const { data: updatedJob, error } = await supabase
      .from('jobs')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al actualizar trabajo' });
    }

    res.json({
      message: 'Trabajo actualizado exitosamente',
      job: updatedJob
    });
  } catch (error) {
    console.error('Error al actualizar trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// DELETE /api/jobs/:id - Eliminar un trabajo (solo el creador)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    // Verificar que el trabajo pertenece al usuario
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', req.params.id)
      .single();

    if (!job || job.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este trabajo' });
    }

    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(500).json({ error: 'Error al eliminar trabajo' });
    }

    res.json({ message: 'Trabajo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar trabajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// POST /api/jobs/:id/reviews - Crear una reseña para un trabajo
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { calificacion, comentario } = req.body;
    const jobId = req.params.id;
    const supabase = req.app.locals.supabase;

    // Validaciones
    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ error: 'La calificación debe estar entre 1 y 5' });
    }

    // Obtener el trabajo y el trabajador
    const { data: job } = await supabase
      .from('jobs')
      .select('user_id')
      .eq('id', jobId)
      .single();

    if (!job) {
      return res.status(404).json({ error: 'Trabajo no encontrado' });
    }

    // No puedes reseñarte a ti mismo
    if (job.user_id === req.user.userId) {
      return res.status(400).json({ error: 'No puedes reseñar tu propio trabajo' });
    }

    // Crear la reseña
    const { data: newReview, error } = await supabase
      .from('reviews')
      .insert([
        {
          job_id: jobId,
          user_id: job.user_id,
          reviewer_id: req.user.userId,
          calificacion: parseInt(calificacion),
          comentario
        }
      ])
      .select(`
        *,
        reviewer:reviewer_id (nombre)
      `)
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al crear reseña' });
    }

    // Actualizar estadísticas del trabajador
    const { data: reviews } = await supabase
      .from('reviews')
      .select('calificacion')
      .eq('user_id', job.user_id);

    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.calificacion, 0) / totalReviews;

    await supabase
      .from('users')
      .update({
        promedio_calificacion: avgRating.toFixed(2),
        total_trabajos: totalReviews,
        experiencia: totalReviews * 10
      })
      .eq('id', job.user_id);

    res.status(201).json({
      message: 'Reseña creada exitosamente',
      review: newReview
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/jobs/:id/reviews - Obtener reseñas de un trabajo
router.get('/:id/reviews', async (req, res) => {
  try {
    const supabase = req.app.locals.supabase;

    const { data: reviews, error } = await supabase
      .from('reviews')
      .select(`
        *,
        reviewer:reviewer_id (nombre, ciudad)
      `)
      .eq('job_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Error al obtener reseñas' });
    }

    res.json(reviews);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;