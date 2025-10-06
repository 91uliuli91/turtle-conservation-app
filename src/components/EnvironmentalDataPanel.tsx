"use client"

import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';

interface EnvironmentalDataPanelProps {
  compact?: boolean;
  showLocationInfo?: boolean;
}

export default function EnvironmentalDataPanel({ 
  compact = false, 
  showLocationInfo = true 
}: EnvironmentalDataPanelProps) {
  const { data: environmentalData, loading, error, deviceLocation, refetch } = useEnvironmentalData();

  if (loading) {
    return (
      <div className={`bg-card rounded-2xl p-4 border border-border/50 ${compact ? 'mb-4' : 'mb-6'}`}>
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm">
            {!deviceLocation ? 'Obteniendo ubicación...' : 'Obteniendo datos ambientales...'}
          </span>
        </div>
        {!deviceLocation && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Por favor, permite el acceso a tu ubicación
          </p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-card rounded-2xl p-4 border border-destructive/20 ${compact ? 'mb-4' : 'mb-6'}`}>
        <div className="text-center">
          <div className="text-destructive mb-2">⚠️ No se pudieron cargar los datos</div>
          <p className="text-sm text-muted-foreground mb-3">{error}</p>
          <button 
            onClick={refetch}
            className="text-xs bg-secondary px-3 py-1 rounded-lg hover:bg-accent transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!environmentalData) {
    return null;
  }

  // Versión compacta para formularios
  if (compact) {
    return (
      <div className="bg-card rounded-2xl p-4 border border-border/50 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Condiciones Actuales</span>
          {showLocationInfo && deviceLocation && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Tu ubicación
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">🌡️ Temp</div>
            <div className="text-sm font-semibold text-foreground">
              {environmentalData.weather.temperature}°C
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">💧 Hum</div>
            <div className="text-sm font-semibold text-foreground">
              {environmentalData.weather.humidity}%
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">🌊 Marea</div>
            <div className="text-sm font-semibold text-foreground">
              {environmentalData.tide.tideHeight > 0 ? `${environmentalData.tide.tideHeight}m` : '--'}
            </div>
          </div>
        </div>
        {environmentalData.tide.source && (
          <div className="text-xs text-muted-foreground text-center mt-2">
            Fuente: {environmentalData.tide.source}
          </div>
        )}
      </div>
    );
  }

  // Versión completa para dashboard
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Condiciones en Tu Ubicación
          </h3>
          {showLocationInfo && deviceLocation && (
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ubicación actual • Precisión: ±{Math.round(deviceLocation.accuracy)}m
            </p>
          )}
        </div>
        <button 
          onClick={refetch}
          className="text-xs bg-secondary px-3 py-1 rounded-lg hover:bg-accent transition-colors flex items-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Temperatura */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-3 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">Temperatura</div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {environmentalData.weather.temperature}°C
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Sensación: {environmentalData.weather.feelsLike}°C
          </div>
        </div>

        {/* Humedad */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-3 border border-blue-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">Humedad</div>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {environmentalData.weather.humidity}%
          </div>
          <div className="text-xs text-muted-foreground mt-1 capitalize">
            {environmentalData.weather.weatherCondition}
          </div>
        </div>

        {/* Mareas */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-3 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7l4-4m0 0l4 4m-4-4v18m0 0l-4-4m4 4l4-4" />
              </svg>
            </div>
            <div className="text-sm font-medium text-foreground">Marea</div>
          </div>
          
          <div className="text-2xl font-bold text-foreground">
            {environmentalData.tide.tideHeight}m
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {environmentalData.tide.tideStatus === 'high' && '🌊 Pleamar'}
            {environmentalData.tide.tideStatus === 'low' && '🔻 Bajamar'}
            {environmentalData.tide.tideStatus === 'rising' && '📈 Subiendo'}
            {environmentalData.tide.tideStatus === 'falling' && '📉 Bajando'}
            {environmentalData.tide.highTide !== '--:--' && ` • Alta: ${environmentalData.tide.highTide}`}
          </div>
        </div>

        {/* Fase Lunar */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-3 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-2xl">{environmentalData.moonPhase.icon}</div>
            <div className="text-sm font-medium text-foreground">Luna</div>
          </div>
          <div className="text-lg font-bold text-foreground">
            {environmentalData.moonPhase.phase}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {environmentalData.moonPhase.illumination}% iluminada
          </div>
        </div>
      </div>

      {/* Información de fuentes y ubicación */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="text-xs text-muted-foreground">
          <strong>Fuentes:</strong> Clima: OpenWeatherMap • Mareas: WorldTides • 
          Luna: Cálculo astronómico • Ubicación: Dispositivo GPS
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Actualizado: {environmentalData.timestamp}
          {deviceLocation && (
            <span> • Coord: {deviceLocation.lat.toFixed(4)}, {deviceLocation.lon.toFixed(4)}</span>
          )}
        </div>
      </div>
    </div>
  );
}