// src/app/api/eventos/arqueo/route.ts
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
      // Datos específicos de arqueo
      nido_id,
      crias_vivas_liberadas,
      crias_muertas_en_nido,
      crias_deformes,
      huevos_no_eclosionados,
      comentarios_arqueo,
      fotos_paths
    } = data;

    console.log('📊 Datos recibidos para arqueo:', data);

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
        'Arqueo',
        fecha_hora || new Date().toISOString(),
        campamento_id && campamento_id > 0 ? campamento_id : null, // Validar campamento_id
        zona_playa && ['A', 'B', 'C'].includes(zona_playa) ? zona_playa : null, // Validar zona_playa
        estacion_baliza || null,
        coordenada_lat || null,
        coordenada_lon || null,
        null, // No hay tortuga específica en arqueo
        personal_registro_id || 1,
        observaciones || null
      ]);

      const eventoId = eventoResult.rows[0].id;
      console.log('✅ Evento de arqueo creado con ID:', eventoId);

      // 2. Crear la exhumación
      if (nido_id) {
        await query(`
          INSERT INTO exhumaciones (
            nido_id, fecha_hora_exhumacion, crias_vivas_liberadas,
            crias_muertas_en_nido, crias_deformes, huevos_no_eclosionados,
            comentarios
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
          nido_id,
          fecha_hora || new Date().toISOString(),
          crias_vivas_liberadas || 0,
          crias_muertas_en_nido || 0,
          crias_deformes || 0,
          huevos_no_eclosionados || 0,
          comentarios_arqueo || null
        ]);

        console.log('✅ Datos de exhumación registrados');
      }

      // 3. Si hay fotos, agregar a observaciones generales del evento
      if (fotos_paths) {
        await query(`
          INSERT INTO observaciones_tortuga (
            evento_id, path_fotos, se_coloco_marca_nueva, se_remarco
          ) VALUES ($1, $2, $3, $4)
        `, [
          eventoId,
          fotos_paths,
          false,
          false
        ]);

        console.log('✅ Fotos de arqueo registradas');
      }

      // Confirmar transacción
      await query('COMMIT');

      return NextResponse.json({
        success: true,
        message: 'Evento de arqueo guardado exitosamente',
        evento_id: eventoId
      });

    } catch (error) {
      // Rollback en caso de error
      await query('ROLLBACK');
      throw error;
    }

  } catch (error: any) {
    console.error('❌ Error al guardar evento de arqueo:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    }, { status: 500 });
  }
}