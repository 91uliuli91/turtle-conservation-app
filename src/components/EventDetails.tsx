// src/components/EventDetails.tsx
//Este componente gestiona la entrada de detalles específicos según el tipo de evento (anidación, arqueo, intento), 
// mostrando campos interactivos como sliders, botones y checkboxes. Los detalles se guardan en el estado y se actualizan de forma reactiva.
'use client';

import { useState } from 'react';
import '../app/globals.css';

// Definición de las propiedades que se pasan al componente EventDetails
interface EventDetailsProps {
  eventType: string; // Tipo de evento (anidación, arqueo, intento)
  onDetailsChange: (details: any) => void; // Función para actualizar los detalles del evento en el formulario
  onBack: () => void; // Función para retroceder al paso anterior
  onNext: () => void; // Función para avanzar al siguiente paso
}

export default function EventDetails({ eventType, onDetailsChange, onBack, onNext }: EventDetailsProps) {
  // Estado local para almacenar los detalles del evento
  const [details, setDetails] = useState({
    numeroHuevos: 50, // Número de huevos (sólo para eventos de anidación)
    largoCaparazon: 50, // Largo del caparazón (para arqueo y anidación)
    anchoCaparazon: 50, // Ancho del caparazón (para arqueo y anidación)
    observaciones: '', // Observaciones adicionales
    seColocoMarca: false, // Checkbox para marca nueva (sólo para arqueo/anidación)
    seRemarco: false // Checkbox para remarcado (sólo para arqueo/anidación)
  });

  // Función para actualizar los detalles cuando el usuario cambia un campo
  const updateDetail = (field: string, value: any) => {
    const newDetails = { ...details, [field]: value }; // Crea una copia del estado con el campo actualizado
    setDetails(newDetails); // Actualiza el estado local
    onDetailsChange(newDetails); // Llama a la función para actualizar los detalles en el formulario principal
  };

  // Renderiza los campos específicos para el evento de "anidación"
  const renderAnidacionFields = () => (
    <div className="space-y-8">
      <div className="text-center">
        <label className="block text-lg font-light text-gray-300 mb-6">
          Número de Huevos
        </label>
        <div className="flex items-center justify-center gap-8">
          <button
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 rounded-full 
                    text-2xl font-light text-gray-300 transition-all duration-200
                    shadow-lg hover:shadow-xl pb-4"
            onClick={() => updateDetail('numeroHuevos', Math.max(0, details.numeroHuevos - 1))}
          >
            −
          </button>
          <div className="text-4xl font-light text-white w-20 text-center">
            {details.numeroHuevos}
          </div>
          <button
            className="w-14 h-14 bg-slate-800 hover:bg-slate-700 rounded-full 
                    text-2xl font-light text-gray-300 transition-all duration-200
                    shadow-lg hover:shadow-xl"
            onClick={() => updateDetail('numeroHuevos', details.numeroHuevos + 1)}
          >
            +
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="250"
          value={details.numeroHuevos}
          onChange={(e) => updateDetail('numeroHuevos', Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>
    </div>
  );

  // Renderiza los campos de medición del caparazón (tanto largo como ancho)
  const renderMedicionesFields = () => (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-light text-gray-300">
            Largo del caparazón
          </label>
          <span className="text-2xl font-light text-white">
            {details.largoCaparazon} cm
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="250"
          value={details.largoCaparazon}
          onChange={(e) => updateDetail('largoCaparazon', Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="text-lg font-light text-gray-300">
            Ancho del caparazón
          </label>
          <span className="text-2xl font-light text-white">
            {details.anchoCaparazon} cm
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="250"
          value={details.anchoCaparazon}
          onChange={(e) => updateDetail('anchoCaparazon', Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer slider-thumb"
        />
      </div>

      <div className="space-y-4">
        {/* Checkbox para "Se colocó marca nueva" */}
        <label className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl cursor-pointer
                        hover:bg-slate-800/70 transition-all duration-200">
          <input
            type="checkbox"
            checked={details.seColocoMarca}
            onChange={(e) => updateDetail('seColocoMarca', e.target.checked)}
            className="w-5 h-5 text-emerald-600 bg-slate-700 border-slate-600 
                    rounded focus:ring-emerald-500 focus:ring-2"
          />
          <span className="text-gray-300 font-light">Se colocó marca nueva</span>
        </label>
        
        {/* Checkbox para "Se remarcó" */}
        <label className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl cursor-pointer
                        hover:bg-slate-800/70 transition-all duration-200">
          <input
            type="checkbox"
            checked={details.seRemarco}
            onChange={(e) => updateDetail('seRemarco', e.target.checked)}
            className="w-5 h-5 text-emerald-600 bg-slate-700 border-slate-600 
                    rounded focus:ring-emerald-500 focus:ring-2"
          />
          <span className="text-gray-300 font-light">Se remarcó</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col px-6 py-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-gray-100 mb-2">
          Detalles del Evento
        </h2>
      </div>
      
      <div className="mb-8 flex-1">
        {/* Renderiza los campos dependiendo del tipo de evento */}
        {eventType === 'anidacion' && renderAnidacionFields()}
        {(eventType === 'arqueo' || eventType === 'anidacion') && renderMedicionesFields()}
        {eventType === 'intento' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏖️</div>
            <p className="text-gray-400 text-lg font-light">
              No se requieren detalles adicionales
              <br />para intentos de anidación
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {/* Botón para retroceder al paso anterior */}
        <button
          onClick={onBack}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 rounded-xl 
                    text-gray-300 font-medium transition-all duration-200"
        >
          ← Volver
        </button>
        {/* Botón para avanzar al siguiente paso */}
        <button
          onClick={onNext}
          className="flex-1 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 
                    hover:from-emerald-500 hover:to-teal-500 rounded-xl 
                    text-white font-medium transition-all duration-200 shadow-lg"
        >
          Siguiente →
        </button>
      </div>
    </div>
  );
};
