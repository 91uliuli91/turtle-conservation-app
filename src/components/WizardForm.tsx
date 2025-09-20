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

const handleSave = async () => {
setIsSaving(true);
setSaveStatus('saving');

try {
    if (isOnline) {
    // Guardar online (simulado)
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
    alert('❌ Error guardando el evento. Por favor intenta nuevamente.');
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
}