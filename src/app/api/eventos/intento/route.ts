// src/app/api/eventos/intento/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { query } from '@/app/lib/db';

export const dynamic = 'force-static'; // Para compatibilidad con GitHub Pages

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validar datos requeridos
    const {
      fecha_hora,
      coordenada_lat,
      coordenada_lon,
      personal_registro_id,
      observaciones,
      campamento_id,
      zona_playa,
      estacion_baliza,
      tortuga_id,
      // Datos específicos de intento
      largo_caparazon,
      ancho_caparazon,
      se_coloco_marca,
      se_remarco,
      // Datos ambientales
      temperatura_arena,
      humedad_arena,
      fase_lunar,
      // Fotos
      fotos_paths
    } = data;

    console.log('📊 Datos recibidos para intento:', data);

    // Iniciar transacción
    await query('BEGIN');

    try {
      // 1. Crear el evento principal
      const eventoResult = await query(`
        INSERT INTO eventos (
          tipo_evento, fecha_hora, campamento_id, zona_playa, 
          estacion_baliza, coordenada_lat, coordenada_lon, 
          tortuga_id, personal_registro_id, observaciones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
        RETURNING id
      `, [
        'Intento',
        fecha_hora || new Date().toISOString(),
        campamento_id && campamento_id > 0 ? campamento_id : null, // Validar campamento_id
        zona_playa && ['A', 'B', 'C'].includes(zona_playa) ? zona_playa : null, // Validar zona_playa
        estacion_baliza || null,
        coordenada_lat || null,
        coordenada_lon || null,
        tortuga_id && tortuga_id > 0 ? tortuga_id : null, // Validar tortuga_id
        personal_registro_id || 1,
        observaciones || null
      ]);

      const eventoId = eventoResult.rows[0].id;
      console.log('✅ Evento de intento creado con ID:', eventoId);

      // 2. Crear observaciones de tortuga
      if (largo_caparazon || ancho_caparazon || se_coloco_marca || se_remarco || fotos_paths) {
        await query(`
          INSERT INTO observaciones_tortuga (
            evento_id, largo_caparazon_cm, ancho_caparazon_cm,
            se_coloco_marca_nueva, se_remarco, path_fotos
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          eventoId,
          largo_caparazon || null,
          ancho_caparazon || null,
          se_coloco_marca || false,
          se_remarco || false,
          fotos_paths || null
        ]);

        console.log('✅ Observaciones de tortuga creadas');
      }

      // 3. Crear condiciones ambientales
      if (temperatura_arena || humedad_arena || fase_lunar) {
        await query(`
          INSERT INTO condiciones_ambientales (
            evento_id, temperatura_arena_nido_c, 
            humedad_arena_porcentaje, fase_lunar
          ) VALUES ($1, $2, $3, $4)
        `, [
          eventoId,
          temperatura_arena || null,
          humedad_arena || null,
          fase_lunar || null
        ]);

        console.log('✅ Condiciones ambientales creadas');
      }

      // Confirmar transacción
      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Evento de intento guardado exitosamente',
        evento_id: eventoId
      });

    } catch (error) {
      // Rollback en caso de error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('❌ Error al guardar evento de intento:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}