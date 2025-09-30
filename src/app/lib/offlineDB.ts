// src/app/lib/offlineDB.ts
import Dexie, { Table } from 'dexie';

export interface EventoOffline {
  id?: number;
  tipo_evento: string;
  fecha_hora: Date;
  campamento_id?: number | null;
  zona_playa?: string | null;
  coordenada_lat: number;
  coordenada_lon: number;
  tortuga_id?: number | null;
  observaciones?: string | null;
  detalles: Record<string, unknown>;
  fotos: string[];
  sincronizado: number; // ← Cambiado de boolean a number (0 = false, 1 = true)
  createdAt: Date;
}

export class OfflineDatabase extends Dexie {
  eventos!: Table<EventoOffline>;

  constructor() {
    super('TurtleConservationDB');
    
    this.version(2).stores({ // ← Cambia a versión 2
      eventos: '++id, tipo_evento, fecha_hora, sincronizado, createdAt, coordenada_lat, coordenada_lon'
    });

    this.on('populate', () => {
      console.log('Base de datos offline inicializada');
    });
  }
}

export const db = new OfflineDatabase();

// Función para verificar la conexión
export const initDB = async () => {
  try {
    await db.open();
    console.log('✅ Base de datos offline conectada');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos offline:', error);
    return false;
  }
};