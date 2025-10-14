-- security_tables.sql
-- Tablas adicionales para sistema de autenticación seguro

-- Tabla para registrar intentos de login
CREATE TABLE IF NOT EXISTS login_log (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER REFERENCES personal(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    success BOOLEAN DEFAULT false,
    fecha_hora TIMESTAMP DEFAULT NOW(),
    user_agent TEXT,
    INDEX idx_login_log_personal (personal_id),
    INDEX idx_login_log_fecha (fecha_hora),
    INDEX idx_login_log_ip (ip_address)
);

-- Tabla para registrar registros de usuarios
CREATE TABLE IF NOT EXISTS registro_log (
    id SERIAL PRIMARY KEY,
    personal_id INTEGER REFERENCES personal(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    fecha_hora TIMESTAMP DEFAULT NOW(),
    INDEX idx_registro_log_personal (personal_id),
    INDEX idx_registro_log_fecha (fecha_hora)
);

-- Agregar campos a la tabla personal si no existen
ALTER TABLE personal 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255),
ADD COLUMN IF NOT EXISTS fecha_registro TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS ultimo_login TIMESTAMP,
ADD COLUMN IF NOT EXISTS intentos_fallidos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS bloqueado_hasta TIMESTAMP;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_personal_email ON personal(email);
CREATE INDEX IF NOT EXISTS idx_personal_activo ON personal(activo);

-- Comentarios para documentación
COMMENT ON TABLE login_log IS 'Registro de todos los intentos de inicio de sesión';
COMMENT ON TABLE registro_log IS 'Registro de nuevos usuarios creados';
COMMENT ON COLUMN personal.password_hash IS 'Hash bcrypt de la contraseña del usuario';
COMMENT ON COLUMN personal.intentos_fallidos IS 'Contador de intentos de login fallidos consecutivos';
COMMENT ON COLUMN personal.bloqueado_hasta IS 'Timestamp hasta el cual el usuario está bloqueado por múltiples intentos fallidos';

-- Función para limpiar logs antiguos (mantener solo últimos 90 días)
CREATE OR REPLACE FUNCTION limpiar_logs_antiguos()
RETURNS void AS $$
BEGIN
    DELETE FROM login_log WHERE fecha_hora < NOW() - INTERVAL '90 days';
    DELETE FROM registro_log WHERE fecha_hora < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Crear trabajo programado para limpiar logs (opcional - requiere pg_cron)
-- SELECT cron.schedule('limpiar-logs-mensuales', '0 0 1 * *', 'SELECT limpiar_logs_antiguos()');

-- Función para resetear intentos fallidos después de login exitoso
CREATE OR REPLACE FUNCTION resetear_intentos_fallidos()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.success = true THEN
        UPDATE personal 
        SET intentos_fallidos = 0, 
            bloqueado_hasta = NULL,
            ultimo_login = NOW()
        WHERE id = NEW.personal_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para resetear intentos fallidos automáticamente
DROP TRIGGER IF EXISTS trigger_resetear_intentos ON login_log;
CREATE TRIGGER trigger_resetear_intentos
    AFTER INSERT ON login_log
    FOR EACH ROW
    EXECUTE FUNCTION resetear_intentos_fallidos();

-- Vista para estadísticas de seguridad
CREATE OR REPLACE VIEW vista_estadisticas_seguridad AS
SELECT 
    DATE(fecha_hora) as fecha,
    COUNT(*) as total_intentos,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as exitosos,
    SUM(CASE WHEN NOT success THEN 1 ELSE 0 END) as fallidos,
    COUNT(DISTINCT ip_address) as ips_unicas,
    COUNT(DISTINCT personal_id) as usuarios_activos
FROM login_log
WHERE fecha_hora >= NOW() - INTERVAL '30 days'
GROUP BY DATE(fecha_hora)
ORDER BY fecha DESC;

-- Insertar datos de ejemplo (opcional - solo para desarrollo)
-- INSERT INTO personal (nombre_completo, apellido, email, password_hash, rol, activo)
-- VALUES ('Test User', 'Test', 'test@example.com', '$2a$12$hashedpassword', 'voluntario', true);

COMMENT ON VIEW vista_estadisticas_seguridad IS 'Estadísticas diarias de intentos de login de los últimos 30 días';