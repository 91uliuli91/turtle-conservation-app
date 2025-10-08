// src/app/api/tortugas/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';

export const dynamic = 'force-static'; // Para compatibilidad con GitHub Pages

export async function GET() {
  try {
    const result = await query(`
      SELECT t.id, t.marca_principal, e.nombre_comun as especie_nombre
      FROM tortugas t
      LEFT JOIN especies e ON t.especie_id = e.id
      ORDER BY t.marca_principal
    `);
    
    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error: any) {
    console.error('❌ Error obteniendo tortugas:', error);
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { marca_principal, especie_id } = await request.json();
    
    if (!marca_principal) {
      return NextResponse.json({
        success: false,
        error: 'La marca principal es requerida'
      }, { status: 400 });
    }

    const result = await query(
      'INSERT INTO tortugas (marca_principal, especie_id) VALUES ($1, $2) RETURNING id, marca_principal, especie_id',
      [marca_principal, especie_id || null]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: 'Tortuga registrada exitosamente'
    });
  } catch (error: any) {
    console.error('❌ Error registrando tortuga:', error);
    
    if (error.code === '23505') { // Violación de unique constraint
      return NextResponse.json({
        success: false,
        error: 'Ya existe una tortuga con esa marca principal'
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 });
  }
}