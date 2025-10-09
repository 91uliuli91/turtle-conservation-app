// src/components/LocationPicker.tsx - CON MAPA INTERACTIVO (CORREGIDO)
"use client"

import { useState, useEffect, useRef } from 'react'
import '../app/globals.css'

interface LocationPickerProps {
  onLocationConfirm: (lat: number, lon: number) => void
  onBack: () => void
}

interface MapPosition {
  lat: number
  lon: number
  accuracy?: number
}

export default function LocationPicker({ onLocationConfirm, onBack }: LocationPickerProps) {
  const [selectedPosition, setSelectedPosition] = useState<MapPosition | null>(null)
  const [currentPosition, setCurrentPosition] = useState<MapPosition | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const [marker, setMarker] = useState<any>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  // Cargar scripts de Leaflet dinámicamente
  useEffect(() => {
    if (!showMap) return

    const loadLeaflet = async () => {
      try {
        // Verificar si ya está cargado
        if (typeof window !== 'undefined' && (window as any).L) {
          initializeMap()
          return
        }

        // Cargar CSS de Leaflet
        const cssLink = document.createElement('link')
        cssLink.rel = 'stylesheet'
        cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
        cssLink.crossOrigin = ''
        document.head.appendChild(cssLink)

        // Cargar JS de Leaflet
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='
        script.crossOrigin = ''
        
        script.onload = () => {
          console.log('✅ Leaflet cargado')
          initializeMap()
        }
        
        script.onerror = () => {
          setMapError('Error al cargar el mapa. Por favor, intenta de nuevo.')
        }
        
        document.body.appendChild(script)
      } catch (error) {
        console.error('Error cargando Leaflet:', error)
        setMapError('Error al cargar el mapa')
      }
    }

    loadLeaflet()

    // Cleanup
    return () => {
      if (mapInstance) {
        mapInstance.remove()
        setMapInstance(null)
      }
    }
  }, [showMap])

  // Inicializar mapa de Leaflet
  const initializeMap = () => {
    if (!mapContainerRef.current || mapInstance) return

    const L = (window as any).L
    if (!L) return

    try {
      // Posición inicial (Cancún por defecto o ubicación actual)
      const initialPosition = currentPosition || { lat: 21.1619, lon: -86.8515 }

      // Crear mapa
      const map = L.map(mapContainerRef.current).setView(
        [initialPosition.lat, initialPosition.lon],
        currentPosition ? 16 : 13
      )

      // Añadir capa de tiles (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        className: 'map-tiles'
      }).addTo(map)

      // Crear icono personalizado para el marcador
      const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div class="marker-pin">
            <svg class="w-8 h-8 text-primary drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C7.802 0 4.403 3.403 4.403 7.602c0 4.198 7.597 16.398 7.597 16.398s7.597-12.2 7.597-16.398C19.597 3.403 16.198 0 12 0zm0 11.5c-2.198 0-4-1.802-4-4s1.802-4 4-4 4 1.802 4 4-1.802 4-4 4z"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      })

      // Añadir marcador draggable
      const newMarker = L.marker(
        [initialPosition.lat, initialPosition.lon],
        {
          draggable: true,
          icon: customIcon
        }
      ).addTo(map)

      // Tooltip con instrucciones
      newMarker.bindTooltip('📍 Arrastra para ajustar la ubicación', {
        permanent: false,
        direction: 'top',
        offset: [0, -32]
      })

      // Actualizar posición al arrastrar
      newMarker.on('dragend', function(event: any) {
        const position = event.target.getLatLng()
        setSelectedPosition({
          lat: position.lat,
          lon: position.lng
        })
      })

      // Click en el mapa para mover el marcador
      map.on('click', function(event: any) {
        const { lat, lng } = event.latlng
        newMarker.setLatLng([lat, lng])
        setSelectedPosition({ lat, lon: lng })
      })

      // Establecer posición inicial seleccionada
      setSelectedPosition(initialPosition)
      setMarker(newMarker)
      setMapInstance(map)
      setMapError(null)

      // Si hay ubicación actual, agregar círculo de precisión
      if (currentPosition?.accuracy) {
        L.circle([currentPosition.lat, currentPosition.lon], {
          radius: currentPosition.accuracy,
          color: '#6366f1',
          fillColor: '#6366f1',
          fillOpacity: 0.15,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(map)
      }

    } catch (error) {
      console.error('Error inicializando mapa:', error)
      setMapError('Error al inicializar el mapa')
    }
  }

  // Obtener ubicación actual del dispositivo
  const handleUseCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada en este navegador')
      return
    }

    setIsLoadingLocation(true)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          accuracy: position.coords.accuracy
        }
        
        setCurrentPosition(newPosition)
        setSelectedPosition(newPosition)
        setIsLoadingLocation(false)

        // Si el mapa está abierto, centrar en nueva ubicación
        if (mapInstance && marker) {
          const L = (window as any).L
          mapInstance.setView([newPosition.lat, newPosition.lon], 16)
          marker.setLatLng([newPosition.lat, newPosition.lon])
          
          // Agregar círculo de precisión
          L.circle([newPosition.lat, newPosition.lon], {
            radius: newPosition.accuracy,
            color: '#6366f1',
            fillColor: '#6366f1',
            fillOpacity: 0.15,
            weight: 2
          }).addTo(mapInstance)
        }
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error)
        setIsLoadingLocation(false)
        
        let errorMessage = 'Error obteniendo ubicación'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado. Por favor, habilita el acceso.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible. Intenta de nuevo.'
            break
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado. Intenta de nuevo.'
            break
        }
        
        alert(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    )
  }

  // Confirmar ubicación y continuar
  const handleConfirmLocation = () => {
    if (selectedPosition) {
      onLocationConfirm(selectedPosition.lat, selectedPosition.lon)
    } else {
      alert('Por favor, selecciona una ubicación en el mapa')
    }
  }

  return (
    <div className="animate-fadeInUp">
      <style jsx global>{`
        .custom-marker {
          background: transparent;
          border: none;
        }
        .marker-pin {
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bounce 2s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .map-tiles {
          filter: brightness(0.95) contrast(1.05);
        }
        .dark .map-tiles {
          filter: brightness(0.7) contrast(1.1) saturate(0.8);
        }
        .leaflet-container {
          font-family: inherit;
        }
        .leaflet-tooltip {
          background-color: rgba(0, 0, 0, 0.8);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 8px 12px;
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>

      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-light text-foreground mb-4 text-balance">
            Selecciona la ubicación
          </h3>
          <p className="text-muted-foreground text-lg text-pretty">
            Obtén la ubicación precisa del evento
          </p>
        </div>

        {/* Botón de ubicación actual */}
        <button
          onClick={handleUseCurrentLocation}
          disabled={isLoadingLocation}
          className={`w-full p-6 gradient-purple-blue text-white rounded-3xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 ease-out group mb-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
        >
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              {isLoadingLocation ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </div>
            <div className="text-left">
              <div className="text-lg font-bold">
                {isLoadingLocation ? 'Obteniendo ubicación...' : 'Usar mi ubicación actual'}
              </div>
              <div className="text-white/80 text-sm">GPS automático</div>
            </div>
          </div>
        </button>

        {/* Información de ubicación actual */}
        {currentPosition && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground mb-1">
                  Ubicación detectada
                </p>
                <p className="text-xs text-muted-foreground">
                  Lat: {currentPosition.lat.toFixed(6)}, Lon: {currentPosition.lon.toFixed(6)}
                </p>
                {currentPosition.accuracy && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Precisión: ±{Math.round(currentPosition.accuracy)}m
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mapa interactivo */}
        <div className="mb-6">
          {!showMap ? (
            <div className="bg-muted/30 rounded-2xl p-8 border border-border/50 text-center">
              <div className="w-20 h-20 rounded-2xl bg-card shadow-lg flex items-center justify-center mb-6 mx-auto">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              
              <h4 className="text-lg font-semibold text-foreground mb-2">
                O selecciona en el mapa
              </h4>
              <p className="text-muted-foreground text-sm mb-6">
                Elige la ubicación exacta arrastrando el marcador o haciendo clic
              </p>
              
              <button
                onClick={() => setShowMap(true)}
                className={`px-8 py-3 gradient-purple-blue text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25 inline-flex items-center gap-2`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Abrir Mapa Interactivo
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Instrucciones */}
              <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      💡 Arrastra el marcador 📍 o haz clic en el mapa para ajustar la ubicación
                    </p>
                  </div>
                </div>
              </div>

              {/* Contenedor del mapa */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-border/50 shadow-xl">
                {mapError ? (
                  <div className="h-96 bg-destructive/10 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-destructive mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-destructive font-medium">{mapError}</p>
                      <button
                        onClick={() => {
                          setMapError(null)
                          setShowMap(false)
                          setTimeout(() => setShowMap(true), 100)
                        }}
                        className="mt-4 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div ref={mapContainerRef} className="h-96 w-full" style={{ minHeight: '400px' }} />
                    
                    {/* Controles del mapa */}
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 z-[1000]">
                      <button
                        onClick={handleUseCurrentLocation}
                        disabled={isLoadingLocation}
                        className={`flex-1 px-4 py-3 bg-card/95 backdrop-blur-sm border border-border rounded-xl font-medium text-sm hover:bg-accent transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoadingLocation ? (
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                        )}
                        Mi ubicación
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Coordenadas seleccionadas */}
              {selectedPosition && !mapError && (
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground mb-1">
                        📍 Ubicación seleccionada
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {selectedPosition.lat.toFixed(6)}, {selectedPosition.lon.toFixed(6)}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(
                            `${selectedPosition.lat.toFixed(6)}, ${selectedPosition.lon.toFixed(6)}`
                          )
                          alert('Coordenadas copiadas al portapapeles')
                        }
                      }}
                      className={`px-3 py-2 bg-card hover:bg-accent rounded-lg transition-colors text-xs font-medium flex items-center gap-2`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copiar
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className={`flex-1 px-6 py-4 bg-muted/50 border border-border rounded-2xl text-foreground hover:bg-muted hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Atrás</span>
          </button>

          {selectedPosition ? (
            <button
              onClick={handleConfirmLocation}
              className={`flex-1 px-6 py-4 gradient-purple-blue text-white rounded-2xl font-semibold hover:scale-105 hover:shadow-2xl hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-2`}
            >
              <span>Confirmar ubicación</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => onLocationConfirm(21.1619, -86.8515)}
              className={`flex-1 px-6 py-4 bg-secondary border border-border rounded-2xl text-secondary-foreground hover:bg-accent hover:scale-105 transition-all duration-300 font-medium flex items-center justify-center space-x-2 text-sm`}
            >
              <span>Continuar sin ubicación</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}