// src/components/EventTypeSelector.tsx
'use client';

interface EventTypeSelectorProps {
onSelect: (type: string) => void;
}

export default function EventTypeSelector({ onSelect }: EventTypeSelectorProps) {
const eventTypes = [
{
    id: 'arqueo',
    name: 'Arqueo',
    icon: '🐢',
    description: 'Registro de tortuga avistada'
},
{
    id: 'intento',
    name: 'Intento',
    icon: '🏖️',
    description: 'Intento de anidación'
},
{
    id: 'anidacion',
    name: 'Anidación',
    icon: '🥚',
    description: 'Nido con huevos'
}
];

return (
<div className="flex flex-col items-center p-4">
    <h2 className="text-2xl font-bold mb-8">¿Qué tipo de evento registras?</h2>
    
    <div className="space-y-4 w-full">
    {eventTypes.map((event) => (
        <button
        key={event.id}
        onClick={() => onSelect(event.id)}
        className="w-full p-6 bg-gray-800 rounded-xl border-2 border-gray-600 hover:border-green-500 
                    hover:bg-gray-700 transition-all duration-200 flex flex-col items-center"
        >
        <span className="text-4xl mb-2">{event.icon}</span>
        <span className="text-xl font-semibold mb-1">{event.name}</span>
        <span className="text-gray-400 text-sm">{event.description}</span>
        </button>
    ))}
    </div>

    <p className="mt-8 text-gray-400 text-center">
    Selecciona el tipo de evento para continuar
    </p>
</div>
);
}