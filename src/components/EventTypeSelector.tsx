// src/components/EventTypeSelector.tsx

//Este componente permite seleccionar uno de los tres tipos de eventos (Arqueo, Intento, Anidación), 
// mostrando un diseño interactivo y visualmente atractivo, con un icono y descripción de cada tipo de evento.
'use client';

interface EventTypeSelectorProps {
  onSelect: (type: string) => void; // Función que se llama cuando el usuario selecciona un tipo de evento
}

export default function EventTypeSelector({ onSelect }: EventTypeSelectorProps) {
  // Definimos los tipos de eventos disponibles con sus propiedades (id, nombre, icono, descripción y gradiente de fondo)
  const eventTypes = [
    {
      id: 'arqueo', // ID único para cada tipo de evento
      name: 'Arqueo', // Nombre del evento
      icon: '🐢', // Icono representativo del evento
      description: 'Registro de tortuga avistada', // Descripción breve del evento
      gradient: 'from-emerald-600 to-teal-600' // Gradiente de color de fondo del botón
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
        {/* Título de la sección */}
        <h2 className="text-3xl font-light text-gray-100 mb-3">
          Nuevo Registro
        </h2>
        <p className="text-gray-400 text-lg">
          ¿Qué tipo de evento registras?
        </p>
      </div>
      
      {/* Muestra los botones de selección de tipo de evento */}
      <div className="space-y-4 w-full max-w-sm">
        {eventTypes.map((event) => (
          <button
            key={event.id} // Usamos el ID del evento como clave para React
            onClick={() => onSelect(event.id)} // Llama a la función onSelect con el ID del evento
            className={`group w-full p-6 bg-gradient-to-r ${event.gradient} rounded-2xl 
                       shadow-lg hover:shadow-xl transform hover:scale-105 
                       transition-all duration-300 ease-out`} // Estilos para el botón
          >
            <div className="flex items-center space-x-4">
              {/* Icono del evento */}
              <div className="text-4xl">{event.icon}</div>
              
              <div className="text-left flex-1">
                {/* Nombre del evento */}
                <div className="text-xl font-semibold text-white mb-1">
                  {event.name}
                </div>
                {/* Descripción del evento */}
                <div className="text-white/80 text-sm">
                  {event.description}
                </div>
              </div>

              {/* Flecha de dirección que cambia de color cuando se pasa el mouse */}
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
