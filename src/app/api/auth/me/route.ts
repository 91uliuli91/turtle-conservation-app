// src/app/api/auth/me/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/../backend/lib/db';

export async function GET(request: Request) {
  try {
    const userId = request.headers.get('x-user-id') || 
                   new URL(request.url).searchParams.get('user-id');
    
    if (!userId) {
      return NextResponse.json({ user: null });
    }
    
    // USANDO LA ESTRUCTURA ACTUAL
    const result = await query(
      'SELECT id, nombre_completo, email, rol FROM personal WHERE id = $1 AND activo = true',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ 
      user: {
        id: result.rows[0].id,
        nombre: result.rows[0].nombre_completo,  // ← nombre_completo
        email: result.rows[0].email,
        cargo: result.rows[0].rol  // ← rol como cargo
      }
    });
    
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}