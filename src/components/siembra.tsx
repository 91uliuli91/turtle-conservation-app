// src/components/siembra.tsx
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Anidacion {
  id: number;
  fecha_hora: string;
  zona_playa: string;
  tamano_nidada: number;
  especie: string;
  sembrado: boolean;
}

interface SiembraData {
  anidacion_id: number;
  medio_transporte: 'a_pie' | 'cuatrimoto' | 'vehiculo' | 'otro';
  medio_transporte_otro?: string;
  contenedor: 'bolsa' | 'cubeta' | 'caja' | 'otro';
  contenedor_otro?: string;
  se_coloco_jobo: boolean;
  numero_serie_jobo?: string;
  hora_apertura_nido: string;
  hora_cierre_nido: string;
  fecha_siembra: string;
  hora_siembra: string;
  observaciones?: string;
}

export default function SiembraPage() {
  const [anidaciones, setAnidaciones] = useState<Anidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnidacion, setSelectedAnidacion] = useState<Anidacion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [siembraData, setSiembraData] = useState<SiembraData>({
    anidacion_id: 0,
    medio_transporte: 'a_pie',
    contenedor: 'bolsa',
    se_coloco_jobo: false,
    hora_apertura_nido: '',
    hora_cierre_nido: '',
    fecha_siembra: new Date().toISOString().split('T')[0],
    hora_siembra: new Date().toTimeString().slice(0, 5),
  });
  const [saving, setSaving] = useState(false);

  // Cargar anidaciones pendientes
  useEffect(() => {
    fetchAnidaciones();
  }, []);

  const fetchAnidaciones = async () => {
    try {
      // TODO: Reemplazar con tu endpoint real
      // const response = await fetch('/api/anidaciones?pendientes=true');
      // const data = await response.json();
      
      // Mock data por ahora
      const mockData: Anidacion[] = [
        {
          id: 1,
          fecha_hora: '2024-11-05 18:30:00',
          zona_playa: 'Norte',
          tamano_nidada: 120,
          especie: 'Chelonia mydas',
          sembrado: false
        },
        {
          id: 2,
          fecha_hora: '2024-11-06 20:15:00',
          zona_playa: 'Centro',
          tamano_nidada: 95,
          especie: 'Eretmochelys imbricata',
          sembrado: false
        },
      ];
      
      setAnidaciones(mockData);
    } catch (error) {
      console.error('Error cargando anidaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnidacion = (anidacion: Anidacion) => {
    setSelectedAnidacion(anidacion);
    setSiembraData(prev => ({ ...prev, anidacion_id: anidacion.id }));
    setShowForm(true);
  };

  const handleInputChange = (field: keyof SiembraData, value: any) => {
    setSiembraData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // TODO: Implementar guardado en API
      // const response = await fetch('/api/siembra', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(siembraData)
      // });

      console.log('📦 Datos de siembra:', siembraData);
      
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('✅ Siembra registrada exitosamente');
      setShowForm(false);
      setSelectedAnidacion(null);
      fetchAnidaciones();
    } catch (error) {
      console.error('Error guardando siembra:', error);
      alert('❌ Error al guardar la siembra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground">Cargando anidaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </Link>
          
          <h1 className="text-4xl font-bold text-foreground mb-2">
            🌱 Siembra de Nidos
          </h1>
          <p className="text-muted-foreground">
            Registra el traslado y siembra de huevos en áreas protegidas
          </p>
        </div>

        {/* Lista de Anidaciones Pendientes */}
        {!showForm ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Anidaciones Pendientes de Siembra
            </h2>
            
            {anidaciones.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-foreground font-medium mb-2">No hay anidaciones pendientes</p>
                <p className="text-muted-foreground text-sm">
                  Todas las anidaciones han sido sembradas
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {anidaciones.map((anidacion) => (
                  <div
                    key={anidacion.id}
                    className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20 hover:border-emerald-500/40 transition-all hover:scale-105 cursor-pointer"
                    onClick={() => handleSelectAnidacion(anidacion)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nido #{anidacion.id}</p>
                          <p className="font-semibold text-foreground">{anidacion.zona_playa}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fecha:</span>
                        <span className="text-foreground font-medium">
                          {new Date(anidacion.fecha_hora).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Huevos:</span>
                        <span className="text-foreground font-medium">{anidacion.tamano_nidada}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Especie:</span>
                        <span className="text-foreground font-medium text-xs">{anidacion.especie}</span>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
                      Registrar Siembra
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          
          /* Formulario de Siembra */
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Registro de Siembra - Nido #{selectedAnidacion?.id}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedAnidacion(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
            
              {/* Información del Nido */}
              <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                <h3 className="font-semibold text-foreground mb-3">Información del Nido</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Zona:</span>
                    <span className="ml-2 font-medium">{selectedAnidacion?.zona_playa}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Huevos:</span>
                    <span className="ml-2 font-medium">{selectedAnidacion?.tamano_nidada}</span>
                  </div>
                </div>
              </div>

              {/* Medio de Transporte */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Medio de Transporte *
                </label>
                <select
                  value={siembraData.medio_transporte}
                  onChange={(e) => handleInputChange('medio_transporte', e.target.value)}
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                  required
                >
                  <option value="a_pie">A pie</option>
                  <option value="cuatrimoto">Cuatrimoto</option>
                  <option value="vehiculo">Vehículo</option>
                  <option value="otro">Otro</option>
                </select>
                {siembraData.medio_transporte === 'otro' && (
                  <input
                    type="text"
                    value={siembraData.medio_transporte_otro || ''}
                    onChange={(e) => handleInputChange('medio_transporte_otro', e.target.value)}
                    placeholder="Especificar medio de transporte"
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground mt-2"
                    required
                  />
                )}
              </div>

              {/* Contenedor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Contenedor *
                </label>
                <select
                  value={siembraData.contenedor}
                  onChange={(e) => handleInputChange('contenedor', e.target.value)}
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                  required
                >
                  <option value="bolsa">Bolsa</option>
                  <option value="cubeta">Cubeta</option>
                  <option value="caja">Caja</option>
                  <option value="otro">Otro</option>
                </select>
                {siembraData.contenedor === 'otro' && (
                  <input
                    type="text"
                    value={siembraData.contenedor_otro || ''}
                    onChange={(e) => handleInputChange('contenedor_otro', e.target.value)}
                    placeholder="Especificar contenedor"
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground mt-2"
                    required
                  />
                )}
              </div>

              {/* Jobo (Sensor de Temperatura) */}
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <input
                    type="checkbox"
                    checked={siembraData.se_coloco_jobo}
                    onChange={(e) => handleInputChange('se_coloco_jobo', e.target.checked)}
                    className="w-5 h-5 text-primary"
                  />
                  <label className="text-sm font-medium text-foreground">
                    🌡️ Se colocó Jobo (sensor de temperatura)
                  </label>
                </div>
                
                {siembraData.se_coloco_jobo && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Número de Serie del Jobo *
                    </label>
                    <input
                      type="text"
                      value={siembraData.numero_serie_jobo || ''}
                      onChange={(e) => handleInputChange('numero_serie_jobo', e.target.value)}
                      placeholder="Ej: JOBO-2024-001"
                      className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                      required={siembraData.se_coloco_jobo}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      El jobo se mete al sembrar los huevos para medir la temperatura del nido
                    </p>
                  </div>
                )}
              </div>

              {/* Horarios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hora de Apertura del Nido *
                  </label>
                  <input
                    type="time"
                    value={siembraData.hora_apertura_nido}
                    onChange={(e) => handleInputChange('hora_apertura_nido', e.target.value)}
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hora de Cierre del Nido *
                  </label>
                  <input
                    type="time"
                    value={siembraData.hora_cierre_nido}
                    onChange={(e) => handleInputChange('hora_cierre_nido', e.target.value)}
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                    required
                  />
                </div>
              </div>

              {/* Fecha y Hora de Siembra */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Fecha de Siembra *
                  </label>
                  <input
                    type="date"
                    value={siembraData.fecha_siembra}
                    onChange={(e) => handleInputChange('fecha_siembra', e.target.value)}
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Hora de Siembra *
                  </label>
                  <input
                    type="time"
                    value={siembraData.hora_siembra}
                    onChange={(e) => handleInputChange('hora_siembra', e.target.value)}
                    className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                    required
                  />
                </div>
              </div>

              {/* Observaciones */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Observaciones
                </label>
                <textarea
                  value={siembraData.observaciones || ''}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Notas adicionales sobre la siembra..."
                  rows={4}
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setSelectedAnidacion(null);
                  }}
                  className="flex-1 py-3 bg-muted/50 border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 gradient-purple-blue text-white rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {saving ? 'Guardando...' : '✅ Registrar Siembra'}
                </button>
              </div>
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
      );
    }
  