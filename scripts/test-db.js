// Script para probar las funciones de base de datos directamente
// Ejecutar con: node scripts/test-db.js

const { testConnection, query } = require('../src/app/lib/db.ts');

async function runTests() {
  console.log('🚀 Iniciando pruebas de base de datos...\n');

  try {
    // Test 1: Probar conexión
    console.log('1️⃣ Probando conexión...');
    const isConnected = await testConnection();
    console.log(`Resultado: ${isConnected ? '✅ Conectado' : '❌ Error de conexión'}\n`);

    if (!isConnected) {
      console.log('❌ No se puede continuar sin conexión');
      return;
    }

    // Test 2: Query simple
    console.log('2️⃣ Ejecutando query simple...');
    const timeResult = await query('SELECT NOW() as current_time');
    console.log('✅ Tiempo actual:', timeResult.rows[0].current_time);

    // Test 3: Listar tablas
    console.log('\n3️⃣ Listando tablas de la base de datos...');
    const tablesResult = await query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    console.log('📋 Tablas encontradas:', tablesResult.rows.map(row => row.tablename));

    // Test 4: Información de la base de datos
    console.log('\n4️⃣ Información de la base de datos...');
    const dbInfo = await query('SELECT version()');
    console.log('🔢 Versión de PostgreSQL:', dbInfo.rows[0].version);

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
  } finally {
    process.exit();
  }
}

runTests();