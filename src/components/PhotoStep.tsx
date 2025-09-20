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
<div className="flex flex-col p-4 h-full">
    <h2 className="text-2xl font-bold mb-6 text-center">Fotos y Observaciones</h2>

    <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Fotos ({photos.length})</h3>
        <button
        onClick={handleTakePhoto}
        className="px-4 py-2 bg-blue-600 rounded-lg text-white font-semibold"
        >
        📸 Tomar Foto
        </button>
    </div>

    <div className="grid grid-cols-3 gap-2 mb-4">
        {photos.map((photo, index) => (
        <div key={index} className="relative">
            <img
            src={photo}
            alt={`Foto ${index + 1}`}
            className="w-full h-24 object-cover rounded"
            />
            <button
            onClick={() => handleRemovePhoto(index)}
            className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-sm"
            >
            ×
            </button>
        </div>
        ))}
        {photos.length === 0 && (
        <div className="col-span-3 text-center py-8 text-gray-400">
            No hay fotos aún. Toma la primera foto!
        </div>
        )}
    </div>
    </div>

    <div className="mb-6 flex-1">
    <h3 className="text-lg font-semibold mb-2">Observaciones</h3>
    <textarea
        value={observations}
        onChange={(e) => {
        setObservations(e.target.value);
        onObservationsChange(e.target.value);
        }}
        placeholder="Escribe observaciones relevantes sobre el evento..."
        className="w-full h-32 p-3 bg-gray-800 border border-gray-600 rounded-lg text-white resize-none"
    />
    <p className="text-sm text-gray-400 mt-1">
        Opcional: Puedes usar dictado por voz en dispositivos compatibles
    </p>
    </div>

    <div className="flex gap-4 mt-auto">
    <button
        onClick={onBack}
        className="flex-1 py-3 bg-gray-600 rounded-lg text-white font-semibold"
    >
        ← Volver
    </button>
    <button
        onClick={onNext}
        className="flex-1 py-3 bg-green-600 rounded-lg text-white font-semibold"
    >
        Resumen →
    </button>
    </div>
</div>
);
}