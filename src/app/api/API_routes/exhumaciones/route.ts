export const dynamic = 'force-static';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener exhumaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const nido_id = searchParams.get('nido_id');

    if (id) {
      // Obtener exhumación específica por ID
      const result = await query(`
        SELECT ex.*, 
               n.numero_huevos_recolectados, n.identificador_en_corral,
               e.fecha_hora as fecha_anidacion, e.tipo_evento,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Exhumaciones ex
        JOIN Nidos n ON ex.nido_id = n.id
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE ex.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Exhumación no encontrada'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else if (nido_id) {
      // Obtener exhumaciones por nido específico
      const result = await query(`
        SELECT ex.*, 
               n.numero_huevos_recolectados, n.identificador_en_corral,
               e.fecha_hora as fecha_anidacion, e.tipo_evento,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Exhumaciones ex
        JOIN Nidos n ON ex.nido_id = n.id
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        WHERE ex.nido_id = $1
      `, [nido_id]);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    } else {
      // Obtener todas las exhumaciones
      const result = await query(`
        SELECT ex.*, 
               n.numero_huevos_recolectados, n.identificador_en_corral,
               e.fecha_hora as fecha_anidacion, e.tipo_evento,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre,
               c.nombre as campamento_nombre
        FROM Exhumaciones ex
        JOIN Nidos n ON ex.nido_id = n.id
        JOIN Eventos e ON n.evento_anidacion_id = e.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        ORDER BY ex.fecha_hora_exhumacion DESC
      `);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    }
  } catch (error) {
    console.error('Error al obtener exhumaciones:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nueva exhumación
export async function POST(request: NextRequest) {
  try {
    const {
      nido_id,
      fecha_hora_exhumacion,
      crias_vivas_liberadas,
      crias_muertas_en_nido,
      crias_deformes,
      huevos_no_eclosionados,
      comentarios
    } = await request.json();

    // Validaciones requeridas
    if (!nido_id || !fecha_hora_exhumacion) {
      return NextResponse.json({
        success: false,
        error: 'El ID del nido y la fecha de exhumación son requeridos'
      }, { status: 400 });
    }

    // Verificar que el nido existe
    const nidoExists = await query('SELECT numero_huevos_recolectados FROM Nidos WHERE id = $1', [nido_id]);
    if (nidoExists.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'El nido especificado no existe'
      }, { status: 400 });
    }

    // Verificar que no existe ya una exhumación para este nido (relación 1:1)
    const exhumacionExists = await query('SELECT id FROM Exhumaciones WHERE nido_id = $1', [nido_id]);
    if (exhumacionExists.rowCount && exhumacionExists.rowCount > 0) {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una exhumación registrada para este nido'
      }, { status: 409 });
    }

    // Validaciones de números no negativos
    const campos_numericos = [
      { valor: crias_vivas_liberadas, nombre: 'crías vivas liberadas' },
      { valor: crias_muertas_en_nido, nombre: 'crías muertas en nido' },
      { valor: crias_deformes, nombre: 'crías deformes' },
      { valor: huevos_no_eclosionados, nombre: 'huevos no eclosionados' }
    ];

    for (const campo of campos_numericos) {
      if (campo.valor !== undefined && campo.valor !== null && campo.valor < 0) {
        return NextResponse.json({
          success: false,
          error: `El número de ${campo.nombre} no puede ser negativo`
        }, { status: 400 });
      }
    }

    // Validación lógica: el total no debería exceder significativamente los huevos recolectados
    const totalContado = (crias_vivas_liberadas || 0) + 
                        (crias_muertas_en_nido || 0) + 
                        (crias_deformes || 0) + 
                        (huevos_no_eclosionados || 0);
    
    const huevosOriginales = nidoExists.rows[0].numero_huevos_recolectados;
    
    if (totalContado > huevosOriginales * 1.5) { // Permitir 50% más por posibles errores de conteo inicial
      return NextResponse.json({
        success: false,
        error: `El total contado (${totalContado}) excede significativamente los huevos originales (${huevosOriginales})`
      }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO Exhumaciones (
        nido_id, fecha_hora_exhumacion, crias_vivas_liberadas,
        crias_muertas_en_nido, crias_deformes, huevos_no_eclosionados, comentarios
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      nido_id,
      fecha_hora_exhumacion,
      crias_vivas_liberadas || 0,
      crias_muertas_en_nido || 0,
      crias_deformes || 0,
      huevos_no_eclosionados || 0,
      comentarios || null
    ]);

    // Obtener la exhumación completa con información relacionada
    const exhumacionCompleta = await query(`
      SELECT ex.*, 
             n.numero_huevos_recolectados, n.identificador_en_corral,
             e.fecha_hora as fecha_anidacion, e.tipo_evento,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre,
             c.nombre as campamento_nombre
      FROM Exhumaciones ex
      JOIN Nidos n ON ex.nido_id = n.id
      JOIN Eventos e ON n.evento_anidacion_id = e.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      LEFT JOIN Campamentos c ON e.campamento_id = c.id
      WHERE ex.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: exhumacionCompleta.rows[0],
      message: 'Exhumación creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear exhumación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar exhumación
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      fecha_hora_exhumacion,
      crias_vivas_liberadas,
      crias_muertas_en_nido,
      crias_deformes,
      huevos_no_eclosionados,
      comentarios
    } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID de la exhumación es requerido'
      }, { status: 400 });
    }

    // Validaciones de números no negativos
    const campos_numericos = [
      { valor: crias_vivas_liberadas, nombre: 'crías vivas liberadas' },
      { valor: crias_muertas_en_nido, nombre: 'crías muertas en nido' },
      { valor: crias_deformes, nombre: 'crías deformes' },
      { valor: huevos_no_eclosionados, nombre: 'huevos no eclosionados' }
    ];

    for (const campo of campos_numericos) {
      if (campo.valor !== undefined && campo.valor !== null && campo.valor < 0) {
        return NextResponse.json({
          success: false,
          error: `El número de ${campo.nombre} no puede ser negativo`
        }, { status: 400 });
      }
    }

    const result = await query(`
      UPDATE Exhumaciones SET
        fecha_hora_exhumacion = COALESCE($1, fecha_hora_exhumacion),
        crias_vivas_liberadas = COALESCE($2, crias_vivas_liberadas),
        crias_muertas_en_nido = COALESCE($3, crias_muertas_en_nido),
        crias_deformes = COALESCE($4, crias_deformes),
        huevos_no_eclosionados = COALESCE($5, huevos_no_eclosionados),
        comentarios = COALESCE($6, comentarios)
      WHERE id = $7
      RETURNING *
    `, [
      fecha_hora_exhumacion,
      crias_vivas_liberadas,
      crias_muertas_en_nido,
      crias_deformes,
      huevos_no_eclosionados,
      comentarios,
      id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Exhumación no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Exhumación actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar exhumación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar exhumación
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

    const result = await query('DELETE FROM Exhumaciones WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Exhumación no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Exhumación eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar exhumación:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}