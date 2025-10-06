// src/hooks/useEnvironmentalData.ts
//Propósito:

// Maneja el estado (loading, error, data)
// Realiza llamadas a la API
// Implementa auto-refresh cada 15 minutos
// Se puede usar en cualquier componente
// src/hooks/useEnvironmentalData.ts - VERSIÓN MEJORADA
// src/hooks/useEnvironmentalData.ts - VERSIÓN CON GEOLOCALIZACIÓN
"use client"

import { useState, useEffect } from 'react';
import { EnvironmentalData, weatherService } from '@/services/weatherService';
import { useDeviceLocation } from './useDeviceLocation';

export function useEnvironmentalData(autoRefresh = true) {
  const { location: deviceLocation, loading: locationLoading, error: locationError } = useDeviceLocation();
  const [data, setData] = useState<EnvironmentalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnvironmentalData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Obteniendo datos ambientales para ubicación actual...');
      
      const environmentalData = await weatherService.getEnvironmentalData(lat, lon);
      setData(environmentalData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener datos ambientales';
      setError(errorMessage);
      console.error('❌ Error en useEnvironmentalData:', err);
    } finally {
      setLoading(false);
    }
  };

  const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
  };

  useEffect(() => {
    if (deviceLocation && !locationLoading) {
      fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
    } else if (locationError && !locationLoading) {
      setError(`Ubicación: ${locationError}`);
      setLoading(false);
    }
  }, [deviceLocation, locationLoading, locationError]);

  useEffect(() => {
    if (deviceLocation && autoRefresh) {
      const interval = setInterval(() => {
        fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
      }, 30 * 60 * 1000); // 30 minutos
      
      return () => clearInterval(interval);
    }
  }, [deviceLocation, autoRefresh]);

  const refetch = async () => {
    if (deviceLocation) {
      await fetchEnvironmentalData(deviceLocation.lat, deviceLocation.lon);
    }
  };

  return {
    data,
    loading: loading || locationLoading,
    error: error || locationError,
    deviceLocation,
    refetch
  };
}