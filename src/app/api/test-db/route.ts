export const dynamic = 'force-static';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { 
  checkDatabaseConnection, 
  getAllUsers, 
  getUserById, 
  createUser 
} from '@/app/lib/db-examples';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const test = searchParams.get('test');

  try {
    switch (test) {
      case 'connection':
        const isConnected = await checkDatabaseConnection();
        return NextResponse.json({ 
          success: true, 
          connected: isConnected,
          message: isConnected ? 'Conexión exitosa' : 'Conexión fallida'
        });

      case 'users':
        const users = await getAllUsers();
        return NextResponse.json({ 
          success: true, 
          data: users,
          count: users.length
        });

      case 'user':
        const userId = searchParams.get('id');
        if (!userId) {
          return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
        }
        const user = await getUserById(parseInt(userId));
        return NextResponse.json({ 
          success: true, 
          data: user
        });

      default:
        return NextResponse.json({
          success: true,
          message: 'Pruebas disponibles:',
          tests: [
            'GET /api/test-db?test=connection - Probar conexión',
            'GET /api/test-db?test=users - Obtener todos los usuarios',
            'GET /api/test-db?test=user&id=1 - Obtener usuario por ID',
            'POST /api/test-db - Crear nuevo usuario'
          ]
        });
    }
  } catch (error) {
    console.error('Error en test de DB:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Nombre y email son requeridos' 
      }, { status: 400 });
    }

    const newUser = await createUser(name, email);
    return NextResponse.json({ 
      success: true, 
      data: newUser,
      message: 'Usuario creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  }
}