// src/app/api/auth/registro/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/app/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { nombre, apellido, email, password, cargo } = await request.json();
    
    // Combinar nombre y apellido para nombre_completo
    const nombreCompleto = `${nombre} ${apellido}`.trim();
    
    // Verificar si el usuario ya existe
    const existingUser = await query(
      'SELECT id FROM personal WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 });
    }
    
    // Hash de la contraseña
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Insertar nuevo usuario - USANDO LA ESTRUCTURA ACTUAL
    const result = await query(
      `INSERT INTO personal (nombre_completo, apellido, email, password_hash, rol, activo) 
       VALUES ($1, $2, $3, $4, $5, true) 
       RETURNING id, nombre_completo, email, rol`,
      [nombreCompleto, apellido, email, passwordHash, cargo]
    );
    
    const user = result.rows[0];
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        nombre: user.nombre_completo,  // ← nombre_completo
        email: user.email, 
        cargo: user.rol  // ← rol como cargo
      } 
    });
    
  } catch (error: any) {
    console.error('Error en registro:', error);
    return NextResponse.json({ 
      error: 'Error interno del servidor',
      details: error.message 
    }, { status: 500 });
  }
}