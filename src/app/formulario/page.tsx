// src/app/formulario/page.tsx
'use client';

import WizardForm from '@/components/WizardForm'; // Importa el componente WizardForm para el registro de eventos

export default function FormularioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header con botón de regreso */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Nuevo Evento de Tortuga</h1>
              <p className="text-gray-600 text-lg">
                Registra un nuevo evento de anidación, arqueo o intento
              </p>
            </div>
            
            {/* Botón de regreso */}
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Volver</span>
            </button>
          </div>
          
          {/* Contenedor del formulario */}
          <div className="bg-white rounded-xl shadow-lg p-1">
            <WizardForm />
          </div>
        </div>
      </div>
    </div>
  );
}
