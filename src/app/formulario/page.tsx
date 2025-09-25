'use client';

import WizardForm from '@/components/WizardForm';

export default function FormularioPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-5xl mx-auto">
          {/* Header con botón de regreso */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Nuevo Evento de Tortuga</h1>
              <p className="text-gray-600">
                Registra un nuevo evento de anidación, arqueo o intento
              </p>
            </div>
            
            {/* Botón de regreso */}
            <button 
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <i className="fas fa-arrow-left text-gray-600"></i>
              <span className="text-gray-700">Volver</span>
            </button>
          </div>
          
          {/* Contenedor del formulario con mejor espaciado */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <WizardForm />
          </div>
        </div>
      </div>
    </div>
  );
}