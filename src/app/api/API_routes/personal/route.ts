export const dynamic = 'force-static';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/../backend/lib/db';

// GET - Obtener todo el personal
export async function GET() {
  try {
    const result = await query(`
      SELECT id, nombre_completo, rol 
      FROM Personal 
      ORDER BY nombre_completo
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener personal:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nuevo personal
export async function POST(request: NextRequest) {
  try {
    const { nombre_completo, rol } = await request.json();

    if (!nombre_completo) {
      return NextResponse.json({
        success: false,
        error: 'El nombre completo es requerido'
      }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO Personal (nombre_completo, rol)
      VALUES ($1, $2)
      RETURNING *
    `, [nombre_completo, rol]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Personal creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear personal:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar personal
export async function PUT(request: NextRequest) {
  try {
    const { id, nombre_completo, rol } = await request.json();

    if (!id || !nombre_completo) {
      return NextResponse.json({
        success: false,
        error: 'ID y nombre completo son requeridos'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Personal 
      SET nombre_completo = $1, rol = $2
      WHERE id = $3
      RETURNING *
    `, [nombre_completo, rol, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Personal no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Personal actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar personal:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar personal
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

    const result = await query('DELETE FROM Personal WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Personal no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Personal eliminado exitosamente'
    });
  } catch (error: unknown) {
    console.error('Error al eliminar personal:', error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23503') {
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar al personal porque tiene eventos registrados'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}