export const dynamic = 'force-static';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/../backend/lib/db';

// GET - Obtener todos los campamentos
export async function GET() {
  try {
    const result = await query(`
      SELECT id, nombre 
      FROM Campamentos 
      ORDER BY nombre
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error al obtener campamentos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// POST - Crear nuevo campamento
export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();

    if (!nombre) {
      return NextResponse.json({
        success: false,
        error: 'El nombre del campamento es requerido'
      }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO Campamentos (nombre)
      VALUES ($1)
      RETURNING *
    `, [nombre]);

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Campamento creado exitosamente'
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear campamento:', error);
    
    if (error.code === '23505') { // Unique constraint violation
      return NextResponse.json({
        success: false,
        error: 'Ya existe un campamento con ese nombre'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// PUT - Actualizar campamento
export async function PUT(request: NextRequest) {
  try {
    const { id, nombre } = await request.json();

    if (!id || !nombre) {
      return NextResponse.json({
        success: false,
        error: 'ID y nombre son requeridos'
      }, { status: 400 });
    }

    const result = await query(`
      UPDATE Campamentos 
      SET nombre = $1
      WHERE id = $2
      RETURNING *
    `, [nombre, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Campamento no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Campamento actualizado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al actualizar campamento:', error);
    
    if (error.code === '23505') {
      return NextResponse.json({
        success: false,
        error: 'Ya existe un campamento con ese nombre'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

// DELETE - Eliminar campamento
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

    const result = await query('DELETE FROM Campamentos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: 'Campamento no encontrado'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Campamento eliminado exitosamente'
    });
  } catch (error: any) {
    console.error('Error al eliminar campamento:', error);
    
    if (error.code === '23503') { // Foreign key constraint violation
      return NextResponse.json({
        success: false,
        error: 'No se puede eliminar el campamento porque tiene eventos asociados'
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}