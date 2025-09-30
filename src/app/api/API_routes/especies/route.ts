<<<<<<< HEAD
// src/app/api/API_routes/especies/route.js
=======
export const dynamic = 'force-static';
export const revalidate = 0;

>>>>>>> 4b1bdba920eb81a534bfebbd031c0d9427c7e22b
import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

// GET - Obtener todas las especies
export async function GET() {
  try {
    const result = await query(`
      SELECT id, nombre_comun, nombre_cientifico 
      FROM Especies 
      ORDER BY nombre_comun
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener especies:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nueva especie
export async function POST(request: NextRequest) {
  try {
    const { nombre_comun, nombre_cientifico } = await request.json();

    if (!nombre_comun) {
      return NextResponse.json({
        success: false,
        error: 'El nombre común es requerido'
      }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO Especies (nombre_comun, nombre_cientifico)
      VALUES ($1, $2)
      RETURNING *
    `, [nombre_comun, nombre_cientifico]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Especie creada exitosamente'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear especie:', error);
    
    if ((error as any)?.code === '23505') { // Unique constraint violation
      return NextResponse.json({
        success: false,
        error: 'Ya existe una especie con ese nombre'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar especie
export async function PUT(request: NextRequest) {
  try {
    const { id, nombre_comun, nombre_cientifico } = await request.json();

    if (!id || !nombre_comun) {
      return NextResponse.json({
        success: false,
        error: 'ID y nombre común son requeridos'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Especies 
      SET nombre_comun = $1, nombre_cientifico = $2
      WHERE id = $3
      RETURNING *
    `, [nombre_comun, nombre_cientifico, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Especie no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Especie actualizada exitosamente'
    });
  } catch (error: any) {
    console.error('Error al actualizar especie:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Ya existe una especie con ese nombre'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar especie
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

    const result = await query('DELETE FROM Especies WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Especie no encontrada'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Especie eliminada exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar especie:', error);
    
    if ((error as any)?.code === '23503') { // Foreign key constraint violation
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar la especie porque tiene tortugas asociadas'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}