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
useEffect(() => {
  let syncInterval: NodeJS.Timeout;

  if (isOnline && pendingSyncs > 0) {
    // Intentar sincronizar cada 30 segundos mientras haya eventos pendientes
    syncInterval = setInterval(() => {
      syncPendingEvents().catch(console.error);
    }, 30000);
  }

  return () => {
    if (syncInterval) clearInterval(syncInterval);
  };
}, [isOnline, pendingSyncs, syncPendingEvents]);

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
      <div className="w-full h-full bg-gradient-to-br from-[#0a0f0f] to-[#0f1a1a] text-[#f0fdf4]  shadow-2xl border border-[#1a3d2c] overflow-hidden">
      {/* Header con indicador de conexión */}
      <div className="bg-gradient-to-r from-[#1a3d2c] to-[#0f2a1f] px-8 py-6 text-[#f0fdf4] border-b border-[#2dbf78]/30">
        <div className="flex justify-between items-center mb-4">
          
          <div>
            <h2 className="text-2xl font-bold">Registro de Evento</h2>
            <p className="text-[#2dbf78] text-sm mt-1">Complete la información del evento en 5 pasos</p>
          </div>
          
          {/* Indicador de estado de conexión */}
          <div className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm ${
            isOnline 
              ? 'bg-[#2dbf78]/20 text-[#2dbf78] border border-[#2dbf78]/40' 
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}>
            
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-[#2dbf78]' : 'bg-red-400'}`}></div>
              {isOnline ? 'En línea' : 'Offline'}
              {pendingSyncs > 0 && (
                <span className="bg-white/10 px-2 py-1 rounded-full text-xs">
                  {pendingSyncs} pendiente{pendingSyncs !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          
        </div>    
        {/* Botón de regreso */}
        <button 
          onClick={() => window.history.back()} // Regresa a la página anterior en el historial
          className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
        >
          {/* Icono de flecha hacia atrás */}
          <i className="fas fa-arrow-left text-gray-600"></i>
          <span className="text-gray-700">Volver</span>
        </button>
        {/* Barra de progreso y pasos */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[#2dbf78]">Progreso del formulario</span>
            <span className="text-sm font-semibold bg-[#2dbf78]/20 px-3 py-1 rounded-full text-[#2dbf78]">
              Paso {currentStep} de 5
            </span>
          </div>
          
          {/* Barra de progreso principal */}
          <div className="w-full bg-[#1a3d2c] rounded-full h-3 mb-6">
            <div 
              className="bg-[#2dbf78] h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            ></div>
          </div>
          
          {/* Indicadores de pasos */}
          <div className="flex justify-between relative">
            {/* Línea de conexión */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-[#1a3d2c] -z-10"></div>
            <div 
              className="absolute top-4 left-0 h-0.5 bg-[#2dbf78] transition-all duration-500 ease-out -z-10"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            ></div>
            
            {[
              { step: 1, label: 'Tipo de Evento', icon: '📋' },
              { step: 2, label: 'Ubicación', icon: '📍' },
              { step: 3, label: 'Detalles', icon: '✏️' },
              { step: 4, label: 'Multimedia', icon: '📷' },
              { step: 5, label: 'Resumen', icon: '✅' }
            ].map(({ step, label, icon }) => (
              <div key={step} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold transition-all duration-300 shadow-lg ${
                  currentStep >= step 
                    ? 'bg-[#2dbf78] text-[#0a0f0f] scale-110 shadow-[#2dbf78]/40' 
                    : currentStep === step - 1
                    ? 'bg-[#1a3d2c] text-[#2dbf78] border-2 border-[#2dbf78] shadow-lg'
                    : 'bg-[#1a3d2c] text-[#2dbf78]/60'
                }`}>
                  {currentStep > step ? '✓' : icon}
                </div>
                <span className={`text-xs mt-2 font-medium text-center max-w-[80px] ${
                  currentStep >= step ? 'text-[#2dbf78] font-semibold' : 'text-[#2dbf78]/70'
                }`}>
                  {label}
                </span>
                <span className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${
                  step === currentStep ? 'bg-yellow-400 text-[#0a0f0f] animate-pulse' : 'hidden'
                }`}>
                  !
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="px-8 py-8 min-h-[500px] bg-[#0a0f0f]/50 backdrop-blur-sm">
        <div className="bg-[#0f1a1a] rounded-2xl shadow-lg border border-[#1a3d2c] p-6 min-h-[400px]">
          {renderCurrentStep()}
        </div>
      </div>

      {/* Footer con estados */}
      {saveStatus !== 'idle' && (
        <div className="border-t border-[#1a3d2c] bg-[#0a0f0f] px-8 py-4">
          <div className={`flex items-center justify-center py-2 px-4 rounded-lg ${
            saveStatus === 'saving' ? 'bg-[#1a3d2c] border border-[#2dbf78]/30' :
            saveStatus === 'saved' ? 'bg-[#1a3d2c] border border-[#2dbf78]/50' :
            'bg-red-900/20 border border-red-500/30'
          }`}>
            {saveStatus === 'saving' && (
              <div className="flex items-center text-[#2dbf78]">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2dbf78] mr-3"></div>
                <span className="font-medium">Guardando evento...</span>
              </div>
            )}
            {saveStatus === 'saved' && (
              <div className="flex items-center text-[#2dbf78]">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">
                  Evento guardado {isOnline ? 'en línea' : 'offline'} exitosamente
                </span>
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center text-red-400">
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Error al guardar el evento</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}