'use client';

import { useState, useEffect, useCallback } from 'react';

interface OfflineEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  synced: boolean;
}

export function useOfflineAdvanced() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState<OfflineEvent[]>([]);

  // Verificar estado de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log('🟢 Conectado - Intentando sincronizar eventos pendientes');
      syncPendingEvents();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      console.log('🔴 Sin conexión - Modo offline activado');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Verificar estado inicial
    setIsOnline(navigator.onLine);
    
    // Cargar eventos pendientes al iniciar
    loadPendingEvents();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cargar eventos pendientes del localStorage
  const loadPendingEvents = useCallback(() => {
    try {
      const stored = localStorage.getItem('turtletrack-pending-events');
      if (stored) {
        const events: OfflineEvent[] = JSON.parse(stored);
        setPendingSyncs(events.filter(event => !event.synced));
      }
    } catch (error) {
      console.error('Error cargando eventos pendientes:', error);
    }
  }, []);

  // Guardar evento en modo offline
  const saveEventOffline = useCallback(async (eventData: any): Promise<string> => {
    const eventId = `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const offlineEvent: OfflineEvent = {
      id: eventId,
      type: eventData.type || 'unknown',
      data: eventData,
      timestamp: Date.now(),
      synced: false
    };

    try {
      // Obtener eventos existentes
      const stored = localStorage.getItem('turtletrack-pending-events');
      const existingEvents: OfflineEvent[] = stored ? JSON.parse(stored) : [];
      
      // Agregar nuevo evento
      const updatedEvents = [...existingEvents, offlineEvent];
      localStorage.setItem('turtletrack-pending-events', JSON.stringify(updatedEvents));
      
      // Actualizar estado
      setPendingSyncs(updatedEvents.filter(event => !event.synced));
      
      console.log('💾 Evento guardado offline:', eventId);
      return eventId;
    } catch (error) {
      console.error('Error guardando evento offline:', error);
      throw new Error('No se pudo guardar el evento en modo offline');
    }
  }, []);

  // Sincronizar eventos pendientes con la API
  const syncPendingEvents = useCallback(async () => {
    if (!isOnline) {
      console.log('📶 Sin conexión - No se puede sincronizar');
      return;
    }

    try {
      const stored = localStorage.getItem('turtletrack-pending-events');
      if (!stored) return;

      const events: OfflineEvent[] = JSON.parse(stored);
      const unsyncedEvents = events.filter(event => !event.synced);

      if (unsyncedEvents.length === 0) {
        console.log('✅ No hay eventos pendientes por sincronizar');
        return;
      }

      console.log(`🔄 Sincronizando ${unsyncedEvents.length} eventos...`);

      // Simular envío a la API
      for (const event of unsyncedEvents) {
        try {
          console.log(`📤 Enviando evento ${event.id} a la API...`);
          
          // Aquí iría la llamada real a tu API
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
          
          // Marcar como sincronizado
          event.synced = true;
          console.log(`✅ Evento ${event.id} sincronizado exitosamente`);
        } catch (error) {
          console.error(`❌ Error sincronizando evento ${event.id}:`, error);
          // Continuar con el siguiente evento
        }
      }

      // Guardar eventos actualizados
      localStorage.setItem('turtletrack-pending-events', JSON.stringify(events));
      setPendingSyncs(events.filter(event => !event.synced));

      console.log('🎉 Sincronización completada');
    } catch (error) {
      console.error('Error en sincronización:', error);
    }
  }, [isOnline]);

  // Limpiar eventos ya sincronizados
  const cleanupSyncedEvents = useCallback(() => {
    try {
      const stored = localStorage.getItem('turtletrack-pending-events');
      if (!stored) return;

      const events: OfflineEvent[] = JSON.parse(stored);
      const unsyncedEvents = events.filter(event => !event.synced);
      
      localStorage.setItem('turtletrack-pending-events', JSON.stringify(unsyncedEvents));
      setPendingSyncs(unsyncedEvents);
    } catch (error) {
      console.error('Error limpiando eventos sincronizados:', error);
    }
  }, []);

  // Obtener estadísticas de almacenamiento
  const getStorageStats = useCallback(() => {
    try {
      const stored = localStorage.getItem('turtletrack-pending-events');
      const events: OfflineEvent[] = stored ? JSON.parse(stored) : [];
      
      return {
        total: events.length,
        pending: events.filter(e => !e.synced).length,
        synced: events.filter(e => e.synced).length,
        storageSize: new Blob([stored || '']).size
      };
    } catch (error) {
      return { total: 0, pending: 0, synced: 0, storageSize: 0 };
    }
  }, []);

  return {
    isOnline,
    pendingSyncs: pendingSyncs.length,
    saveEventOffline,
    syncPendingEvents,
    cleanupSyncedEvents,
    getStorageStats,
    // Método para forzar verificación de conexión
    checkConnection: () => setIsOnline(navigator.onLine)
  };
}