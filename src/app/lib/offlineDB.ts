// src/app/lib/offlineDB.ts
import Dexie, { Table } from 'dexie'; // Importamos Dexie, la librería que facilita el uso de IndexedDB

// Definimos la estructura de los eventos almacenados en la base de datos offline
export interface EventoOffline {
  id?: number; // ID del evento (autoincremental)
  tipo_evento: string; // Tipo de evento (anidación, arqueo, etc.)
  fecha_hora: Date; // Fecha y hora del evento
  campamento_id?: number | null; // ID del campamento (opcional)
  zona_playa?: string | null; // Zona de la playa donde ocurrió el evento
  coordenada_lat: number; // Latitud del evento
  coordenada_lon: number; // Longitud del evento
  tortuga_id?: number | null; // ID de la tortuga (opcional)
  observaciones?: string | null; // Observaciones adicionales sobre el evento
  detalles: any; // Detalles específicos del evento (puede contener información compleja)
  fotos: string[]; // Array de URLs de fotos asociadas al evento
  sincronizado: number; // Indica si el evento está sincronizado (0 = no, 1 = sí)
  createdAt: Date; // Fecha de creación del evento
}

// Clase que extiende Dexie para crear la base de datos offline
export class OfflineDatabase extends Dexie {
  eventos!: Table<EventoOffline>; // Definimos la tabla 'eventos' que almacena los eventos offline

  constructor() {
    super('TurtleConservationDB'); // Inicializa la base de datos con el nombre 'TurtleConservationDB'
    
    // Definimos la estructura de la base de datos y las versiones
    this.version(2).stores({ // Establecemos la versión de la base de datos (versión 2)
      eventos: '++id, tipo_evento, fecha_hora, sincronizado, createdAt, coordenada_lat, coordenada_lon' // Definimos los índices para la tabla 'eventos'
    });

    // Evento cuando la base de datos se inicializa (población)
    this.on('populate', () => {
      console.log('Base de datos offline inicializada');
    });
  }
}

// Creamos una instancia de la base de datos
export const db = new OfflineDatabase();

// Función para verificar la conexión a la base de datos
export const initDB = async () => {
  try {
    await db.open(); // Intentamos abrir la base de datos
    console.log('✅ Base de datos offline conectada');
    return true; // Si la conexión es exitosa, retornamos 'true'
  } catch (error) {
    console.error('❌ Error conectando a la base de datos offline:', error);
    return false; // Si ocurre un error, mostramos el error y retornamos 'false'
  }
};
