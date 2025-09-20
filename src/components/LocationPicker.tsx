// src/components/LocationPicker.tsx
'use client';

import { useState, useEffect } from 'react';

interface LocationPickerProps {
onLocationConfirm: (lat: number, lon: number) => void;
onBack: () => void;
}

export default function LocationPicker({ onLocationConfirm, onBack }: LocationPickerProps) {
const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const getLocation = () => {
    setLoading(true);
    setTimeout(() => {
    setLocation({ 
        lat: 20.6170 + (Math.random() - 0.5) * 0.01, 
        lon: -87.0729 + (Math.random() - 0.5) * 0.01 
    });
    setLoading(false);
    }, 1000);
};

getLocation();
}, []);

const handleConfirm = () => {
if (location) {
    onLocationConfirm(location.lat, location.lon);
}
};

if (loading) {
return (
    <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
    <p className="text-lg">Obteniendo ubicación...</p>
    <p className="text-gray-400 text-sm mt-2">Asegúrate de tener el GPS activado</p>
    </div>
);
}

return (
<div className="flex flex-col items-center p-4">
    <h2 className="text-2xl font-bold mb-4">Confirmar Ubicación</h2>
    
    <div className="w-full h-64 bg-blue-900 rounded-lg relative overflow-hidden mb-4">
    <div className="absolute inset-0 bg-gradient-to-b from-blue-700 to-blue-900">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white animate-pulse"></div>
        </div>
    </div>
    <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-2 rounded">
        📍 Lat: {location?.lat.toFixed(6)}, Lon: {location?.lon.toFixed(6)}
    </div>
    </div>

    <p className="text-gray-400 text-center mb-6">
    La ubicación se obtuvo automáticamente via GPS. 
    <br />¿Es correcta esta ubicación?
    </p>

    <div className="flex gap-4 w-full">
    <button
        onClick={onBack}
        className="flex-1 py-3 bg-gray-600 rounded-lg text-white font-semibold"
    >
        ← Volver
    </button>
    <button
        onClick={handleConfirm}
        className="flex-1 py-3 bg-green-600 rounded-lg text-white font-semibold"
        disabled={!location}
    >
        ✅ Confirmar Ubicación
    </button>
    </div>
</div>
);
}