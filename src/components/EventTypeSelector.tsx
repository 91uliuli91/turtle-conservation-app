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
      description: 'Registro de tortuga avistada',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'intento',
      name: 'Intento',
      icon: '🏖️', 
      description: 'Intento de anidación',
      gradient: 'from-amber-600 to-orange-600'
    },
    {
      id: 'anidacion',
      name: 'Anidación',
      icon: '🥚',
      description: 'Nido con huevos',
      gradient: 'from-blue-600 to-indigo-600'
    }
  ];

  return (
    <div className="flex flex-col items-center px-6 py-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-light text-gray-100 mb-3">
          Nuevo Registro
        </h2>
        <p className="text-gray-400 text-lg">
          ¿Qué tipo de evento registras?
        </p>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        {eventTypes.map((event) => (
          <button
            key={event.id}
            onClick={() => onSelect(event.id)}
            className={`group w-full p-6 bg-gradient-to-r ${event.gradient} rounded-2xl 
                       shadow-lg hover:shadow-xl transform hover:scale-105 
                       transition-all duration-300 ease-out`}
          >
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{event.icon}</div>
              <div className="text-left flex-1">
                <div className="text-xl font-semibold text-white mb-1">
                  {event.name}
                </div>
                <div className="text-white/80 text-sm">
                  {event.description}
                </div>
              </div>
              <div className="text-white/60 group-hover:text-white transition-colors">
                →
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};