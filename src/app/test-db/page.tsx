'use client';

import { useState } from 'react';

export default function TestDbPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTest = async (testType: string, params?: any) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      let url = `/api/test-db?test=${testType}`;
      let options: RequestInit = { method: 'GET' };

      if (testType === 'user' && params?.id) {
        url += `&id=${params.id}`;
      }

      if (testType === 'create-user') {
        options = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        };
        url = '/api/test-db';
      }

      const response = await fetch(url, options);
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const [userId, setUserId] = useState('1');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🧪 Pruebas de Base de Datos
        </h1>

        {/* Botones de prueba */}
        <div className="grid gap-4 mb-8">
          {/* Probar conexión */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">1. Probar Conexión</h2>
            <button
              onClick={() => runTest('connection')}
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {loading ? 'Probando...' : 'Probar Conexión'}
            </button>
          </div>

          {/* Obtener usuarios */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">2. Obtener Todos los Usuarios</h2>
            <button
              onClick={() => runTest('users')}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {loading ? 'Obteniendo...' : 'Obtener Usuarios'}
            </button>
          </div>

          {/* Obtener usuario por ID */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">3. Obtener Usuario por ID</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="number"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="ID del usuario"
                className="border border-gray-300 px-3 py-2 rounded flex-1"
              />
              <button
                onClick={() => runTest('user', { id: userId })}
                disabled={loading || !userId}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
              >
                {loading ? 'Buscando...' : 'Buscar Usuario'}
              </button>
            </div>
          </div>

          {/* Crear usuario */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">4. Crear Usuario</h2>
            <div className="space-y-2 mb-4">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nombre del usuario"
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="Email del usuario"
                className="border border-gray-300 px-3 py-2 rounded w-full"
              />
            </div>
            <button
              onClick={() => runTest('create-user', { name: userName, email: userEmail })}
              disabled={loading || !userName || !userEmail}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </div>

        {/* Resultados */}
        {(results || error) && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">📊 Resultados</h2>
            {error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Error:</strong> {error}
              </div>
            ) : (
              <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                {JSON.stringify(results, null, 2)}
              </pre>
            )}
          </div>
        )}

        {/* Instrucciones */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mt-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Instrucciones</h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Asegúrate de que PostgreSQL esté ejecutándose</li>
            <li>• Verifica que la base de datos 'coral_de_datos' exista</li>
            <li>• Crea una tabla 'users' si planeas probar las funciones de usuarios</li>
          </ul>
        </div>
      </div>
    </div>
  );
}