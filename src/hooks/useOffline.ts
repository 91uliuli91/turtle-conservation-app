// src/hooks/useOffline.ts
'use client';

import { useState, useEffect } from 'react'; // Importamos hooks de React para gestionar el estado y efectos secundarios
import { db, EventoOffline, initDB } from '@/app/lib/offlineDB'; // Importamos la base de datos Dexie.js y su inicialización

// Custom hook que maneja la lógica offline y la sincronización de eventos
export const useOffline = () => {
  // Estado que maneja si el usuario está en línea u offline
  const [isOnline, setIsOnline] = useState(true); 
  // Estado que cuenta los eventos pendientes de sincronización
  const [pendingSyncs, setPendingSyncs] = useState(0);
  // Estado que asegura que la base de datos esté inicializada antes de usarla
  const [dbReady, setDbReady] = useState(false);

  // Inicialización de la base de datos cuando el componente se monta
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB(); // Inicializa la base de datos (Dexie.js)
        setDbReady(true); // Marca la base de datos como lista para ser usada
        
        // Contamos los eventos pendientes (sincronizados = 0 significa que no están sincronizados)
        const count = await db.eventos.where('sincronizado').equals(0).count();
        setPendingSyncs(count); // Actualiza el número de eventos pendientes
      } catch (error) {
        console.error('Error inicializando DB:', error);
      }
    };

    initializeDB(); // Llama a la función para inicializar la base de datos
  }, []); // Este `useEffect` se ejecuta solo una vez cuando el componente se monta

  // Detecta cambios en la conexión a Internet
  useEffect(() => {
    if (typeof window === 'undefined') return; // Evita que se ejecute en el servidor

    setIsOnline(navigator.onLine); // Establece el estado de conexión basado en la propiedad `navigator.onLine`
    
    const handleOnline = () => {
      console.log('🟢 Conexión restaurada');
      setIsOnline(true); // Actualiza el estado cuando la conexión se restablece
    };
    
    const handleOffline = () => {
      console.log('🔴 Sin conexión');
      setIsOnline(false); // Actualiza el estado cuando el dispositivo se queda sin conexión
    };

    // Escucha los eventos online y offline
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Limpia los eventos al desmontar el componente
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // Este `useEffect` también se ejecuta solo una vez al montar el componente

  // Función para validar los datos del evento antes de guardarlos en la base de datos offline
  const validateEventData = (eventData: any): EventoOffline => {
    return {
      tipo_evento: eventData.type || 'unknown', // Tipo de evento, por defecto 'unknown'
      fecha_hora: new Date(), // Fecha y hora actual
      coordenada_lat: Number(eventData.location?.lat) || 0, // Latitud del evento
      coordenada_lon: Number(eventData.location?.lon) || 0, // Longitud del evento
      detalles: eventData.details || {}, // Detalles del evento (si los hay)
      fotos: Array.isArray(eventData.photos) ? eventData.photos : [], // Fotos asociadas al evento
      observaciones: eventData.observations || null, // Observaciones del evento
      campamento_id: null, // ID del campamento (si aplica)
      zona_playa: null, // Zona de la playa (si aplica)
      tortuga_id: null, // ID de la tortuga (si aplica)
      sincronizado: 0, // Marca el evento como no sincronizado (0 = no, 1 = sí)
      createdAt: new Date() // Fecha de creación del evento
    };
  };

  // Función para guardar un evento offline en la base de datos
  const saveEventOffline = async (eventData: any): Promise<number> => {
    if (!dbReady) {
      throw new Error('Base de datos no inicializada'); // Asegúrate de que la base de datos esté lista
    }

    try {
      const validatedData = validateEventData(eventData); // Valida los datos del evento
      const id = await db.eventos.add(validatedData); // Guarda el evento en la base de datos offline
      
      setPendingSyncs(prev => prev + 1); // Incrementa el contador de eventos pendientes
      return id as number; // Devuelve el ID del evento guardado
    } catch (error) {
      console.error('Error guardando offline:', error); // Maneja cualquier error al guardar el evento
      throw error; // Vuelve a lanzar el error para manejarlo en el lugar donde se llamó
    }
  };

  // Función para sincronizar los eventos pendientes con el backend cuando el dispositivo está online
  const syncPendingEvents = async () => {
    if (!isOnline || !dbReady) {
      console.log('No hay conexión o DB no lista, no se puede sincronizar');
      return; // Si no hay conexión o la base de datos no está lista, no sincroniza
    }

    try {
      // Obtiene todos los eventos pendientes (sin sincronizar)
      const pendingEvents = await db.eventos.where('sincronizado').equals(0).toArray();
      
      console.log(`Sincronizando ${pendingEvents.length} eventos pendientes...`);
      
      // Para cada evento pendiente, intenta sincronizarlo con el backend
      for (const event of pendingEvents) {
        try {
          await sendEventToAPI(event); // Función para enviar el evento al servidor (debería estar implementada)
          
          // Marca el evento como sincronizado (sincronizado = 1)
          await db.eventos.update(event.id!, { sincronizado: 1 });
          setPendingSyncs(prev => prev - 1); // Decrementa el contador de eventos pendientes
          console.log(`✅ Evento ${event.id} sincronizado`);
        } catch (error) {
          console.error(`Error sincronizando evento ${event.id}:`, error); // Maneja errores al sincronizar eventos
        }
      }
    } catch (error) {
      console.error('Error obteniendo eventos pendientes:', error); // Maneja cualquier error al obtener eventos pendientes
    }
  };

  // Sincroniza automáticamente cuando la conexión se recupera
  useEffect(() => {
    if (isOnline && pendingSyncs > 0) {
      console.log('Conexión recuperada, sincronizando eventos pendientes...');
      syncPendingEvents(); // Sincroniza los eventos cuando la conexión se restablece
    }
  }, [isOnline]); // Se ejecuta cuando el estado de conexión cambia

  // Función para contar los eventos pendientes (sincronizados = 0)
  const countPendingEvents = async () => {
    try {
      const count = await db.eventos.where('sincronizado').equals(0).count(); // Cuenta los eventos pendientes
      setPendingSyncs(count); // Actualiza el número de eventos pendientes
      return count;
    } catch (error) {
      console.error('Error contando eventos pendientes:', error); // Maneja cualquier error al contar eventos pendientes
      return 0;
    }
  };

  // Función para obtener todos los eventos pendientes (sincronizados = 0)
  const getPendingEvents = async () => {
    try {
      return await db.eventos.where('sincronizado').equals(0).toArray(); // Devuelve los eventos pendientes
    } catch (error) {
      console.error('Error obteniendo eventos pendientes:', error); // Maneja errores al obtener eventos pendientes
      return []; // Devuelve un array vacío en caso de error
    }
  };

  return {
    isOnline, // Estado de conexión (online u offline)
    pendingSyncs, // Número de eventos pendientes de sincronización
    saveEventOffline, // Función para guardar eventos offline
    syncPendingEvents, // Función para sincronizar eventos pendientes
    countPendingEvents, // Función para contar eventos pendientes
    getPendingEvents // Función para obtener los eventos pendientes
  };
};
