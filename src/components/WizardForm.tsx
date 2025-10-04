// src/components/WizardForm.tsx - VERSIÓN CON PADDING FIJO
"use client"
import { useState, useEffect } from "react"
import EventTypeSelector from "./EventTypeSelector"
import LocationPicker from "./LocationPicker"
import EventDetails from "./EventDetails"
import PhotoStep from "./PhotoStep"
import SummaryStep from "./SummaryStep"

import '../app/globals.css';

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
  const [scrollProgress, setScrollProgress] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)

  const { isOnline, pendingSyncs, saveEventOffline, syncPendingEvents } = useOffline()

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const updateEventData = (field: string, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
  }

  // Obtener altura del header después del renderizado
  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('.expanded-header');
      if (header) {
        setHeaderHeight(header.clientHeight);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  // Efecto para animación de barra
  useEffect(() => {
    setIsProgressAnimating(true);
    const timer = setTimeout(() => setIsProgressAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [currentStep])

  // Efecto para manejar el scroll con aparición al final
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // Calcular progreso basado en la altura del header
      // La barra compacta aparece cuando el header expandido está a punto de desaparecer
      const triggerPoint = headerHeight * 0.7; // 70% de la altura del header
      const progress = Math.min(Math.max((scrollTop - triggerPoint) / (headerHeight * 0.3), 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      if (isOnline) {
        console.log("Guardando online:", eventData)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSaveStatus("saved")
        setTimeout(() => setShowSuccessOptions(true), 1000)
      } else {
        const id = await saveEventOffline(eventData)
        setSaveStatus("saved")
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
    window.location.href = "/"
  }

  const calculateProgress = () => {
    if (currentStep === 1) return 0;
    return ((currentStep - 1) / 4) * 100;
  }

  const getStepStatus = (step: number) => {
    if (currentStep > step) return "completed";
    if (currentStep === step) return "current";
    return "upcoming";
  }

  // Componente para el header unificado con transición al final
  const UnifiedHeader = () => {
    const compactOpacity = Math.min(scrollProgress * 2, 1); // Aparece más rápido
    const expandedOpacity = 1 - (scrollProgress * 1.2); // Desaparece más lento
    const expandedScale = 1 - (scrollProgress * 0.15);
    const expandedTranslateY = scrollProgress * -30;

    return (
      <>
        {/* Header Compacto - Aparece al final */}
        <div 
          className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 backdrop-blur-xl border-b border-border/50 bg-background/95 shadow-lg"
          style={{
            height: '70px',
            opacity: compactOpacity,
            transform: `translateY(${compactOpacity * -10}px)`,
            padding: '12px 0'
          }}
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-8 h-full">
            <div className="flex items-center justify-between h-full">
              {/* Indicadores de pasos compactos */}
              <div className="flex items-center space-x-3">
                {[1, 2, 3, 4, 5].map((step) => {
                  const status = getStepStatus(step);
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          status === "completed"
                            ? "gradient-purple-blue text-white shadow-md"
                            : status === "current"
                            ? "bg-primary text-primary-foreground border-2 border-primary shadow-md"
                            : "bg-muted/40 text-muted-foreground border border-border"
                        }`}
                      >
                        {status === "completed" ? (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <span>{step}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Estado de conexión compacto */}
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 ${
                  isOnline
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-destructive/10 text-destructive border-destructive/30"
                }`}
                style={{
                  opacity: compactOpacity,
                  transform: `scale(${0.9 + (compactOpacity * 0.1)})`
                }}
              >
                <div className="flex items-center gap-2">  
                  <div
                    className={`w-2 h-2 rounded-full ${isOnline ? "bg-success" : "bg-destructive"} animate-pulse`}
                  ></div>
                  <span className="font-semibold">{isOnline ? "Online" : "Offline"}</span>
                  {pendingSyncs > 0 && (
                    <span className="bg-muted/80 px-1.5 py-0.5 rounded text-xs">{pendingSyncs}</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Barra de progreso compacta */}
            <div className="mt-2" style={{ opacity: compactOpacity }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-muted-foreground">
                  Paso {currentStep} de 5
                </span>
                <span className="text-xs font-medium text-primary">
                  {Math.round(calculateProgress())}%
                </span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden ${
                    isProgressAnimating ? 'animate-wave' : ''
                  }`}
                  style={{ width: `${calculateProgress()}%` }}
                >
                  <div className="absolute inset-0 gradient-purple-blue"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Header Expandido - Desaparece gradualmente */}
        <div className="transition-all duration-500 pt-8">
          <div className="p-2 sm:p-8">
            <div className="max-w-2xl mx-auto">
              <div 
                className="expanded-header bg-card rounded-3xl p-8 shadow-lg border border-border/50 mb-8"
                style={{
                  opacity: expandedOpacity,
                  transform: `scale(${expandedScale}) translateY(${expandedTranslateY}px)`,
                  pointerEvents: scrollProgress > 0.8 ? 'none' : 'auto'
                }}
              >
                <div className="flex items-center gap-4 justify-between">
                  <button 
                    onClick={() => window.history.back()}
                    className="flex items-center space-x-2 px-4 py-3 bg-secondary hover:bg-accent text-secondary-foreground 
                            border border-border transition-all duration-300 hover:scale-105 hover:shadow-lg 
                            cursor-pointer group rounded-xl"
                    style={{
                      opacity: 1 - (scrollProgress * 1.5),
                      transform: `scale(${1 - (scrollProgress * 0.4)})`
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    style={{
                      opacity: 1 - (scrollProgress * 1.2),
                      transform: `scale(${1 - (scrollProgress * 0.3)}) translateY(${scrollProgress * 8}px)`
                    }}
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
                  <div className="space-y-4">
                    <h1 
                      className="text-2xl sm:text-5xl font-bold text-balance bg-gradient-to-r from-primary to-primary/100 bg-clip-text text-transparent rounded-none pt-4"
                      style={{
                        opacity: 1 - (scrollProgress * 1.8),
                        transform: `translateY(${scrollProgress * -10}px)`
                      }}
                    >
                      {saveStatus === "saved" && showSuccessOptions ? "Evento Guardado" : "Registro de Evento"}
                    </h1>
                    <p 
                      className="text-muted-foreground text-lg text-pretty leading-relaxed"
                      style={{
                        opacity: 1 - (scrollProgress * 2),
                        transform: `translateY(${scrollProgress * -5}px)`
                      }}
                    >
                      {saveStatus === "saved" && showSuccessOptions 
                        ? "¿Qué te gustaría hacer ahora?" 
                        : "Complete la información del evento de conservación"}
                    </p>
                  </div>
                </div>

                {saveStatus !== "saved" || !showSuccessOptions ? (
                  <div className="space-y-6">
                    <div 
                      className="flex items-center justify-between mb-2"
                      style={{
                        opacity: 1 - (scrollProgress * 1.5)
                      }}
                    >
                      <span className="text-sm font-bold text-muted-foreground tracking-wide">
                        Paso {currentStep} de 5
                      </span>
                    </div>

                    <div 
                      className="relative"
                      style={{
                        opacity: 1 - (scrollProgress * 1.3)
                      }}
                    >
                      <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden shadow-inner">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse-slow"></div>
                        
                        <div
                          className={`h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden ${
                            isProgressAnimating ? 'animate-wave' : ''
                          }`}
                          style={{ width: `${calculateProgress()}%` }}
                        >
                          <div className="absolute inset-0 gradient-purple-blue"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"></div>
                        </div>
                      </div>
                      
                      {calculateProgress() > 0 && calculateProgress() < 100 && (
                        <div 
                          className="absolute top-1/2 transform bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold shadow-lg transition-all duration-1000 ease-out animate-float"
                          style={{ 
                            left: `calc(${calculateProgress()}% - 20px)`,
                            opacity: 1 - (scrollProgress * 1.5)
                          }}
                        >
                          {Math.round(calculateProgress())}%
                        </div>
                      )}
                    </div>

                    {/* Indicadores de pasos detallados */}
                    <div 
                      className="flex justify-between items-center"
                      style={{
                        opacity: 1 - (scrollProgress * 1.2),
                        transform: `scale(${1 - (scrollProgress * 0.1)})`,
                        transformOrigin: 'top center'
                      }}
                    >
                      {[
                        { 
                          step: 1, 
                          label: "Tipo", 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )
                        },
                        { 
                          step: 2, 
                          label: "Ubicación", 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )
                        },
                        { 
                          step: 3, 
                          label: "Detalles", 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )
                        },
                        { 
                          step: 4, 
                          label: "Fotos", 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )
                        },
                        { 
                          step: 5, 
                          label: "Resumen", 
                          icon: (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )
                        },
                      ].map(({ step, label, icon }) => {
                        const status = getStepStatus(step);

                        return (
                          <div key={step} className="flex flex-col items-center space-y-3">
                            <div
                              className={`relative w-8 h-8 rounded-2xl flex items-center justify-center text-lg transition-all duration-700 ${
                                status === "completed"
                                  ? "gradient-purple-blue text-white shadow-lg shadow-primary/25 scale-110 animate-check-in"
                                  : status === "current"
                                  ? "bg-primary text-primary-foreground border-2 border-primary shadow-lg scale-110 animate-pulse"
                                  : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted/80 transition-all duration-300"
                              }`}
                              style={{
                                transform: `scale(${1 - (scrollProgress * 0.1)})`
                              }}
                            >
                              {status === "completed" ? (
                                <div className="animate-check-in">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              ) : status === "current" ? (
                                <span className="font-bold text-xs animate-bounce-in">{step}</span>
                              ) : (
                                <span className="opacity-70">{icon}</span>
                              )}
                            </div>
                            <span
                              className={`text-xs font-semibold transition-all duration-500 ${
                                status === "completed"
                                  ? "text-primary font-bold"
                                  : status === "current"
                                  ? "text-primary font-bold"
                                  : "text-muted-foreground opacity-70"
                              }`}
                              style={{
                                opacity: 1 - (scrollProgress * 1.5)
                              }}
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
        </div>
      </>
    );
  };

  const renderCurrentStep = () => {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header unificado con transición al final */}
      <UnifiedHeader />
      
      {/* Contenido principal con padding fijo */}
      <div className="transition-all duration-500">
        <div className="px-2 pb-12 sm:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-fadeInUp">{renderCurrentStep()}</div>
          </div>
        </div>
      </div>

      {/* Estado de guardado fijo en la parte inferior */}
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
                    <svg className="w-6 h-6 animate-spin mr-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
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

// Componente para las opciones después de guardar exitosamente (se mantiene igual)
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
            <div className="w-12 h-12 bg-white/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
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
            <div className="w-12 h-12 bg-muted/50 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
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
  );
}