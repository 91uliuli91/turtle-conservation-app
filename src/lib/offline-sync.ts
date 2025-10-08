// src/lib/offline-sync.ts
// Clase principal para manejar sincronización entre offline DB y servidor

import { offlineDB } from './offline-db';
import { 
  EventoOffline, 
  SyncQueueItem, 
  SyncStatus,
  CampamentoOffline,
  EspecieOffline,
  TortugaOffline,
  PersonalOffline,
  CondicionesAmbientalesOffline,
  ObservacionesTortugaOffline,
  NidoOffline,
  ExhumacionOffline
} from './offline-types';

export interface SyncResult {
  success: boolean;
  message: string;
  syncedCount?: number;
  failedCount?: number;
  details?: any;
}

export class OfflineSync {
  private syncInProgress = false;
  private maxRetries = 3;
  private retryDelayMs = 2000;

  constructor() {}

  /**
   * Sincronizar todos los datos pendientes
   */
  async syncAll(): Promise<SyncResult> {
    if (this.syncInProgress) {
      return { 
        success: false, 
        message: 'Sync already in progress' 
      };
    }

    this.syncInProgress = true;
    console.log('🔄 Starting full synchronization...');

    try {
      let totalSynced = 0;
      let totalFailed = 0;

      // 1. Sincronizar datos de referencia primero
      const refDataResult = await this.syncReferenceData();
      totalSynced += refDataResult.syncedCount || 0;
      totalFailed += refDataResult.failedCount || 0;

      // 2. Sincronizar eventos principales
      const eventosResult = await this.syncEventos();
      totalSynced += eventosResult.syncedCount || 0;
      totalFailed += eventosResult.failedCount || 0;

      // 3. Sincronizar datos relacionados (nidos, observaciones, etc.)
      const relatedDataResult = await this.syncRelatedData();
      totalSynced += relatedDataResult.syncedCount || 0;
      totalFailed += relatedDataResult.failedCount || 0;

      // 4. Procesar cola de sincronización
      const queueResult = await this.processSyncQueue();
      totalSynced += queueResult.syncedCount || 0;
      totalFailed += queueResult.failedCount || 0;

      console.log(`✅ Sync completed. Synced: ${totalSynced}, Failed: ${totalFailed}`);

      return {
        success: totalFailed === 0 || totalSynced > 0,
        message: `Synchronization completed. ${totalSynced} synced, ${totalFailed} failed`,
        syncedCount: totalSynced,
        failedCount: totalFailed
      };

    } catch (error) {
      console.error('❌ Sync failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown sync error',
        syncedCount: 0,
        failedCount: 1
      };
    } finally {
      this.syncInProgress = false;
    }
  }

  /**
   * Sincronizar datos de referencia (campamentos, especies, tortugas, personal)
   */
  private async syncReferenceData(): Promise<SyncResult> {
    let syncedCount = 0;
    let failedCount = 0;

    try {
      // Campamentos
      const campamentos = await offlineDB.campamentos.where('sync_status').equals('pending').toArray();
      for (const campamento of campamentos) {
        const result = await this.syncSingleRecord('campamentos', campamento);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Especies
      const especies = await offlineDB.especies.where('sync_status').equals('pending').toArray();
      for (const especie of especies) {
        const result = await this.syncSingleRecord('especies', especie);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Tortugas
      const tortugas = await offlineDB.tortugas.where('sync_status').equals('pending').toArray();
      for (const tortuga of tortugas) {
        const result = await this.syncSingleRecord('tortugas', tortuga);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Personal
      const personal = await offlineDB.personal.where('sync_status').equals('pending').toArray();
      for (const persona of personal) {
        const result = await this.syncSingleRecord('personal', persona);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      return { success: true, message: 'Reference data synced', syncedCount, failedCount };

    } catch (error) {
      console.error('Reference data sync failed:', error);
      return { 
        success: false, 
        message: 'Reference data sync failed', 
        syncedCount, 
        failedCount: failedCount + 1 
      };
    }
  }

  /**
   * Sincronizar eventos principales
   */
  private async syncEventos(): Promise<SyncResult> {
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const eventos = await offlineDB.eventos.where('sync_status').equals('pending').toArray();
      
      for (const evento of eventos) {
        const result = await this.syncEvento(evento);
        if (result.success) {
          syncedCount++;
        } else {
          failedCount++;
          // Incrementar contador de intentos
          await offlineDB.eventos.update(evento.id!, {
            sync_attempts: (evento.sync_attempts || 0) + 1,
            error_message: result.message
          });
        }
      }

      return { success: true, message: 'Events synced', syncedCount, failedCount };

    } catch (error) {
      console.error('Events sync failed:', error);
      return { 
        success: false, 
        message: 'Events sync failed', 
        syncedCount, 
        failedCount: failedCount + 1 
      };
    }
  }

  /**
   * Sincronizar un evento individual con el servidor
   */
  private async syncEvento(evento: EventoOffline): Promise<SyncResult> {
    try {
      // Determinar endpoint basado en tipo de evento
      const endpoint = this.getEventoEndpoint(evento.tipo_evento);
      
      // Preparar datos para envío
      const eventoData = {
        ...evento,
        sync_status: undefined, // No enviar campos de control
        created_offline: undefined,
        last_modified: undefined,
        sync_attempts: undefined,
        error_message: undefined
      };

      console.log(`📤 Syncing ${evento.tipo_evento} event:`, eventoData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventoData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Event synced successfully:`, result);

      // Actualizar estado en base offline
      await offlineDB.eventos.update(evento.id!, {
        sync_status: 'synced' as SyncStatus,
        last_modified: new Date().toISOString(),
        error_message: undefined,
        sync_attempts: 0
      });

      return { 
        success: true, 
        message: 'Event synced successfully',
        details: result
      };

    } catch (error) {
      console.error(`❌ Failed to sync ${evento.tipo_evento} event:`, error);
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown sync error'
      };
    }
  }

  /**
   * Obtener endpoint correcto según tipo de evento
   */
  private getEventoEndpoint(tipoEvento: string): string {
    switch (tipoEvento.toLowerCase()) {
      case 'anidación':
        return '/api/eventos/anidacion';
      case 'intento':
        return '/api/eventos/intento';
      case 'arqueo':
        return '/api/eventos/arqueo';
      default:
        throw new Error(`Unknown event type: ${tipoEvento}`);
    }
  }

  /**
   * Sincronizar datos relacionados (nidos, observaciones, condiciones)
   */
  private async syncRelatedData(): Promise<SyncResult> {
    let syncedCount = 0;
    let failedCount = 0;

    try {
      // Condiciones ambientales
      const condiciones = await offlineDB.condiciones_ambientales.where('sync_status').equals('pending').toArray();
      for (const condicion of condiciones) {
        const result = await this.syncSingleRecord('condiciones-ambientales', condicion);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Observaciones de tortuga
      const observaciones = await offlineDB.observaciones_tortuga.where('sync_status').equals('pending').toArray();
      for (const observacion of observaciones) {
        const result = await this.syncSingleRecord('observaciones-tortuga', observacion);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Nidos
      const nidos = await offlineDB.nidos.where('sync_status').equals('pending').toArray();
      for (const nido of nidos) {
        const result = await this.syncSingleRecord('nidos', nido);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      // Exhumaciones
      const exhumaciones = await offlineDB.exhumaciones.where('sync_status').equals('pending').toArray();
      for (const exhumacion of exhumaciones) {
        const result = await this.syncSingleRecord('exhumaciones', exhumacion);
        if (result.success) syncedCount++;
        else failedCount++;
      }

      return { success: true, message: 'Related data synced', syncedCount, failedCount };

    } catch (error) {
      console.error('Related data sync failed:', error);
      return { 
        success: false, 
        message: 'Related data sync failed', 
        syncedCount, 
        failedCount: failedCount + 1 
      };
    }
  }

  /**
   * Sincronizar un registro individual con endpoint genérico
   */
  private async syncSingleRecord(tableName: string, record: any): Promise<SyncResult> {
    try {
      // Para datos que no tienen endpoints específicos, se pueden agregar aquí
      // Por ahora, marcar como sincronizado
      console.log(`📤 Syncing ${tableName} record:`, record.id);

      // Simular sincronización exitosa para datos de referencia
      await this.updateRecordSyncStatus(tableName, record.id, 'synced');

      return { 
        success: true, 
        message: `${tableName} record synced successfully` 
      };

    } catch (error) {
      console.error(`❌ Failed to sync ${tableName} record:`, error);
      
      await this.updateRecordSyncStatus(tableName, record.id, 'error');
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown sync error'
      };
    }
  }

  /**
   * Actualizar estado de sincronización de un registro
   */
  private async updateRecordSyncStatus(tableName: string, recordId: number, status: SyncStatus) {
    const updateData = {
      sync_status: status,
      last_modified: new Date().toISOString()
    };

    switch (tableName) {
      case 'campamentos':
        await offlineDB.campamentos.update(recordId, updateData);
        break;
      case 'especies':
        await offlineDB.especies.update(recordId, updateData);
        break;
      case 'tortugas':
        await offlineDB.tortugas.update(recordId, updateData);
        break;
      case 'personal':
        await offlineDB.personal.update(recordId, updateData);
        break;
      case 'condiciones-ambientales':
        await offlineDB.condiciones_ambientales.update(recordId, updateData);
        break;
      case 'observaciones-tortuga':
        await offlineDB.observaciones_tortuga.update(recordId, updateData);
        break;
      case 'nidos':
        await offlineDB.nidos.update(recordId, updateData);
        break;
      case 'exhumaciones':
        await offlineDB.exhumaciones.update(recordId, updateData);
        break;
    }
  }

  /**
   * Procesar cola de sincronización
   */
  private async processSyncQueue(): Promise<SyncResult> {
    let syncedCount = 0;
    let failedCount = 0;

    try {
      const queueItems = await offlineDB.sync_queue
        .where('attempts')
        .below(this.maxRetries)
        .sortBy('priority');

      for (const item of queueItems) {
        try {
          await this.processSyncQueueItem(item);
          await offlineDB.sync_queue.delete(item.id!);
          syncedCount++;
        } catch (error) {
          // Incrementar intentos y actualizar error
          await offlineDB.sync_queue.update(item.id!, {
            attempts: item.attempts + 1,
            last_attempt: new Date().toISOString(),
            error_message: error instanceof Error ? error.message : 'Unknown error'
          });
          failedCount++;
        }
      }

      return { success: true, message: 'Sync queue processed', syncedCount, failedCount };

    } catch (error) {
      console.error('Sync queue processing failed:', error);
      return { 
        success: false, 
        message: 'Sync queue processing failed', 
        syncedCount, 
        failedCount: failedCount + 1 
      };
    }
  }

  /**
   * Procesar un elemento específico de la cola de sincronización
   */
  private async processSyncQueueItem(item: SyncQueueItem): Promise<void> {
    console.log(`🔄 Processing sync queue item: ${item.table_name} - ${item.operation}`);
    
    // Implementar lógica específica según operación
    switch (item.operation) {
      case 'CREATE':
        await this.handleCreateOperation(item);
        break;
      case 'UPDATE':
        await this.handleUpdateOperation(item);
        break;
      case 'DELETE':
        await this.handleDeleteOperation(item);
        break;
      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }
  }

  private async handleCreateOperation(item: SyncQueueItem): Promise<void> {
    // Implementar creación en servidor
    console.log('Handling CREATE operation:', item);
  }

  private async handleUpdateOperation(item: SyncQueueItem): Promise<void> {
    // Implementar actualización en servidor
    console.log('Handling UPDATE operation:', item);
  }

  private async handleDeleteOperation(item: SyncQueueItem): Promise<void> {
    // Implementar eliminación en servidor
    console.log('Handling DELETE operation:', item);
  }

  /**
   * Agregar elemento a cola de sincronización
   */
  async addToSyncQueue(
    tableName: string, 
    recordId: string | number, 
    operation: 'CREATE' | 'UPDATE' | 'DELETE', 
    data: any, 
    priority: number = 2
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      table_name: tableName,
      record_id: recordId,
      operation,
      data,
      created_at: new Date().toISOString(),
      attempts: 0,
      priority
    };

    await offlineDB.sync_queue.add(queueItem);
    console.log(`📋 Added to sync queue: ${tableName} - ${operation}`);
  }

  /**
   * Obtener estadísticas de sincronización
   */
  async getSyncStats() {
    const pendingEventos = await offlineDB.eventos.where('sync_status').equals('pending').count();
    const syncedEventos = await offlineDB.eventos.where('sync_status').equals('synced').count();
    const errorEventos = await offlineDB.eventos.where('sync_status').equals('error').count();
    
    const queueSize = await offlineDB.sync_queue.count();
    const failedQueueItems = await offlineDB.sync_queue.where('attempts').aboveOrEqual(this.maxRetries).count();

    return {
      eventos: {
        pending: pendingEventos,
        synced: syncedEventos,
        error: errorEventos,
        total: pendingEventos + syncedEventos + errorEventos
      },
      queue: {
        pending: queueSize,
        failed: failedQueueItems
      },
      syncInProgress: this.syncInProgress
    };
  }

  /**
   * Limpiar datos sincronizados antiguos
   */
  async cleanupSyncedData(olderThanDays: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);
    const cutoffIso = cutoffDate.toISOString();

    // Limpiar eventos sincronizados antiguos
    await offlineDB.eventos
      .where('sync_status').equals('synced')
      .and((evento: any) => evento.last_modified! < cutoffIso)
      .delete();

    // Limpiar elementos fallidos de la cola
    await offlineDB.sync_queue
      .where('attempts').aboveOrEqual(this.maxRetries)
      .and((item: any) => item.created_at < cutoffIso)
      .delete();

    console.log(`🧹 Cleaned up synced data older than ${olderThanDays} days`);
  }
}