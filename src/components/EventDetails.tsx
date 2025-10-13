// src/components/EventDetails.tsx - VERSIÓN MODIFICADA
'use client';

import { useState } from 'react';
import '../app/globals.css';

interface EventDetailsProps {
  eventType: string;
  onDetailsChange: (details: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function EventDetails({ eventType, onDetailsChange, onBack, onNext }: EventDetailsProps) {
  const [details, setDetails] = useState({
    // NUEVO CAMPO: Controla si hay tortuga en el lugar
    hayTortuga: false,
    
    numeroHuevos: 50,
    largoCaparazon: 50,
    anchoCaparazon: 50,
    observaciones: '',
    seColocoMarca: false,
    seRemarco: false,
    
    // Campos para la API
    campamento_id: undefined as number | undefined,
    zona_playa: undefined as 'A' | 'B' | 'C' | undefined,
    estacion_baliza: '',
    tortuga_id: undefined as number | undefined
  });

  const updateDetail = (field: string, value: any) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onDetailsChange(newDetails);
  };

  // Componente para la pregunta sobre la tortuga
  const renderPreguntaTortuga = () => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        ¿Se encontró la tortuga en el lugar?
      </h3>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => updateDetail('hayTortuga', true)}
          className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 border-2 ${
            details.hayTortuga 
              ? 'bg-success/20 text-success border-success/50 shadow-lg scale-105' 
              : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              details.hayTortuga ? 'bg-success border-success' : 'border-muted-foreground'
            }`}>
              {details.hayTortuga && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>Sí, hay tortuga</span>
          </div>
        </button>

        <button
          onClick={() => updateDetail('hayTortuga', false)}
          className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 border-2 ${
            !details.hayTortuga 
              ? 'bg-destructive/20 text-destructive border-destructive/50 shadow-lg scale-105' 
              : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              !details.hayTortuga ? 'bg-destructive border-destructive' : 'border-muted-foreground'
            }`}>
              {!details.hayTortuga && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span>No hay tortuga</span>
          </div>
        </button>
      </div>
    </div>
  );

  const renderCamposAdicionales = () => (
    <div className="space-y-4 mt-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Campamento
        </label>
        <select 
          value={details.campamento_id || ''}
          onChange={(e) => updateDetail('campamento_id', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
        >
          <option value="">Seleccionar campamento</option>
          <option value="1">Campamento Norte</option>
          <option value="2">Campamento Sur</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Zona de Playa
        </label>
        <select 
          value={details.zona_playa || ''}
          onChange={(e) => updateDetail('zona_playa', e.target.value as 'A' | 'B' | 'C' | undefined)}
          className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
        >
          <option value="">Seleccionar zona</option>
          <option value="A">Zona A</option>
          <option value="B">Zona B</option>
          <option value="C">Zona C</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Estación/Baliza
        </label>
        <input
          type="text"
          value={details.estacion_baliza}
          onChange={(e) => updateDetail('estacion_baliza', e.target.value)}
          placeholder="Ej: EST-001"
          className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
        />
      </div>
    </div>
  );

  const renderAnidacionFields = () => (
    <div className="space-y-8">
      {/* Pregunta sobre tortuga para anidación */}
      {renderPreguntaTortuga()}

      {/* Campos de mediciones SOLO si hay tortuga */}
      {details.hayTortuga && (
        <div className="space-y-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <h4 className="text-lg font-semibold text-foreground text-center mb-4">
            Mediciones de la Tortuga
          </h4>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Largo del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.largoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.largoCaparazon}
              onChange={(e) => updateDetail('largoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Ancho del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.anchoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.anchoCaparazon}
              onChange={(e) => updateDetail('anchoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seColocoMarca}
                onChange={(e) => updateDetail('seColocoMarca', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se colocó marca nueva</span>
            </label>
            
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seRemarco}
                onChange={(e) => updateDetail('seRemarco', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se remarcó</span>
            </label>
          </div>
        </div>
      )}

      {/* Número de huevos (siempre visible para anidación) */}
      <div className="text-center bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
        <label className="block text-lg font-light text-foreground mb-6">
          Número de Huevos
        </label>
        <div className="flex items-center justify-center gap-8">
          <button
            className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full 
                    text-2xl font-light text-foreground transition-all duration-200
                    shadow-lg hover:shadow-xl pb-4 border border-border"
            onClick={() => updateDetail('numeroHuevos', Math.max(0, details.numeroHuevos - 1))}
          >
            −
          </button>
          <div className="text-4xl font-light text-foreground w-20 text-center">
            {details.numeroHuevos}
          </div>
          <button
            className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full 
                    text-2xl font-light text-foreground transition-all duration-200
                    shadow-lg hover:shadow-xl border border-border"
            onClick={() => updateDetail('numeroHuevos', details.numeroHuevos + 1)}
          >
            +
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="300"
          value={details.numeroHuevos}
          onChange={(e) => updateDetail('numeroHuevos', Number(e.target.value))}
          className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb mt-4"
        />
      </div>

      {renderCamposAdicionales()}
    </div>
  );

  const renderArqueoFields = () => (
    <div className="space-y-8">
      {/* Pregunta sobre tortuga para arqueo */}
      {renderPreguntaTortuga()}

      {/* Campos de mediciones SOLO si hay tortuga */}
      {details.hayTortuga && (
        <div className="space-y-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <h4 className="text-lg font-semibold text-foreground text-center mb-4">
            Mediciones de la Tortuga
          </h4>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Largo del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.largoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.largoCaparazon}
              onChange={(e) => updateDetail('largoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Ancho del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.anchoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.anchoCaparazon}
              onChange={(e) => updateDetail('anchoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seColocoMarca}
                onChange={(e) => updateDetail('seColocoMarca', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se colocó marca nueva</span>
            </label>
            
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seRemarco}
                onChange={(e) => updateDetail('seRemarco', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se remarcó</span>
            </label>
          </div>
        </div>
      )}

      {renderCamposAdicionales()}
    </div>
  );

  const renderIntentoFields = () => (
    <div className="space-y-8">
      {/* Pregunta sobre tortuga para intento */}
      {renderPreguntaTortuga()}

      {/* Campos de mediciones SOLO si hay tortuga */}
      {details.hayTortuga && (
        <div className="space-y-6 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
          <h4 className="text-lg font-semibold text-foreground text-center mb-4">
            Mediciones de la Tortuga
          </h4>
          
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Largo del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.largoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.largoCaparazon}
              onChange={(e) => updateDetail('largoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                Ancho del caparazón
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.anchoCaparazon} cm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.anchoCaparazon}
              onChange={(e) => updateDetail('anchoCaparazon', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seColocoMarca}
                onChange={(e) => updateDetail('seColocoMarca', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se colocó marca nueva</span>
            </label>
            
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.seRemarco}
                onChange={(e) => updateDetail('seRemarco', e.target.checked)}
                className="w-5 h-5 text-primary bg-muted border-border 
                        rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-foreground font-light">Se remarcó</span>
            </label>
          </div>
        </div>
      )}

      {renderCamposAdicionales()}
    </div>
  );

  return (
    <div className="flex flex-col px-6 py-8 animate-fadeIn bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-foreground mb-2">
          Detalles del Evento
        </h2>
      </div>
      
      <div className="mb-8 flex-1">
        {eventType === 'anidacion' && renderAnidacionFields()}
        {eventType === 'arqueo' && renderArqueoFields()}
        {eventType === 'intento' && renderIntentoFields()}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 px-6 py-4 bg-muted/50 border border-border rounded-2xl text-foreground hover:bg-muted hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 gradient-purple-blue text-white font-semibold 
                  rounded-2xl transition-all duration-300 hover:scale-105 
                  hover:shadow-2xl hover:shadow-primary/25
                  flex items-center justify-center gap-2"
        >
          Continuar 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};