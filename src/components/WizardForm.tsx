// src/components/WizardForm.tsx
"use client"

import { useState, useEffect } from "react"
import EventTypeSelector from "./EventTypeSelector"
import LocationPicker from "./LocationPicker"
import EventDetails from "./EventDetails"
import PhotoStep from "./PhotoStep"
import SummaryStep from "./SummaryStep"

// Mock hook for offline functionality
const useOffline = () => ({
  isOnline: true,
  pendingSyncs: 0,
  saveEventOffline: async (data: any) => {
    console.log("Saving offline:", data)
    return Math.random().toString(36).substr(2, 9)
  },
  syncPendingEvents: async () => console.log("Syncing events"),
})

export default function WizardForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [eventData, setEventData] = useState({
    type: "",
    location: { lat: 0, lon: 0 },
    details: {},
    photos: [] as string[],
    observations: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [showSuccessOptions, setShowSuccessOptions] = useState(false)
  

const [isProgressAnimating, setIsProgressAnimating] = useState(false)
const [currentStep, setCurrentStep] = useState(1);
const [eventData, setEventData] = useState<{
  type: string;
  location: { lat: number; lon: number };
  details: Record<string, unknown>;
  photos: string[];
  observations: string;
}>({
type: '',
location: { lat: 0, lon: 0 },
details: {},
photos: [] as string[],
observations: ''
});
const [isSaving, setIsSaving] = useState(false);
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const { isOnline, pendingSyncs, saveEventOffline, syncPendingEvents } = useOffline()

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const updateEventData = (field: string, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
const updateEventData = (field: string, value: any) => {
setEventData(prev => ({ ...prev, [field]: value }));
};

// Sincronizar automáticamente cuando hay conexión
// En el WizardForm.tsx, actualiza el useEffect de sincronización:
useEffect(() => {
    if (isOnline && pendingSyncs > 0) {
        console.log('Intentando sincronizar eventos pendientes...');
        syncPendingEvents().catch(error => {
        console.error('Error en sincronización automática:', error);
    });
    }
}, [isOnline, pendingSyncs, syncPendingEvents]);

// En tu WizardForm.tsx, actualiza handleSave:
const handleSave = async () => {
  setIsSaving(true);
  setSaveStatus('saving');

  try {
    if (isOnline) {
      // Guardar online
      console.log('Guardando online:', eventData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaveStatus('saved');
      alert('✅ Evento guardado en línea exitosamente!');
    } else {
      // Guardar offline
      const id = await saveEventOffline(eventData);
      setSaveStatus('saved');
      alert(`✅ Evento guardado offline (ID: ${id}). Se sincronizará automáticamente cuando haya conexión.`);
    }
  } catch (error) {
    console.error('Error guardando evento:', error);
    setSaveStatus('error');
    alert(`❌ Error guardando el evento: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor intenta nuevamente.`);
  } finally {
    setIsSaving(false);
  }

  // Sincronizar automáticamente cuando hay conexión
  useEffect(() => {
    let syncInterval: NodeJS.Timeout
    if (isOnline && pendingSyncs > 0) {
      // Intentar sincronizar cada 30 segundos mientras haya eventos pendientes
      syncInterval = setInterval(() => {
        syncPendingEvents().catch(console.error)
      }, 30000)
    }

    return () => {
      if (syncInterval) clearInterval(syncInterval)
    }
  }, [isOnline, pendingSyncs, syncPendingEvents])

  // ⭐⭐⭐ NUEVO EFECTO PARA ANIMACIÓN DE BARRA ⭐⭐⭐
  useEffect(() => {
    setIsProgressAnimating(true);
    const timer = setTimeout(() => setIsProgressAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentStep])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      if (isOnline) {
        // Guardar online
        console.log("Guardando online:", eventData)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSaveStatus("saved")
        // Mostrar opciones después de 1 segundo
        setTimeout(() => setShowSuccessOptions(true), 1000)
      } else {
        // Guardar offline
        const id = await saveEventOffline(eventData)
        setSaveStatus("saved")
        // Mostrar opciones después de 1 segundo
        setTimeout(() => setShowSuccessOptions(true), 1000)
      }
    } catch (error: any) {
      console.error("Error guardando evento:", error)
      setSaveStatus("error")
      alert(`❌ Error guardando el evento: ${error.message}. Por favor intenta nuevamente.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddNewEvent = () => {
    // Resetear el formulario para nuevo evento
    setEventData({
      type: "",
      location: { lat: 0, lon: 0 },
      details: {},
      photos: [] as string[],
      observations: "",
    })
    setCurrentStep(1)
    setSaveStatus("idle")
    setShowSuccessOptions(false)
  }

  const handleReturnToDashboard = () => {
    // Redirigir al dashboard
    window.location.href = "/"
  }

  // Calcular el progreso correctamente
  const calculateProgress = () => {
    // El progreso debe ser 0% en el paso 1 (selección de tipo)
    // y avanzar 25% por cada paso completado
    if (currentStep === 1) return 0;
    return ((currentStep - 1) / 4) * 100;
  }

  const renderCurrentStep = () => {
    // Si estamos en estado de éxito y mostrando opciones, renderizar el componente de éxito
    if (saveStatus === "saved" && showSuccessOptions) {
      return (
        <div className="animate-fadeInUp">
          <SuccessOptions 
            onAddNewEvent={handleAddNewEvent}
            onReturnToDashboard={handleReturnToDashboard}
          />
        </div>
      )
    }

    switch (currentStep) {
      case 1:
        return (
          <EventTypeSelector
            onSelect={(type) => {
              updateEventData("type", type)
              nextStep()
            }}
          />
        )
      case 2:
        return (
          <LocationPicker
            onLocationConfirm={(lat, lon) => {
              updateEventData("location", { lat, lon })
              nextStep()
            }}
            onBack={prevStep}
          />
        )
      case 3:
        return (
          <EventDetails
            eventType={eventData.type}
            onDetailsChange={(details) => updateEventData("details", details)}
            onBack={prevStep}
            onNext={nextStep}
          />
        )
      case 4:
        return (
          <PhotoStep
            onPhotosChange={(photos) => updateEventData("photos", photos)}
            onObservationsChange={(observations) => updateEventData("observations", observations)}
            onBack={prevStep}
            onNext={nextStep}
          />
        )
      case 5:
        return (
          <SummaryStep 
            eventData={eventData} 
            onBack={prevStep} 
            onSave={handleSave} 
            isSaving={isSaving} 
          />
        )
      default:
        return <div>Paso no válido</div>
    }
  }

  const progressPercentage = calculateProgress();

  return (
    <div className="min-h-screen bg-background">
      <div className="p-2 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 mb-8">
            <div className="flex items-center gap-4 mb-2 justify-between ">
              {/* Botón de regreso mejorado */}
              <button 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2 px-4 py-3 bg-secondary hover:bg-accent text-secondary-foreground 
                        border border-border transition-all duration-300 hover:scale-105 hover:shadow-lg 
                        cursor-pointer group"
              >
                <svg className="w-4 h-4 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-bold">Volver</span>
              </button>
              <div
                className={`px-4 py-3 rounded-2xl text-sm font-medium border transition-all duration-300 backdrop-blur-sm ${
                  isOnline
                    ? "bg-success/10 text-success border-success/30 shadow-lg shadow-success/5"
                    : "bg-destructive/10 text-destructive border-destructive/30 shadow-lg shadow-destructive/5"
                }`}
              >
                <div className="flex items-center gap-3">  
                  <div
                    className={`w-3 h-3 rounded-full ${isOnline ? "bg-success" : "bg-destructive"} animate-pulse`}
                  ></div>
                  <span className="font-semibold">{isOnline ? "Online" : "Offline"}</span>
                  {pendingSyncs > 0 && (
                    <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">{pendingSyncs}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-4 ">
                <h1 className="text-3xl sm:text-5xl font-bold text-balance bg-gradient-to-r from-primary to-primary/100 bg-clip-text text-transparent rounded-none ">
                  {saveStatus === "saved" && showSuccessOptions ? "Evento Guardado" : "Registro de Evento"}
                </h1>
                <p className="text-muted-foreground text-xl text-pretty leading-relaxed">
                  {saveStatus === "saved" && showSuccessOptions 
                    ? "¿Qué te gustaría hacer ahora?" 
                    : "Complete la información del evento de conservación"}
                </p>
              </div>
            </div>

            {saveStatus !== "saved" || !showSuccessOptions ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-muted-foreground tracking-wide">
                    Paso {currentStep} de 5
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {Math.round(progressPercentage)}% completado
                  </span>
                </div>
                <div className="relative">
                  <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner">
                    {/* Barra de progreso principal con transición suave */}
                    <div
                      className="h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ 
                        width: `${progressPercentage}%`,
                        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {/* Efecto de brillo animado más sutil */}
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          animation: 'shine 3s ease-in-out infinite',
                          transform: 'translateX(-100%)'
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Indicador de porcentaje flotante */}
                  {progressPercentage > 0 && progressPercentage < 100 && (
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold shadow-lg transition-all duration-1500 ease-out"
                      style={{ 
                        left: `calc(${progressPercentage}% - 20px)`,
                        transition: 'left 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {Math.round(progressPercentage)}%
                    </div>
                  )}
                </div>

{/* Modern step indicators - VERSIÓN MEJORADA */}
<div className="flex justify-between items-center">
  {[
    { step: 1, label: "Tipo", icon: "🐢" },
    { step: 2, label: "Ubicación", icon: "📍" },
    { step: 3, label: "Detalles", icon: "📝" },
    { step: 4, label: "Fotos", icon: "📸" },
    { step: 5, label: "Resumen", icon: "✅" },
  ].map(({ step, label, icon }) => {
    const isCompleted = currentStep > step;
    const isCurrent = currentStep === step;
    const isFuture = currentStep < step;

    return (
      <div key={step} className="flex flex-col items-center space-y-3">
        {/* Línea conectora entre pasos */}
        {step > 1 && (
          <div 
            className={`absolute left-0 right-0 h-0.5 -translate-y-6 -z-10 transition-all duration-700 ${
              isCompleted ? 'bg-primary' : 'bg-muted/30'
            }`}
            style={{ 
              width: '100%',
              transform: `translateX(${(step - 1) * 25}%)`,
              marginLeft: '-50%',
              marginRight: '-50%'
            }}
          ></div>
        )}
        
        <div
          className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-700 transform ${
            isCompleted
              ? "gradient-purple-blue text-white shadow-lg shadow-primary/25 scale-110 animate-pulse-completed" // Paso completado
              : isCurrent
              ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg scale-110 animate-pulse-current" // Paso actual
              : "bg-muted/30 text-muted-foreground border border-muted hover:bg-muted/50 transition-all duration-300" // Paso futuro
          }`}
        >
          {isCompleted ? (
            // Paso completado - mostrar check con animación
            <div className="animate-check-in">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          ) : isCurrent ? (
            // Paso actual - mostrar número con animación
            <div className="animate-bounce-in">
              <span className="font-bold text-sm">{step}</span>
            </div>
          ) : (
            // Paso futuro - mostrar ícono normal
            <span className="opacity-60">{icon}</span>
          )}
        </div>
        <span
          className={`text-xs font-semibold transition-all duration-500 ${
            isCompleted
              ? "text-primary font-bold scale-105"
              : isCurrent
              ? "text-primary font-bold"
              : "text-muted-foreground opacity-70"
          }`}
        >
          {label.toUpperCase()}
        </span>
      </div>
    );
  })}
</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-2 pb-12 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-fadeInUp">{renderCurrentStep()}</div>
        </div>
      </div>

      {saveStatus !== "idle" && !showSuccessOptions && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 z-50">
          <div className="px-6 py-6">
            <div className="max-w-2xl mx-auto">
              <div
                className={`flex items-center justify-center py-6 px-8 rounded-3xl transition-all duration-500 animate-scaleIn ${
                  saveStatus === "saving"
                    ? "bg-muted/30 border border-border/50"
                    : saveStatus === "saved"
                      ? "bg-success/10 border border-success/30 shadow-lg shadow-success/5"
                      : "bg-destructive/10 border border-destructive/30 shadow-lg shadow-destructive/5"
                }`}
              >
                {saveStatus === "saving" && (
                  <div className="flex items-center text-foreground">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-primary/20 border-t-primary mr-4"></div>
                    <span className="font-semibold text-lg">Guardando evento...</span>
                  </div>
                )}
                {saveStatus === "saved" && (
                  <div className="flex items-center text-success">
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Evento guardado exitosamente</span>
                  </div>
                )}
                {saveStatus === "error" && (
                  <div className="flex items-center text-destructive">
                    <div className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center mr-4">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-lg">Error al guardar el evento</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para las opciones después de guardar exitosamente
function SuccessOptions({ onAddNewEvent, onReturnToDashboard }: { 
  onAddNewEvent: () => void; 
  onReturnToDashboard: () => void;
}) {
  return (
    <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-success" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">¡Evento Guardado!</h2>
        <p className="text-muted-foreground">El evento ha sido registrado exitosamente en el sistema.</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={onAddNewEvent}
          className="w-full p-6 gradient-purple-blue text-white font-semibold 
                   hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 
                   transition-all duration-500 ease-out group animate-fadeInUp"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              ➕
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold">Agregar Nuevo Evento</div>
              <div className="text-white/80 text-sm">Registrar otro evento</div>
            </div>
          </div>
        </button>

        <button
          onClick={onReturnToDashboard}
          className="w-full p-6 bg-secondary hover:bg-accent text-secondary-foreground 
                   border border-border font-semibold hover:scale-105 
                   transition-all duration-500 ease-out group animate-fadeInUp"
          style={{ animationDelay: "400ms" }}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className="w-12 h-12 bg-muted/50 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              🏠
            </div>
            <div className="text-left">
              <div className="text-lg font-semibold">Volver al Inicio</div>
              <div className="text-muted-foreground text-sm">Regresar al dashboard</div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-border/30">
        <p className="text-center text-xs text-muted-foreground tracking-wide animate-pulse">
          SELECCIONA UNA OPCIÓN PARA CONTINUAR
        </p>
      </div>
    </div>
  )
=======
return (
<div className="min-h-screen bg-black text-white p-4 relative">
    {/* Indicador de estado de conexión */}
    <div className={`fixed top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold z-50 ${
    isOnline ? 'bg-green-600' : 'bg-red-600'
    }`}>
    {isOnline ? '🟢 En línea' : '🔴 Offline'}
    {pendingSyncs > 0 && ` (${pendingSyncs} pendientes)`}
    </div>

    <div className="max-w-md mx-auto">
    {/* Indicador de progreso */}
    <div className="flex justify-between mb-8">
        {[1, 2, 3, 4, 5].map(step => (
        <div
            key={step}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
            currentStep >= step ? 'bg-green-600' : 'bg-gray-600'
            }`}
        >
            {step}
        </div>
        ))}
    </div>

    {renderCurrentStep()}

    {/* Estado del guardado */}
    {saveStatus === 'saving' && (
        <div className="fixed bottom-4 left-4 bg-blue-600 px-3 py-2 rounded">
        Guardando...
        </div>
    )}
    {saveStatus === 'saved' && (
        <div className="fixed bottom-4 left-4 bg-green-600 px-3 py-2 rounded">
        ✅ Guardado {isOnline ? 'en línea' : 'offline'}
        </div>
    )}
    </div>
</div>
);
>>>>>>> 4b1bdba920eb81a534bfebbd031c0d9427c7e22b
}