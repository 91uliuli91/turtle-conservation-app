-- Script para actualizar la tabla personal para autenticación
-- Ejecutar en PostgreSQL

-- Agregar campos faltantes para autenticación
ALTER TABLE personal ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE personal ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE personal ADD COLUMN IF NOT EXISTS apellido VARCHAR(100);
ALTER TABLE personal ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE personal ADD COLUMN IF NOT EXISTS fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE personal ADD COLUMN IF NOT EXISTS fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_personal_email ON personal(email);
CREATE INDEX IF NOT EXISTS idx_personal_activo ON personal(activo);

-- Agregar restricciones
ALTER TABLE personal ALTER COLUMN email SET NOT NULL;
ALTER TABLE personal ALTER COLUMN password_hash SET NOT NULL;

COMMENT ON TABLE personal IS 'Tabla de personal del sistema con autenticación';
COMMENT ON COLUMN personal.email IS 'Email único para login';
COMMENT ON COLUMN personal.password_hash IS 'Hash de contraseña con bcrypt';
COMMENT ON COLUMN personal.activo IS 'Usuario activo en el sistema';