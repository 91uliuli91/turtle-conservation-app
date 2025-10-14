// src/components/ProfileMenu.tsx - ACTUALIZADO CON SEGURIDAD
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SecureLoginForm, SecureRegisterForm } from './SecureAuthForm';

interface User {
  id: number;
  nombre: string;
  email: string;
  cargo: string;
}

export default function MobileProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState<string>('');
  const router = useRouter();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Importante para incluir cookies
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      }
    } catch (error) {
      console.log('Usuario no autenticado');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthError('');
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Incluir cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 429) {
          throw new Error(`Demasiados intentos. Intenta de nuevo en ${data.retryAfter} segundos`);
        }
        throw new Error(data.error || 'Error en el inicio de sesión');
      }

      console.log('✅ Login exitoso:', data);
      setUser(data.user);
      setShowAuthModal(false);
      setShowMenu(false);
      
      // Mostrar mensaje de bienvenida
      showSuccessMessage(`¡Bienvenido, ${data.user.nombre}!`);
      
    } catch (error: any) {
      console.error('❌ Error de login:', error);
      setAuthError(error.message);
      throw error; // Re-lanzar para que el formulario lo maneje
    }
  };

  const handleRegister = async (formData: any) => {
    try {
      setAuthError('');
      
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Manejar errores específicos
        if (response.status === 409) {
          throw new Error('El email ya está registrado');
        }
        if (response.status === 429) {
          throw new Error('Demasiados intentos. Intenta más tarde');
        }
        throw new Error(data.error || data.details?.join(', ') || 'Error en el registro');
      }

      console.log('✅ Registro exitoso:', data);
      
      // Mostrar mensaje de éxito y cambiar a login
      showSuccessMessage('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión');
      setIsLogin(true);
      setAuthError('');
      
    } catch (error: any) {
      console.error('❌ Error de registro:', error);
      setAuthError(error.message);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      setUser(null);
      setShowMenu(false);
      
      showSuccessMessage('Sesión cerrada exitosamente');
      
      // Redirigir al home
      router.push('/');
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const showSuccessMessage = (message: string) => {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 z-[100] bg-success text-white px-6 py-3 rounded-xl shadow-lg animate-fadeInUp';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('animate-fadeOut');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  };

  return (
    <>
      {/* Botón de Perfil */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl"
      >
        {user ? (
          <div className="w-6 h-6 rounded-full gradient-purple-blue flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        <span className="text-xs mt-1 font-medium">Perfil</span>
      </button>

      {/* Menú desplegable */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          <div className="fixed bottom-20 left-4 right-4 bg-card border border-border 
                         rounded-2xl shadow-xl backdrop-blur-xl z-50 animate-fadeInUp max-w-sm mx-auto">
            {user ? (
              <div className="p-4 space-y-3">
                <div className="text-center pb-3 border-b border-border">
                  <div className="w-12 h-12 rounded-full gradient-purple-blue flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg font-bold">
                      {user.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-foreground font-semibold text-sm">{user.nombre}</h3>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                  <div className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full mt-1">
                    {user.cargo}
                  </div>
                </div>

                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 text-foreground hover:bg-accent 
                                   rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </button>

                  <button className="w-full text-left px-3 py-2 text-foreground hover:bg-accent 
                                   rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Mis Eventos</span>
                  </button>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 bg-destructive/20 text-destructive hover:bg-destructive/30 
                           rounded-xl transition-all duration-200 flex items-center justify-center 
                           space-x-2 font-medium mt-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                <div className="text-center pb-3 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-foreground font-semibold text-sm">Invitado</h3>
                  <p className="text-muted-foreground text-xs">Inicia sesión para más funciones</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsLogin(true);
                      setShowMenu(false);
                      setAuthError('');
                    }}
                    className="w-full gradient-purple-blue text-white font-semibold py-2 
                             rounded-xl transition-all duration-300 hover:scale-105 text-sm"
                  >
                    Iniciar Sesión
                  </button>

                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsLogin(false);
                      setShowMenu(false);
                      setAuthError('');
                    }}
                    className="w-full bg-secondary text-secondary-foreground font-semibold py-2 
                            border border-border rounded-xl transition-all duration-300 
                            hover:scale-105 hover:bg-accent text-sm"
                  >
                    Crear Cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Autenticación */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 animate-fadeIn">
          <div className="bg-card shadow-xl border border-border
                          w-full max-w-lg max-h-[90vh]
                          rounded-t-3xl rounded-b-none overflow-hidden">

            {/* Header */}
            <div className="p-6 sticky top-0 bg-card border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl gradient-purple-blue flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {isLogin ? 'Accede a tu cuenta' : 'Únete a TurtleTrack'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setAuthError('');
                  }}
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-accent flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
              {/* Error global */}
              {authError && (
                <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-destructive text-sm">{authError}</p>
                  </div>
                </div>
              )}

              {isLogin ? (
                <SecureLoginForm onLogin={handleLogin} />
              ) : (
                <SecureRegisterForm onRegister={handleRegister} />
              )}

              <div className="text-center mt-6 pt-6 border-t border-border">
                <p className="text-muted-foreground text-sm">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setAuthError('');
                    }}
                    className="text-primary hover:underline font-medium"
                  >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                  </button>
                </p>
              </div>

              {/* Información de seguridad */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-foreground mb-1">Conexión Segura</p>
                    <p className="text-xs text-muted-foreground">
                      Tus datos están protegidos con encriptación de nivel bancario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}