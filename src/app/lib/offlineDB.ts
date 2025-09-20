// src/app/lib/offlineDB.ts
import Dexie, { Table } from 'dexie';

export interface EventoOffline {
id?: number;
tipo_evento: string;
fecha_hora: Date;
campamento_id?: number;
zona_playa?: string;
coordenada_lat: number;
coordenada_lon: number;
tortuga_id?: number;
observaciones?: string;
detalles: any;
fotos: string[];
sincronizado: boolean;
createdAt: Date;
}

export class OfflineDatabase extends Dexie {
eventos!: Table<EventoOffline>;

constructor() {
    super('TurtleConservationDB');
    this.version(1).stores({
    eventos: '++id, tipo_evento, fecha_hora, sincronizado, createdAt'
    });
}
}

export const db = new OfflineDatabase();