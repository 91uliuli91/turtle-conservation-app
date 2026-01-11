// src/app/api/campamentos/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/../backend/lib/db';

export const dynamic = 'force-static'; // Para compatibilidad con GitHub Pages

export async function GET() {
  try {
    const result = await query('SELECT id, nombre FROM campamentos ORDER BY nombre');
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('❌ Error obteniendo campamentos:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre } = await request.json();
    
    if (!nombre) {
      return NextResponse.json({
        success: false,
        error: 'El nombre del campamento es requerido'
      }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO campamentos (nombre) VALUES ($1) RETURNING id, nombre',
      [nombre]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Campamento creado exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error creando campamento:', error);
    
    if (error.code === '23505') { // Violación de unique constraint
      return NextResponse.json({
        success: false,
        error: 'Ya existe un campamento con ese nombre'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}