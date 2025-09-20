// src/hooks/useOffline.ts
'use client';

import { useState, useEffect } from 'react';
import { db, EventoOffline } from '@/app/lib/offlineDB';

export const useOffline = () => {
const [isOnline, setIsOnline] = useState(true); // Valor inicial true por defecto
const [pendingSyncs, setPendingSyncs] = useState(0);

// Detectar cambios en la conexión - Solo en el cliente
useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') return;

    // Establecer el estado inicial correcto
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

    // Contar eventos pendientes al inicializar
    const countInitialPending = async () => {
    try {
        const count = await db.eventos.where('sincronizado').equals(false).count();
        setPendingSyncs(count);
    } catch (error) {
        console.error('Error contando eventos pendientes:', error);
    }
    };

    countInitialPending();

    return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
    };
}, []);

// Guardar evento offline
const saveEventOffline = async (eventData: any): Promise<number> => {
    try {
    const id = await db.eventos.add({
        tipo_evento: eventData.type,
        fecha_hora: new Date(),
        coordenada_lat: eventData.location.lat,
        coordenada_lon: eventData.location.lon,
        detalles: eventData.details,
        fotos: eventData.photos,
        observaciones: eventData.observations,
        sincronizado: false,
        createdAt: new Date()
    });
    
    // Actualizar contador de pendientes
    setPendingSyncs(prev => prev + 1);
    return id as number;
    } catch (error) {
    console.error('Error guardando offline:', error);
    throw error;
    }
};

// Enviar evento a la API
const sendEventToAPI = async (event: EventoOffline) => {
    try {
    const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        tipo_evento: event.tipo_evento,
        fecha_hora: event.fecha_hora,
        coordenada_lat: event.coordenada_lat,
        coordenada_lon: event.coordenada_lon,
        observaciones: event.observaciones,
        detalles: event.detalles,
        fotos: event.fotos
        })
    });

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
    } catch (error) {
    console.error('Error enviando evento a API:', error);
    throw error;
    }
};

// Sincronizar eventos pendientes
const syncPendingEvents = async () => {
    if (!isOnline) {
    console.log('No hay conexión, no se puede sincronizar');
    return;
    }

    try {
    const pendingEvents = await db.eventos.where('sincronizado').equals(false).toArray();
    
    console.log(`Sincronizando ${pendingEvents.length} eventos pendientes...`);
    
    for (const event of pendingEvents) {
        try {
        await sendEventToAPI(event);
        
        // Marcar como sincronizado
        await db.eventos.update(event.id!, { sincronizado: true });
        setPendingSyncs(prev => prev - 1);
        console.log(`✅ Evento ${event.id} sincronizado`);
        
        } catch (error) {
        console.error(`Error sincronizando evento ${event.id}:`, error);
        // Continuar con los demás eventos aunque falle uno
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