// src/components/ProfileMenu.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

  // Verificar si el usuario está logueado
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/me');
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
      console.log('Intentando login con:', { email, password: '***' });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Respuesta login:', response.status, response.statusText);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Login exitoso:', userData);
        setUser(userData.user);
        setShowAuthModal(false);
        setShowMenu(false);
      } else {
        const errorData = await response.json();
        console.error('Error de login:', errorData);
        alert(`Error: ${errorData.error || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error('Error de red en login:', error);
      alert(`Error de conexión: ${error}`);
    }
  };

  const handleRegister = async (formData: any) => {
    try {
      console.log('Enviando datos de registro:', formData);
      const response = await fetch('/api/auth/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (response.ok) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        setIsLogin(true);
      } else {
        const error = await response.json();
        console.error('Error detallado:', error);
        alert(`Error: ${error.error || 'Error en el registro'}`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert(`Error de conexión: ${error}`);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setShowMenu(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <>
      {/* Botón de Perfil en la barra de navegación móvil */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl"
      >
        {user ? (
          // Usuario logueado - mostrar avatar
          <div className="w-6 h-6 rounded-full gradient-purple-blue flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        ) : (
          // Usuario no logueado - mostrar icono por defecto
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
        <span className="text-xs mt-1 font-medium">Perfil</span>
      </button>

      {/* Menú desplegable móvil */}
      {showMenu && (
        <>
          {/* Overlay para cerrar al hacer click fuera */}
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          {/* Menú desde la parte inferior */}
          <div className="fixed bottom-20 left-4 right-4 bg-[#1a1a2e] border border-[#334155] 
                         rounded-2xl shadow-xl backdrop-blur-xl z-50 animate-fadeInUp max-w-sm mx-auto">
            {user ? (
              // Menú cuando el usuario está logueado
              <div className="p-4 space-y-3">
                {/* Información del usuario */}
                <div className="text-center pb-3 border-b border-[#334155]">
                  <div className="w-12 h-12 rounded-full gradient-purple-blue flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg font-bold">
                      {user.nombre.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-[#f8fafc] font-semibold text-sm">{user.nombre}</h3>
                  <p className="text-[#94a3b8] text-xs">{user.email}</p>
                  <div className="inline-block px-2 py-1 bg-[#8b5cf6]/20 text-[#8b5cf6] text-xs rounded-full mt-1">
                    {user.cargo}
                  </div>
                </div>

                {/* Opciones del menú */}
                <div className="space-y-1">
                  <button className="w-full text-left px-3 py-2 text-[#f8fafc] hover:bg-[#252542] 
                                   rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Mi Perfil</span>
                  </button>

                  <button className="w-full text-left px-3 py-2 text-[#f8fafc] hover:bg-[#252542] 
                                   rounded-xl transition-all duration-200 flex items-center space-x-3 text-sm">
                    <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Mis Eventos</span>
                  </button>
                </div>

                {/* Botón de cerrar sesión */}
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 bg-[#ef4444]/20 text-[#ef4444] hover:bg-[#ef4444]/30 
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
              // Menú cuando el usuario NO está logueado
              <div className="p-4 space-y-3">
                <div className="text-center pb-3 border-b border-[#334155]">
                  <div className="w-12 h-12 rounded-full bg-[#252542] flex items-center justify-center mx-auto mb-2">
                    <svg className="w-6 h-6 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[#f8fafc] font-semibold text-sm">Invitado</h3>
                  <p className="text-[#94a3b8] text-xs">Inicia sesión para más funciones</p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsLogin(true);
                      setShowMenu(false);
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
                    }}
                    className="w-full bg-[#252542] text-[#f8fafc] font-semibold py-2 
                             border border-[#334155] rounded-xl transition-all duration-300 
                             hover:scale-105 hover:bg-[#2d2d5a] text-sm"
                  >
                    Crear Cuenta
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal de Autenticación Móvil */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50 animate-fadeIn">
          <div className="bg-[#1a1a2e] rounded-t-3xl shadow-xl border border-[#334155] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header del Modal */}
            <div className="p-6 border-b border-[#334155] sticky top-0 bg-[#1a1a2e]">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl gradient-purple-blue flex items-center justify-center">
                    <span className="material-icons text-white text-lg">eco</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#f8fafc]">
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </h2>
                    <p className="text-[#94a3b8] text-sm">
                      {isLogin ? 'Accede a tu cuenta' : 'Únete a TurtleTrack'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="w-8 h-8 rounded-lg bg-[#252542] hover:bg-[#2d2d5a] 
                           flex items-center justify-center transition-all duration-200"
                >
                  <svg className="w-4 h-4 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {isLogin ? (
                <MobileLoginForm onLogin={handleLogin} />
              ) : (
                <MobileRegisterForm onRegister={handleRegister} />
              )}

              {/* Cambiar entre Login/Registro */}
              <div className="text-center mt-6 pt-6 border-t border-[#334155]">
                <p className="text-[#94a3b8] text-sm">
                  {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                  <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-[#8b5cf6] hover:underline font-medium"
                  >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión aquí'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Componentes de formulario optimizados para móvil
function MobileLoginForm({ onLogin }: { onLogin: (email: string, password: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(email, password);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                   transition-all duration-300"
          placeholder="tu@email.com"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Contraseña
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                   transition-all duration-300"
          placeholder="••••••••"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-purple-blue text-white font-semibold py-3 px-4 rounded-xl 
                 transition-all duration-300 hover:scale-105 hover:shadow-lg 
                 hover:shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

function MobileRegisterForm({ onRegister }: { onRegister: (formData: any) => void }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: 'voluntario'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    await onRegister(formData);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[#f8fafc] mb-2">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                     focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                     transition-all duration-300 text-sm"
            placeholder="Nombre"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#f8fafc] mb-2">
            Apellido
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                     focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                     transition-all duration-300 text-sm"
            placeholder="Apellido"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                   transition-all duration-300 text-sm"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Cargo
        </label>
        <select
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] transition-all duration-300 text-sm"
        >
          <option value="voluntario">Voluntario</option>
          <option value="biologo">Biólogo</option>
          <option value="coordinador">Coordinador</option>
          <option value="investigador">Investigador</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Contraseña
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                   transition-all duration-300 text-sm"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#f8fafc] mb-2">
          Confirmar
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-[#0f0f23] border-2 border-transparent focus:border-[#8b5cf6] 
                   focus:ring-2 focus:ring-[#8b5cf6] rounded-xl text-[#f8fafc] placeholder-[#64748b] 
                   transition-all duration-300 text-sm"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full gradient-purple-blue text-white font-semibold py-3 px-4 rounded-xl 
                 transition-all duration-300 hover:scale-105 hover:shadow-lg 
                 hover:shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100"
      >
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>
    </form>
  );
}