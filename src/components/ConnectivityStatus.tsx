// src/components/ConnectivityStatus.tsx
// Componente para mostrar estado de conectividad y sincronización

'use client';

import React, { useState, useEffect } from 'react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { offlineService } from '@/lib/offline-service';

interface ConnectivityStatusProps {
  showDetails?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  className?: string;
}

export function ConnectivityStatus({ 
  showDetails = false, 
  position = 'top-right',
  className = ''
}: ConnectivityStatusProps) {
  const { 
    networkStatus, 
    syncInProgress, 
    getStatusText, 
    getStatusColor,
    triggerSync 
  } = useNetworkStatus();

  const [offlineStats, setOfflineStats] = useState<any>(null);
  const [showStats, setShowStats] = useState(false);

  // Cargar estadísticas offline
  useEffect(() => {
    const loadStats = async () => {
      try {
        if (offlineService.isReady()) {
          const stats = await offlineService.getOfflineStats();
          setOfflineStats(stats);
        }
      } catch (error) {
        console.error('Failed to load offline stats:', error);
      }
    };

    loadStats();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const statusColor = getStatusColor();
  const statusText = getStatusText();

  const handleSync = async () => {
    try {
      const result = await triggerSync();
      if (result.success) {
        // Recargar estadísticas después de sincronizar
        if (offlineService.isReady()) {
          const stats = await offlineService.getOfflineStats();
          setOfflineStats(stats);
        }
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Indicador principal */}
      <div 
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg
          ${statusColor === 'green' ? 'bg-green-100 text-green-800 border border-green-200' : ''}
          ${statusColor === 'blue' ? 'bg-blue-100 text-blue-800 border border-blue-200' : ''}
          ${statusColor === 'orange' ? 'bg-orange-100 text-orange-800 border border-orange-200' : ''}
          ${statusColor === 'red' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
          ${statusColor === 'gray' ? 'bg-gray-100 text-gray-800 border border-gray-200' : ''}
          cursor-pointer transition-all hover:shadow-xl
        `}
        onClick={() => setShowStats(!showStats)}
        title="Click para ver detalles"
      >
        {/* Indicador de estado */}
        <div 
          className={`
            w-3 h-3 rounded-full 
            ${statusColor === 'green' ? 'bg-green-500' : ''}
            ${statusColor === 'blue' ? 'bg-blue-500 animate-pulse' : ''}
            ${statusColor === 'orange' ? 'bg-orange-500' : ''}
            ${statusColor === 'red' ? 'bg-red-500' : ''}
            ${statusColor === 'gray' ? 'bg-gray-500' : ''}
          `}
        />
        
        {/* Texto de estado */}
        <span className="text-sm font-medium">
          {statusText}
        </span>

        {/* Contador de pendientes */}
        {offlineStats?.eventos.pending > 0 && (
          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
            {offlineStats.eventos.pending}
          </span>
        )}

        {/* Botón de sincronización */}
        {networkStatus.canSync && !syncInProgress && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleSync();
            }}
            className="ml-1 p-1 hover:bg-white hover:bg-opacity-20 rounded"
            title="Sincronizar ahora"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        )}
      </div>

      {/* Panel de detalles */}
      {showStats && (
        <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg shadow-xl min-w-80">
          <h3 className="font-semibold text-gray-900 mb-3">Estado de Conectividad</h3>
          
          {/* Estado de red */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Internet:</span>
              <span className={`text-sm font-medium ${networkStatus.isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {networkStatus.isOnline ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Servidor:</span>
              <span className={`text-sm font-medium ${networkStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {networkStatus.isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>

            {networkStatus.lastConnected && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última conexión:</span>
                <span className="text-sm text-gray-800">
                  {new Date(networkStatus.lastConnected).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>

          {/* Estadísticas offline */}
          {offlineStats && (
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900 mb-2">Datos Offline</h4>
              
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Eventos totales:</span>
                  <span className="font-medium">{offlineStats.eventos.total}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Pendientes sync:</span>
                  <span className={`font-medium ${offlineStats.eventos.pending > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {offlineStats.eventos.pending}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Sincronizados:</span>
                  <span className="font-medium text-green-600">
                    {offlineStats.eventos.synced}
                  </span>
                </div>

                {offlineStats.media?.fotos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fotos offline:</span>
                    <span className="font-medium">{offlineStats.media.fotos}</span>
                  </div>
                )}

                {offlineStats.sync?.queueSize > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">En cola:</span>
                    <span className="font-medium text-blue-600">{offlineStats.sync.queueSize}</span>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="mt-3 pt-3 border-t">
                {networkStatus.canSync && (
                  <button
                    onClick={handleSync}
                    disabled={syncInProgress}
                    className={`
                      w-full px-3 py-2 text-sm font-medium rounded
                      ${syncInProgress 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                      }
                    `}
                  >
                    {syncInProgress ? 'Sincronizando...' : 'Sincronizar Ahora'}
                  </button>
                )}
                
                {!networkStatus.canSync && offlineStats.eventos.pending > 0 && (
                  <div className="text-center text-sm text-gray-500">
                    {offlineStats.eventos.pending} eventos se sincronizarán cuando haya conexión
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ConnectivityStatus;