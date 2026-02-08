const express = require('express');
const router = express.Router();

// Middleware para verificar token
const authMiddleware = require('../middleware/auth');

// POST /api/messages - Enviar un mensaje
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receptor_id, contenido, trabajo_id } = req.body;
    const emisor_id = req.userId;
    const supabase = req.app.locals.supabase;

    // Validaciones
    if (!receptor_id || !contenido) {
      return res.status(400).json({ error: 'Receptor y contenido son requeridos' });
    }

    if (contenido.trim().length === 0) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío' });
    }

    // Insertar mensaje
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          emisor_id,
          receptor_id,
          contenido,
          trabajo_id: trabajo_id || null,
          leido: false,
          creado_en: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error al crear mensaje:', error);
      return res.status(500).json({ error: 'Error al enviar mensaje' });
    }

    res.status(201).json({
      success: true,
      message: 'Mensaje enviado exitosamente',
      data
    });
  } catch (error) {
    console.error('Error en POST /messages:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/messages/:conversationId - Obtener mensajes de una conversación
router.get('/conversation/:conversationId', authMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.userId;
    const supabase = req.app.locals.supabase;

    // Obtener mensajes de la conversación
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        emisor:emisor_id (id, nombre, email),
        receptor:receptor_id (id, nombre, email)
      `)
      .or(`and(emisor_id.eq.${userId},receptor_id.eq.${conversationId}),and(emisor_id.eq.${conversationId},receptor_id.eq.${userId})`)
      .order('creado_en', { ascending: true });

    if (error) {
      console.error('Error al obtener mensajes:', error);
      return res.status(500).json({ error: 'Error al obtener mensajes' });
    }

    // Marcar como leídos
    const { error: updateError } = await supabase
      .from('messages')
      .update({ leido: true })
      .eq('receptor_id', userId)
      .eq('emisor_id', conversationId);

    res.json(data || []);
  } catch (error) {
    console.error('Error en GET /messages/conversation:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/messages/list - Obtener lista de conversaciones
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const supabase = req.app.locals.supabase;

    // Obtener todas las conversaciones del usuario
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        emisor:emisor_id (id, nombre, email),
        receptor:receptor_id (id, nombre, email)
      `)
      .or(`emisor_id.eq.${userId},receptor_id.eq.${userId}`)
      .order('creado_en', { ascending: false });

    if (error) {
      console.error('Error al obtener conversaciones:', error);
      return res.status(500).json({ error: 'Error al obtener conversaciones' });
    }

    // Agrupar por usuario (obtener único contacto por conversación)
    const conversaciones = {};
    data.forEach(msg => {
      const otroUserId = msg.emisor_id === userId ? msg.receptor_id : msg.emisor_id;
      const otroUser = msg.emisor_id === userId ? msg.receptor : msg.emisor;
      
      if (!conversaciones[otroUserId]) {
        conversaciones[otroUserId] = {
          userId: otroUserId,
          nombre: otroUser.nombre,
          email: otroUser.email,
          ultimoMensaje: msg.contenido,
          creado_en: msg.creado_en,
          noLeidos: msg.receptor_id === userId && !msg.leido ? 1 : 0
        };
      } else if (msg.receptor_id === userId && !msg.leido) {
        conversaciones[otroUserId].noLeidos += 1;
      }
    });

    res.json(Object.values(conversaciones));
  } catch (error) {
    console.error('Error en GET /messages/list:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// PUT /api/messages/:id - Marcar mensaje como leído
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = req.app.locals.supabase;

    const { data, error } = await supabase
      .from('messages')
      .update({ leido: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Error al actualizar mensaje' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error en PUT /messages/:id:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
