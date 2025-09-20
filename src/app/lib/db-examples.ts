// Ejemplo de uso del archivo db.ts
// Este archivo muestra cómo usar las funciones de conexión a la base de datos

import { pool, query, testConnection, createClient } from './db';

// Ejemplo 1: Probar la conexión
export const checkDatabaseConnection = async () => {
  const isConnected = await testConnection();
  return isConnected;
};

// Ejemplo 2: Consulta simple usando la función query
export const getAllUsers = async () => {
  try {
    const result = await query('SELECT * FROM users ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
};

// Ejemplo 3: Consulta con parámetros
export const getUserById = async (userId: number) => {
  try {
    const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    throw error;
  }
};

// Ejemplo 4: Insertar datos
export const createUser = async (name: string, email: string) => {
  try {
    const result = await query(
      'INSERT INTO users (name, email, created_at) VALUES ($1, $2, NOW()) RETURNING *',
      [name, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error al crear usuario:', error);
    throw error;
  }
};

// Ejemplo 5: Usar pool directamente para transacciones
export const transferData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Operaciones de la transacción
    await client.query('UPDATE accounts SET balance = balance - 100 WHERE id = 1');
    await client.query('UPDATE accounts SET balance = balance + 100 WHERE id = 2');
    
    await client.query('COMMIT');
    console.log('✅ Transacción completada');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en transacción, rollback ejecutado:', error);
    throw error;
  } finally {
    client.release();
  }
};