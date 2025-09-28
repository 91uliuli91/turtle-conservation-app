'use client';

interface LocationPickerProps {
  onLocationConfirm: (lat: number, lon: number) => void;
  onBack: () => void;
}

export default function LocationPicker({ onLocationConfirm, onBack }: LocationPickerProps) {
  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationConfirm(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          alert('Error obteniendo ubicación: ' + error.message);
          // Coordenadas por defecto
          onLocationConfirm(9.9281, -84.0907); // Costa Rica
        }
      );
    } else {
      alert('Geolocalización no soportada');
      onLocationConfirm(9.9281, -84.0907); // Coordenadas por defecto
    }
  };

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold text-[#2dbf78] mb-6 text-center">
        Selecciona la ubicación
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={handleUseCurrentLocation}
          className="w-full p-4 bg-[#2dbf78] text-white rounded-lg font-semibold hover:bg-[#25a366] transition-colors"
        >
          📍 Usar mi ubicación actual
        </button>
        
        <div className="bg-[#1a3d2c] rounded-lg p-4">
          <p className="text-[#2dbf78] mb-2">O selecciona en el mapa:</p>
          <div className="h-48 bg-gray-700 rounded flex items-center justify-center">
            <span className="text-gray-400">Mapa interactivo aquí</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-[#1a3d2c] border border-[#2dbf78] rounded-lg text-[#2dbf78] hover:bg-[#2dbf78] hover:text-white transition-colors"
        >
          ← Atrás
        </button>
        
        <button
          onClick={() => onLocationConfirm(9.9281, -84.0907)}
          className="px-6 py-2 bg-[#1a3d2c] border border-[#2dbf78] rounded-lg text-[#2dbf78] hover:bg-[#2dbf78] hover:text-white transition-colors"
        >
          Continuar sin ubicación →
        </button>
      </div>
    </div>
  );
}