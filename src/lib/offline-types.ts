// src/lib/offline-types.ts
// Interfaces TypeScript basadas en el esquema PostgreSQL

export interface CampamentoOffline {
  id?: number;
  nombre: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface EspecieOffline {
  id?: number;
  nombre_comun: string;
  nombre_cientifico?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface TortugaOffline {
  id?: number;
  marca_principal?: string;
  especie_id?: number;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface PersonalOffline {
  id?: number;
  nombre_completo: string;
  rol?: string;
  email?: string;
  apellido?: string;
  activo?: boolean;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface EventoOffline {
  id?: number;
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
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
  sync_attempts?: number;
  error_message?: string;
}

export interface CondicionesAmbientalesOffline {
  id?: number;
  evento_id: number;
  temperatura_arena_nido_c?: number;
  humedad_arena_porcentaje?: number;
  fase_lunar?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface ObservacionesTortugaOffline {
  id?: number;
  evento_id: number;
  largo_caparazon_cm?: number;
  ancho_caparazon_cm?: number;
  se_coloco_marca_nueva?: boolean;
  se_remarco?: boolean;
  path_fotos?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface NidoOffline {
  id?: number;
  evento_anidacion_id: number;
  numero_huevos_recolectados: number;
  trasladado_a_corral?: boolean;
  fecha_hora_traslado?: string;
  identificador_en_corral?: string;
  fecha_probable_eclosion?: string;
  temperatura_media_corral_c?: number;
  humedad_media_corral_porcentaje?: number;
  observaciones_corral?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface ExhumacionOffline {
  id?: number;
  nido_id: number;
  fecha_hora_exhumacion: string;
  crias_vivas_liberadas?: number;
  crias_muertas_en_nido?: number;
  crias_deformes?: number;
  huevos_no_eclosionados?: number;
  comentarios?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface EstadoZonaOffline {
  id?: number;
  descripcion: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

export interface EstadoZonaEventoOffline {
  id?: number;
  evento_id: number;
  estado_zona_id: number;
  descripcion_adicional?: string;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

// Interface para manejar fotos offline
export interface FotoOffline {
  id?: number;
  evento_id?: number;
  observacion_id?: number;
  filename: string;
  blob_data: Blob;
  mime_type: string;
  size: number;
  // Campos de control offline
  sync_status?: 'pending' | 'synced' | 'error';
  created_offline?: boolean;
  last_modified?: string;
}

// Interface para cola de sincronización
export interface SyncQueueItem {
  id?: number;
  table_name: string;
  record_id: string | number;
  operation: 'CREATE' | 'UPDATE' | 'DELETE';
  data: any;
  created_at: string;
  attempts: number;
  last_attempt?: string;
  error_message?: string;
  priority: number; // 1=alta, 2=media, 3=baja
}

// Tipos de sincronización
export type SyncStatus = 'pending' | 'synced' | 'error';
export type SyncOperation = 'CREATE' | 'UPDATE' | 'DELETE';