// src/components/PhotoStep.tsx - VERSIÓN CORREGIDA (Múltiples fotos funcionando)
"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import '../app/globals.css'

interface PhotoStepProps {
  onPhotosChange: (photos: File[]) => void
  onObservationsChange: (observations: string) => void
  onBack: () => void
  onNext: () => void
}

interface PhotoPreview {
  id: string
  file: File
  url: string
  timestamp: number
  blob: Blob // ← AGREGAR ESTA LÍNEA PARA MANTENER LA REFERENCIA AL BLOB
}

export default function PhotoStep({ 
  onPhotosChange, 
  onObservationsChange, 
  onBack, 
  onNext 
}: PhotoStepProps) {
  const [photos, setPhotos] = useState<PhotoPreview[]>([])
  const [observations, setObservations] = useState("")
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para actualizar las fotos y notificar al componente padre
  const updatePhotos = useCallback((newPhotos: PhotoPreview[]) => {
    setPhotos(newPhotos);
    onPhotosChange(newPhotos.map(photo => photo.file));
  }, [onPhotosChange]);

  // Abrir cámara del dispositivo
  const openCamera = useCallback(async () => {
    try {
      // CORRECCIÓN: Limpiar stream anterior SI existe
      if (stream) {
        console.log('🔄 Limpiando stream anterior...');
        stream.getTracks().forEach(track => {
          console.log(`⏹️ Deteniendo track: ${track.kind}`);
          track.stop();
        });
        setStream(null);
        // Pequeña pausa para asegurar la limpieza
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log('🎥 Intentando abrir cámara...');
      setIsCameraOpen(true);
      
      // Verificar disponibilidad de la API
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador no soporta acceso a la cámara');
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      console.log('✅ Stream obtenido:', mediaStream);
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          console.log('📺 Video metadata cargada');
          videoRef.current?.play().catch(err => {
            console.error('❌ Error playing video:', err);
          });
        };

        // Agregar manejo de errores del video
        videoRef.current.onerror = (e) => {
          console.error('❌ Error en elemento video:', e);
        };
      }
    } catch (error: any) {
      console.error('❌ Error al acceder a la cámara:', error);
      setIsCameraOpen(false);
      alert('No se pudo acceder a la cámara: ' + error.message);
    }
  }, [stream]);

  // Efecto para reiniciar la cámara cuando se abre
  useEffect(() => {
    if (isCameraOpen && !stream) {
      // Si la cámara está abierta pero no hay stream, intentar abrirla
      openCamera();
    }
  }, [isCameraOpen, stream, openCamera]);

  // Cerrar cámara
  const closeCamera = useCallback(() => {
    if (stream) {
      console.log('🔴 Cerrando cámara...')
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraOpen(false)
  }, [stream])

  // SOLUCIÓN DEFINITIVA: Capturar foto manteniendo referencia al blob
  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      console.error('❌ No hay video, canvas o stream disponible')
      return
    }
    
    setIsCapturing(true)
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      // Verificar que el video esté listo
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error('❌ Video no está listo')
        setIsCapturing(false)
        return
      }

      // Configurar canvas
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('❌ No se pudo obtener el contexto 2D')
        setIsCapturing(false)
        return
      }

      // Dibujar frame actual
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // SOLUCIÓN: Convertir canvas a data URL en lugar de blob
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      
      // Convertir data URL a blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const timestamp = Date.now()
      const fileName = `foto_${timestamp}.jpg`
      
      // Crear File desde el blob
      const file = new File([blob], fileName, {
        type: 'image/jpeg',
        lastModified: timestamp
      })
      
      // Crear URL desde el blob (no desde data URL)
      const url = URL.createObjectURL(blob)
      
      const photoPreview: PhotoPreview = {
        id: `photo_${timestamp}`,
        file,
        url,
        timestamp,
        blob // ← MANTENER REFERENCIA AL BLOB
      }
      
      // Actualizar fotos
      const updatedPhotos = [...photos, photoPreview]
      updatePhotos(updatedPhotos)
      
      console.log(`✅ Foto capturada: ${fileName} (${blob.size} bytes)`)
      
    } catch (error) {
      console.error('❌ Error al capturar foto:', error)
      alert('Error al capturar la foto: ' + error)
    } finally {
      setIsCapturing(false)
    }
  }, [photos, updatePhotos, stream])

  // ALTERNATIVA MÁS SIMPLE: Usar data URL directamente para preview
  const capturePhotoSimple = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      return
    }
    
    setIsCapturing(true)
    
    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      
      // SOLUCIÓN SIMPLE: Usar data URL directamente para el preview
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
      
      const timestamp = Date.now()
      const fileName = `foto_${timestamp}.jpg`
      
      // Convertir data URL a blob para el File
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      
      const file = new File([blob], fileName, {
        type: 'image/jpeg',
        lastModified: timestamp
      })
      
      const photoPreview: PhotoPreview = {
        id: `photo_${timestamp}`,
        file,
        url: dataUrl, // ← USAR DATA URL DIRECTAMENTE PARA EL PREVIEW
        timestamp,
        blob
      }
      
      const updatedPhotos = [...photos, photoPreview]
      updatePhotos(updatedPhotos)
      
      console.log(`✅ Foto capturada: ${fileName}`)
      
    } catch (error) {
      console.error('Error al capturar foto:', error)
    } finally {
      setIsCapturing(false)
    }
  }, [photos, updatePhotos, stream])

  // Subir fotos desde galería
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return
    
    const newPhotos: PhotoPreview[] = []
    
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const timestamp = Date.now() + Math.random()
        const photoPreview: PhotoPreview = {
          id: `photo_${timestamp}`,
          file,
          url: URL.createObjectURL(file),
          timestamp,
          blob: file // Para archivos subidos, el file ya es un blob
        }
        newPhotos.push(photoPreview)
      }
    })
    
    const updatedPhotos = [...photos, ...newPhotos]
    updatePhotos(updatedPhotos)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [photos, updatePhotos])

  // Eliminar foto
  const handleRemovePhoto = useCallback((photoId: string) => {
    const photoToRemove = photos.find(p => p.id === photoId)
    if (photoToRemove) {
      // Solo revocar URL si no es una data URL
      if (!photoToRemove.url.startsWith('data:')) {
        URL.revokeObjectURL(photoToRemove.url)
      }
    }
    
    const updatedPhotos = photos.filter(p => p.id !== photoId)
    updatePhotos(updatedPhotos)
  }, [photos, updatePhotos])

  // Actualizar observaciones
  const handleObservationsChange = useCallback((value: string) => {
    setObservations(value)
    onObservationsChange(value)
  }, [onObservationsChange])

  // Limpiar recursos al desmontar
  useEffect(() => {
    return () => {
      if (stream) {
        console.log('🧹 Limpiando stream en cleanup...');
        stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      // No liberar URLs de fotos aquí para mantener las previews
    };
  }, [stream]);

  return (
    <div className="flex flex-col animate-fadeInUp">
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-foreground mb-2">Fotos y Observaciones</h2>
          <p className="text-muted-foreground text-lg">Documenta el evento con imágenes</p>
        </div>

        {/* Modal de Cámara */}
        {isCameraOpen && (
          <div className="fixed inset-0 z-50 bg-black flex flex-col">
            {/* Header de la cámara */}
            <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="text-white font-semibold flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stream ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                Cámara {stream ? 'Activa' : 'Iniciando...'}
              </div>
              <button
                onClick={closeCamera}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Vista de la cámara */}
            <div className="flex-1 relative overflow-hidden bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(1)' }}
              />
              
              {/* Canvas oculto para captura */}
              <canvas
                ref={canvasRef}
                className="hidden"
              />

              {/* Overlay de guía */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {stream && (
                  <div className="w-full h-full border-2 border-white/30 m-auto" 
                       style={{ maxWidth: '90%', maxHeight: '90%' }} />
                )}
              </div>

              {/* Estado de la cámara */}
              {stream && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  {photos.length} {photos.length === 1 ? 'foto' : 'fotos'}
                </div>
              )}
            </div>

            {/* Controles de la cámara */}
            <div className="p-8 bg-black/80 backdrop-blur-sm">
              <div className="flex justify-center items-center gap-8">
                {/* Contador de fotos */}
                <div className="text-white text-sm font-medium">
                  {photos.length} capturadas
                </div>

                {/* Botón de captura - USAR LA VERSIÓN SIMPLE */}
                <button
                  onClick={capturePhotoSimple}
                  disabled={isCapturing || !stream}
                  className={`w-20 h-20 rounded-full border-4 border-white 
                            flex items-center justify-center transition-all duration-200
                            ${isCapturing || !stream 
                              ? 'bg-gray-500 opacity-50 cursor-not-allowed' 
                              : 'bg-white/20 hover:bg-white/30 active:scale-95'
                            }`}
                >
                  {isCapturing ? (
                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white" />
                  )}
                </button>

                {/* Botón de galería */}
                <button
                  onClick={() => {
                    closeCamera()
                    setTimeout(() => fileInputRef.current?.click(), 300)
                  }}
                  className="w-12 h-12 rounded-lg bg-white/20 hover:bg-white/30 
                           flex items-center justify-center transition-colors"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>

              {isCapturing && (
                <div className="text-center text-white mt-4 text-sm">
                  Capturando foto...
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sección de fotos */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Fotos ({photos.length})
            </h3>
            
            <div className="flex gap-3">
              <button
                onClick={openCamera}
                className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary 
                         rounded-xl font-medium transition-all duration-200
                         flex items-center gap-2 border border-primary/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Cámara
              </button>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-secondary hover:bg-accent text-secondary-foreground 
                         rounded-xl font-medium transition-all duration-200
                         flex items-center gap-2 border border-border"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Galería
              </button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative group aspect-square rounded-2xl overflow-hidden 
                           bg-muted/30 border border-border/50 hover:border-primary/50 
                           transition-all duration-300"
                >
                  <img
                    src={photo.url}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">
                        Foto {index + 1}
                      </p>
                      <p className="text-white/70 text-xs">
                        {(photo.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRemovePhoto(photo.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-destructive hover:bg-destructive/90 
                             text-white rounded-full opacity-0 group-hover:opacity-100 
                             transition-all duration-200 flex items-center justify-center
                             shadow-lg hover:scale-110"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl bg-muted/10">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-foreground font-medium mb-2">No hay fotos aún</p>
              <p className="text-muted-foreground text-sm mb-4">
                Captura fotos con la cámara o sube desde tu galería
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={openCamera}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Abrir cámara
                </button>
                <span className="text-muted-foreground">o</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Subir desde galería
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sección de observaciones */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-foreground mb-4">
            Observaciones
          </label>
          <textarea
            value={observations}
            onChange={(e) => handleObservationsChange(e.target.value)}
            placeholder="Escribe observaciones relevantes sobre el evento..."
            rows={5}
            className="w-full p-4 bg-muted/30 border border-border rounded-2xl 
                     text-foreground placeholder-muted-foreground resize-none
                     focus:border-primary focus:ring-2 focus:ring-primary/20 
                     transition-all duration-200 outline-none"
          />
          <p className="text-sm text-muted-foreground mt-2">
            {observations.length} caracteres
          </p>
        </div>

        {/* Botones de navegación */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 py-4 bg-muted/50 hover:bg-muted border border-border 
                     rounded-2xl text-foreground font-semibold transition-all duration-300 
                     hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          
          <button
            onClick={onNext}
            className="flex-1 py-4 gradient-purple-blue text-white font-semibold 
                     rounded-2xl transition-all duration-300 hover:scale-105 
                     hover:shadow-2xl hover:shadow-primary/25
                     flex items-center justify-center gap-2"
          >
            Continuar
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}