import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener todas las tortugas con información de especie
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Obtener tortuga específica por ID
      const result = await query(`
        SELECT t.id, t.marca_principal, t.especie_id,
               e.nombre_comun as especie_nombre,
               e.nombre_cientifico as especie_cientifica
        FROM Tortugas t
        LEFT JOIN Especies e ON t.especie_id = e.id
        WHERE t.id = $1
      `, [id]);

      if (result.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'Tortuga no encontrada'
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: result.rows[0]
      });
    } else {
      // Obtener todas las tortugas
      const result = await query(`
        SELECT t.id, t.marca_principal, t.especie_id,
               e.nombre_comun as especie_nombre,
               e.nombre_cientifico as especie_cientifica
        FROM Tortugas t
        LEFT JOIN Especies e ON t.especie_id = e.id
        ORDER BY t.marca_principal
      `);

      return NextResponse.json({
        success: true,
        data: result.rows,
        count: result.rowCount
      });
    }
  } catch (error) {
    console.error('Error al obtener tortugas:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nueva tortuga
export async function POST(request: NextRequest) {
  try {
    const { marca_principal, especie_id } = await request.json();

    if (!marca_principal) {
      return NextResponse.json({
        success: false,
        error: 'La marca principal es requerida'
      }, { status: 400 });
    }

    // Verificar que la especie existe si se proporciona
    if (especie_id) {
      const especieExists = await query('SELECT id FROM Especies WHERE id = $1', [especie_id]);
      if (especieExists.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'La especie especificada no existe'
        }, { status: 400 });
      }
    }

    const result = await query(`
      INSERT INTO Tortugas (marca_principal, especie_id)
      VALUES ($1, $2)
      RETURNING *
    `, [marca_principal, especie_id || null]);

    // Obtener la tortuga con información de especie
    const tortugaCompleta = await query(`
      SELECT t.id, t.marca_principal, t.especie_id,
             e.nombre_comun as especie_nombre,
             e.nombre_cientifico as especie_cientifica
      FROM Tortugas t
      LEFT JOIN Especies e ON t.especie_id = e.id
      WHERE t.id = $1
    `, [result.rows[0].id]);

    return NextResponse.json({
      success: true,
      data: tortugaCompleta.rows[0],
      message: 'Tortuga creada exitosamente'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear tortuga:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({
        success: false,
        error: 'Ya existe una tortuga con esa marca principal'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar tortuga
export async function PUT(request: NextRequest) {
  try {
    const { id, marca_principal, especie_id } = await request.json();

    if (!id || !marca_principal) {
      return NextResponse.json({
        success: false,
        error: 'ID y marca principal son requeridos'
      }, { status: 400 });
    }

    // Verificar que la especie existe si se proporciona
    if (especie_id) {
      const especieExists = await query('SELECT id FROM Especies WHERE id = $1', [especie_id]);
      if (especieExists.rowCount === 0) {
        return NextResponse.json({
          success: false,
          error: 'La especie especificada no existe'
        }, { status: 400 });
      }
    }

    const result = await query(`
      UPDATE Tortugas 
      SET marca_principal = $1, especie_id = $2
      WHERE id = $3
      RETURNING *
    `, [marca_principal, especie_id || null, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Tortuga no encontrada'
      }, { status: 404 });
    }

    // Obtener la tortuga actualizada con información de especie
    const tortugaCompleta = await query(`
      SELECT t.id, t.marca_principal, t.especie_id,
             e.nombre_comun as especie_nombre,
             e.nombre_cientifico as especie_cientifica
      FROM Tortugas t
      LEFT JOIN Especies e ON t.especie_id = e.id
      WHERE t.id = $1
    `, [id]);

    return NextResponse.json({
      success: true,
      data: tortugaCompleta.rows[0],
      message: 'Tortuga actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('Error al actualizar tortuga:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una tortuga con esa marca principal'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar tortuga
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

    const result = await query('DELETE FROM Tortugas WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Tortuga no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Tortuga eliminada exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar tortuga:', error);
    
    if (error.code === '23503') { // Foreign key constraint violation
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar la tortuga porque tiene eventos asociados'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}