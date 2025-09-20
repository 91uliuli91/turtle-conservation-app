// src/hooks/useOffline.ts
'use client';

import { useState, useEffect } from 'react';
import { db, EventoOffline, initDB } from '@/app/lib/offlineDB';

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSyncs, setPendingSyncs] = useState(0);
  const [dbReady, setDbReady] = useState(false);

  // Inicializar la base de datos
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        setDbReady(true);
        
        // Contar eventos pendientes - USAR 0 en lugar de false
        const count = await db.eventos.where('sincronizado').equals(0).count();
        setPendingSyncs(count);
      } catch (error) {
        console.error('Error inicializando DB:', error);
      }
    };

    initializeDB();
  }, []);

// Detectar cambios en la conexión
useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);
    
    const handleOnline = () => {
        console.log('🟢 Conexión restaurada');
        setIsOnline(true);
    };
    
    const handleOffline = () => {
        console.log('🔴 Sin conexión');
        setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
}, []);

// Función para validar datos antes de guardar
  const validateEventData = (eventData: any): EventoOffline => {
    return {
      tipo_evento: eventData.type || 'unknown',
      fecha_hora: new Date(),
      coordenada_lat: Number(eventData.location?.lat) || 0,
      coordenada_lon: Number(eventData.location?.lon) || 0,
      detalles: eventData.details || {},
      fotos: Array.isArray(eventData.photos) ? eventData.photos : [],
      observaciones: eventData.observations || null,
      campamento_id: null,
      zona_playa: null,
      tortuga_id: null,
      sincronizado: 0, // ← 0 para false, 1 para true
      createdAt: new Date()
    };
  };

  // Guardar evento offline
  const saveEventOffline = async (eventData: any): Promise<number> => {
    if (!dbReady) {
      throw new Error('Base de datos no inicializada');
    }

    try {
      const validatedData = validateEventData(eventData);
      
      const id = await db.eventos.add(validatedData);
      
      setPendingSyncs(prev => prev + 1);
      return id as number;
    } catch (error) {
      console.error('Error guardando offline:', error);
      throw error;
    }
  };

  // Sincronizar eventos pendientes
  const syncPendingEvents = async () => {
    if (!isOnline || !dbReady) {
      console.log('No hay conexión o DB no lista, no se puede sincronizar');
      return;
    }

    try {
      // USAR 0 en lugar de false
      const pendingEvents = await db.eventos.where('sincronizado').equals(0).toArray();
      
      console.log(`Sincronizando ${pendingEvents.length} eventos pendientes...`);
      
      for (const event of pendingEvents) {
        try {
          await sendEventToAPI(event);
          
          // Marcar como sincronizado (1 = true)
          await db.eventos.update(event.id!, { sincronizado: 1 });
          setPendingSyncs(prev => prev - 1);
          console.log(`✅ Evento ${event.id} sincronizado`);
          
        } catch (error) {
          console.error(`Error sincronizando evento ${event.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error obteniendo eventos pendientes:', error);
    }
  };

// Sincronizar automáticamente cuando se recupera la conexión
useEffect(() => {
    if (isOnline && pendingSyncs > 0) {
    console.log('Conexión recuperada, sincronizando eventos pendientes...');
    syncPendingEvents();
    }
}, [isOnline]);

// Contar eventos pendientes
const countPendingEvents = async () => {
    try {
    const count = await db.eventos.where('sincronizado').equals(false).count();
    setPendingSyncs(count);
    return count;
    } catch (error) {
    console.error('Error contando eventos pendientes:', error);
    return 0;
    }
};

// Obtener eventos pendientes
const getPendingEvents = async () => {
    try {
    return await db.eventos.where('sincronizado').equals(false).toArray();
    } catch (error) {
    console.error('Error obteniendo eventos pendientes:', error);
    return [];
    }
};

return {
    isOnline,
    pendingSyncs,
    saveEventOffline,
    syncPendingEvents,
    countPendingEvents,
    getPendingEvents
};
};