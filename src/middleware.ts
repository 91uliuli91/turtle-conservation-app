// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
//import { verifyAuth } from './lib/auth-utils';

// Rutas que NO requieren autenticación
const PUBLIC_ROUTES = [
    '/',
    '/api/auth/login',
    '/api/auth/registro',
    '/api/health',
    '/not-found'
];

// Rutas que REQUIEREN autenticación
const PROTECTED_ROUTES = [
    '/formulario',
    '/mapa',
    '/estadisticas',
    '/api/eventos',
    '/api/campamentos',
    '/api/tortugas'
];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
  // Permitir acceso a rutas públicas
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Verificar autenticación para rutas protegidas
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        const token = request.cookies.get('auth-token')?.value;
        
        if (!token) {
        // Redirigir a login para rutas de UI
        if (!pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        // Retornar 401 para rutas de API
        return NextResponse.json(
            { error: 'No autorizado - Token requerido' },
            { status: 401 }
        );
        }

        try {
        // Verificar validez del token
        //const payload = await verifyAuth(token);
        
        // Agregar información del usuario al header para las rutas API
        //const requestHeaders = new Headers(request.headers);
        //requestHeaders.set('x-user-id', payload.userId);
        //requestHeaders.set('x-user-role', payload.role);
        
        return NextResponse.next({
            request: {
            //headers: requestHeaders,
            },
        });
        } catch (error) {
        console.error('❌ Token inválido:', error);
        
        // Limpiar cookie y redirigir
        const response = pathname.startsWith('/api')
            ? NextResponse.json(
                { error: 'Token inválido o expirado' },
                { status: 401 }
            )
            : NextResponse.redirect(new URL('/', request.url));
        
        response.cookies.delete('auth-token');
        return response;
        }
    }

    return NextResponse.next();
    }

    export const config = {
    matcher: [
        /*
        * Match all request paths except:
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - public folder
        */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};