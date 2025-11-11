// src/components/SummaryStep.tsx - VERSIÓN ACTUALIZADA CON TODOS LOS NUEVOS CAMPOS
"use client"

import React from 'react';

interface SummaryStepProps {
  eventData: any
  onBack: () => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
  saveError?: string | null
}

export default function SummaryStep({ 
  eventData, 
  onBack, 
  onSave, 
  onCancel,
  isSaving, 
  saveError 
}: SummaryStepProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = React.useState<number | null>(null);

  const openPhotoModal = (index: number) => setSelectedPhotoIndex(index);
  const closePhotoModal = () => setSelectedPhotoIndex(null);

  const nextPhoto = () => {
    if (selectedPhotoIndex !== null && eventData.photos) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % eventData.photos.length);
    }
  };

  const previousPhoto = () => {
    if (selectedPhotoIndex !== null && eventData.photos) {
      setSelectedPhotoIndex(
        selectedPhotoIndex === 0 ? eventData.photos.length - 1 : selectedPhotoIndex - 1
      );
    }
  };

  const getEventTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      arqueo: "Arqueo",
      intento: "Intento", 
      anidacion: "Anidación",
    }
    return names[type] || type
  }

  const getEspecieName = (especie: string) => {
    const names: { [key: string]: string } = {
      ei: "Eretmochelys imbricata (Carey)",
      cm: "Chelonia mydas (Verde)",
      cc: "Caretta caretta (Caguama)",
    }
    return names[especie] || especie
  }

  const getZonaName = (zona: string) => {
    const names: { [key: string]: string } = {
      Norte: "Zona Norte",
      Centro: "Zona Centro", 
      Sur: "Zona Sur",
    }
    return names[zona] || zona
  }

  const getClaveNidoName = (clave: string) => {
    const names: { [key: string]: string } = {
      camastros: "Camastros",
      vegetacion: "Vegetación",
      otro: "Otro",
    }
    return names[clave] || clave
  }

  const getMedioTransporteName = (medio: string) => {
    const names: { [key: string]: string } = {
      a_pie: "A pie",
      cuatrimoto: "Cuatrimoto",
      vehiculo: "Vehículo",
      otro: "Otro",
    }
    return names[medio] || medio
  }

  const getContenedorName = (contenedor: string) => {
    const names: { [key: string]: string } = {
      bolsa: "Bolsa",
      cubeta: "Cubeta",
      caja: "Caja",
      otro: "Otro",
    }
    return names[contenedor] || contenedor
  }

  const hayTortuga = () => {
    if (eventData.type === 'intento') {
      return false;
    }
    return eventData.details?.hayTortuga || false;
  }

  return (
    <div className="flex flex-col h-full animate-fadeInUp">
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-foreground mb-2">
            {saveError ? "Error al Guardar" : "Resumen del Evento"}
          </h2>
          <p className="text-muted-foreground text-lg">
            {saveError ? "No se pudo guardar el evento" : "Revisa toda la información antes de guardar"}
          </p>
        </div>

        {/* Banner de Error */}
        {saveError && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-destructive">Error al guardar</h3>
                <p className="text-destructive/80 text-sm">{saveError}</p>
              </div>
            </div>
          </div>
        )}

        {/* 🆕 DATOS AMBIENTALES CON INDICADOR DE GUARDADO */}
        {eventData.environmentalData && (
          <div className="mb-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">Datos Ambientales</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Información registrada automáticamente
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">🌡️ Temperatura</div>
                <div className="text-lg font-bold text-foreground">
                  {eventData.environmentalData.weather?.temperature}°C
                </div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">💧 Humedad</div>
                <div className="text-lg font-bold text-foreground">
                  {eventData.environmentalData.weather?.humidity}%
                </div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">🌊 Marea</div>
                <div className="text-lg font-bold text-foreground">
                  {eventData.environmentalData.tide?.tideHeight}m
                </div>
              </div>
              <div className="text-center p-3 bg-card/50 rounded-xl">
                <div className="text-sm text-muted-foreground mb-1">🌙 Luna</div>
                <div className="text-lg font-bold text-foreground">
                  {eventData.environmentalData.moonPhase?.illumination}%
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-cyan-500/20">
              <p className="text-xs text-muted-foreground text-center">
                📍 Ubicación: {eventData.location.lat.toFixed(6)}, {eventData.location.lon.toFixed(6)}
              </p>
            </div>
          </div>
        )}

        {/* Información General */}
        <div className="bg-muted/30 rounded-2xl p-6 mb-6 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Información General</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground font-medium">Tipo de Evento:</span>
              <span className="font-semibold text-foreground">{getEventTypeName(eventData.type)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border/30">
              <span className="text-muted-foreground font-medium">Ubicación:</span>
              <span className="font-semibold text-foreground text-right">
                {eventData.location.lat.toFixed(6)}, {eventData.location.lon.toFixed(6)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground font-medium">Fecha/Hora:</span>
              <span className="font-semibold text-foreground">
                {new Date().toLocaleString('es-MX')}
              </span>
            </div>
          </div>
        </div>

        {/* 🆕 ZONA Y ESTACIÓN (ACTUALIZADO) */}
        {eventData.details && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 mb-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Ubicación del Evento</h3>
            </div>
            
            <div className="space-y-4">
              {eventData.details.zona_playa && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Zona de Playa:</span>
                  <span className="font-semibold text-foreground">{getZonaName(eventData.details.zona_playa)}</span>
                </div>
              )}

              {eventData.details.estacion_baliza && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Estación Baliza:</span>
                  <span className="font-semibold text-foreground">#{eventData.details.estacion_baliza}</span>
                </div>
              )}

              {eventData.type === 'intento' ? (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Tipo de registro:</span>
                  <span className="font-semibold text-foreground">Intento de anidación (sin tortuga)</span>
                </div>
              ) : (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">¿Se encontró tortuga?:</span>
                  <span className="font-semibold text-foreground">{hayTortuga() ? 'Sí' : 'No'}</span>
                </div>
              )}

              {eventData.details.especie && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Especie:</span>
                  <span className="font-semibold text-foreground">{getEspecieName(eventData.details.especie)}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🆕 INFORMACIÓN DE LA TORTUGA (CON CICATRIZ) */}
        {hayTortuga() && eventData.type !== 'intento' && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 mb-6 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Información de la Tortuga</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">LSCC (Largo caparazón):</span>
                <span className="font-semibold text-foreground">{eventData.details.lscc} cm</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">ACC (Ancho caparazón):</span>
                <span className="font-semibold text-foreground">{eventData.details.acc} cm</span>
              </div>

              {/* 🆕 CICATRIZ */}
              {eventData.details.tieneCicatriz !== undefined && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Tiene cicatriz:</span>
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    {eventData.details.tieneCicatriz ? (
                      <>
                        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Sí (indica marca previa)
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        No
                      </>
                    )}
                  </span>
                </div>
              )}

              {/* 🆕 TIPO DE MARCAJE */}
              {eventData.details.tipoMarcaje && (
                <div className="pt-2 border-t border-emerald-500/20">
                  <h4 className="text-lg font-semibold text-foreground mb-3">
                    {eventData.details.tipoMarcaje === 'marcaje' ? '🏷️ Marcaje Palace (Nuevo)' : '🔄 Recaptura'}
                  </h4>
                  
                  {eventData.details.tipoMarcaje === 'marcaje' ? (
                    /* Marcaje Palace */
                    <div className="space-y-2">
                      {eventData.details.marcaPalaceIzq && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground font-medium">Aleta Izquierda:</span>
                          <span className="font-semibold text-foreground">{eventData.details.marcaPalaceIzq}</span>
                        </div>
                      )}
                      {eventData.details.marcaPalaceDer && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground font-medium">Aleta Derecha:</span>
                          <span className="font-semibold text-foreground">{eventData.details.marcaPalaceDer}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Recaptura */
                    <div className="space-y-2">
                      {eventData.details.ladoRecaptura && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground font-medium">Lado de la marca:</span>
                          <span className="font-semibold text-foreground capitalize">
                            Aleta {eventData.details.ladoRecaptura}
                          </span>
                        </div>
                      )}
                      {eventData.details.numeroSerieRecaptura && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground font-medium">Número de Serie:</span>
                          <span className="font-semibold text-foreground">{eventData.details.numeroSerieRecaptura}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Marcas Externas */}
              {(eventData.details.marcaExternaIzq || eventData.details.marcaExternaDer) && (
                <div className="pt-2 border-t border-emerald-500/20">
                  <h4 className="text-lg font-semibold text-foreground mb-3">Marcas Externas</h4>
                  {eventData.details.marcaExternaIzq && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">Aleta Izquierda:</span>
                      <span className="font-semibold text-foreground">{eventData.details.marcaExternaIzq}</span>
                    </div>
                  )}
                  {eventData.details.marcaExternaDer && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">Aleta Derecha:</span>
                      <span className="font-semibold text-foreground">{eventData.details.marcaExternaDer}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🆕 DETALLES DE ANIDACIÓN (CON CLAVE DE NIDO) */}
        {eventData.type === "anidacion" && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 mb-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Detalles de Anidación</h3>
            </div>
            
            <div className="space-y-4">
              {eventData.details?.tamanoNidada && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Tamaño de Nidada:</span>
                  <span className="font-semibold text-foreground text-2xl">{eventData.details.tamanoNidada} huevos</span>
                </div>
              )}

              {/* 🆕 CLAVE DE NIDO */}
              {eventData.details?.claveNido && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Clave de Nido:</span>
                  <span className="font-semibold text-foreground">
                    {getClaveNidoName(eventData.details.claveNido)}
                    {eventData.details.claveNido === 'otro' && eventData.details.claveNidoOtro && 
                      ` (${eventData.details.claveNidoOtro})`}
                  </span>
                </div>
              )}

              {eventData.details?.horaRecolecta && (
                <div className="flex justify-between items-center py-2 border-b border-border/30">
                  <span className="text-muted-foreground font-medium">Hora de Recolección:</span>
                  <span className="font-semibold text-foreground">{eventData.details.horaRecolecta}</span>
                </div>
              )}

              {eventData.details?.procedenciaHuevos && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground font-medium">Procedencia de Huevos:</span>
                  <span className="font-semibold text-foreground capitalize">
                    {eventData.details.procedenciaHuevos.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🆕 FOTÓGRAFO */}
        {eventData.details?.fotografo && (
          <div className="bg-amber-500/10 rounded-xl p-4 mb-6 border border-amber-500/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Fotógrafo</p>
                <p className="font-semibold text-foreground">{eventData.details.fotografo}</p>
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {eventData.observations && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 mb-6 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Observaciones</h3>
            </div>
            
            <p className="text-foreground leading-relaxed bg-card/50 rounded-xl p-4 border border-border/30">
              {eventData.observations}
            </p>
          </div>
        )}

        {/* Fotos */}
        {eventData.photos && eventData.photos.length > 0 && (
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl p-6 mb-6 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Fotos ({eventData.photos.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {eventData.photos.map((photo: File, index: number) => {
                const photoUrl = URL.createObjectURL(photo);
                
                return (
                  <div 
                    key={index} 
                    onClick={() => openPhotoModal(index)}
                    className="relative group aspect-square rounded-xl overflow-hidden bg-muted/30 border border-border/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <img 
                      src={photoUrl} 
                      alt={`Foto ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onLoad={() => {
                        URL.revokeObjectURL(photoUrl);
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-xs font-semibold truncate mb-1">
                          {photo.name}
                        </p>
                        <div className="flex items-center justify-between text-white/80 text-xs">
                          <span>{(photo.size / 1024).toFixed(1)} KB</span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Foto {index + 1}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full border border-white/20">
                      {index + 1}
                    </div>

                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-amber-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Total de archivos: {eventData.photos.length}
                </span>
                <span className="text-muted-foreground flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Tamaño total: {(eventData.photos.reduce((sum: number, photo: File) => sum + photo.size, 0) / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 mt-8">
          {saveError ? (
            <>
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-4 bg-muted/50 border border-border rounded-2xl text-foreground hover:bg-muted hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancelar</span>
              </button>
              
              <button
                onClick={onSave}
                disabled={isSaving}
                className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reintentando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reintentar</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onBack}
                className="flex-1 px-6 py-4 bg-muted/50 border border-border rounded-2xl text-foreground hover:bg-muted hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Volver</span>
              </button>
              
              <button
                onClick={onSave}
                className="flex-1 px-6 py-4 gradient-purple-blue text-white rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Guardar Evento</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal de vista previa completa */}
      {selectedPhotoIndex !== null && eventData.photos && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closePhotoModal}
        >
          <button
            onClick={closePhotoModal}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors z-10"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium z-10">
            {selectedPhotoIndex + 1} / {eventData.photos.length}
          </div>

          {eventData.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                previousPhoto();
              }}
              className="absolute left-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          <div className="max-w-4xl max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={URL.createObjectURL(eventData.photos[selectedPhotoIndex])}
              alt={`Foto ${selectedPhotoIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center mt-4 text-sm">
              {eventData.photos[selectedPhotoIndex].name} • {(eventData.photos[selectedPhotoIndex].size / 1024).toFixed(1)} KB
            </p>
          </div>

          {eventData.photos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-4 w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}      
    </div>
  )
}