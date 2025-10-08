// src/lib/offline-db.ts
// Base de datos offline con Dexie.js que replica el esquema PostgreSQL

import Dexie, { Table } from 'dexie';
import {
  CampamentoOffline,
  EspecieOffline,
  TortugaOffline,
  PersonalOffline,
  EventoOffline,
  CondicionesAmbientalesOffline,
  ObservacionesTortugaOffline,
  NidoOffline,
  ExhumacionOffline,
  EstadoZonaOffline,
  EstadoZonaEventoOffline,
  FotoOffline,
  SyncQueueItem
} from './offline-types';

export class TurtleOfflineDB extends Dexie {
  // Tablas principales
  campamentos!: Table<CampamentoOffline>;
  especies!: Table<EspecieOffline>;
  tortugas!: Table<TortugaOffline>;
  personal!: Table<PersonalOffline>;
  eventos!: Table<EventoOffline>;
  
  // Tablas relacionadas
  condiciones_ambientales!: Table<CondicionesAmbientalesOffline>;
  observaciones_tortuga!: Table<ObservacionesTortugaOffline>;
  nidos!: Table<NidoOffline>;
  exhumaciones!: Table<ExhumacionOffline>;
  estados_zona!: Table<EstadoZonaOffline>;
  estado_zona_eventos!: Table<EstadoZonaEventoOffline>;
  
  // Gestión de fotos y sincronización
  fotos!: Table<FotoOffline>;
  sync_queue!: Table<SyncQueueItem>;

  constructor() {
    super('TurtleOfflineDB');
    
    this.version(1).stores({
      // Tablas principales con índices
      campamentos: '++id, nombre, sync_status, created_offline',
      especies: '++id, nombre_comun, nombre_cientifico, sync_status, created_offline',
      tortugas: '++id, marca_principal, especie_id, sync_status, created_offline',
      personal: '++id, nombre_completo, rol, email, activo, sync_status, created_offline',
      
      // Eventos - tabla principal con múltiples índices
      eventos: `++id, 
                tipo_evento, 
                fecha_hora, 
                campamento_id, 
                zona_playa, 
                tortuga_id, 
                personal_registro_id, 
                sync_status, 
                created_offline, 
                last_modified,
                [tipo_evento+sync_status],
                [campamento_id+fecha_hora],
                [tortuga_id+tipo_evento]`,
      
      // Tablas relacionadas
      condiciones_ambientales: `++id, 
                                evento_id, 
                                temperatura_arena_nido_c, 
                                fase_lunar, 
                                sync_status, 
                                created_offline`,
      
      observaciones_tortuga: `++id, 
                             evento_id, 
                             largo_caparazon_cm, 
                             ancho_caparazon_cm, 
                             se_coloco_marca_nueva, 
                             se_remarco, 
                             sync_status, 
                             created_offline`,
      
      nidos: `++id, 
             evento_anidacion_id, 
             numero_huevos_recolectados, 
             trasladado_a_corral, 
             identificador_en_corral, 
             fecha_probable_eclosion, 
             sync_status, 
             created_offline`,
      
      exhumaciones: `++id, 
                    nido_id, 
                    fecha_hora_exhumacion, 
                    crias_vivas_liberadas, 
                    crias_muertas_en_nido, 
                    huevos_no_eclosionados, 
                    sync_status, 
                    created_offline`,
      
      estados_zona: '++id, descripcion, sync_status, created_offline',
      
      estado_zona_eventos: `++id, 
                           evento_id, 
                           estado_zona_id, 
                           descripcion_adicional, 
                           sync_status, 
                           created_offline`,
      
      // Gestión de fotos
      fotos: `++id, 
             evento_id, 
             observacion_id, 
             filename, 
             mime_type, 
             size, 
             sync_status, 
             created_offline`,
      
      // Cola de sincronización con prioridades
      sync_queue: `++id, 
                  table_name, 
                  record_id, 
                  operation, 
                  created_at, 
                  attempts, 
                  priority,
                  [table_name+operation],
                  [priority+created_at],
                  [attempts+priority]`
    });

    // Hooks para agregar timestamps automáticamente
    this.eventos.hook('creating', (primKey, obj, trans) => {
      obj.last_modified = new Date().toISOString();
      obj.created_offline = true;
      obj.sync_status = 'pending';
      obj.sync_attempts = 0;
    });

    this.eventos.hook('updating', (modifications, primKey, obj, trans) => {
      (modifications as any).last_modified = new Date().toISOString();
    });

    // Hooks para otras tablas principales
    const addTimestamps = (primKey: any, obj: any, trans: any) => {
      obj.last_modified = new Date().toISOString();
      obj.created_offline = true;
      obj.sync_status = 'pending';
    };

    const updateTimestamp = (modifications: any, primKey: any, obj: any, trans: any) => {
      (modifications as any).last_modified = new Date().toISOString();
    };

    // Aplicar hooks a todas las tablas principales
    [this.campamentos, this.especies, this.tortugas, this.personal,
     this.condiciones_ambientales, this.observaciones_tortuga, 
     this.nidos, this.exhumaciones, this.estados_zona, 
     this.estado_zona_eventos, this.fotos].forEach(table => {
      table.hook('creating', addTimestamps);
      table.hook('updating', updateTimestamp);
    });
  }

  /**
   * Guardar evento completo con datos relacionados
   */
  async saveEventoCompleto(eventoData: {
    evento: Omit<EventoOffline, 'id' | 'sync_status' | 'created_offline' | 'last_modified'>;
    condiciones?: Omit<CondicionesAmbientalesOffline, 'id' | 'evento_id' | 'sync_status' | 'created_offline' | 'last_modified'>;
    observaciones?: Omit<ObservacionesTortugaOffline, 'id' | 'evento_id' | 'sync_status' | 'created_offline' | 'last_modified'>;
    fotos?: File[];
  }) {
    
    return await this.transaction('rw', [
      this.eventos, 
      this.condiciones_ambientales, 
      this.observaciones_tortuga, 
      this.fotos,
      this.sync_queue
    ], async () => {
      
      // 1. Guardar evento principal
      const eventoId = await this.eventos.add(eventoData.evento);
      console.log(`📱 Saved event offline with ID: ${eventoId}`);

      // 2. Guardar condiciones ambientales si existen
      if (eventoData.condiciones) {
        const condicionesCompletas = {
          ...eventoData.condiciones,
          evento_id: eventoId as number
        };
        await this.condiciones_ambientales.add(condicionesCompletas);
        console.log(`🌡️ Saved environmental conditions for event ${eventoId}`);
      }

      // 3. Guardar observaciones de tortuga si existen
      if (eventoData.observaciones) {
        const observacionesCompletas = {
          ...eventoData.observaciones,
          evento_id: eventoId as number
        };
        await this.observaciones_tortuga.add(observacionesCompletas);
        console.log(`🐢 Saved turtle observations for event ${eventoId}`);
      }

      // 4. Guardar fotos si existen
      if (eventoData.fotos && eventoData.fotos.length > 0) {
        for (const foto of eventoData.fotos) {
          const fotoOffline: Omit<FotoOffline, 'id'> = {
            evento_id: eventoId as number,
            filename: foto.name,
            blob_data: foto,
            mime_type: foto.type,
            size: foto.size,
            sync_status: 'pending',
            created_offline: true,
            last_modified: new Date().toISOString()
          };
          await this.fotos.add(fotoOffline);
        }
        console.log(`📸 Saved ${eventoData.fotos.length} photos for event ${eventoId}`);
      }

      // 5. Agregar a cola de sincronización con alta prioridad
      await this.sync_queue.add({
        table_name: 'eventos',
        record_id: eventoId as number,
        operation: 'CREATE',
        data: eventoData,
        created_at: new Date().toISOString(),
        attempts: 0,
        priority: 1 // Alta prioridad para eventos
      });

      return {
        eventoId,
        success: true,
        message: 'Event saved offline successfully'
      };
    });
  }

  /**
   * Obtener eventos por rango de fechas
   */
  async getEventosByDateRange(startDate: string, endDate: string) {
    return await this.eventos
      .where('fecha_hora')
      .between(startDate, endDate, true, true)
      .toArray();
  }

  /**
   * Obtener eventos por tipo y estado de sincronización
   */
  async getEventosByTipoAndStatus(tipo: string, syncStatus?: 'pending' | 'synced' | 'error') {
    const query = this.eventos.where('tipo_evento').equals(tipo);
    
    if (syncStatus) {
      return await query.and(evento => evento.sync_status === syncStatus).toArray();
    }
    
    return await query.toArray();
  }

  /**
   * Obtener evento completo con datos relacionados
   */
  async getEventoCompleto(eventoId: number) {
    const evento = await this.eventos.get(eventoId);
    if (!evento) return null;

    const [condiciones, observaciones, fotos] = await Promise.all([
      this.condiciones_ambientales.where('evento_id').equals(eventoId).toArray(),
      this.observaciones_tortuga.where('evento_id').equals(eventoId).toArray(),
      this.fotos.where('evento_id').equals(eventoId).toArray()
    ]);

    return {
      evento,
      condiciones: condiciones[0] || null,
      observaciones: observaciones[0] || null,
      fotos
    };
  }

  /**
   * Obtener estadísticas de datos offline
   */
  async getOfflineStats() {
    const [
      totalEventos,
      pendingEventos,
      totalCampamentos,
      totalEspecies,
      totalTortugas,
      totalFotos,
      queueSize,
      failedQueue
    ] = await Promise.all([
      this.eventos.count(),
      this.eventos.where('sync_status').equals('pending').count(),
      this.campamentos.count(),
      this.especies.count(),
      this.tortugas.count(),
      this.fotos.count(),
      this.sync_queue.count(),
      this.sync_queue.where('attempts').above(2).count()
    ]);

    return {
      eventos: {
        total: totalEventos,
        pending: pendingEventos,
        synced: totalEventos - pendingEventos
      },
      referenceData: {
        campamentos: totalCampamentos,
        especies: totalEspecies,
        tortugas: totalTortugas
      },
      media: {
        fotos: totalFotos
      },
      sync: {
        queueSize,
        failedItems: failedQueue
      }
    };
  }

  /**
   * Buscar eventos por texto
   */
  async searchEventos(searchTerm: string) {
    const lowerTerm = searchTerm.toLowerCase();
    
    return await this.eventos
      .filter(evento => {
        const tipoMatch = evento.tipo_evento.toLowerCase().includes(lowerTerm);
        const zonaMatch = evento.zona_playa?.toLowerCase().includes(lowerTerm) || false;
        const estacionMatch = evento.estacion_baliza?.toLowerCase().includes(lowerTerm) || false;
        const observacionesMatch = evento.observaciones?.toLowerCase().includes(lowerTerm) || false;
        
        return tipoMatch || zonaMatch || estacionMatch || observacionesMatch;
      })
      .toArray();
  }

  /**
   * Limpiar base de datos (para testing o reset)
   */
  async clearAllData() {
    await this.transaction('rw', [
      this.eventos,
      this.condiciones_ambientales,
      this.observaciones_tortuga,
      this.nidos,
      this.exhumaciones,
      this.fotos,
      this.sync_queue,
      this.campamentos,
      this.especies,
      this.tortugas,
      this.personal,
      this.estados_zona,
      this.estado_zona_eventos
    ], async () => {
      await Promise.all([
        this.eventos.clear(),
        this.condiciones_ambientales.clear(),
        this.observaciones_tortuga.clear(),
        this.nidos.clear(),
        this.exhumaciones.clear(),
        this.fotos.clear(),
        this.sync_queue.clear(),
        this.campamentos.clear(),
        this.especies.clear(),
        this.tortugas.clear(),
        this.personal.clear(),
        this.estados_zona.clear(),
        this.estado_zona_eventos.clear()
      ]);
      
      console.log('🧹 All offline data cleared');
    });
  }

  /**
   * Inicializar datos de referencia básicos
   */
  async initializeReferenceData() {
    // Verificar si ya existen datos
    const existingCampamentos = await this.campamentos.count();
    if (existingCampamentos > 0) {
      console.log('📚 Reference data already exists');
      return;
    }

    // Datos básicos para funcionar offline
    await this.transaction('rw', [this.campamentos, this.especies, this.personal], async () => {
      
      // Campamentos básicos
      await this.campamentos.bulkAdd([
        { nombre: 'Campamento Norte', sync_status: 'synced', created_offline: false, last_modified: new Date().toISOString() },
        { nombre: 'Campamento Sur', sync_status: 'synced', created_offline: false, last_modified: new Date().toISOString() },
        { nombre: 'Campamento Central', sync_status: 'synced', created_offline: false, last_modified: new Date().toISOString() }
      ]);

      // Especies básicas
      await this.especies.bulkAdd([
        { 
          nombre_comun: 'Tortuga Golfina', 
          nombre_cientifico: 'Lepidochelys olivacea',
          sync_status: 'synced', 
          created_offline: false, 
          last_modified: new Date().toISOString() 
        },
        { 
          nombre_comun: 'Tortuga Verde', 
          nombre_cientifico: 'Chelonia mydas',
          sync_status: 'synced', 
          created_offline: false, 
          last_modified: new Date().toISOString() 
        },
        { 
          nombre_comun: 'Tortuga Carey', 
          nombre_cientifico: 'Eretmochelys imbricata',
          sync_status: 'synced', 
          created_offline: false, 
          last_modified: new Date().toISOString() 
        }
      ]);

      // Personal básico
      await this.personal.bulkAdd([
        {
          nombre_completo: 'Guardabosques Offline',
          rol: 'guardabosques',
          email: 'offline@turtle.app',
          activo: true,
          sync_status: 'synced',
          created_offline: false,
          last_modified: new Date().toISOString()
        }
      ]);

      console.log('📚 Basic reference data initialized for offline use');
    });
  }
}

// Instancia única de la base de datos
export const offlineDB = new TurtleOfflineDB();