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

  const { isOnline, pendingSyncs, saveEventOffline, syncPendingEvents } = useOffline()

  const nextStep = () => setCurrentStep((prev) => prev + 1)
  const prevStep = () => setCurrentStep((prev) => prev - 1)

  const updateEventData = (field: string, value: any) => {
    setEventData((prev) => ({ ...prev, [field]: value }))
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

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus("saving")

    try {
      if (isOnline) {
        // Guardar online
        console.log("Guardando online:", eventData)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setSaveStatus("saved")
        alert("✅ Evento guardado en línea exitosamente!")
      } else {
        // Guardar offline
        const id = await saveEventOffline(eventData)
        setSaveStatus("saved")
        alert(`✅ Evento guardado offline (ID: ${id}). Se sincronizará automáticamente cuando haya conexión.`)
      }
    } catch (error: any) {
      console.error("Error guardando evento:", error)
      setSaveStatus("error")
      alert(`❌ Error guardando el evento: ${error.message}. Por favor intenta nuevamente.`)
    } finally {
      setIsSaving(false)
    }
  }

  const renderCurrentStep = () => {
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
        return <SummaryStep eventData={eventData} onBack={prevStep} onSave={handleSave} isSaving={isSaving} />
      default:
        return <div>Paso no válido</div>
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card rounded-3xl p-8 shadow-lg border border-border/50 mb-8">
            <div className="flex justify-between items-start mb-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-light text-balance tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Registro de Evento
                </h1>
                <p className="text-muted-foreground text-xl text-pretty leading-relaxed">
                  Complete la información del evento de conservación
                </p>
              </div>

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
                  <span className="font-semibold">{isOnline ? "En línea" : "Offline"}</span>
                  {pendingSyncs > 0 && (
                    <span className="bg-muted px-3 py-1 rounded-full text-xs font-medium">{pendingSyncs}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground tracking-wide">
                  PASO {currentStep} DE 5
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  {Math.round((currentStep / 5) * 100)}% completado
                </span>
              </div>

              {/* Enhanced progress bar with gradient */}
              <div className="relative">
                <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="gradient-purple-blue h-2 rounded-full transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Modern step indicators */}
              <div className="flex justify-between items-center">
                {[
                  { step: 1, label: "Tipo", icon: "🐢" },
                  { step: 2, label: "Ubicación", icon: "📍" },
                  { step: 3, label: "Detalles", icon: "📝" },
                  { step: 4, label: "Fotos", icon: "📸" },
                  { step: 5, label: "Resumen", icon: "✅" },
                ].map(({ step, label, icon }) => (
                  <div key={step} className="flex flex-col items-center space-y-3 animate-fadeInUp">
                    <div
                      className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-lg transition-all duration-500 ${
                        currentStep >= step
                          ? "gradient-purple-blue text-white shadow-lg shadow-primary/25 scale-110"
                          : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted/80"
                      }`}
                    >
                      {currentStep >= step ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span>{icon}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-colors duration-300 tracking-wide ${
                        currentStep >= step ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {label.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-12 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-fadeInUp">{renderCurrentStep()}</div>
        </div>
      </div>

      {saveStatus !== "idle" && (
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
