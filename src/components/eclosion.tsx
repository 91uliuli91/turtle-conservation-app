// src/app/eclosion/page.tsx - PÁGINA DE ECLOSIÓN Y LIMPIEZA DE NIDOS
"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Nido {
  id: number;
  anidacion_id: number;
  numero_huevos: number;
  fecha_siembra: string;
  fecha_probable_eclosion: string;
  dias_restantes: number;
  zona_playa: string;
  especie: string;
  estado: 'pendiente' | 'proximo' | 'listo';
  identificador_corral?: string;
}

interface ArqueoData {
  nido_id: number;
  fecha_hora_arqueo: string;
  crias_vivas_liberadas: number;
  crias_muertas_en_nido: number;
  crias_deformes: number;
  huevos_no_eclosionados: number;
  comentarios: string;
  fotografo?: string;
}

export default function EclosionPage() {
  const [nidos, setNidos] = useState<Nido[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNido, setSelectedNido] = useState<Nido | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [arqueoData, setArqueoData] = useState<ArqueoData>({
    nido_id: 0,
    fecha_hora_arqueo: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().slice(0, 5),
    crias_vivas_liberadas: 0,
    crias_muertas_en_nido: 0,
    crias_deformes: 0,
    huevos_no_eclosionados: 0,
    comentarios: '',
  });
  const [saving, setSaving] = useState(false);
  const [filterEstado, setFilterEstado] = useState<'todos' | 'proximo' | 'listo'>('todos');

  useEffect(() => {
    fetchNidos();
  }, []);

  const fetchNidos = async () => {
    try {
      // TODO: Reemplazar con endpoint real
      // const response = await fetch('/api/nidos?estado=pendiente_eclosion');
      // const data = await response.json();
      
      // Mock data
      const mockData: Nido[] = [
        {
          id: 1,
          anidacion_id: 1,
          numero_huevos: 120,
          fecha_siembra: '2024-10-15',
          fecha_probable_eclosion: '2024-12-14',
          dias_restantes: 3,
          zona_playa: 'Norte',
          especie: 'Chelonia mydas',
          estado: 'listo',
          identificador_corral: 'CORRAL-A-001'
        },
        {
          id: 2,
          anidacion_id: 2,
          numero_huevos: 95,
          fecha_siembra: '2024-10-20',
          fecha_probable_eclosion: '2024-12-19',
          dias_restantes: 8,
          zona_playa: 'Centro',
          especie: 'Eretmochelys imbricata',
          estado: 'proximo',
          identificador_corral: 'CORRAL-B-005'
        },
        {
          id: 3,
          anidacion_id: 3,
          numero_huevos: 110,
          fecha_siembra: '2024-10-25',
          fecha_probable_eclosion: '2024-12-24',
          dias_restantes: 13,
          zona_playa: 'Sur',
          especie: 'Caretta caretta',
          estado: 'pendiente',
          identificador_corral: 'CORRAL-C-012'
        },
      ];
      
      setNidos(mockData);
    } catch (error) {
      console.error('Error cargando nidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectNido = (nido: Nido) => {
    setSelectedNido(nido);
    setArqueoData(prev => ({ ...prev, nido_id: nido.id }));
    setShowForm(true);
  };

  const handleInputChange = (field: keyof ArqueoData, value: any) => {
    setArqueoData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSaving(true);

    try {
      // TODO: Implementar guardado en API
      // const response = await fetch('/api/eventos/arqueo', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(arqueoData)
      // });

      console.log('📊 Datos de arqueo:', arqueoData);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('✅ Arqueo registrado exitosamente');
      setShowForm(false);
      setSelectedNido(null);
      fetchNidos();
    } catch (error) {
      console.error('Error guardando arqueo:', error);
      alert('❌ Error al guardar el arqueo');
    } finally {
      setSaving(false);
    }
  };

  const getNidosFiltrados = () => {
    if (filterEstado === 'todos') return nidos;
    return nidos.filter(n => n.estado === filterEstado);
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'listo': return 'from-green-500/10 to-emerald-500/10 border-green-500/30';
      case 'proximo': return 'from-orange-500/10 to-yellow-500/10 border-orange-500/30';
      default: return 'from-blue-500/10 to-cyan-500/10 border-blue-500/30';
    }
  };

  const getEstadoIcon = (estado: string) => {
    switch (estado) {
      case 'listo':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'proximo':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const totalHuevos = arqueoData.crias_vivas_liberadas + 
                     arqueoData.crias_muertas_en_nido + 
                     arqueoData.crias_deformes + 
                     arqueoData.huevos_no_eclosionados;

  const tasaEclosion = selectedNido ? 
    ((arqueoData.crias_vivas_liberadas / selectedNido.numero_huevos) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-foreground">Cargando nidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 pb-24">
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
            🐢 Eclosión y Limpieza
          </h1>
          <p className="text-muted-foreground">
            Registra el arqueo de nidos y liberación de crías
          </p>
        </div>

        {/* Filtros */}
        {!showForm && (
          <div className="bg-card rounded-2xl p-4 mb-6 border border-border/50">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setFilterEstado('todos')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filterEstado === 'todos' 
                    ? 'bg-primary text-white' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Todos ({nidos.length})
              </button>
              <button
                onClick={() => setFilterEstado('listo')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filterEstado === 'listo' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Listos ({nidos.filter(n => n.estado === 'listo').length})
              </button>
              <button
                onClick={() => setFilterEstado('proximo')}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  filterEstado === 'proximo' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                Próximos ({nidos.filter(n => n.estado === 'proximo').length})
              </button>
            </div>
          </div>
        )}

        {/* Lista de Nidos */}
        {!showForm ? (
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Nidos Pendientes de Arqueo
            </h2>
            
            {getNidosFiltrados().length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-foreground font-medium mb-2">No hay nidos en esta categoría</p>
                <p className="text-muted-foreground text-sm">
                  Intenta con otro filtro
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getNidosFiltrados().map((nido) => (
                  <div
                    key={nido.id}
                    className={`bg-gradient-to-br ${getEstadoColor(nido.estado)} rounded-xl p-4 border hover:scale-105 transition-all cursor-pointer`}
                    onClick={() => handleSelectNido(nido)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center">
                          {getEstadoIcon(nido.estado)}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Nido #{nido.id}</p>
                          <p className="font-semibold text-foreground">{nido.zona_playa}</p>
                        </div>
                      </div>
                      {nido.estado === 'listo' && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                          ¡LISTO!
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Corral:</span>
                        <span className="text-foreground font-medium text-xs">
                          {nido.identificador_corral}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Huevos:</span>
                        <span className="text-foreground font-medium">{nido.numero_huevos}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Días restantes:</span>
                        <span className={`font-bold ${
                          nido.dias_restantes <= 3 ? 'text-green-500' : 
                          nido.dias_restantes <= 7 ? 'text-orange-500' : 
                          'text-blue-500'
                        }`}>
                          {nido.dias_restantes} días
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Eclosión:</span>
                        <span className="text-foreground font-medium text-xs">
                          {new Date(nido.fecha_probable_eclosion).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-4 py-2 bg-card hover:bg-card/80 rounded-lg transition-colors font-medium text-foreground border border-border">
                      Registrar Arqueo
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Formulario de Arqueo */
          <div className="bg-card rounded-2xl p-6 border border-border/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">
                Arqueo - Nido #{selectedNido?.id}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedNido(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Info del Nido */}
              <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
                <h3 className="font-semibold text-foreground mb-3">Información del Nido</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Zona:</span>
                    <span className="ml-2 font-medium">{selectedNido?.zona_playa}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Corral:</span>
                    <span className="ml-2 font-medium text-xs">{selectedNido?.identificador_corral}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Huevos:</span>
                    <span className="ml-2 font-medium">{selectedNido?.numero_huevos}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Especie:</span>
                    <span className="ml-2 font-medium text-xs">{selectedNido?.especie}</span>
                  </div>
                </div>
              </div>

              {/* Fecha y Hora */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fecha y Hora del Arqueo *
                </label>
                <input
                  type="datetime-local"
                  value={arqueoData.fecha_hora_arqueo}
                  onChange={(e) => handleInputChange('fecha_hora_arqueo', e.target.value)}
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                  required
                />
              </div>

              {/* Contadores de Crías */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Crías Vivas */}
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    🐢 Crías Vivas Liberadas
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_vivas_liberadas', Math.max(0, arqueoData.crias_vivas_liberadas - 1))}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={arqueoData.crias_vivas_liberadas}
                      onChange={(e) => handleInputChange('crias_vivas_liberadas', parseInt(e.target.value) || 0)}
                      className="flex-1 p-3 bg-muted/30 border border-border rounded-xl text-foreground text-center text-2xl font-bold"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_vivas_liberadas', arqueoData.crias_vivas_liberadas + 1)}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Crías Muertas */}
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    ☠️ Crías Muertas en Nido
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_muertas_en_nido', Math.max(0, arqueoData.crias_muertas_en_nido - 1))}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={arqueoData.crias_muertas_en_nido}
                      onChange={(e) => handleInputChange('crias_muertas_en_nido', parseInt(e.target.value) || 0)}
                      className="flex-1 p-3 bg-muted/30 border border-border rounded-xl text-foreground text-center text-2xl font-bold"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_muertas_en_nido', arqueoData.crias_muertas_en_nido + 1)}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Crías Deformes */}
                <div className="bg-orange-500/10 rounded-xl p-4 border border-orange-500/20">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    ⚠️ Crías Deformes
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_deformes', Math.max(0, arqueoData.crias_deformes - 1))}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={arqueoData.crias_deformes}
                      onChange={(e) => handleInputChange('crias_deformes', parseInt(e.target.value) || 0)}
                      className="flex-1 p-3 bg-muted/30 border border-border rounded-xl text-foreground text-center text-2xl font-bold"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('crias_deformes', arqueoData.crias_deformes + 1)}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Huevos No Eclosionados */}
                <div className="bg-gray-500/10 rounded-xl p-4 border border-gray-500/20">
                  <label className="block text-sm font-medium text-foreground mb-3">
                    🥚 Huevos No Eclosionados
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('huevos_no_eclosionados', Math.max(0, arqueoData.huevos_no_eclosionados - 1))}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={arqueoData.huevos_no_eclosionados}
                      onChange={(e) => handleInputChange('huevos_no_eclosionados', parseInt(e.target.value) || 0)}
                      className="flex-1 p-3 bg-muted/30 border border-border rounded-xl text-foreground text-center text-2xl font-bold"
                      min="0"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('huevos_no_eclosionados', arqueoData.huevos_no_eclosionados + 1)}
                      className="w-12 h-12 bg-muted/50 hover:bg-muted rounded-xl font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Resumen Estadístico */}
              <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                <h3 className="font-semibold text-foreground mb-3">📊 Resumen Estadístico</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Contado</p>
                    <p className="text-2xl font-bold text-foreground">{totalHuevos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Esperado</p>
                    <p className="text-2xl font-bold text-foreground">{selectedNido?.numero_huevos}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Diferencia</p>
                    <p className={`text-2xl font-bold ${
                      totalHuevos === selectedNido?.numero_huevos ? 'text-green-500' :
                      totalHuevos < (selectedNido?.numero_huevos || 0) ? 'text-orange-500' :
                      'text-red-500'
                    }`}>
                      {totalHuevos - (selectedNido?.numero_huevos || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tasa Eclosión</p>
                    <p className="text-2xl font-bold text-green-500">{tasaEclosion}%</p>
                  </div>
                </div>
                {totalHuevos !== selectedNido?.numero_huevos && (
                  <div className="mt-3 p-2 bg-orange-500/10 rounded-lg">
                    <p className="text-sm text-orange-600 text-center">
                      ⚠️ El total contado no coincide con el esperado
                    </p>
                  </div>
                )}
              </div>

              {/* Fotógrafo */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  📸 Fotógrafo (opcional)
                </label>
                <input
                  type="text"
                  value={arqueoData.fotografo || ''}
                  onChange={(e) => handleInputChange('fotografo', e.target.value)}
                  placeholder="Nombre de quien toma las fotos"
                  className="w-full p-3 bg-muted/30 border border-border rounded-xl text-foreground"
                />
              </div>

              {/* Comentarios */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Comentarios y Observaciones
                </label>
                <textarea
                  value={arqueoData.comentarios}
                  onChange={(e) => handleInputChange('comentarios', e.target.value)}
                  placeholder="Observaciones sobre el arqueo, condiciones del nido, etc..."
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
                    setSelectedNido(null);
                  }}
                  className="flex-1 py-3 bg-muted/50 border border-border rounded-xl text-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex-1 py-3 gradient-purple-blue text-white rounded-xl font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {saving ? 'Guardando...' : '✅ Registrar Arqueo'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}