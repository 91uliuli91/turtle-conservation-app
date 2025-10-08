// src/app/guia-indexeddb/page.tsx
// Guía visual para encontrar IndexedDB

'use client';

import React from 'react';

export default function GuiaIndexedDBPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🔍 Guía: Cómo Encontrar IndexedDB
          </h1>

          {/* Paso 1 */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold text-blue-900 mb-3">
              Paso 1: Abrir Chrome DevTools
            </h2>
            <div className="space-y-2 text-blue-800">
              <p>• <kbd className="px-2 py-1 bg-gray-200 rounded">F12</kbd> o <kbd className="px-2 py-1 bg-gray-200 rounded">Ctrl + Shift + I</kbd></p>
              <p>• Click derecho en la página → "Inspeccionar"</p>
              <p>• Menú Chrome → Más herramientas → Herramientas para desarrolladores</p>
            </div>
          </div>

          {/* Paso 2 */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-900 mb-3">
              Paso 2: Ir a la pestaña "Application"
            </h2>
            <div className="space-y-2 text-green-800">
              <p>• En la parte superior de DevTools busca la pestaña <strong>"Application"</strong></p>
              <p>• Si no la ves, haz click en <strong>"&gt;&gt;"</strong> para ver más pestañas</p>
              <p>• También puede aparecer como <strong>"Aplicación"</strong> si tienes Chrome en español</p>
            </div>
          </div>

          {/* Paso 3 */}
          <div className="mb-8 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold text-purple-900 mb-3">
              Paso 3: Encontrar "Storage" en el panel lateral
            </h2>
            <div className="text-purple-800">
              <p className="mb-3">En el panel izquierdo verás una estructura como esta:</p>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <div>📁 Application</div>
                <div className="ml-4">📁 Manifest</div>
                <div className="ml-4">📁 Service Workers</div>
                <div className="ml-4">📁 Storage</div>
                <div className="ml-8">📁 Local Storage</div>
                <div className="ml-8">📁 Session Storage</div>
                <div className="ml-8 text-purple-600 font-bold">📁 IndexedDB ← AQUÍ</div>
                <div className="ml-8">📁 Cookies</div>
              </div>
            </div>
          </div>

          {/* Paso 4 */}
          <div className="mb-8 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h2 className="text-xl font-semibold text-orange-900 mb-3">
              Paso 4: Explorar "TurtleOfflineDB"
            </h2>
            <div className="text-orange-800">
              <p className="mb-3">Haz click en "IndexedDB" y verás:</p>
              <div className="bg-gray-100 p-4 rounded font-mono text-sm">
                <div>📁 IndexedDB</div>
                <div className="ml-4 text-orange-600 font-bold">📁 TurtleOfflineDB ← NUESTRA BASE DE DATOS</div>
                <div className="ml-8">📁 campamentos</div>
                <div className="ml-8">📁 especies</div>
                <div className="ml-8">📁 tortugas</div>
                <div className="ml-8">📁 personal</div>
                <div className="ml-8 text-red-600 font-bold">📁 eventos ← EVENTOS OFFLINE</div>
                <div className="ml-8">📁 condiciones_ambientales</div>
                <div className="ml-8">📁 observaciones_tortuga</div>
                <div className="ml-8">📁 nidos</div>
                <div className="ml-8">📁 exhumaciones</div>
                <div className="ml-8">📁 fotos</div>
                <div className="ml-8 text-blue-600 font-bold">📁 sync_queue ← COLA DE SYNC</div>
              </div>
            </div>
          </div>

          {/* Paso 5 */}
          <div className="mb-8 p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-red-900 mb-3">
              Paso 5: Ver los datos
            </h2>
            <div className="space-y-2 text-red-800">
              <p>• Haz click en cualquier tabla (ej: "eventos")</p>
              <p>• Verás todos los registros en formato tabla</p>
              <p>• Busca las columnas importantes:</p>
              <ul className="ml-4 space-y-1">
                <li>- <strong>sync_status</strong>: "pending", "synced", o "error"</li>
                <li>- <strong>created_offline</strong>: true/false</li>
                <li>- <strong>last_modified</strong>: timestamp</li>
                <li>- <strong>tipo_evento</strong>: "Anidación", "Arqueo", "Intento"</li>
              </ul>
            </div>
          </div>

          {/* Atajos rápidos */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⚡ Atajos Rápidos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-gray-900 mb-2">Chrome</h3>
                <p className="text-sm text-gray-600">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">F12</kbd> → 
                  <strong> Application</strong> → 
                  <strong> Storage</strong> → 
                  <strong> IndexedDB</strong> → 
                  <strong> TurtleOfflineDB</strong>
                </p>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold text-gray-900 mb-2">Firefox</h3>
                <p className="text-sm text-gray-600">
                  <kbd className="px-2 py-1 bg-gray-200 rounded">F12</kbd> → 
                  <strong> Storage</strong> → 
                  <strong> Indexed DB</strong> → 
                  <strong> TurtleOfflineDB</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Botón para probar */}
          <div className="mt-8 text-center">
            <a 
              href="/test-offline"
              className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🧪 Ir a la Página de Pruebas
            </a>
            <p className="text-sm text-gray-500 mt-2">
              Crea algunos eventos offline y luego revisa IndexedDB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}