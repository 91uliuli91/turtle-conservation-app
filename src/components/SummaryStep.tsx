// src/components/SummaryStep.tsx - VERSIÓN CORREGIDA
"use client"

import '../app/globals.css';
import EnvironmentalDataPanel from './EnvironmentalDataPanel';

interface SummaryStepProps {
  eventData: any
  onBack: () => void
  onSave: () => void
  isSaving: boolean
}

export default function SummaryStep({ eventData, onBack, onSave, isSaving }: SummaryStepProps) {
  const getEventTypeName = (type: string) => {
    const names: { [key: string]: string } = {
      arqueo: "Arqueo",
      intento: "Intento", 
      anidacion: "Anidación",
    }
    return names[type] || type
  }

  return (
    <div className="flex flex-col h-full animate-fadeInUp">
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-foreground mb-2">Resumen del Evento</h2>
          <p className="text-muted-foreground text-lg">Revisa la información antes de guardar</p>
        </div>

        {/* Datos Ambientales ACTUALIZADOS en tiempo real */}
        {eventData.location && eventData.location.lat !== 0 && (
          <div className="mb-6">
            <EnvironmentalDataPanel 
              compact={true}
              showLocationInfo={false}
            />
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

        {/* Detalles de Anidación */}
        {eventData.type === "anidacion" && eventData.details?.numeroHuevos && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl p-6 mb-6 border border-emerald-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Detalles de Anidación</h3>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground font-medium">Número de Huevos:</span>
              <span className="font-semibold text-foreground text-2xl">{eventData.details.numeroHuevos}</span>
            </div>
          </div>
        )}

        {/* Mediciones */}
        {(eventData.type === "arqueo" || eventData.type === "anidacion") && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 mb-6 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">Mediciones</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">Largo del caparazón:</span>
                <span className="font-semibold text-foreground">{eventData.details.largoCaparazon} cm</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-medium">Ancho del caparazón:</span>
                <span className="font-semibold text-foreground">{eventData.details.anchoCaparazon} cm</span>
              </div>
            </div>
          </div>
        )}

        {/* Observaciones */}
        {eventData.observations && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 mb-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Fotos ({eventData.photos.length})
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {eventData.photos.slice(0, 4).map((photo: string, index: number) => (
                <div key={index} className="relative group">
                  <img 
                    src={photo} 
                    alt={`Foto ${index + 1}`} 
                    className="w-full h-24 object-cover rounded-xl border-2 border-border/50 group-hover:border-primary/50 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-sm">
                      Foto {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-muted/50 hover:bg-muted border border-border rounded-2xl text-foreground font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isSaving}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          
          <button
            onClick={onSave}
            className="flex-1 py-4 gradient-purple-blue text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Guardando...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Guardar Evento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}