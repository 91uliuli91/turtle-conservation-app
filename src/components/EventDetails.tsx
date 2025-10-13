// src/components/EventDetails.tsx - VERSIÓN CORREGIDA
'use client';

import { useState, useEffect } from 'react';
import '../app/globals.css';

interface EventDetailsProps {
  eventType: string;
  onDetailsChange: (details: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function EventDetails({ eventType, onDetailsChange, onBack, onNext }: EventDetailsProps) {
  // Para "intento", automáticamente hayTortuga = false
  const [details, setDetails] = useState({
    // INFORMACIÓN BÁSICA DE UBICACIÓN
    zona_playa: undefined as 'A' | 'B' | 'C' | undefined,
    campamento_id: undefined as number | undefined,
    estacion_baliza: '',
    
    // AVISTAMIENTO DE TORTUGA (para intento, siempre es false)
    hayTortuga: eventType === 'intento' ? false : undefined as boolean | undefined,
    especie: '' as 'ei' | 'cm' | 'cc' | undefined,
    seObservo: false,
    
    // MEDICIONES DE TORTUGA (solo si hay tortuga)
    lscc: 50,
    acc: 50,
    
    // MARCAS Y RECAPTURAS (solo si hay tortuga)
    marcaPalaceIzq: '',
    marcaPalaceDer: '',
    recapturaPalace: false,
    numeroSerieRecaptura: '',
    marcaExternaIzq: '',
    marcaExternaDer: '',
    
    // PROCESO DE RECOLECCIÓN (solo para anidación)
    horaRecolecta: '',
    tamanoNidada: 50,
    procedenciaHuevos: '' as 'nido_original' | 'traslado' | 'rescate' | undefined,
    
    // ESTADO DEL NIDO (solo para anidación)
    nidoEnPeligro: false,
    motivoTraslado: '' as 'inundacion' | 'depredacion' | 'erosion' | 'otro' | undefined,
  });

  // Efecto para calcular hora actual por defecto
  useEffect(() => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    if (!details.horaRecolecta && eventType === 'anidacion') {
      updateDetail('horaRecolecta', timeString);
    }
  }, []);

  const updateDetail = (field: string, value: any) => {
    const newDetails = { ...details, [field]: value };
    setDetails(newDetails);
    onDetailsChange(newDetails);
  };

  // Componente para la pregunta sobre la tortuga (NO se muestra para intento)
  const renderPreguntaTortuga = () => (
    eventType !== 'intento' && (
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
              details.hayTortuga === false
                ? 'bg-destructive/20 text-destructive border-destructive/50 shadow-lg scale-105' 
                : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                details.hayTortuga === false ? 'bg-destructive border-destructive' : 'border-muted-foreground'
              }`}>
                {details.hayTortuga === false && (
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
    )
  );

  // Información de especies y zonas
  const renderInformacionEspecieZona = () => (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Zona de Playa *
          </label>
          <select 
            value={details.zona_playa || ''}
            onChange={(e) => updateDetail('zona_playa', e.target.value as 'A' | 'B' | 'C' | undefined)}
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            required
          >
            <option value="">Seleccionar zona</option>
            <option value="A">Zona A</option>
            <option value="B">Zona B</option>
            <option value="C">Zona C</option>
          </select>
        </div>

        {/* Especie solo se muestra si HAY tortuga o es INTENTO (para identificar rastro) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Especie {eventType === 'intento' ? '(del rastro)' : ''}
          </label>
          <select 
            value={details.especie || ''}
            onChange={(e) => updateDetail('especie', e.target.value as 'ei' | 'cm' | 'cc' | undefined)}
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
          >
            <option value="">Seleccionar especie</option>
            <option value="ei">Eretmochelys imbricata (Carey)</option>
            <option value="cm">Chelonia mydas (Verde)</option>
            <option value="cc">Caretta caretta (Caguama)</option>
          </select>
          {eventType === 'intento' && (
            <p className="text-xs text-muted-foreground mt-1">Especie identificada por el rastro</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <option value="3">Campamento Este</option>
            <option value="4">Campamento Oeste</option>
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
            placeholder="Ej: EST-001, BAL-025"
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
          />
        </div>
      </div>
    </div>
  );

  // Mediciones de tortuga (solo si HAY tortuga, NO para intento)
  const renderMedicionesTortuga = () => (
    details.hayTortuga && eventType !== 'intento' && (
      <div className="space-y-6 mb-8 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 border border-emerald-500/20">
        <h4 className="text-lg font-semibold text-foreground text-center mb-4">
          Mediciones de la Tortuga
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                LSCC (Largo caparazón)
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.lscc} cm
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="150"
              value={details.lscc}
              onChange={(e) => updateDetail('lscc', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>20 cm</span>
              <span>150 cm</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                ACC (Ancho caparazón)
              </label>
              <span className="text-2xl font-light text-foreground">
                {details.acc} cm
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="120"
              value={details.acc}
              onChange={(e) => updateDetail('acc', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>20 cm</span>
              <span>120 cm</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                          hover:bg-muted/50 transition-all duration-200">
            <input
              type="checkbox"
              checked={details.seObservo}
              onChange={(e) => updateDetail('seObservo', e.target.checked)}
              className="w-5 h-5 text-primary bg-muted border-border 
                      rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-foreground font-light">Se observó comportamiento de anidación</span>
          </label>
        </div>
      </div>
    )
  );

  // Marcas y recapturas (solo si HAY tortuga, NO para intento)
  const renderMarcasRecapturas = () => (
    details.hayTortuga && eventType !== 'intento' && (
      <div className="space-y-6 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
        <h4 className="text-lg font-semibold text-foreground text-center mb-4">
          Marcas y Recapturas
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Marca Palace - Aleta Izquierda
            </label>
            <input
              type="text"
              value={details.marcaPalaceIzq}
              onChange={(e) => updateDetail('marcaPalaceIzq', e.target.value)}
              placeholder="Ej: P-1234"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Marca Palace - Aleta Derecha
            </label>
            <input
              type="text"
              value={details.marcaPalaceDer}
              onChange={(e) => updateDetail('marcaPalaceDer', e.target.value)}
              placeholder="Ej: P-1235"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                          hover:bg-muted/50 transition-all duration-200">
            <input
              type="checkbox"
              checked={details.recapturaPalace}
              onChange={(e) => updateDetail('recapturaPalace', e.target.checked)}
              className="w-5 h-5 text-primary bg-muted border-border 
                      rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-foreground font-light">Es una recaptura Palace</span>
          </label>
        </div>

        {details.recapturaPalace && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Número de Serie Recaptura
            </label>
            <input
              type="text"
              value={details.numeroSerieRecaptura}
              onChange={(e) => updateDetail('numeroSerieRecaptura', e.target.value)}
              placeholder="Ej: REC-2024-001"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Marca Externa - Aleta Izquierda
            </label>
            <input
              type="text"
              value={details.marcaExternaIzq}
              onChange={(e) => updateDetail('marcaExternaIzq', e.target.value)}
              placeholder="Ej: EXT-A1"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Marca Externa - Aleta Derecha
            </label>
            <input
              type="text"
              value={details.marcaExternaDer}
              onChange={(e) => updateDetail('marcaExternaDer', e.target.value)}
              placeholder="Ej: EXT-B2"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            />
          </div>
        </div>
      </div>
    )
  );

  // Información de recolección (solo para anidación)
  const renderRecoleccionHuevos = () => (
    eventType === 'anidacion' && (
      <div className="space-y-6 mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
        <h4 className="text-lg font-semibold text-foreground text-center mb-4">
          Recolección de Huevos
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Hora de Recolección *
            </label>
            <input
              type="time"
              value={details.horaRecolecta}
              onChange={(e) => updateDetail('horaRecolecta', e.target.value)}
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Procedencia de Huevos
            </label>
            <select 
              value={details.procedenciaHuevos || ''}
              onChange={(e) => updateDetail('procedenciaHuevos', e.target.value as 'nido_original' | 'traslado' | 'rescate' | undefined)}
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            >
              <option value="">Seleccionar procedencia</option>
              <option value="nido_original">Nido original en playa</option>
              <option value="traslado">Traslado por peligro</option>
              <option value="rescate">Rescate de nido erosionado</option>
            </select>
          </div>
        </div>

        <div className="text-center">
          <label className="block text-lg font-light text-foreground mb-6">
            Tamaño de Nidada
          </label>
          <div className="flex items-center justify-center gap-8">
            <button
              className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full 
                      text-2xl font-light text-foreground transition-all duration-200
                      shadow-lg hover:shadow-xl pb-4 border border-border"
              onClick={() => updateDetail('tamanoNidada', Math.max(0, details.tamanoNidada - 1))}
            >
              −
            </button>
            <div className="text-4xl font-light text-foreground w-20 text-center">
              {details.tamanoNidada}
            </div>
            <button
              className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full 
                      text-2xl font-light text-foreground transition-all duration-200
                      shadow-lg hover:shadow-xl border border-border"
              onClick={() => updateDetail('tamanoNidada', details.tamanoNidada + 1)}
            >
              +
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="250"
            value={details.tamanoNidada}
            onChange={(e) => updateDetail('tamanoNidada', Number(e.target.value))}
            className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider-thumb mt-4"
          />
        </div>

        {/* Información adicional para traslados */}
        {details.procedenciaHuevos === 'traslado' && (
          <div className="space-y-4 mt-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
            <label className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl cursor-pointer
                            hover:bg-muted/50 transition-all duration-200">
              <input
                type="checkbox"
                checked={details.nidoEnPeligro}
                onChange={(e) => updateDetail('nidoEnPeligro', e.target.checked)}
                className="w-5 h-5 text-orange-500 bg-muted border-border 
                        rounded focus:ring-orange-500 focus:ring-2"
              />
              <span className="text-foreground font-light">Nido en situación de peligro</span>
            </label>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Motivo de Traslado
              </label>
              <select 
                value={details.motivoTraslado || ''}
                onChange={(e) => updateDetail('motivoTraslado', e.target.value as 'inundacion' | 'depredacion' | 'erosion' | 'otro' | undefined)}
                className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-200 outline-none"
              >
                <option value="">Seleccionar motivo</option>
                <option value="inundacion">Riesgo de inundación</option>
                <option value="depredacion">Amenaza de depredación</option>
                <option value="erosion">Erosión de playa</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>
          </div>
        )}
      </div>
    )
  );

  // Render principal condicional por tipo de evento
  const renderPorTipoEvento = () => {
    switch (eventType) {
      case 'anidacion':
        return (
          <>
            {renderPreguntaTortuga()}
            {renderInformacionEspecieZona()}
            {renderMedicionesTortuga()}
            {renderMarcasRecapturas()}
            {renderRecoleccionHuevos()}
          </>
        );
      
      case 'arqueo':
        return (
          <>
            {renderPreguntaTortuga()}
            {renderInformacionEspecieZona()}
            {renderMedicionesTortuga()}
            {renderMarcasRecapturas()}
          </>
        );
      
      case 'intento':
        return (
          <>
            {/* Para intento: NO pregunta sobre tortuga, pero SÍ pide especie del rastro */}
            <div className="mb-8 text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Registro de Intento</h3>
              <p className="text-muted-foreground">
                Se registra evidencia de intento de anidación sin tortuga presente
              </p>
            </div>
            {renderInformacionEspecieZona()}
            {/* NO se muestran mediciones ni marcas para intento */}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col animate-fadeIn bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light text-foreground mb-2">
          Detalles del Evento - {eventType === 'anidacion' ? 'Anidación' : eventType === 'arqueo' ? 'Arqueo' : 'Intento'}
        </h2>
        <p className="text-muted-foreground">
          {eventType === 'intento' 
            ? 'Registro de evidencia de intento de anidación' 
            : 'Complete la información específica del evento'}
        </p>
      </div>
      
      <div className="mb-8 flex-1 space-y-6">
        {renderPorTipoEvento()}
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