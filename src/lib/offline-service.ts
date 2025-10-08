// src/lib/offline-service.ts
// Servicio principal para gestionar funcionalidad offline

import { offlineDB } from './offline-db';
import { OfflineSync } from './offline-sync';
import { EventoOffline } from './offline-types';

export interface OfflineServiceConfig {
  autoSyncEnabled: boolean;
  syncIntervalMinutes: number;
  maxRetryAttempts: number;
  enableBackgroundSync: boolean;
}

export class OfflineService {
  private offlineSync: OfflineSync;
  private config: OfflineServiceConfig;
  private syncInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(config: Partial<OfflineServiceConfig> = {}) {
    this.config = {
      autoSyncEnabled: true,
      syncIntervalMinutes: 5,
      maxRetryAttempts: 3,
      enableBackgroundSync: true,
      ...config
    };
    
    this.offlineSync = new OfflineSync();
  }

  /**
   * Inicializar servicio offline
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('OfflineService already initialized');
      return;
    }

    try {
      // Abrir base de datos
      await offlineDB.open();
      console.log('📱 Offline database opened successfully');

      // Inicializar datos de referencia básicos
      await offlineDB.initializeReferenceData();

      // Configurar sincronización automática si está habilitada
      if (this.config.autoSyncEnabled) {
        this.startAutoSync();
      }

      // Configurar event listeners para cambios de conectividad
      this.setupConnectivityListeners();

      this.isInitialized = true;
      console.log('✅ OfflineService initialized successfully');

    } catch (error) {
      console.error('❌ Failed to initialize OfflineService:', error);
      throw error;
    }
  }

  /**
   * Guardar evento en modo offline
   */
  async saveEventoOffline(eventoData: {
    tipo_evento: 'Anidación' | 'Intento' | 'Arqueo';
    fecha_hora: string;
    campamento_id?: number;
    zona_playa?: 'A' | 'B' | 'C';
    estacion_baliza?: string;
    coordenada_lat?: number;
    coordenada_lon?: number;
    tortuga_id?: number;
    personal_registro_id?: number;
    observaciones?: string;
    // Datos adicionales
    condiciones?: {
      temperatura_arena_nido_c?: number;
      humedad_arena_porcentaje?: number;
      fase_lunar?: string;
    };
    observaciones_tortuga?: {
      largo_caparazon_cm?: number;
      ancho_caparazon_cm?: number;
      se_coloco_marca_nueva?: boolean;
      se_remarco?: boolean;
      path_fotos?: string;
    };
    fotos?: File[];
  }) {
    
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized. Call initialize() first.');
    }

    try {
      // Preparar datos del evento
      const evento: Omit<EventoOffline, 'id' | 'sync_status' | 'created_offline' | 'last_modified'> = {
        tipo_evento: eventoData.tipo_evento,
        fecha_hora: eventoData.fecha_hora,
        campamento_id: eventoData.campamento_id,
        zona_playa: eventoData.zona_playa,
        estacion_baliza: eventoData.estacion_baliza,
        coordenada_lat: eventoData.coordenada_lat,
        coordenada_lon: eventoData.coordenada_lon,
        tortuga_id: eventoData.tortuga_id,
        personal_registro_id: eventoData.personal_registro_id,
        observaciones: eventoData.observaciones
      };

      // Guardar en base offline con datos relacionados
      const result = await offlineDB.saveEventoCompleto({
        evento,
        condiciones: eventoData.condiciones,
        observaciones: eventoData.observaciones_tortuga,
        fotos: eventoData.fotos
      });

      console.log(`📱 Event saved offline: ${eventoData.tipo_evento} - ID: ${result.eventoId}`);

      // Intentar sincronización inmediata si hay conectividad
      if (navigator.onLine) {
        setTimeout(() => {
          this.triggerSync().catch(error => {
            console.log('Auto-sync failed, will retry later:', error.message);
          });
        }, 1000);
      }

      return result;

    } catch (error) {
      console.error('❌ Failed to save event offline:', error);
      throw error;
    }
  }

  /**
   * Obtener eventos offline
   */
  async getEventosOffline(filters?: {
    tipo?: string;
    startDate?: string;
    endDate?: string;
    syncStatus?: 'pending' | 'synced' | 'error';
    limit?: number;
  }) {
    
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    try {
      let eventos: EventoOffline[];

      if (filters?.startDate && filters?.endDate) {
        eventos = await offlineDB.getEventosByDateRange(filters.startDate, filters.endDate);
      } else if (filters?.tipo) {
        eventos = await offlineDB.getEventosByTipoAndStatus(filters.tipo, filters.syncStatus);
      } else {
        // Obtener todos los eventos
        const query = offlineDB.eventos.orderBy('fecha_hora').reverse();
        
        if (filters?.syncStatus) {
          eventos = await query.filter(e => e.sync_status === filters.syncStatus).toArray();
        } else {
          eventos = await query.toArray();
        }
      }

      // Aplicar límite si se especifica
      if (filters?.limit && filters.limit > 0) {
        eventos = eventos.slice(0, filters.limit);
      }

      return eventos;

    } catch (error) {
      console.error('❌ Failed to get offline events:', error);
      throw error;
    }
  }

  /**
   * Obtener evento completo con datos relacionados
   */
  async getEventoCompletoOffline(eventoId: number) {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    return await offlineDB.getEventoCompleto(eventoId);
  }

  /**
   * Buscar eventos offline
   */
  async searchEventosOffline(searchTerm: string) {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    return await offlineDB.searchEventos(searchTerm);
  }

  /**
   * Obtener datos de referencia offline
   */
  async getReferenceDataOffline() {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    const [campamentos, especies, tortugas, personal] = await Promise.all([
      offlineDB.campamentos.toArray(),
      offlineDB.especies.toArray(),
      offlineDB.tortugas.toArray(),
      offlineDB.personal.toArray()
    ]);

    return {
      campamentos,
      especies,
      tortugas,
      personal
    };
  }

  /**
   * Iniciar sincronización manual
   */
  async triggerSync() {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    console.log('🔄 Triggering manual sync...');
    return await this.offlineSync.syncAll();
  }

  /**
   * Obtener estadísticas offline
   */
  async getOfflineStats() {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    const [dbStats, syncStats] = await Promise.all([
      offlineDB.getOfflineStats(),
      this.offlineSync.getSyncStats()
    ]);

    return {
      ...dbStats,
      sync: syncStats
    };
  }

  /**
   * Configurar sincronización automática
   */
  private startAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    const intervalMs = this.config.syncIntervalMinutes * 60 * 1000;
    
    this.syncInterval = setInterval(async () => {
      if (navigator.onLine) {
        try {
          const result = await this.offlineSync.syncAll();
          if (result.success && result.syncedCount! > 0) {
            console.log(`🔄 Auto-sync completed: ${result.syncedCount} items synced`);
          }
        } catch (error) {
          console.log('Auto-sync failed:', error);
        }
      }
    }, intervalMs);

    console.log(`⏰ Auto-sync enabled every ${this.config.syncIntervalMinutes} minutes`);
  }

  /**
   * Detener sincronización automática
   */
  private stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('⏰ Auto-sync disabled');
    }
  }

  /**
   * Configurar listeners de conectividad
   */
  private setupConnectivityListeners() {
    const handleOnline = async () => {
      console.log('🌐 Network connection restored');
      
      if (this.config.autoSyncEnabled) {
        // Esperar un poco antes de sincronizar para asegurar conectividad estable
        setTimeout(async () => {
          try {
            const result = await this.offlineSync.syncAll();
            console.log('🔄 Connectivity sync result:', result);
          } catch (error) {
            console.log('Connectivity sync failed:', error);
          }
        }, 3000);
      }
    };

    const handleOffline = () => {
      console.log('📴 Network connection lost - switching to offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Limpiar listeners al destruir
    const cleanup = () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };

    // Guardar función de limpieza
    (this as any).cleanup = cleanup;
  }

  /**
   * Limpiar datos offline antiguos
   */
  async cleanupOldData(olderThanDays: number = 30) {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    await this.offlineSync.cleanupSyncedData(olderThanDays);
    console.log(`🧹 Cleaned up data older than ${olderThanDays} days`);
  }

  /**
   * Resetear base de datos offline (para testing)
   */
  async resetOfflineDatabase() {
    if (!this.isInitialized) {
      throw new Error('OfflineService not initialized');
    }

    await offlineDB.clearAllData();
    await offlineDB.initializeReferenceData();
    console.log('🔄 Offline database reset completed');
  }

  /**
   * Destruir servicio
   */
  async destroy() {
    this.stopAutoSync();
    
    if ((this as any).cleanup) {
      (this as any).cleanup();
    }

    if (this.isInitialized) {
      await offlineDB.close();
    }

    this.isInitialized = false;
    console.log('🔧 OfflineService destroyed');
  }

  /**
   * Verificar si el servicio está listo
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Actualizar configuración
   */
  updateConfig(newConfig: Partial<OfflineServiceConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Reconfigurar auto-sync si cambió
    if (newConfig.autoSyncEnabled !== undefined || newConfig.syncIntervalMinutes !== undefined) {
      if (this.config.autoSyncEnabled) {
        this.startAutoSync();
      } else {
        this.stopAutoSync();
      }
    }
    
    console.log('⚙️ OfflineService config updated:', this.config);
  }
}

// Instancia singleton del servicio offline
export const offlineService = new OfflineService();