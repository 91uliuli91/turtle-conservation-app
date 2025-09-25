// src/components/WizardForm.tsx
'use client';

import { useState, useEffect } from 'react';
import EventTypeSelector from './EventTypeSelector';
import LocationPicker from './LocationPicker';
import EventDetails from './EventDetails';
import PhotoStep from './PhotoStep';
import SummaryStep from './SummaryStep';
import { useOffline } from '@/hooks/useOffline';

export default function WizardForm() {
const [currentStep, setCurrentStep] = useState(1);
const [eventData, setEventData] = useState({
type: '',
location: { lat: 0, lon: 0 },
details: {},
photos: [] as string[],
observations: ''
});
const [isSaving, setIsSaving] = useState(false);
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

const { isOnline, pendingSyncs, saveEventOffline, syncPendingEvents } = useOffline();

const nextStep = () => setCurrentStep(prev => prev + 1);
const prevStep = () => setCurrentStep(prev => prev - 1);

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
    alert(`❌ Error guardando el evento: ${error.message}. Por favor intenta nuevamente.`);
  } finally {
    setIsSaving(false);
  }
};

const renderCurrentStep = () => {
switch (currentStep) {
    case 1:
    return (
        <EventTypeSelector
        onSelect={(type) => {
            updateEventData('type', type);
            nextStep();
        }}
        />
    );
    case 2:
    return (
        <LocationPicker
        onLocationConfirm={(lat, lon) => {
            updateEventData('location', { lat, lon });
            nextStep();
        }}
        onBack={prevStep}
        />
    );
    case 3:
    return (
        <EventDetails
        eventType={eventData.type}
        onDetailsChange={(details) => updateEventData('details', details)}
        onBack={prevStep}
        onNext={nextStep}
        />
    );
    case 4:
    return (
        <PhotoStep
        onPhotosChange={(photos) => updateEventData('photos', photos)}
        onObservationsChange={(observations) => updateEventData('observations', observations)}
        onBack={prevStep}
        onNext={nextStep}
        />
    );
    case 5:
    return (
        <SummaryStep
        eventData={eventData}
        onBack={prevStep}
        onSave={handleSave}
        isSaving={isSaving}
        />
    );
    default:
    return <div>Paso no válido</div>;
}
};

return (
  <div className="w-full bg-white text-gray-900 rounded-lg">
    {/* Header con indicador de conexión */}
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Registro de Evento - Paso {currentStep} de 5
        </h2>
        
        {/* Indicador de estado de conexión */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {isOnline ? '🟢 En línea' : '🔴 Offline'}
          {pendingSyncs > 0 && ` (${pendingSyncs} pendientes)`}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">Progreso</span>
          <span className="text-sm text-gray-500">{currentStep}/5</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          ></div>
        </div>
        
        {/* Indicadores de pasos */}
        <div className="flex justify-between mt-3">
          {[
            { step: 1, label: 'Tipo' },
            { step: 2, label: 'Ubicación' },
            { step: 3, label: 'Detalles' },
            { step: 4, label: 'Fotos' },
            { step: 5, label: 'Resumen' }
          ].map(({ step, label }) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
                currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : currentStep === step - 1
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step ? '✓' : step}
              </div>
              <span className={`text-xs mt-1 ${
                currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-400'
              }`}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Contenido del paso actual */}
    <div className="px-6 py-8 min-h-[500px]">
      {renderCurrentStep()}
    </div>

    {/* Footer con estados */}
    {saveStatus !== 'idle' && (
      <div className="border-t border-gray-200 px-6 py-4">
        {saveStatus === 'saving' && (
          <div className="flex items-center text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            Guardando evento...
          </div>
        )}
        {saveStatus === 'saved' && (
          <div className="flex items-center text-green-600">
            <i className="fas fa-check-circle mr-2"></i>
            ✅ Evento guardado {isOnline ? 'en línea' : 'offline'} exitosamente
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="flex items-center text-red-600">
            <i className="fas fa-exclamation-circle mr-2"></i>
            ❌ Error al guardar el evento
          </div>
        )}
      </div>
    )}
  </div>
);
}