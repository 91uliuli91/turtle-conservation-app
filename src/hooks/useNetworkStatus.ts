// src/hooks/useNetworkStatus.ts
// Hook para detectar estado de conectividad y manejar sincronización automática

import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isConnected: boolean;
  canSync: boolean;
  connectionType?: string;
  lastConnected?: Date;
  lastSyncAttempt?: Date;
}

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    isConnected: false,
    canSync: false,
  });

  const [syncInProgress, setSyncInProgress] = useState(false);

  // Función para verificar conectividad real con el servidor
  const checkServerConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

      const response = await fetch('/api/health', {
        method: 'GET',
        signal: controller.signal,
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
        }
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.log('Server connectivity check failed:', error);
      return false;
    }
  }, []);

  // Función para actualizar el estado de conectividad
  const updateNetworkStatus = useCallback(async () => {
    const isOnline = navigator.onLine;
    let isConnected = false;
    let canSync = false;

    if (isOnline) {
      isConnected = await checkServerConnectivity();
      canSync = isConnected;
    }

    setNetworkStatus(prev => ({
      ...prev,
      isOnline,
      isConnected,
      canSync,
      ...(isConnected ? { lastConnected: new Date() } : {}),
      connectionType: (navigator as any).connection?.effectiveType || 'unknown'
    }));

    return { isOnline, isConnected, canSync };
  }, [checkServerConnectivity]);

  // Función para forzar verificación de conectividad
  const forceNetworkCheck = useCallback(async () => {
    return await updateNetworkStatus();
  }, [updateNetworkStatus]);

  // Función para iniciar sincronización manual
  const triggerSync = useCallback(async () => {
    if (syncInProgress || !networkStatus.canSync) {
      return { success: false, message: 'Sync not available or already in progress' };
    }

    setSyncInProgress(true);
    setNetworkStatus(prev => ({
      ...prev,
      lastSyncAttempt: new Date()
    }));

    try {
      // Importar dinámicamente para evitar dependencias circulares
      const { OfflineSync } = await import('@/lib/offline-sync');
      const offlineSync = new OfflineSync();
      
      const result = await offlineSync.syncAll();
      
      return result;
    } catch (error) {
      console.error('Sync failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Sync failed' 
      };
    } finally {
      setSyncInProgress(false);
    }
  }, [networkStatus.canSync, syncInProgress]);

  // Effect para monitorear cambios de conectividad
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network status: ONLINE');
      updateNetworkStatus();
    };

    const handleOffline = () => {
      console.log('Network status: OFFLINE');
      setNetworkStatus(prev => ({
        ...prev,
        isOnline: false,
        isConnected: false,
        canSync: false
      }));
    };

    // Listeners para eventos de conectividad
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificación inicial
    updateNetworkStatus();

    // Verificación periódica cuando está online
    const intervalId = setInterval(() => {
      if (navigator.onLine) {
        updateNetworkStatus();
      }
    }, 30000); // Cada 30 segundos

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(intervalId);
    };
  }, [updateNetworkStatus]);

  // Effect para sincronización automática cuando se recupera conectividad
  useEffect(() => {
    if (networkStatus.canSync && !syncInProgress) {
      // Delay para evitar múltiples intentos seguidos
      const syncTimeout = setTimeout(() => {
        triggerSync().then(result => {
          if (result.success) {
            console.log('Auto-sync completed successfully');
          } else {
            console.log('Auto-sync failed:', result.message);
          }
        });
      }, 2000);

      return () => clearTimeout(syncTimeout);
    }
  }, [networkStatus.canSync, syncInProgress, triggerSync]);

  return {
    networkStatus,
    syncInProgress,
    forceNetworkCheck,
    triggerSync,
    
    // Helpers computados
    isOffline: !networkStatus.isOnline,
    hasConnection: networkStatus.isConnected,
    canSyncNow: networkStatus.canSync && !syncInProgress,
    
    // Estados descriptivos para UI
    getStatusText: () => {
      if (!networkStatus.isOnline) return 'Sin conexión a internet';
      if (!networkStatus.isConnected) return 'Sin conexión al servidor';
      if (syncInProgress) return 'Sincronizando...';
      if (networkStatus.canSync) return 'Conectado';
      return 'Estado desconocido';
    },
    
    getStatusColor: () => {
      if (!networkStatus.isOnline) return 'red';
      if (!networkStatus.isConnected) return 'orange';
      if (syncInProgress) return 'blue';
      if (networkStatus.canSync) return 'green';
      return 'gray';
    }
  };
}