// netlify/functions/especies.js
const { Pool } = require('pg');

// Configuración de base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

exports.handler = async (event, context) => {
  const { httpMethod, body } = event;

  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    switch (httpMethod) {
      case 'GET':
        const result = await pool.query('SELECT * FROM especies ORDER BY id ASC');
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(result.rows)
        };

      case 'POST':
        const data = JSON.parse(body);
        const insertResult = await pool.query(
          'INSERT INTO especies (nombre_cientifico, nombre_comun, estado_conservacion) VALUES ($1, $2, $3) RETURNING *',
          [data.nombre_cientifico, data.nombre_comun, data.estado_conservacion]
        );
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify(insertResult.rows[0])
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Method not allowed' })
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};