// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Buscar usuario - USANDO LA ESTRUCTURA ACTUAL
    const result = await query(
      'SELECT id, nombre_completo, email, password_hash, rol FROM personal WHERE email = $1 AND activo = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }
    
    const user = result.rows[0];
    
    // Verificar contraseña
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }
    
    // Crear sesión
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        nombre: user.nombre_completo,  // ← nombre_completo
        email: user.email, 
        cargo: user.rol  // ← rol como cargo
      }
    });
    
    response.cookies.set('user-id', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 1 día
    });
    
    return response;
    
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}