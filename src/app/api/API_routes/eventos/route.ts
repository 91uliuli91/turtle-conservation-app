// src/app/api/API_routes/eventos/route.ts - VERSIÓN CORREGIDA
// ❌ ELIMINADO: export const dynamic = 'force-static';
// ✅ AGREGADO: Configuración correcta para rutas dinámicas
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/../backend/lib/db';

// GET - Obtener todos los eventos con información relacionada
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const tipo = searchParams.get('tipo');

    if (id) {
      // Obtener evento específico por ID
      const result = await query(`
        SELECT e.*, 
              c.nombre as campamento_nombre,
              t.marca_principal as tortuga_marca,
              p.nombre_completo as personal_nombre
        FROM Eventos e
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
        WHERE e.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Evento no encontrado'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      // Construir query con filtros opcionales
      let queryText = `
        SELECT e.*, 
               c.nombre as campamento_nombre,
               t.marca_principal as tortuga_marca,
               p.nombre_completo as personal_nombre
        FROM Eventos e
        LEFT JOIN Campamentos c ON e.campamento_id = c.id
        LEFT JOIN Tortugas t ON e.tortuga_id = t.id
        LEFT JOIN Personal p ON e.personal_registro_id = p.id
      `;
      
      const params: any[] = [];
      const conditions: string[] = [];

      if (tipo) {
        conditions.push(`e.tipo_evento = $${params.length + 1}`);
        params.push(tipo);
      }

      if (conditions.length > 0) {
        queryText += ` WHERE ${conditions.join(' AND ')}`;
      }

      queryText += ` ORDER BY e.fecha_hora DESC`;

      const result = await query(queryText, params);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    }
  } catch (error: any) {
    console.error('❌ Error al obtener eventos:', error);
    console.error('Detalles del error:', error.message, error.stack);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// POST - Crear nuevo evento
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 Datos recibidos:', body);

    const {
      tipo_evento,
      fecha_hora,
      campamento_id,
      zona_playa,
      estacion_baliza,
      coordenada_lat,
      coordenada_lon,
      tortuga_id,
      personal_registro_id,
      observaciones
    } = body;

    // Validaciones requeridas
    if (!tipo_evento || !fecha_hora || !personal_registro_id) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de evento, fecha/hora y personal de registro son requeridos'
      }, { status: 400 });
    }

    // Validar tipo de evento
    const tiposValidos = ['Anidación', 'Intento', 'Arqueo'];
    if (!tiposValidos.includes(tipo_evento)) {
      return NextResponse.json({
        success: false,
        error: `Tipo de evento debe ser: ${tiposValidos.join(', ')}`
      }, { status: 400 });
    }

    // Validar zona de playa si se proporciona
    if (zona_playa && !['A', 'B', 'C'].includes(zona_playa)) {
      return NextResponse.json({
        success: false,
        error: 'Zona de playa debe ser A, B o C'
      }, { status: 400 });
    }

    // Verificar que las referencias existen
    if (campamento_id) {
      const campamentoExists = await query('SELECT id FROM Campamentos WHERE id = $1', [campamento_id]);
      if (campamentoExists.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'El campamento especificado no existe'
        }, { status: 400 });
      }
    }

    if (tortuga_id) {
      const tortugaExists = await query('SELECT id FROM Tortugas WHERE id = $1', [tortuga_id]);
      if (tortugaExists.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'La tortuga especificada no existe'
        }, { status: 400 });
      }
    }

    const personalExists = await query('SELECT id FROM Personal WHERE id = $1', [personal_registro_id]);
    if (personalExists.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'El personal especificado no existe'
      }, { status: 400 });
    }

    console.log('✅ Validaciones pasadas, insertando evento...');

    const result = await query(`
      INSERT INTO Eventos (
        tipo_evento, fecha_hora, campamento_id, zona_playa, estacion_baliza,
        coordenada_lat, coordenada_lon, tortuga_id, personal_registro_id, observaciones
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      tipo_evento, fecha_hora, campamento_id || null, zona_playa || null,
      estacion_baliza || null, coordenada_lat || null, coordenada_lon || null,
      tortuga_id || null, personal_registro_id, observaciones || null
    ]);

    console.log('✅ Evento insertado, ID:', result.rows[0].id);

    // Obtener el evento completo con información relacionada
    const eventoCompleto = await query(`
      SELECT e.*, 
             c.nombre as campamento_nombre,
             t.marca_principal as tortuga_marca,
             p.nombre_completo as personal_nombre
      FROM Eventos e
      LEFT JOIN Campamentos c ON e.campamento_id = c.id
      LEFT JOIN Tortugas t ON e.tortuga_id = t.id
      LEFT JOIN Personal p ON e.personal_registro_id = p.id
      WHERE e.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: eventoCompleto.rows[0],
      message: 'Evento creado exitosamente'
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error completo al crear evento:', error);
    console.error('Stack trace:', error.stack);
    console.error('Código de error:', error.code);
    
    // Errores específicos de PostgreSQL
    if (error.code === '23503') {
      return NextResponse.json({
        success: false,
        error: 'Error de integridad referencial: uno de los IDs no existe'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// PUT - Actualizar evento
export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      tipo_evento,
      fecha_hora,
      campamento_id,
      zona_playa,
      estacion_baliza,
      coordenada_lat,
      coordenada_lon,
      tortuga_id,
      personal_registro_id,
      observaciones
    } = await request.json();

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID del evento es requerido'
      }, { status: 400 });
    }

    // Validaciones similares al POST
    if (tipo_evento && !['Anidación', 'Intento', 'Arqueo'].includes(tipo_evento)) {
      return NextResponse.json({
        success: false,
        error: 'Tipo de evento debe ser: Anidación, Intento o Arqueo'
      }, { status: 400 });
    }

    if (zona_playa && !['A', 'B', 'C'].includes(zona_playa)) {
      return NextResponse.json({
        success: false,
        error: 'Zona de playa debe ser A, B o C'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Eventos SET
        tipo_evento = COALESCE($1, tipo_evento),
        fecha_hora = COALESCE($2, fecha_hora),
        campamento_id = COALESCE($3, campamento_id),
        zona_playa = COALESCE($4, zona_playa),
        estacion_baliza = COALESCE($5, estacion_baliza),
        coordenada_lat = COALESCE($6, coordenada_lat),
        coordenada_lon = COALESCE($7, coordenada_lon),
        tortuga_id = COALESCE($8, tortuga_id),
        personal_registro_id = COALESCE($9, personal_registro_id),
        observaciones = COALESCE($10, observaciones)
      WHERE id = $11
      RETURNING *
    `, [
      tipo_evento, fecha_hora, campamento_id, zona_playa, estacion_baliza,
      coordenada_lat, coordenada_lon, tortuga_id, personal_registro_id,
      observaciones, id
    ]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Evento no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Evento actualizado exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al actualizar evento:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

// DELETE - Eliminar evento
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

    const result = await query('DELETE FROM Eventos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Evento no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error al eliminar evento:', error);
    
    if (error?.code === '23503') {
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar el evento porque tiene registros asociados'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}