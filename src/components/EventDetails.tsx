// src/components/EventDetails.tsx
'use client';

import { useState } from 'react';

interface EventDetailsProps {
eventType: string;
onDetailsChange: (details: any) => void;
onBack: () => void;
onNext: () => void;
}

export default function EventDetails({ eventType, onDetailsChange, onBack, onNext }: EventDetailsProps) {
const [details, setDetails] = useState({
numeroHuevos: 0,
largoCaparazon: 50,
anchoCaparazon: 40,
observaciones: '',
seColocoMarca: false,
seRemarco: false
});

const updateDetail = (field: string, value: any) => {
const newDetails = { ...details, [field]: value };
setDetails(newDetails);
onDetailsChange(newDetails);
};

const renderAnidacionFields = () => (
<div className="space-y-6">
    <div>
    <label className="block text-lg font-semibold mb-2">Número de Huevos</label>
    <div className="flex items-center justify-center gap-6">
        <button 
        className="w-12 h-12 bg-gray-700 rounded-full text-2xl font-bold"
        onClick={() => updateDetail('numeroHuevos', Math.max(0, details.numeroHuevos - 1))}
        >
        -
        </button>
        <span className="text-3xl font-bold w-16 text-center">{details.numeroHuevos}</span>
        <button 
        className="w-12 h-12 bg-gray-700 rounded-full text-2xl font-bold"
        onClick={() => updateDetail('numeroHuevos', details.numeroHuevos + 1)}
        >
        +
        </button>
    </div>
    </div>
</div>
);

const renderMedicionesFields = () => (
<div className="space-y-6">
    <div>
    <label className="block text-lg font-semibold mb-2">
        Largo del caparazón: {details.largoCaparazon} cm
    </label>
    <input
        type="range"
        min="20"
        max="200"
        value={details.largoCaparazon}
        onChange={(e) => updateDetail('largoCaparazon', Number(e.target.value))}
        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
    />
    </div>

    <div>
    <label className="block text-lg font-semibold mb-2">
        Ancho del caparazón: {details.anchoCaparazon} cm
    </label>
    <input
        type="range"
        min="15"
        max="150"
        value={details.anchoCaparazon}
        onChange={(e) => updateDetail('anchoCaparazon', Number(e.target.value))}
        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer"
    />
    </div>

    <div className="space-y-3">
    <label className="flex items-center gap-3">
        <input
        type="checkbox"
        checked={details.seColocoMarca}
        onChange={(e) => updateDetail('seColocoMarca', e.target.checked)}
        className="w-5 h-5"
        />
        Se colocó marca nueva
    </label>
    <label className="flex items-center gap-3">
        <input
        type="checkbox"
        checked={details.seRemarco}
        onChange={(e) => updateDetail('seRemarco', e.target.checked)}
        className="w-5 h-5"
        />
        Se remarcó
    </label>
    </div>
</div>
);

const renderIntentoFields = () => (
<div className="text-center py-8">
    <p className="text-gray-400 text-lg">
    No se requieren detalles adicionales para intentos de anidación.
    </p>
</div>
);

return (
<div className="flex flex-col p-4">
    <h2 className="text-2xl font-bold mb-6 text-center">Detalles del Evento</h2>
    
    <div className="mb-8">
    {eventType === 'anidacion' && renderAnidacionFields()}
    {(eventType === 'arqueo' || eventType === 'anidacion') && renderMedicionesFields()}
    {eventType === 'intento' && renderIntentoFields()}
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
        Siguiente →
    </button>
    </div>
</div>
);
}