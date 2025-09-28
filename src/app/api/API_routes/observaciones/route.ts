// src/app/api/API_routes/observaciones/route.js
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener observaciones de tortugas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const evento_id = searchParams.get('evento_id');
    const id = searchParams.get('id');

    if (id) {
      // Obtener observación específica por ID
      const result = await query(`
        SELECT ot.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre
        FROM Observaciones_Tortuga ot
        JOIN Eventos e ON ot.evento_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        WHERE ot.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Observación no encontrada'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else if (evento_id) {
      // Obtener observaciones por evento específico
      const result = await query(`
        SELECT ot.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre
        FROM Observaciones_Tortuga ot
        JOIN Eventos e ON ot.evento_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        WHERE ot.evento_id = $1
      `, [evento_id]);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } else {
      // Obtener todas las observaciones
      const result = await query(`
        SELECT ot.*, 
               e.tipo_evento, e.fecha_hora,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre
        FROM Observaciones_Tortuga ot
        JOIN Eventos e ON ot.evento_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        ORDER BY e.fecha_hora DESC
      `);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    }
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nueva observación de tortuga
export async function POST(request: NextRequest) {
  try {
    const {
      evento_id,
      largo_caparazon_cm,
      ancho_caparazon_cm,
      se_coloco_marca_nueva,
      se_remarco,
      path_fotos
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

    // Verificar que no existe ya una observación para este evento (relación 1:1)
    const observacionExists = await query('SELECT id FROM Observaciones_Tortuga WHERE evento_id = $1', [evento_id]);
    if (observacionExists.rowCount && observacionExists.rowCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una observación para este evento'
      }, { status: 409 });
    }

    const result = await query(`
      INSERT INTO Observaciones_Tortuga (
        evento_id, largo_caparazon_cm, ancho_caparazon_cm,
        se_coloco_marca_nueva, se_remarco, path_fotos
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      evento_id,
      largo_caparazon_cm || null,
      ancho_caparazon_cm || null,
      se_coloco_marca_nueva || false,
      se_remarco || false,
      path_fotos || null
    ]);

    // Obtener la observación completa con información del evento
    const observacionCompleta = await query(`
      SELECT ot.*, 
             e.tipo_evento, e.fecha_hora,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre
      FROM Observaciones_Tortuga ot
      JOIN Eventos e ON ot.evento_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      WHERE ot.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: observacionCompleta.rows[0],
      message: 'Observación creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear observación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar observación de tortuga
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      largo_caparazon_cm,
      ancho_caparazon_cm,
      se_coloco_marca_nueva,
      se_remarco,
      path_fotos
    } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de la observación es requerido'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Observaciones_Tortuga SET
        largo_caparazon_cm = COALESCE($1, largo_caparazon_cm),
        ancho_caparazon_cm = COALESCE($2, ancho_caparazon_cm),
        se_coloco_marca_nueva = COALESCE($3, se_coloco_marca_nueva),
        se_remarco = COALESCE($4, se_remarco),
        path_fotos = COALESCE($5, path_fotos)
      WHERE id = $6
      RETURNING *
    `, [
      largo_caparazon_cm,
      ancho_caparazon_cm,
      se_coloco_marca_nueva,
      se_remarco,
      path_fotos,
      id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Observación no encontrada'
      }, { status: 404 });
    }

    // Obtener la observación actualizada con información del evento
    const observacionCompleta = await query(`
      SELECT ot.*, 
             e.tipo_evento, e.fecha_hora,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre
      FROM Observaciones_Tortuga ot
      JOIN Eventos e ON ot.evento_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      WHERE ot.id = $1
    `, [id]);

    return NextResponse.json({
      success: true,
      data: observacionCompleta.rows[0],
      message: 'Observación actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar observación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar observación de tortuga
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

    const result = await query('DELETE FROM Observaciones_Tortuga WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Observación no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Observación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar observación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}