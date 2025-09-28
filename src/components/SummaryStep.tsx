// src/components/SummaryStep.tsx
"use client"

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
    <div className="flex flex-col p-4 h-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Resumen del Evento</h2>

      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Información General</h3>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-400">Tipo de Evento:</span>
            <span className="font-semibold">{getEventTypeName(eventData.type)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Ubicación:</span>
            <span className="font-semibold">
              {eventData.location.lat.toFixed(6)}, {eventData.location.lon.toFixed(6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Fecha/Hora:</span>
            <span className="font-semibold">
              {eventData.date ? new Date(eventData.date).toLocaleString() : new Date().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      {eventData.type === "anidacion" && eventData.details?.numeroHuevos && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Detalles de Anidación</h3>
          <div className="flex justify-between">
            <span className="text-gray-400">Número de Huevos:</span>
            <span className="font-semibold">{eventData.details.numeroHuevos}</span>
          </div>
        </div>
      )}

      {(eventData.type === "arqueo" || eventData.type === "anidacion") && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Mediciones</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Largo caparazón:</span>
              <span className="font-semibold">{eventData.details.largoCaparazon} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Ancho caparazón:</span>
              <span className="font-semibold">{eventData.details.anchoCaparazon} cm</span>
            </div>
          </div>
        </div>
      )}

      {eventData.observations && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Observaciones</h3>
          <p className="text-gray-300">{eventData.observations}</p>
        </div>
      )}

      {eventData.photos && eventData.photos.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">
            Fotos ({eventData.photos.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {eventData.photos.slice(0, 4).map((photo: string, index: number) => (
              <img key={index} src={photo} alt={`Foto ${index + 1}`} className="w-full h-20 object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-auto">
        <button
          onClick={onBack}
          className="flex-1 py-3 bg-gray-600 rounded-lg text-white font-semibold"
          disabled={isSaving}
        >
          ← Volver
        </button>
        <button
          onClick={onSave}
          className="flex-1 py-3 bg-green-600 rounded-lg text-white font-semibold disabled:bg-gray-600"
          disabled={isSaving}
        >
          {isSaving ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Guardando....
            </span>
          ) : (
            "✅ Guardar Evento"
          )}
        </button>
      </div>
    </div>
  )
}
