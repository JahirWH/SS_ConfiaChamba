-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    emisor_id BIGINT NOT NULL,
    receptor_id BIGINT NOT NULL,
    contenido TEXT NOT NULL,
    trabajo_id BIGINT,
    leido BOOLEAN DEFAULT false,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- Relaciones
    FOREIGN KEY (emisor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receptor_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trabajo_id) REFERENCES jobs(id) ON DELETE
    SET NULL,
        -- Índices para mejorar búsquedas
        CONSTRAINT messages_emisor_receptor_check CHECK (emisor_id != receptor_id)
);
-- Crear índices
CREATE INDEX IF NOT EXISTS idx_messages_emisor ON messages(emisor_id);
CREATE INDEX IF NOT EXISTS idx_messages_receptor ON messages(receptor_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversacion ON messages(emisor_id, receptor_id);
CREATE INDEX IF NOT EXISTS idx_messages_creado_en ON messages(creado_en DESC);
CREATE INDEX IF NOT EXISTS idx_messages_leido ON messages(leido);
CREATE INDEX IF NOT EXISTS idx_messages_trabajo ON messages(trabajo_id);
-- Habilitar RLS (Row Level Security)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Crear políticas de RLS
-- Los usuarios solo pueden ver mensajes donde son emisor o receptor
CREATE POLICY "Usuarios pueden ver sus propios mensajes" ON messages FOR
SELECT USING (
        auth.uid()::bigint = emisor_id
        OR auth.uid()::bigint = receptor_id
    );
-- Los usuarios solo pueden insertar mensajes como emisor
CREATE POLICY "Usuarios pueden enviar mensajes" ON messages FOR
INSERT WITH CHECK (auth.uid()::bigint = emisor_id);
-- Los usuarios solo pueden actualizar mensajes que recibieron
CREATE POLICY "Usuarios pueden marcar como leído sus mensajes" ON messages FOR
UPDATE USING (auth.uid()::bigint = receptor_id);