// src/components/EventDetails.tsx - VERSIÓN ACTUALIZADA CON CAMBIOS SOLICITADOS
'use client';

import { useState, useEffect } from 'react';

interface EventDetailsProps {
  eventType: string;
  onDetailsChange: (details: any) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function EventDetails({ eventType, onDetailsChange, onBack, onNext }: EventDetailsProps) {
  const [details, setDetails] = useState({
    // 🆕 ZONAS en lugar de campamentos
    zona_playa: undefined as 'Norte' | 'Centro' | 'Sur' | undefined,
    
    // 🆕 Estación baliza (solo números)
    estacion_baliza: '',
    
    // Tortuga
    hayTortuga: eventType === 'intento' ? false : undefined as boolean | undefined,
    especie: '' as 'ei' | 'cm' | 'cc' | undefined,
    
    // 🆕 Cicatriz (indica si tuvo marca alguna vez)
    tieneCicatriz: undefined as boolean | undefined,
    
    // Mediciones
    lscc: 50,
    acc: 50,
    
    // 🆕 MARCAJE Y RECAPTURA EXCLUYENTES
    tipoMarcaje: undefined as 'marcaje' | 'recaptura' | undefined,
    
    // Marcaje Palace (solo si tipoMarcaje === 'marcaje')
    marcaPalaceIzq: '',
    marcaPalaceDer: '',
    
    // Recaptura (solo si tipoMarcaje === 'recaptura')
    ladoRecaptura: undefined as 'izquierda' | 'derecha' | undefined,
    numeroSerieRecaptura: '',
    
    // Marcas Externas
    marcaExternaIzq: '',
    marcaExternaDer: '',
    
    // Anidación
    horaRecolecta: '',
    tamanoNidada: 50,
    
    // 🆕 CLAVE DE NIDO
    claveNido: '' as 'camastros' | 'vegetacion' | 'otro' | undefined,
    claveNidoOtro: '',
    
    procedenciaHuevos: '' as 'nido_original' | 'traslado' | 'rescate' | undefined,
    nidoEnPeligro: false,
    motivoTraslado: '' as 'inundacion' | 'depredacion' | 'erosion' | 'otro' | undefined,
    
    // 🆕 QUIÉN TOMA LA FOTO
    fotografo: '',
  });

  useEffect(() => {
    const now = new Date();
    const timeString = now.toTimeString().slice(0, 5);
    if (!details.horaRecolecta && eventType === 'anidacion') {
      updateDetail('horaRecolecta', timeString);
    }
  }, []);

  const updateDetail = (field: string, value: any) => {
    const newDetails = { ...details, [field]: value };
    
    // 🔒 LÓGICA EXCLUYENTE: Marcaje vs Recaptura
    if (field === 'tipoMarcaje') {
      if (value === 'marcaje') {
        // Limpiar campos de recaptura
        newDetails.ladoRecaptura = undefined;
        newDetails.numeroSerieRecaptura = '';
      } else if (value === 'recaptura') {
        // Limpiar campos de marcaje
        newDetails.marcaPalaceIzq = '';
        newDetails.marcaPalaceDer = '';
      }
    }
    
    setDetails(newDetails);
    onDetailsChange(newDetails);
  };

  // 🎨 Componente de Radio Button Mejorado
  const RadioButton = ({ selected, label, onClick }: any) => (
    <button
      onClick={onClick}
      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 ${
        selected 
          ? 'bg-success/20 text-success border-success/50 shadow-lg scale-105' 
          : 'bg-muted/30 text-muted-foreground border-border hover:bg-muted/50'
      }`}
    >
      <div className="flex items-center justify-center gap-2">
        <div className={`w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${
          selected ? 'bg-success border-success' : 'border-muted-foreground'
        }`}>
          {selected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <span>{label}</span>
      </div>
    </button>
  );

  // 🆕 PREGUNTA DE TORTUGA
  const renderPreguntaTortuga = () => (
    eventType !== 'intento' && (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
          ¿Se encontró la tortuga en el lugar?
        </h3>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RadioButton
            selected={details.hayTortuga === true}
            label="Sí, hay tortuga"
            onClick={() => updateDetail('hayTortuga', true)}
          />
          <RadioButton
            selected={details.hayTortuga === false}
            label="No hay tortuga"
            onClick={() => updateDetail('hayTortuga', false)}
          />
        </div>
      </div>
    )
  );

  // 🆕 ZONAS Y ESTACIÓN
  const renderInformacionZona = () => (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 🆕 ZONAS en lugar de campamentos */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Zona de Playa *
          </label>
          <select 
            value={details.zona_playa || ''}
            onChange={(e) => updateDetail('zona_playa', e.target.value as 'Norte' | 'Centro' | 'Sur')}
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            required
          >
            <option value="">Seleccionar zona</option>
            <option value="Norte">Zona Norte</option>
            <option value="Centro">Zona Centro</option>
            <option value="Sur">Zona Sur</option>
          </select>
        </div>

        {/* 🆕 ESTACIÓN BALIZA (solo números) */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Estación Baliza (solo números)
          </label>
          <input
            type="number"
            value={details.estacion_baliza}
            onChange={(e) => updateDetail('estacion_baliza', e.target.value)}
            placeholder="Ej: 42"
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Solo números permitidos
          </p>
        </div>
      </div>

      {/* Especie */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Especie {eventType === 'intento' ? '(del rastro)' : ''}
        </label>
        <select 
          value={details.especie || ''}
          onChange={(e) => updateDetail('especie', e.target.value as 'ei' | 'cm' | 'cc')}
          className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
        >
          <option value="">Seleccionar especie</option>
          <option value="ei">Eretmochelys imbricata (Carey)</option>
          <option value="cm">Chelonia mydas (Blanca)</option>
          <option value="cc">Caretta caretta (Caguama)</option>
        </select>
      </div>
    </div>
  );

  // 🆕 CICATRIZ
  const renderCicatriz = () => (
    details.hayTortuga && eventType !== 'intento' && (
      <div className="mb-6 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
        <h5 className="text-base font-medium text-foreground mb-3 text-center">
          ¿La tortuga tiene cicatriz visible?
        </h5>
        <p className="text-sm text-muted-foreground text-center mb-4">
          Una cicatriz indica que tuvo marca alguna vez
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <RadioButton
            selected={details.tieneCicatriz === true}
            label="Sí, tiene cicatriz"
            onClick={() => updateDetail('tieneCicatriz', true)}
          />
          <RadioButton
            selected={details.tieneCicatriz === false}
            label="No tiene cicatriz"
            onClick={() => updateDetail('tieneCicatriz', false)}
          />
        </div>
      </div>
    )
  );

  // MEDICIONES (sin cambios)
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
              <span className="inline-flex items-baseline gap-1 text-2xl font-extrabold">
                <span className="px-2 py-0.5 rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
                  {details.lscc}
                </span>
                <span className="text-sm font-medium text-emerald-700/80">cm</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              value={details.lscc}
              onChange={(e) => updateDetail('lscc', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-light text-foreground">
                ACC (Ancho caparazón)
              </label>
              <span className="inline-flex items-baseline gap-1 text-2xl font-extrabold">
                <span className="px-2 py-0.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/30">
                  {details.acc}
                </span>
                <span className="text-sm font-medium text-blue-700/80">cm</span>
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={details.acc}
              onChange={(e) => updateDetail('acc', Number(e.target.value))}
              className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    )
  );

  // 🆕 MARCAJE Y RECAPTURA EXCLUYENTES
  const renderMarcasRecapturas = () => (
    details.hayTortuga && eventType !== 'intento' && (
      <div className="space-y-6 mb-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
        <h4 className="text-lg font-semibold text-foreground text-center mb-4">
          Marcas y Recapturas
        </h4>
        
        {/* 🆕 SELECCIÓN EXCLUYENTE */}
        <div className="mb-6">
          <h5 className="text-base font-medium text-foreground mb-3 text-center">
            Tipo de registro
          </h5>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RadioButton
              selected={details.tipoMarcaje === 'marcaje'}
              label="Marcaje Palace (nuevo)"
              onClick={() => updateDetail('tipoMarcaje', 'marcaje')}
            />
            <RadioButton
              selected={details.tipoMarcaje === 'recaptura'}
              label="Recaptura (ya marcada)"
              onClick={() => updateDetail('tipoMarcaje', 'recaptura')}
            />
          </div>
        </div>

        {/* 🆕 MARCAJE PALACE */}
        {details.tipoMarcaje === 'marcaje' && (
          <div className="space-y-4 p-4 bg-success/5 rounded-xl border border-success/20 animate-fadeIn">
            <h5 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Marcaje Palace (Nuevo)
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Marca Palace - Aleta Izquierda
                </label>
                <input
                  type="text"
                  value={details.marcaPalaceIzq}
                  onChange={(e) => updateDetail('marcaPalaceIzq', e.target.value)}
                  placeholder="Ej: P-1234"
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
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
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                />
              </div>
            </div>
          </div>
        )}

        {/* 🆕 RECAPTURA */}
        {details.tipoMarcaje === 'recaptura' && (
          <div className="space-y-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 animate-fadeIn">
            <h5 className="text-sm font-semibold text-orange-600 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recaptura
            </h5>
            
            {/* 🆕 LADO DE RECAPTURA */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                ¿En qué lado está la marca? *
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <RadioButton
                  selected={details.ladoRecaptura === 'izquierda'}
                  label="Aleta Izquierda"
                  onClick={() => updateDetail('ladoRecaptura', 'izquierda')}
                />
                <RadioButton
                  selected={details.ladoRecaptura === 'derecha'}
                  label="Aleta Derecha"
                  onClick={() => updateDetail('ladoRecaptura', 'derecha')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Número de Serie Recaptura *
              </label>
              <input
                type="text"
                value={details.numeroSerieRecaptura}
                onChange={(e) => updateDetail('numeroSerieRecaptura', e.target.value)}
                placeholder="Ej: REC-2024-001"
                className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                required={details.tipoMarcaje === 'recaptura'}
              />
            </div>
          </div>
        )}

        {/* Marcas Externas (sin cambios) */}
        <div className="mt-6 pt-6 border-t border-purple-500/20">
          <h5 className="text-sm font-semibold text-foreground mb-4">
            Marcas Externas (opcional)
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={details.marcaExternaIzq}
              onChange={(e) => updateDetail('marcaExternaIzq', e.target.value)}
              placeholder="Marca Externa - Izquierda"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
            />
            <input
              type="text"
              value={details.marcaExternaDer}
              onChange={(e) => updateDetail('marcaExternaDer', e.target.value)}
              placeholder="Marca Externa - Derecha"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
            />
          </div>
        </div>
      </div>
    )
  );

  // 🆕 RECOLECCIÓN DE HUEVOS ACTUALIZADA
  const renderRecoleccionHuevos = () => (
    eventType === 'anidacion' && (
      <div className="space-y-6 mb-8 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20">
        <h4 className="text-lg font-semibold text-foreground text-center mb-4">
          Recolección de Huevos
        </h4>
        
        {/* Tamaño de Nidada */}
        <div className="text-center">
          <label className="block text-lg font-light text-foreground mb-6">
            Tamaño de Nidada
          </label>
          <div className="flex items-center justify-center gap-8">
            <button
              className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full text-2xl font-light transition-all"
              onClick={() => updateDetail('tamanoNidada', Math.max(0, details.tamanoNidada - 1))}
            >
              −
            </button>
            <div className="text-4xl font-light text-foreground w-20 text-center">
              {details.tamanoNidada}
            </div>
            <button
              className="w-14 h-14 bg-muted/50 hover:bg-muted rounded-full text-2xl font-light transition-all"
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
            className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer mt-4"
          />
        </div>

        {/* 🆕 CLAVE DE NIDO */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Clave de Nido
          </label>
          <select 
            value={details.claveNido || ''}
            onChange={(e) => updateDetail('claveNido', e.target.value)}
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
          >
            <option value="">Seleccionar clave</option>
            <option value="camastros">Camastros</option>
            <option value="vegetacion">Vegetación</option>
            <option value="otro">Otro</option>
          </select>
          
          {details.claveNido === 'otro' && (
            <input
              type="text"
              value={details.claveNidoOtro}
              onChange={(e) => updateDetail('claveNidoOtro', e.target.value)}
              placeholder="Especificar otra clave"
              className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground mt-2"
            />
          )}
        </div>

        {/* Procedencia */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Procedencia de Huevos
          </label>
          <select 
            value={details.procedenciaHuevos || ''}
            onChange={(e) => updateDetail('procedenciaHuevos', e.target.value)}
            className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
          >
            <option value="">Seleccionar procedencia</option>
            <option value="nido_original">Nido original en playa</option>
            <option value="traslado">Traslado por peligro</option>
            <option value="rescate">Rescate de nido erosionado</option>
          </select>
        </div>
      </div>
    )
  );

  // 🆕 QUIÉN TOMA LA FOTO
  const renderFotografo = () => (
    <div className="mb-8 bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
      <label className="block text-sm font-medium text-foreground mb-2">
        📸 ¿Quién toma la foto?
      </label>
      <input
        type="text"
        value={details.fotografo}
        onChange={(e) => updateDetail('fotografo', e.target.value)}
        placeholder="Nombre del fotógrafo"
        className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground placeholder-muted-foreground"
      />
    </div>
  );

  // RENDERIZADO POR TIPO DE EVENTO
  const renderPorTipoEvento = () => {
    switch (eventType) {
      case 'anidacion':
        return (
          <>
            {renderPreguntaTortuga()}
            {renderInformacionZona()}
            {renderMedicionesTortuga()}
            {renderCicatriz()}
            {renderMarcasRecapturas()}
            {renderRecoleccionHuevos()}
            {renderFotografo()}
          </>
        );
      
      case 'arqueo':
        return (
          <>
            {renderPreguntaTortuga()}
            {renderInformacionZona()}
            {renderMedicionesTortuga()}
            {renderCicatriz()}
            {renderMarcasRecapturas()}
            {details.hayTortuga && renderFotografo()}
          </>
        );
      
      case 'intento':
        return (
          <>
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
            {renderInformacionZona()}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-4xl mx-auto animate-fadeIn">
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
          className="flex-1 py-4 gradient-purple-blue text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 flex items-center justify-center gap-2"
        >
          Continuar 
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}