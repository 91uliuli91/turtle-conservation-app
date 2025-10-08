// src/app/api/health/route.ts
// Endpoint para verificar conectividad del servidor

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Pool de conexión simple para health check
const healthCheckPool = new Pool({
  user: 'misterturtle',
  host: 'localhost',
  database: 'coral_de_datos',
  password: 'aleta',
  port: 5432,
  max: 1, // Solo una conexión para health check
  idleTimeoutMillis: 5000,
  connectionTimeoutMillis: 5000,
});

export async function GET() {
  try {
    // Verificar estado del servidor
    const serverStatus: any = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };

    // Verificar conectividad de base de datos
    let dbStatus = 'disconnected';
    try {
      const client = await healthCheckPool.connect();
      const result = await client.query('SELECT NOW() as current_time');
      client.release();
      
      dbStatus = 'connected';
      serverStatus.database = {
        status: 'connected',
        timestamp: result.rows[0].current_time,
      };
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      serverStatus.database = {
        status: 'disconnected',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error',
      };
    }

    // Respuesta con información de estado
    const response = {
      ...serverStatus,
      services: {
        api: 'online',
        database: dbStatus,
      }
    };

    // Status code basado en estado de servicios
    const statusCode = dbStatus === 'connected' ? 200 : 503;

    return NextResponse.json(response, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown server error',
      services: {
        api: 'error',
        database: 'unknown',
      }
    }, { status: 500 });
  }
}

// Cerrar pool al terminar proceso
process.on('SIGTERM', () => {
  healthCheckPool.end();
});

process.on('SIGINT', () => {
  healthCheckPool.end();
});