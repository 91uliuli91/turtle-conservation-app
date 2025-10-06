// Tipos para la base de datos basados en los endpoints existentes

export interface Campamento {
  id: number;
  nombre: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
}

export interface Personal {
  id: number;
  nombre_completo: string;
  rol?: string;
}

export interface Tortuga {
  id: number;
  marca_principal: string;
  especie_id?: number;
  especie_nombre?: string;
  especie_cientifica?: string;
}

export interface Evento {
  id: number;
  tipo_evento: 'Anidación' | 'Intento' | 'Arqueo';
  fecha_hora: string;
  campamento_id?: number;
  zona_playa?: 'A' | 'B' | 'C';
  estacion_baliza?: string;
  coordenada_lat?: number;
  coordenada_lon?: number;
  tortuga_id?: number;
  personal_registro_id: number;
  observaciones?: string;
  campamento_nombre?: string;
  tortuga_marca?: string;
  personal_nombre?: string;
}

export interface CondicionesAmbientales {
  id: number;
  evento_id: number;
  temperatura_arena_nido_c?: number;
  humedad_arena_porcentaje?: number;
  fase_lunar?: string;
  tipo_evento?: string;
  fecha_hora?: string;
  tortuga_marca?: string;
  personal_nombre?: string;
  campamento_nombre?: string;
}

export interface ObservacionesTortuga {
  id: number;
  evento_id: number;
  largo_caparazon_cm?: number;
  ancho_caparazon_cm?: number;
  se_coloco_marca_nueva: boolean;
  se_remarco: boolean;
  path_fotos?: string;
  tipo_evento?: string;
  fecha_hora?: string;
  tortuga_marca?: string;
  personal_nombre?: string;
}

export interface Nido {
  id: number;
  evento_anidacion_id: number;
  numero_huevos_recolectados: number;
  trasladado_a_corral: boolean;
  fecha_hora_traslado?: string;
  identificador_en_corral?: string;
  fecha_probable_eclosion?: string;
  temperatura_media_corral_c?: number;
  humedad_media_corral_porcentaje?: number;
  observaciones_corral?: string;
  fecha_anidacion?: string;
  tortuga_marca?: string;
  personal_nombre?: string;
  campamento_nombre?: string;
}

export interface Exhumacion {
  id: number;
  nido_id: number;
  fecha_hora_exhumacion: string;
  crias_vivas_liberadas: number;
  crias_muertas_en_nido: number;
  crias_deformes: number;
  huevos_no_eclosionados: number;
  comentarios?: string;
  numero_huevos_recolectados?: number;
  identificador_en_corral?: string;
  fecha_anidacion?: string;
  tortuga_marca?: string;
  personal_nombre?: string;
  campamento_nombre?: string;
}

// Tipos para el formulario
export interface EventoFormData {
  tipo_evento: 'Anidación' | 'Intento' | 'Arqueo';
  fecha_hora: string;
  campamento_id?: number;
  zona_playa?: 'A' | 'B' | 'C';
  estacion_baliza?: string;
  coordenada_lat?: number;
  coordenada_lon?: number;
  tortuga_id?: number;
  personal_registro_id: number;
  observaciones?: string;
  
  // Campos específicos por tipo de evento
  condiciones_ambientales?: Partial<CondicionesAmbientales>;
  observaciones_tortuga?: Partial<ObservacionesTortuga>;
  nido?: Partial<Nido>;
}

// Tipos para datos ambientales
export interface EnvironmentalData {
  temperatura: number;
  humedad: number;
  faseLunar: string;
  marea: 'alta' | 'baja' | 'subiendo' | 'bajando';
  estadoClima: string;
  velocidadViento: number;
  presionAtmosferica: number;
  ultimaActualizacion: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}