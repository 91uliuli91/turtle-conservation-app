// src/app/api/API_routes/condiciones/route.js
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener condiciones ambientales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const evento_id = searchParams.get('evento_id');

    if (id) {
      // Obtener condición específica por ID
      const result = await query(`
        SELECT ca.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Condiciones_Ambientales ca
        JOIN Eventos e ON ca.evento_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE ca.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Condición ambiental no encontrada'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else if (evento_id) {
      // Obtener condiciones por evento específico
      const result = await query(`
        SELECT ca.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Condiciones_Ambientales ca
        JOIN Eventos e ON ca.evento_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE ca.evento_id = $1
      `, [evento_id]);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } else {
      // Obtener todas las condiciones ambientales
      const result = await query(`
        SELECT ca.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Condiciones_Ambientales ca
        JOIN Eventos e ON ca.evento_id = e.id
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
    console.error('Error al obtener condiciones ambientales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nuevas condiciones ambientales
export async function POST(request: NextRequest) {
  try {
    const {
      evento_id,
      temperatura_arena_nido_c,
      humedad_arena_porcentaje,
      fase_lunar
    } = await request.json();

    // Validaciones requeridas
    if (!evento_id) {
      return NextResponse.json({
        success: false,
        error: 'El ID del evento es requerido'
      }, { status: 400 });
    }

    // Verificar que el evento existe
    const eventoExists = await query('SELECT id FROM Eventos WHERE id = $1', [evento_id]);
    if (eventoExists.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'El evento especificado no existe'
      }, { status: 400 });
    }

    // Verificar que no existe ya una condición ambiental para este evento (relación 1:1)
    const condicionExists = await query('SELECT id FROM Condiciones_Ambientales WHERE evento_id = $1', [evento_id]);
    if (condicionExists.rowCount && condicionExists.rowCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Ya existen condiciones ambientales registradas para este evento'
      }, { status: 409 });
    }

    // Validaciones de rangos
    if (temperatura_arena_nido_c !== undefined && temperatura_arena_nido_c !== null) {
      if (temperatura_arena_nido_c < -50 || temperatura_arena_nido_c > 70) {
        return NextResponse.json({
          success: false,
          error: 'La temperatura debe estar entre -50°C y 70°C'
        }, { status: 400 });
      }
    }

    if (humedad_arena_porcentaje !== undefined && humedad_arena_porcentaje !== null) {
      if (humedad_arena_porcentaje < 0 || humedad_arena_porcentaje > 100) {
        return NextResponse.json({
          success: false,
          error: 'La humedad debe estar entre 0% y 100%'
        }, { status: 400 });
      }
    }

    const result = await query(`
      INSERT INTO Condiciones_Ambientales (
        evento_id, temperatura_arena_nido_c, humedad_arena_porcentaje, fase_lunar
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      evento_id,
      temperatura_arena_nido_c || null,
      humedad_arena_porcentaje || null,
      fase_lunar || null
    ]);

    // Obtener la condición completa con información del evento
    const condicionCompleta = await query(`
      SELECT ca.*, 
             e.tipo_evento, e.fecha_hora,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre,
             c.nombre as campamento_nombre
      FROM Condiciones_Ambientales ca
      JOIN Eventos e ON ca.evento_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      LEFT JOIN Campamentos c ON e.campamento_id = c.id
      WHERE ca.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: condicionCompleta.rows[0],
      message: 'Condiciones ambientales creadas exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear condiciones ambientales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar condiciones ambientales
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      temperatura_arena_nido_c,
      humedad_arena_porcentaje,
      fase_lunar
    } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de las condiciones ambientales es requerido'
      }, { status: 400 });
    }

    // Validaciones de rangos
    if (temperatura_arena_nido_c !== undefined && temperatura_arena_nido_c !== null) {
      if (temperatura_arena_nido_c < -50 || temperatura_arena_nido_c > 70) {
        return NextResponse.json({
          success: false,
          error: 'La temperatura debe estar entre -50°C y 70°C'
        }, { status: 400 });
      }
    }

    if (humedad_arena_porcentaje !== undefined && humedad_arena_porcentaje !== null) {
      if (humedad_arena_porcentaje < 0 || humedad_arena_porcentaje > 100) {
        return NextResponse.json({
          success: false,
          error: 'La humedad debe estar entre 0% y 100%'
        }, { status: 400 });
      }
    }

    const result = await query(`
      UPDATE Condiciones_Ambientales SET
        temperatura_arena_nido_c = COALESCE($1, temperatura_arena_nido_c),
        humedad_arena_porcentaje = COALESCE($2, humedad_arena_porcentaje),
        fase_lunar = COALESCE($3, fase_lunar)
      WHERE id = $4
      RETURNING *
    `, [
      temperatura_arena_nido_c,
      humedad_arena_porcentaje,
      fase_lunar,
      id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Condiciones ambientales no encontradas'
      }, { status: 404 });
    }

    // Obtener la condición actualizada con información del evento
    const condicionCompleta = await query(`
      SELECT ca.*, 
             e.tipo_evento, e.fecha_hora,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre,
             c.nombre as campamento_nombre
      FROM Condiciones_Ambientales ca
      JOIN Eventos e ON ca.evento_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      LEFT JOIN Campamentos c ON e.campamento_id = c.id
      WHERE ca.id = $1
    `, [id]);

    return NextResponse.json({
      success: true,
      data: condicionCompleta.rows[0],
      message: 'Condiciones ambientales actualizadas exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar condiciones ambientales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar condiciones ambientales
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

    const result = await query('DELETE FROM Condiciones_Ambientales WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Condiciones ambientales no encontradas'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Condiciones ambientales eliminadas exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar condiciones ambientales:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}