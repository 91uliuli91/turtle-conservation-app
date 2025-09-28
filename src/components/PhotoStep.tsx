// src/components/PhotoStep.tsx
//Este componente gestiona tanto la captura de fotos como las observaciones de un evento y permite la navegación entre pasos del formulario. 
'use client';

import { useState } from 'react';

// Definición de las propiedades que se pasan al componente PhotoStep
interface PhotoStepProps {
  onPhotosChange: (photos: string[]) => void; // Función que se llama para actualizar las fotos en el paso anterior
  onObservationsChange: (observations: string) => void; // Función que se llama para actualizar las observaciones
  onBack: () => void; // Función para retroceder al paso anterior
  onNext: () => void; // Función para avanzar al siguiente paso
}

export default function PhotoStep({ onPhotosChange, onObservationsChange, onBack, onNext }: PhotoStepProps) {
  // Estado local para almacenar las fotos y observaciones
  const [photos, setPhotos] = useState<string[]>([]); // Array que guarda las URLs de las fotos
  const [observations, setObservations] = useState(''); // Texto que guarda las observaciones del evento

  // Función que se llama cuando se toma una nueva foto
  const handleTakePhoto = () => {
    // Genera una URL aleatoria de una foto (en este caso, usando picsum.photos)
    const newPhoto = `https://picsum.photos/200/300?random=${photos.length + 1}`;
    const newPhotos = [...photos, newPhoto]; // Se añade la nueva foto al array
    setPhotos(newPhotos); // Actualiza el estado de las fotos
    onPhotosChange(newPhotos); // Llama a la función proporcionada para actualizar las fotos en el formulario
  };

  // Función para eliminar una foto
  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index); // Filtra la foto que se quiere eliminar
    setPhotos(newPhotos); // Actualiza el estado con las fotos restantes
    onPhotosChange(newPhotos); // Actualiza las fotos en el formulario
  };

  return (
    <div className="flex flex-col px-6 py-8 h-full animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-gray-100 mb-2">
          Fotos y Observaciones
        </h2>
      </div>

      {/* Sección para tomar fotos */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-light text-gray-300">
            Fotos ({photos.length})
          </h3>
          <button
            onClick={handleTakePhoto} // Llama a handleTakePhoto cuando el usuario hace clic
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 rounded-xl 
                       text-white font-medium transition-all duration-200 shadow-lg
                       flex items-center gap-2"
          >
            📸 Tomar Foto
          </button>
        </div>

        {/* Sección para mostrar las fotos tomadas */}
        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo} // Muestra la foto
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-xl"
              />
              <button
                onClick={() => handleRemovePhoto(index)} // Elimina la foto correspondiente
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 
                           text-white rounded-full text-sm font-medium
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Mensaje cuando no se han tomado fotos */}
        {photos.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-700 rounded-xl">
            <div className="text-4xl mb-4">📸</div>
            <p className="text-gray-400 font-light">
              No hay fotos aún
              <br />
              <span className="text-gray-500">Toma la primera foto</span>
            </p>
          </div>
        )}
      </div>

      {/* Sección para escribir observaciones */}
      <div className="mb-8 flex-1">
        <h3 className="text-lg font-light text-gray-300 mb-4">Observaciones</h3>
        <textarea
          value={observations} // Muestra las observaciones ingresadas
          onChange={(e) => {
            setObservations(e.target.value); // Actualiza el estado local de observaciones
            onObservationsChange(e.target.value); // Llama a la función para actualizar las observaciones en el formulario
          }}
          placeholder="Escribe observaciones relevantes sobre el evento..."
          className="w-full h-32 p-4 bg-slate-800/50 border border-slate-700 
                     rounded-xl text-white placeholder-gray-500 resize-none
                     focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                     transition-all duration-200"
        />
      </div>

      {/* Botones de navegación */}
      <div className="flex gap-3">
        <button
          onClick={onBack} // Llama a la función onBack para retroceder al paso anterior
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl 
                     text-gray-300 font-medium transition-all duration-200"
        >
          ← Volver
        </button>
        <button
          onClick={onNext} // Llama a la función onNext para avanzar al siguiente paso
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                     hover:from-emerald-500 hover:to-teal-500 rounded-xl 
                     text-white font-medium transition-all duration-200 shadow-lg"
        >
          Resumen →
        </button>
      </div>
    </div>
  );
};
