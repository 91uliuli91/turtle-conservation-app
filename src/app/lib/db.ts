//src/app/lib/db.ts
import { Pool, Client } from 'pg';

// Configuración de conexión a PostgreSQL
const dbConfig = {
  user: 'misterturtle',
  host: 'localhost',
  database: 'coral_de_datos',
  password: 'aleta',
  port: 5432,
};

// Pool de conexiones para mejor rendimiento.
export const pool = new Pool(dbConfig);

// Cliente individual para operaciones específicas
export const createClient = () => new Client(dbConfig);

// Función para probar la conexión
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    return false;
  }
};

// Función para ejecutar consultas con manejo de errores
export const query = async (text: string, params?: unknown[]) => {
  try {
    const start = Date.now();
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Query ejecutado:', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('❌ Error en la consulta:', error);
    throw error;
  }
};

// Función para cerrar todas las conexiones (útil para cleanup)
export const closeConnections = async () => {
  try {
    await pool.end();
    console.log('🔐 Pool de conexiones cerrado');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error);
  }
};

// Export default del pool para uso directo
export default pool;
<<<<<<< HEAD
(tu versión local)
=======
(versión remota)
>>>>>>> (hash del commit remoto)