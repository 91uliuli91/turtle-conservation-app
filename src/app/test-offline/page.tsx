// src/app/test-offline/page.tsx
// Página de prueba para demostrar funcionalidad offline

'use client';

import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { offlineService } from '@/lib/offline-service';
import ConnectivityStatus from '@/components/ConnectivityStatus';

export default function TestOfflinePage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTestingOffline, setIsTestingOffline] = useState(false);
  const [offlineStats, setOfflineStats] = useState<any>(null);
  const [eventosOffline, setEventosOffline] = useState<any[]>([]);
  
  const { networkStatus, forceNetworkCheck, triggerSync } = useNetworkStatus();

  // Cargar datos al inicializar
  useEffect(() => {
    const initOfflineService = async () => {
      try {
        await offlineService.initialize();
        loadOfflineData();
      } catch (error) {
        console.error('Error initializing offline service:', error);
      }
    };

    initOfflineService();
  }, []);

  // Cargar datos offline
  const loadOfflineData = async () => {
    try {
      const [stats, eventos] = await Promise.all([
        offlineService.getOfflineStats(),
        offlineService.getEventosOffline({ limit: 10 })
      ]);
      
      setOfflineStats(stats);
      setEventosOffline(eventos);
    } catch (error) {
      console.error('Error loading offline data:', error);
    }
  };

  // Función para simular evento offline
  const createTestEventOffline = async () => {
    setIsTestingOffline(true);
    
    try {
      const testEvent = {
        tipo_evento: 'Anidación' as const,
        fecha_hora: new Date().toISOString(),
        campamento_id: 1,
        zona_playa: 'A' as const,
        estacion_baliza: `TEST-${Date.now()}`,
        coordenada_lat: 10.123456,
        coordenada_lon: -85.654321,
        tortuga_id: 1,
        personal_registro_id: 1,
        observaciones: `Evento de prueba offline creado en ${new Date().toLocaleString()}`,
        
        // Condiciones ambientales de prueba
        condiciones: {
          temperatura_arena_nido_c: 28.5,
          humedad_arena_porcentaje: 65,
          fase_lunar: 'Cuarto Creciente'
        },
        
        // Observaciones de tortuga de prueba
        observaciones_tortuga: {
          largo_caparazon_cm: 85,
          ancho_caparazon_cm: 75,
          se_coloco_marca_nueva: true,
          se_remarco: false
        }
      };

      const result = await offlineService.saveEventoOffline(testEvent);
      
      setTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'CREATE_OFFLINE_EVENT',
        success: result.success,
        data: { eventId: result.eventoId, status: 'offline' },
        message: `Evento offline creado con ID: ${result.eventoId}`
      }]);

      // Recargar datos
      await loadOfflineData();
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'CREATE_OFFLINE_EVENT',
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        message: 'Error creando evento offline'
      }]);
    } finally {
      setIsTestingOffline(false);
    }
  };

  // Función para probar conectividad
  const testConnectivity = async () => {
    const result = await forceNetworkCheck();
    
    setTestResults(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      action: 'CONNECTIVITY_CHECK',
      success: true,
      data: result,
      message: `Conectividad: ${result.isConnected ? 'Conectado' : 'Desconectado'}`
    }]);
  };

  // Función para probar sincronización
  const testSync = async () => {
    try {
      const result = await triggerSync();
      
      setTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'MANUAL_SYNC',
        success: result.success,
        data: result,
        message: `Sync: ${result.message}`
      }]);

      // Recargar datos después de sync
      await loadOfflineData();
      
    } catch (error) {
      setTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        action: 'MANUAL_SYNC',
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        message: 'Error en sincronización manual'
      }]);
    }
  };

  // Limpiar resultados
  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      {/* Componente de estado de conectividad */}
      <ConnectivityStatus position="top-right" showDetails={true} />
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
            🧪 Prueba de Funcionalidad Offline
            <span className="ml-4 text-sm font-normal px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              Test Lab
            </span>
          </h1>
          
          <p className="text-gray-600 mb-6">
            Esta página te permite probar todas las funcionalidades offline de la aplicación.
            Puedes simular eventos offline, verificar conectividad y probar sincronización.
          </p>

          {/* Panel de estado actual */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-blue-900 mb-2">Estado de Red</h3>
              <p className="text-sm text-blue-700">
                Internet: <span className={`font-medium ${networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {networkStatus.isOnline ? 'Conectado' : 'Desconectado'}
                </span>
              </p>
              <p className="text-sm text-blue-700">
                Servidor: <span className={`font-medium ${networkStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                  {networkStatus.isConnected ? 'Conectado' : 'Desconectado'}
                </span>
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-green-900 mb-2">Datos Offline</h3>
              <p className="text-sm text-green-700">
                Eventos totales: <span className="font-medium">{offlineStats?.eventos?.total || 0}</span>
              </p>
              <p className="text-sm text-green-700">
                Pendientes: <span className="font-medium text-orange-600">{offlineStats?.eventos?.pending || 0}</span>
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border">
              <h3 className="font-semibold text-purple-900 mb-2">Sincronización</h3>
              <p className="text-sm text-purple-700">
                Cola: <span className="font-medium">{offlineStats?.sync?.queueSize || 0}</span>
              </p>
              <p className="text-sm text-purple-700">
                Sincronizados: <span className="font-medium text-green-600">{offlineStats?.eventos?.synced || 0}</span>
              </p>
            </div>
          </div>

          {/* Botones de prueba */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={createTestEventOffline}
              disabled={isTestingOffline}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isTestingOffline ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creando...
                </>
              ) : (
                <>
                  📱 Crear Evento Offline
                </>
              )}
            </button>
            
            <button
              onClick={testConnectivity}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              🌐 Probar Conectividad
            </button>
            
            <button
              onClick={testSync}
              disabled={!networkStatus.canSync}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              🔄 Sincronizar
            </button>
            
            <button
              onClick={loadOfflineData}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
            >
              🔄 Recargar Datos
            </button>
            
            <button
              onClick={clearResults}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              🗑️ Limpiar Log
            </button>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Log de pruebas */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Log de Pruebas</h2>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {testResults.length === 0 ? (
                <p className="text-gray-500 italic">No hay resultados de pruebas aún...</p>
              ) : (
                testResults.slice().reverse().map((result, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border-l-4 ${
                      result.success 
                        ? 'bg-green-50 border-green-400' 
                        : 'bg-red-50 border-red-400'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">
                        {result.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {result.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{result.message}</p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          Ver detalles
                        </summary>
                        <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                    {result.error && (
                      <p className="text-xs text-red-600 mt-1">
                        Error: {result.error}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eventos offline */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📱 Eventos Offline</h2>
            
            <div className="max-h-96 overflow-y-auto space-y-2">
              {eventosOffline.length === 0 ? (
                <p className="text-gray-500 italic">No hay eventos offline...</p>
              ) : (
                eventosOffline.map((evento, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded border ${
                      evento.sync_status === 'pending' 
                        ? 'bg-orange-50 border-orange-200' 
                        : evento.sync_status === 'synced'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm">
                        {evento.tipo_evento}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        evento.sync_status === 'pending' 
                          ? 'bg-orange-200 text-orange-800' 
                          : evento.sync_status === 'synced'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {evento.sync_status}
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-1">
                      ID: {evento.id} | Zona: {evento.zona_playa} | {evento.estacion_baliza}
                    </p>
                    
                    <p className="text-xs text-gray-500">
                      {new Date(evento.fecha_hora).toLocaleString()}
                    </p>
                    
                    {evento.observaciones && (
                      <p className="text-xs text-gray-700 mt-1 italic">
                        "{evento.observaciones}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">
            🔍 Instrucciones de Prueba
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-800">
            <div>
              <h4 className="font-semibold mb-2">Para probar modo offline:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>Desconecta tu internet</li>
                <li>Haz clic en "Crear Evento Offline"</li>
                <li>Observa que se guarda localmente</li>
                <li>Reconecta internet</li>
                <li>Observa la sincronización automática</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">También puedes:</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>Usar DevTools → Network → Throttling → Offline</li>
                <li>Verificar datos en DevTools → Application → IndexedDB</li>
                <li>Observar el indicador de conectividad</li>
                <li>Probar sincronización manual</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}