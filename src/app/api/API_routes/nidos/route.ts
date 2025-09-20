import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener nidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const evento_anidacion_id = searchParams.get('evento_anidacion_id');

    if (id) {
      // Obtener nido específico por ID
      const result = await query(`
        SELECT n.*, 
               e.fecha_hora as fecha_anidacion,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Nidos n
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE n.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Nido no encontrado'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else if (evento_anidacion_id) {
      // Obtener nidos por evento específico
      const result = await query(`
        SELECT n.*, 
               e.fecha_hora as fecha_anidacion,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Nidos n
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE n.evento_anidacion_id = $1
      `, [evento_anidacion_id]);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } else {
      // Obtener todos los nidos
      const result = await query(`
        SELECT n.*, 
               e.fecha_hora as fecha_anidacion,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Nidos n
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        ORDER BY e.fecha_hora DESC
      `);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    }
  } catch (error) {
    console.error('Error al obtener nidos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nuevo nido
export async function POST(request: NextRequest) {
  try {
    const {
      evento_anidacion_id,
      numero_huevos_recolectados,
      trasladado_a_corral,
      fecha_hora_traslado,
      identificador_en_corral,
      fecha_probable_eclosion,
      temperatura_media_corral_c,
      humedad_media_corral_porcentaje,
      observaciones_corral
    } = await request.json();

    // Validaciones requeridas
    if (!evento_anidacion_id || numero_huevos_recolectados === undefined) {
      return NextResponse.json({
        success: false,
        error: 'El evento de anidación y número de huevos recolectados son requeridos'
      }, { status: 400 });
    }

    if (numero_huevos_recolectados < 0) {
      return NextResponse.json({
        success: false,
        error: 'El número de huevos no puede ser negativo'
      }, { status: 400 });
    }

    // Verificar que el evento existe y es de tipo "Anidación"
    const eventoExists = await query('SELECT tipo_evento FROM Eventos WHERE id = $1', [evento_anidacion_id]);
    if (eventoExists.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'El evento especificado no existe'
      }, { status: 400 });
    }

    if (eventoExists.rows[0].tipo_evento !== 'Anidación') {
      return NextResponse.json({
        success: false,
        error: 'El evento debe ser de tipo "Anidación"'
      }, { status: 400 });
    }

    // Verificar que no existe ya un nido para este evento (relación 1:1)
    const nidoExists = await query('SELECT id FROM Nidos WHERE evento_anidacion_id = $1', [evento_anidacion_id]);
    if (nidoExists.rowCount && nidoExists.rowCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe un nido para este evento de anidación'
      }, { status: 409 });
    }

    // Validaciones condicionales para traslado a corral
    if (trasladado_a_corral) {
      if (!fecha_hora_traslado) {
        return NextResponse.json({
          success: false,
          error: 'La fecha de traslado es requerida cuando se traslada a corral'
        }, { status: 400 });
      }
      if (!identificador_en_corral) {
        return NextResponse.json({
          success: false,
          error: 'El identificador en corral es requerido cuando se traslada a corral'
        }, { status: 400 });
      }
    }

    const result = await query(`
      INSERT INTO Nidos (
        evento_anidacion_id, numero_huevos_recolectados, trasladado_a_corral,
        fecha_hora_traslado, identificador_en_corral, fecha_probable_eclosion,
        temperatura_media_corral_c, humedad_media_corral_porcentaje, observaciones_corral
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      evento_anidacion_id,
      numero_huevos_recolectados,
      trasladado_a_corral || false,
      fecha_hora_traslado || null,
      identificador_en_corral || null,
      fecha_probable_eclosion || null,
      temperatura_media_corral_c || null,
      humedad_media_corral_porcentaje || null,
      observaciones_corral || null
    ]);

    // Obtener el nido completo con información del evento
    const nidoCompleto = await query(`
      SELECT n.*, 
             e.fecha_hora as fecha_anidacion,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre,
             c.nombre as campamento_nombre
      FROM Nidos n
      JOIN Eventos e ON n.evento_anidacion_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      LEFT JOIN Campamentos c ON e.campamento_id = c.id
      WHERE n.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: nidoCompleto.rows[0],
      message: 'Nido creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear nido:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar nido
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      numero_huevos_recolectados,
      trasladado_a_corral,
      fecha_hora_traslado,
      identificador_en_corral,
      fecha_probable_eclosion,
      temperatura_media_corral_c,
      humedad_media_corral_porcentaje,
      observaciones_corral
    } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID del nido es requerido'
      }, { status: 400 });
    }

    // Validaciones
    if (numero_huevos_recolectados !== undefined && numero_huevos_recolectados < 0) {
      return NextResponse.json({
        success: false,
        error: 'El número de huevos no puede ser negativo'
      }, { status: 400 });
    }

    // Si se está marcando como trasladado, validar campos requeridos
    if (trasladado_a_corral && !fecha_hora_traslado) {
      return NextResponse.json({
        success: false,
        error: 'La fecha de traslado es requerida cuando se traslada a corral'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Nidos SET
        numero_huevos_recolectados = COALESCE($1, numero_huevos_recolectados),
        trasladado_a_corral = COALESCE($2, trasladado_a_corral),
        fecha_hora_traslado = COALESCE($3, fecha_hora_traslado),
        identificador_en_corral = COALESCE($4, identificador_en_corral),
        fecha_probable_eclosion = COALESCE($5, fecha_probable_eclosion),
        temperatura_media_corral_c = COALESCE($6, temperatura_media_corral_c),
        humedad_media_corral_porcentaje = COALESCE($7, humedad_media_corral_porcentaje),
        observaciones_corral = COALESCE($8, observaciones_corral)
      WHERE id = $9
      RETURNING *
    `, [
      numero_huevos_recolectados,
      trasladado_a_corral,
      fecha_hora_traslado,
      identificador_en_corral,
      fecha_probable_eclosion,
      temperatura_media_corral_c,
      humedad_media_corral_porcentaje,
      observaciones_corral,
      id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nido no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Nido actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar nido:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar nido
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID es requerido'
      }, { status: 400 });
    }

    const result = await query('DELETE FROM Nidos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Nido no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Nido eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar nido:', error);
    
    if (error.code === '23503') { // Foreign key constraint violation
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar el nido porque tiene exhumaciones asociadas'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}