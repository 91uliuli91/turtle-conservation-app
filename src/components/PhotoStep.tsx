// src/components/PhotoStep.tsx
'use client';

import { useState } from 'react';

interface PhotoStepProps {
onPhotosChange: (photos: string[]) => void;
onObservationsChange: (observations: string) => void;
onBack: () => void;
onNext: () => void;
}

export default function PhotoStep({ onPhotosChange, onObservationsChange, onBack, onNext }: PhotoStepProps) {
const [photos, setPhotos] = useState<string[]>([]);
const [observations, setObservations] = useState('');

const handleTakePhoto = () => {
const newPhoto = `https://picsum.photos/200/300?random=${photos.length + 1}`;
const newPhotos = [...photos, newPhoto];
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
};

const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
    onPhotosChange(newPhotos);
};
return (
    <div className="flex flex-col px-6 py-8 h-full animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-gray-100 mb-2">
          Fotos y Observaciones
        </h2>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-light text-gray-300">
            Fotos ({photos.length})
          </h3>
          <button
            onClick={handleTakePhoto}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 
                       hover:from-blue-500 hover:to-purple-500 rounded-xl 
                       text-white font-medium transition-all duration-200 shadow-lg
                       flex items-center gap-2"
          >
            📸 Tomar Foto
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Foto ${index + 1}`}
                className="w-full h-32 object-cover rounded-xl"
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 
                           text-white rounded-full text-sm font-medium
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
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

      <div className="mb-8 flex-1">
        <h3 className="text-lg font-light text-gray-300 mb-4">Observaciones</h3>
        <textarea
          value={observations}
          onChange={(e) => {
            setObservations(e.target.value);
            onObservationsChange(e.target.value);
          }}
          placeholder="Escribe observaciones relevantes sobre el evento..."
          className="w-full h-32 p-4 bg-slate-800/50 border border-slate-700 
                     rounded-xl text-white placeholder-gray-500 resize-none
                     focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 
                     transition-all duration-200"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl 
                     text-gray-300 font-medium transition-all duration-200"
        >
          ← Volver
        </button>
        <button
          onClick={onNext}
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
