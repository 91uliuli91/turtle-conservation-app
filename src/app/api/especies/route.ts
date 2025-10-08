// src/app/api/especies/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export const dynamic = 'force-static'; // Para compatibilidad con GitHub Pages

export async function GET() {
  try {
    const result = await query('SELECT id, nombre_comun, nombre_cientifico FROM especies ORDER BY nombre_comun');
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('❌ Error obteniendo especies:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { nombre_comun, nombre_cientifico } = await request.json();
    
    if (!nombre_comun) {
      return NextResponse.json({
        success: false,
        error: 'El nombre común es requerido'
      }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO especies (nombre_comun, nombre_cientifico) VALUES ($1, $2) RETURNING id, nombre_comun, nombre_cientifico',
      [nombre_comun, nombre_cientifico || null]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Especie creada exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error creando especie:', error);
    
    if (error.code === '23505') { // Violación de unique constraint
      return NextResponse.json({
        success: false,
        error: 'Ya existe una especie con ese nombre'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}