// LocationPicker.tsx - Versión actualizada con bordes más redondeados
"use client"

interface LocationPickerProps {
  onLocationConfirm: (lat: number, lon: number) => void
  onBack: () => void
}

export default function LocationPicker({ onLocationConfirm, onBack }: LocationPickerProps) {
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationConfirm(position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          alert("Error obteniendo ubicación: " + error.message)
          onLocationConfirm(9.9281, -84.0907)
        },
      )
    } else {
      alert("Geolocalización no soportada")
      onLocationConfirm(9.9281, -84.0907)
    }
  }

  return (
    <div className="animate-fadeInUp">
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-light text-foreground mb-4 text-balance">Selecciona la ubicación</h3>
          <p className="text-muted-foreground text-lg text-pretty">Obtén la ubicación precisa del evento</p>
        </div>

        <div className="space-y-6">
          <button
            onClick={handleUseCurrentLocation}
            className="w-full p-6 gradient-purple-blue text-white rounded-3xl font-semibold 
                     hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 
                     transition-all duration-500 ease-out group"
          >
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold">Usar mi ubicación actual</div>
                <div className="text-white/80 text-sm">GPS automático</div>
              </div>
            </div>
          </button>

          <div className="bg-muted/30 rounded-3xl p-6 border border-border/50">
            <p className="text-foreground mb-4 font-medium">O selecciona en el mapa:</p>
            <div className="h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center border border-border/30">
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-card shadow-lg flex items-center justify-center text-2xl mb-4 mx-auto">
                  🗺️
                </div>
                <span className="text-muted-foreground font-medium">Mapa interactivo</span>
                <p className="text-xs text-muted-foreground mt-2">Próximamente disponible</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8 gap-4">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-4 bg-muted/50 border border-border rounded-2xl text-foreground 
                     hover:bg-muted hover:scale-105 transition-all duration-300 font-medium
                     flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Atrás</span>
          </button>

          <button
            onClick={() => onLocationConfirm(9.9281, -84.0907)}
            className="flex-1 px-6 py-4 bg-secondary border border-border rounded-2xl text-secondary-foreground 
                     hover:bg-accent hover:scale-105 transition-all duration-300 font-medium
                     flex items-center justify-center space-x-2"
          >
            <span>Continuar sin ubicación</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}