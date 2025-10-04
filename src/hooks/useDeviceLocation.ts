// src/hooks/useDeviceLocation.ts
"use client"

import { useState, useEffect } from 'react';

export interface DeviceLocation {
  lat: number;
  lon: number;
  accuracy: number;
  timestamp: number;
  error?: string;
}

export function useDeviceLocation() {
  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = (): Promise<DeviceLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalización no soportada'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: DeviceLocation = {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage = 'Error desconocido al obtener ubicación';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permiso de ubicación denegado';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Información de ubicación no disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tiempo de espera agotado';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5 * 60 * 1000 // 5 minutos
        }
      );
    });
  };

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const deviceLocation = await getCurrentLocation();
        setLocation(deviceLocation);
        
        console.log(' Ubicación del dispositivo obtenida:', deviceLocation);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
        setError(errorMessage);
        console.error(' Error obteniendo ubicación:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const deviceLocation = await getCurrentLocation();
      setLocation(deviceLocation);
      
      return deviceLocation;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    loading,
    error,
    refetch
  };
}