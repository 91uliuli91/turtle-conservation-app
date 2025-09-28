// src/components/LocationPicker.tsx
//Este componente simula la obtención de una ubicación y permite al usuario confirmarla. 
// En una implementación real, puedes reemplazar la función de simulación con la API de geolocalización del navegador.
'use client';

import { useState, useEffect } from 'react';

// Definición de las propiedades que se pasan al componente LocationPicker
interface LocationPickerProps {
  onLocationConfirm: (lat: number, lon: number) => void; // Función que se llama para confirmar la ubicación seleccionada
  onBack: () => void; // Función para retroceder al paso anterior
}

export default function LocationPicker({ onLocationConfirm, onBack }: LocationPickerProps) {
  // Estado para almacenar la ubicación obtenida (latitud y longitud)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  // Estado para controlar el estado de carga
  const [loading, setLoading] = useState(true);

  // useEffect para simular la obtención de la ubicación (en lugar de usar la API del navegador en este caso)
  useEffect(() => {
    const getLocation = () => {
      setLoading(true); // Empieza el proceso de carga
      setTimeout(() => {
        // Simula la obtención de ubicación con datos aleatorios
        setLocation({ 
          lat: 20.6170 + (Math.random() - 0.5) * 0.01,  // Latitud aleatoria cerca de Cancún
          lon: -87.0729 + (Math.random() - 0.5) * 0.01 // Longitud aleatoria cerca de Cancún
        });
        setLoading(false); // Termina el proceso de carga
      }, 1000); // Simula un retraso de 1 segundo
    };

    getLocation(); // Llama a la función para obtener la ubicación
  }, []); // Ejecuta solo una vez cuando el componente se monta

  // Función para manejar la confirmación de la ubicación
  const handleConfirm = () => {
    if (location) {
      // Si la ubicación está disponible, la pasa al componente padre
      onLocationConfirm(location.lat, location.lon);
    }
  };

  // Si está cargando, se muestra un spinner y un mensaje
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 animate-fadeIn">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-emerald-400/20 rounded-full animate-pulse"></div>
        </div>
        <h3 className="text-xl font-light text-gray-100 mb-2">
          Obteniendo ubicación
        </h3>
        <p className="text-gray-400 text-center">
          Asegúrate de tener el GPS activado
        </p>
      </div>
    );
  }

  // Si la ubicación ya fue obtenida, muestra la interfaz para confirmarla
  return (
    <div className="flex flex-col px-6 py-8 animate-fadeIn">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-light text-gray-100 mb-2">
          Confirmar Ubicación
        </h2>
      </div>
      
      {/* Muestra un mapa simulado con la ubicación obtenida */}
      <div className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl 
                      relative overflow-hidden mb-6 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-blue-900/40">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              <div className="absolute -inset-2 border-2 border-red-400/50 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
        
        {/* Muestra la ubicación de latitud y longitud */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white 
                        px-3 py-2 rounded-lg text-sm font-mono">
          📍 {location?.lat.toFixed(6)}, {location?.lon.toFixed(6)}
        </div>
      </div>

      <p className="text-gray-400 text-center mb-8 leading-relaxed">
        La ubicación se obtuvo automáticamente
        <br />
        <span className="text-gray-300">¿Es correcta esta ubicación?</span>
      </p>

      {/* Botones para retroceder o confirmar la ubicación */}
      <div className="flex gap-3">
        <button
          onClick={onBack} // Llama a la función onBack para retroceder al paso anterior
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl 
                     text-gray-300 font-medium transition-all duration-200"
        >
          ← Volver
        </button>
        <button
          onClick={() => location && onLocationConfirm(location.lat, location.lon)} // Confirma la ubicación
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                     hover:from-emerald-500 hover:to-teal-500 rounded-xl 
                     text-white font-medium transition-all duration-200 shadow-lg"
        >
          ✓ Confirmar
        </button>
      </div>
    </div>
  );
};
