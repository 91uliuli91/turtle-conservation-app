// src/hooks/useEnvironmentalData.ts - VERSIÓN CON CACHE INTELIGENTE
"use client";

import { useState, useEffect } from 'react';
import { EnvironmentalData, weatherService } from '@/services/weatherService';
import { useDeviceLocation } from './useDeviceLocation';

// Configuración del cache
const CACHE_CONFIG = {
  KEY: 'turtletrack-environmental-cache',
  DURATION: 10 * 60 * 1000, // 10 minutos en cache
  LOCATION_THRESHOLD: 0.01, // ~1km de diferencia
} as const;

// Tipo para los datos cacheados
interface CachedData {
  data: EnvironmentalData;
  timestamp: number;
  location: { lat: number; lon: number };
  version: string;
}

export function useEnvironmentalData(autoRefresh = true) {
  const { location: deviceLocation, loading: locationLoading, error: locationError } = useDeviceLocation();
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingCache, setUsingCache] = useState(false);

  // Sistema de cache inteligente
  const getCachedData = (lat: number, lon: number): EnvironmentalData | null => {
    try {
      const cachedRaw = localStorage.getItem(CACHE_CONFIG.KEY);
      if (!cachedRaw) return null;

      const cached: CachedData = JSON.parse(cachedRaw);
      
      // Validar estructura del cache
      if (!cached.data || !cached.timestamp || !cached.location) {
        console.warn('Cache corrupto, eliminando...');
        localStorage.removeItem(CACHE_CONFIG.KEY);
        return null;
      }

      // Verificar si es la misma ubicación (con margen de error)
      const isSameLocation = 
        Math.abs(cached.location.lat - lat) < CACHE_CONFIG.LOCATION_THRESHOLD && 
        Math.abs(cached.location.lon - lon) < CACHE_CONFIG.LOCATION_THRESHOLD;
      
      // Verificar si el cache es reciente
      const isRecent = Date.now() - cached.timestamp < CACHE_CONFIG.DURATION;
      
      if (isSameLocation && isRecent) {
        console.log('Usando datos cacheados (rápido)');
        setUsingCache(true);
        return cached.data;
      } else if (!isRecent) {
        console.log('Cache expirado, actualizando...');
      } else {
        console.log('Ubicación cambiada, nuevo fetch...');
      }
    } catch (err) {
      console.warn('Error al leer cache:', err);
      // Limpiar cache corrupto
      localStorage.removeItem(CACHE_CONFIG.KEY);
    }
    
    setUsingCache(false);
    return null;
  };

  const setCachedData = (lat: number, lon: number, data: EnvironmentalData) => {
    try {
      const cacheData: CachedData = {
        data,
        timestamp: Date.now(),
        location: { lat, lon },
        version: '1.0' // Para futuras migraciones
      };
      localStorage.setItem(CACHE_CONFIG.KEY, JSON.stringify(cacheData));
      console.log('Datos guardados en cache');
    } catch (err) {
      console.warn('No se pudo guardar en cache (modo privado?)');
    }
  };

  // Función principal para obtener datos
  const fetchEnvironmentalData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Intentar obtener datos cacheados primero (para respuesta instantánea)
      const cachedData = getCachedData(lat, lon);
      if (cachedData) {
        setData(cachedData);
        setLoading(false); // Mostrar datos cacheados inmediatamente
      }
      
      console.log('Obteniendo datos ambientales actualizados...');
      
      // 2. Obtener datos frescos (siempre)
      const environmentalData = await weatherService.getEnvironmentalData(lat, lon);
      
      // 3. Guardar en cache y actualizar estado
      setCachedData(lat, lon, environmentalData);
      setData(environmentalData);
      setUsingCache(false);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener datos ambientales';
      setError(errorMessage);
      console.error('Error en useEnvironmentalData:', err);
      
      // Si hay error pero tenemos cache, mantener los datos cacheados
      if (!data && cachedData) {
        console.log('Usando cache como fallback por error');
        setData(cachedData);
        setError(null); // Limpiar error si tenemos cache de respaldo
      }
    } finally {
      setLoading(false);
    }
  };

  // 📍 Efecto para cargar datos cuando tenemos ubicación
  useEffect(() => {
    if (deviceLocation && !locationLoading) {
      fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
    } else if (locationError && !locationLoading) {
      setError(`Ubicación: ${locationError}`);
      setLoading(false);
    }
  }, [deviceLocation, locationLoading, locationError]);

  //  Auto-refresh cada 30 minutos (opcional)
  useEffect(() => {
    if (deviceLocation && autoRefresh && !usingCache) {
      const interval = setInterval(() => {
        console.log('Actualización automática de datos ambientales');
        fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
      }, 30 * 60 * 1000); // 30 minutos
      
      return () => clearInterval(interval);
    }
  }, [deviceLocation, autoRefresh, usingCache]);

  // Función para re-forzar la actualización
  const refetch = async () => {
    if (deviceLocation) {
      console.log('Re-forzando actualización...');
      // Limpiar cache para forzar fetch nuevo
      localStorage.removeItem(CACHE_CONFIG.KEY);
      setUsingCache(false);
      await fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
    }
  };

  return {
    data,
    loading: loading || locationLoading,
    error: error || locationError,
    deviceLocation,
    usingCache, // Nuevo: para mostrar indicador de cache
    refetch
  };
}