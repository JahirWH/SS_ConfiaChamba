-- ============================================================================
-- SISTEMA DE BASE DE DATOS MEJORADO PARA TrabajoLocal
-- Esquema Completo y Profesional con Mayor Transparencia
-- ============================================================================
-- ============================================================================
-- 1. TABLA USERS - Información detallada del trabajador/cliente
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Autenticación
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    -- Información Personal
    nombre TEXT NOT NULL,
    apellido TEXT DEFAULT '',
    documento_identidad TEXT UNIQUE DEFAULT NULL,
    -- DNI, Pasaporte, etc
    fecha_nacimiento DATE DEFAULT NULL,
    genero TEXT DEFAULT NULL,
    -- 'M', 'F', 'Otro'
    -- Contacto
    telefono TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    telegram TEXT DEFAULT '',
    -- Ubicación
    ciudad TEXT DEFAULT '',
    provincia TEXT DEFAULT '',
    codigo_postal TEXT DEFAULT '',
    direccion TEXT DEFAULT '',
    latitud FLOAT DEFAULT NULL,
    longitud FLOAT DEFAULT NULL,
    -- Perfil Profesional
    tipo_usuario TEXT DEFAULT 'trabajador',
    -- 'trabajador', 'cliente', 'ambos'
    profesion TEXT DEFAULT '',
    especializacion TEXT DEFAULT '',
    anos_experiencia INTEGER DEFAULT 0,
    descripcion_perfil TEXT DEFAULT '',
    -- Bio personalizada
    -- Calificaciones
    promedio_calificacion FLOAT DEFAULT 0,
    total_trabajos INTEGER DEFAULT 0,
    total_resenas INTEGER DEFAULT 0,
    trabajos_completados INTEGER DEFAULT 0,
    trabajos_cancelados INTEGER DEFAULT 0,
    -- Documentación
    foto_perfil_url TEXT DEFAULT NULL,
    documentos_verificados BOOLEAN DEFAULT FALSE,
    es_verificado BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP DEFAULT NULL,
    -- Disponibilidad
    disponible BOOLEAN DEFAULT TRUE,
    horario_inicio TIME DEFAULT '08:00',
    horario_fin TIME DEFAULT '18:00',
    dias_disponibles TEXT DEFAULT 'Lunes,Martes,Miercoles,Jueves,Viernes',
    -- Experiencia y Skills
    skills TEXT DEFAULT '[]',
    -- Array JSON de habilidades
    certificaciones TEXT DEFAULT '[]',
    -- Array JSON
    -- Preferencias
    precio_minimo FLOAT DEFAULT 0,
    precio_maximo FLOAT DEFAULT 0,
    radio_atencion_km INTEGER DEFAULT 0,
    -- Cuenta
    saldo FLOAT DEFAULT 0,
    metodos_pago TEXT DEFAULT '[]',
    cuenta_bancaria_verificada BOOLEAN DEFAULT FALSE,
    -- Estadísticas
    total_ganancias FLOAT DEFAULT 0,
    total_gastado FLOAT DEFAULT 0,
    -- Auditoría
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    ultimo_login TIMESTAMP DEFAULT NULL,
    activo BOOLEAN DEFAULT TRUE
);
-- ============================================================================
-- 2. TABLA JOBS - Trabajos/Servicios con detalles completos
-- ============================================================================
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    categoria TEXT NOT NULL,
    subcategoria TEXT DEFAULT '',
    -- Precio y Términos
    precio FLOAT NOT NULL,
    precio_minimo FLOAT DEFAULT NULL,
    precio_maximo FLOAT DEFAULT NULL,
    tipo_precio TEXT NOT NULL,
    moneda TEXT DEFAULT 'USD',
    -- Ubicación
    ubicacion TEXT DEFAULT '',
    ciudad TEXT NOT NULL,
    provincia TEXT DEFAULT '',
    codigo_postal TEXT DEFAULT '',
    direccion_detallada TEXT DEFAULT '',
    latitud FLOAT DEFAULT NULL,
    longitud FLOAT DEFAULT NULL,
    es_servicio_a_domicilio BOOLEAN DEFAULT FALSE,
    es_taller_propio BOOLEAN DEFAULT FALSE,
    -- Detalles
    duracion_estimada_horas FLOAT DEFAULT NULL,
    duracion_estimada_dias INTEGER DEFAULT NULL,
    fecha_inicio_disponible DATE DEFAULT NULL,
    fecha_fin_disponible DATE DEFAULT NULL,
    -- Materiales
    materiales_incluidos TEXT DEFAULT '',
    materiales_cliente_debe_proveer TEXT DEFAULT '',
    herramientas_necesarias TEXT DEFAULT '[]',
    -- Garantía
    tiene_garantia BOOLEAN DEFAULT FALSE,
    duracion_garantia_dias INTEGER DEFAULT NULL,
    descripcion_garantia TEXT DEFAULT '',
    -- Desglose de Costos
    desglose_costos TEXT DEFAULT '[]',
    -- Términos
    acepta_cambios BOOLEAN DEFAULT TRUE,
    porcentaje_cambios_sin_costo FLOAT DEFAULT 10,
    politica_cancelacion TEXT DEFAULT 'flexible',
    -- Estado
    estado TEXT DEFAULT 'activo',
    es_destacado BOOLEAN DEFAULT FALSE,
    imagenes_url TEXT DEFAULT '[]',
    video_url TEXT DEFAULT NULL,
    visitas_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- ============================================================================
-- 3. TABLA CONTRACTS - Acuerdos/Contratos
-- ============================================================================
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    trabajador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Precios
    precio_acordado FLOAT NOT NULL,
    precio_total FLOAT NOT NULL,
    moneda TEXT DEFAULT 'USD',
    desglose_final TEXT DEFAULT '[]',
    -- Fechas
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin_estimada TIMESTAMP DEFAULT NULL,
    fecha_completacion TIMESTAMP DEFAULT NULL,
    -- Hitos
    hitos TEXT DEFAULT '[]',
    -- Modificaciones
    modificaciones_realizadas TEXT DEFAULT '[]',
    costo_modificaciones FLOAT DEFAULT 0,
    -- Pagos
    estado_pago TEXT DEFAULT 'pendiente',
    monto_anticipo FLOAT DEFAULT 0,
    anticipo_pagado BOOLEAN DEFAULT FALSE,
    periodo_devolucion_dias INTEGER DEFAULT 30,
    monto_retenido FLOAT DEFAULT 0,
    -- Términos
    terminos_adicionales TEXT DEFAULT '',
    estado TEXT DEFAULT 'activo',
    razon_cancelacion TEXT DEFAULT NULL,
    trabajo_inspeccionado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completado_at TIMESTAMP DEFAULT NULL
);
-- ============================================================================
-- 4. TABLA REVIEWS - Calificaciones detalladas
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    trabajador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cliente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    -- Calificaciones por Criterios
    calificacion_general INTEGER NOT NULL,
    calificacion_puntualidad INTEGER DEFAULT 5,
    calificacion_calidad INTEGER DEFAULT 5,
    calificacion_profesionalismo INTEGER DEFAULT 5,
    calificacion_comunicacion INTEGER DEFAULT 5,
    calificacion_precio INTEGER DEFAULT 5,
    -- Comentarios
    titulo_resena TEXT DEFAULT '',
    comentario TEXT NOT NULL,
    puntos_positivos TEXT DEFAULT '[]',
    puntos_mejorar TEXT DEFAULT '[]',
    -- Respuesta
    respuesta TEXT DEFAULT NULL,
    respuesta_fecha TIMESTAMP DEFAULT NULL,
    fotos_url TEXT DEFAULT '[]',
    es_comprado_verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    util_count INTEGER DEFAULT 0
);
-- ============================================================================
-- 5. TABLA DISPUTES - Disputas y Reclamaciones
-- ============================================================================
CREATE TABLE IF NOT EXISTS disputes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    iniciador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    otro_usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    razon TEXT NOT NULL,
    monto_disputado FLOAT NOT NULL,
    imagenes_url TEXT DEFAULT '[]',
    archivos_url TEXT DEFAULT '[]',
    estado TEXT DEFAULT 'abierta',
    resolucion TEXT DEFAULT NULL,
    requiere_mediador BOOLEAN DEFAULT FALSE,
    mediador_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resuelto_at TIMESTAMP DEFAULT NULL
);
-- ============================================================================
-- 6. TABLA PAYMENTS - Historial de Pagos
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    monto FLOAT NOT NULL,
    moneda TEXT DEFAULT 'USD',
    tipo_pago TEXT NOT NULL,
    metodo_pago TEXT DEFAULT '',
    estado TEXT DEFAULT 'pendiente',
    referencia_externa TEXT DEFAULT NULL,
    comision_plataforma FLOAT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    completado_at TIMESTAMP DEFAULT NULL
);
-- ============================================================================
-- 7. TABLA MENSAJES - Chat entre usuarios
-- ============================================================================
CREATE TABLE IF NOT EXISTS mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    remitente_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    destinatario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,
    tipo TEXT DEFAULT 'texto',
    url_archivo TEXT DEFAULT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================================================
-- 8. TABLA PORTAFOLIO - Trabajos anteriores del trabajador
-- ============================================================================
CREATE TABLE IF NOT EXISTS portafolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trabajador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    categoria TEXT,
    imagenes_url TEXT DEFAULT '[]',
    video_url TEXT DEFAULT NULL,
    precio_trabajo FLOAT DEFAULT NULL,
    fecha_realizacion DATE,
    cliente_nombre TEXT DEFAULT NULL,
    cliente_testimonio TEXT DEFAULT NULL,
    cliente_calificacion INTEGER DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================================================
-- 9. TABLA CERTIFICACIONES - Documentos de Verificación
-- ============================================================================
CREATE TABLE IF NOT EXISTS certificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    nombre TEXT NOT NULL,
    emisor TEXT,
    numero_documento TEXT,
    fecha_emision DATE,
    fecha_expiracion DATE,
    url_documento TEXT,
    verificado BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP DEFAULT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================================================
-- 10. TABLA NOTIFICACIONES - Sistema de alertas
-- ============================================================================
CREATE TABLE IF NOT EXISTS notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    contenido TEXT,
    referencia_id UUID DEFAULT NULL,
    leida BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- ============================================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tipo_usuario ON users(tipo_usuario);
CREATE INDEX IF NOT EXISTS idx_users_ciudad ON users(ciudad);
CREATE INDEX IF NOT EXISTS idx_users_verified ON users(es_verificado);
CREATE INDEX IF NOT EXISTS idx_jobs_user_id ON jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_ciudad ON jobs(ciudad);
CREATE INDEX IF NOT EXISTS idx_jobs_categoria ON jobs(categoria);
CREATE INDEX IF NOT EXISTS idx_jobs_estado ON jobs(estado);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at);
CREATE INDEX IF NOT EXISTS idx_contracts_trabajador_id ON contracts(trabajador_id);
CREATE INDEX IF NOT EXISTS idx_contracts_cliente_id ON contracts(cliente_id);
CREATE INDEX IF NOT EXISTS idx_contracts_estado ON contracts(estado);
CREATE INDEX IF NOT EXISTS idx_reviews_trabajador_id ON reviews(trabajador_id);
CREATE INDEX IF NOT EXISTS idx_reviews_cliente_id ON reviews(cliente_id);
CREATE INDEX IF NOT EXISTS idx_payments_usuario_id ON payments(usuario_id);
CREATE INDEX IF NOT EXISTS idx_payments_estado ON payments(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_contract_id ON mensajes(contract_id);
