// src/components/SecureAuthForm.tsx
'use client';
import { useState, useEffect } from 'react';

interface FormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
  cargo: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export function SecureLoginForm({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Validar email en tiempo real
  useEffect(() => {
    if (email && !validateEmail(email)) {
      setEmailError('Email inválido');
    } else {
      setEmailError('');
    }
  }, [email]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email inválido');
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none
                     ${emailError ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
            placeholder="tu@email.com"
            required
          />
          {emailError && (
            <p className="text-destructive text-xs mt-1">{emailError}</p>
          )}
        </div>
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-muted/30 border-2 border-transparent focus:border-primary 
                     rounded-xl text-foreground placeholder-muted-foreground 
                     transition-all duration-200 outline-none pr-12"
            placeholder="••••••••"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={loading || !!emailError}
        className="w-full gradient-purple-blue text-white font-semibold py-3 px-4 rounded-xl 
                 transition-all duration-300 hover:scale-105 hover:shadow-lg 
                 hover:shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100
                 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Iniciando sesión...
          </span>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
}

export function SecureRegisterForm({ onRegister }: { onRegister: (formData: FormData) => Promise<void> }) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
    cargo: 'voluntario'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    label: 'Muy débil',
    color: 'bg-destructive'
  });
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  // Validar fortaleza de contraseña
  useEffect(() => {
    if (formData.password) {
      const strength = calculatePasswordStrength(formData.password);
      setPasswordStrength(strength);
    }
  }, [formData.password]);

  // Verificar disponibilidad de email
  useEffect(() => {
    const checkEmail = async () => {
      if (formData.email && validateEmail(formData.email)) {
        setCheckingEmail(true);
        try {
          const response = await fetch(`/api/auth/registro?email=${formData.email}`);
          const data = await response.json();
          setEmailAvailable(data.available);
        } catch (error) {
          console.error('Error verificando email:', error);
        } finally {
          setCheckingEmail(false);
        }
      }
    };

    const debounce = setTimeout(checkEmail, 500);
    return () => clearTimeout(debounce);
  }, [formData.email]);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    let label = 'Muy débil';
    let color = 'bg-destructive';

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

    if (score <= 2) {
      label = 'Muy débil';
      color = 'bg-destructive';
    } else if (score <= 4) {
      label = 'Débil';
      color = 'bg-orange-500';
    } else if (score <= 5) {
      label = 'Media';
      color = 'bg-yellow-500';
    } else {
      label = 'Fuerte';
      color = 'bg-success';
    }

    return { score, label, color };
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.nombre || formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido || formData.apellido.length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else {
      if (formData.password.length < 8) {
        newErrors.password = 'Mínimo 8 caracteres';
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = 'Debe contener una mayúscula';
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password = 'Debe contener una minúscula';
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password = 'Debe contener un número';
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
        newErrors.password = 'Debe contener un símbolo especial';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (emailAvailable === false) {
      setErrors({ email: 'El email ya está registrado' });
      return;
    }

    setLoading(true);
    try {
      await onRegister(formData);
    } catch (err) {
      console.error('Error en registro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre y Apellido */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Nombre *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none text-sm
                     ${errors.nombre ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
            placeholder="Juan"
            required
          />
          {errors.nombre && (
            <p className="text-destructive text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Apellido *
          </label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none text-sm
                     ${errors.apellido ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
            placeholder="Pérez"
            required
          />
          {errors.apellido && (
            <p className="text-destructive text-xs mt-1">{errors.apellido}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Email *
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none text-sm pr-10
                     ${errors.email ? 'border-destructive' : 'border-transparent focus:border-primary'}
                     ${emailAvailable === false ? 'border-destructive' : ''}`}
            placeholder="tu@email.com"
            required
          />
          {checkingEmail && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 animate-spin text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          )}
          {!checkingEmail && emailAvailable === true && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {!checkingEmail && emailAvailable === false && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-4 h-4 text-destructive" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-destructive text-xs mt-1">{errors.email}</p>
        )}
        {emailAvailable === false && (
          <p className="text-destructive text-xs mt-1">Este email ya está registrado</p>
        )}
      </div>

      {/* Cargo */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cargo *
        </label>
        <select
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-muted/30 border-2 border-transparent focus:border-primary 
                   rounded-xl text-foreground transition-all duration-200 outline-none text-sm"
        >
          <option value="voluntario">Voluntario</option>
          <option value="biologo">Biólogo</option>
          <option value="coordinador">Coordinador</option>
          <option value="investigador">Investigador</option>
          <option value="guardabosques">Guardabosques</option>
        </select>
      </div>

      {/* Contraseña */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Contraseña *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none text-sm pr-10
                     ${errors.password ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
            placeholder="••••••••"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>

        {/* Indicador de fortaleza */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Fortaleza:</span>
              <span className={`text-xs font-medium ${
                passwordStrength.score <= 2 ? 'text-destructive' :
                passwordStrength.score <= 4 ? 'text-orange-500' :
                passwordStrength.score <= 5 ? 'text-yellow-500' :
                'text-success'
              }`}>
                {passwordStrength.label}
              </span>
            </div>
            <div className="h-1.5 bg-muted/30 rounded-full overflow-hidden">
              <div 
                className={`h-full ${passwordStrength.color} transition-all duration-300`}
                style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {errors.password && (
          <p className="text-destructive text-xs mt-1">{errors.password}</p>
        )}

        {/* Requisitos */}
        {formData.password && (
          <div className="mt-2 space-y-1">
            <RequirementCheck met={formData.password.length >= 8} text="Mínimo 8 caracteres" />
            <RequirementCheck met={/[A-Z]/.test(formData.password)} text="Una mayúscula" />
            <RequirementCheck met={/[a-z]/.test(formData.password)} text="Una minúscula" />
            <RequirementCheck met={/\d/.test(formData.password)} text="Un número" />
            <RequirementCheck met={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)} text="Un símbolo especial" />
          </div>
        )}
      </div>

      {/* Confirmar Contraseña */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Confirmar Contraseña *
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-muted/30 border-2 rounded-xl text-foreground 
                     placeholder-muted-foreground transition-all duration-200 outline-none text-sm pr-10
                     ${errors.confirmPassword ? 'border-destructive' : 'border-transparent focus:border-primary'}`}
            placeholder="••••••••"
            required
            minLength={8}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showConfirmPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading || emailAvailable === false || checkingEmail}
        className="w-full gradient-purple-blue text-white font-semibold py-3 px-4 rounded-xl 
                 transition-all duration-300 hover:scale-105 hover:shadow-lg 
                 hover:shadow-primary/25 disabled:opacity-50 disabled:hover:scale-100
                 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Creando cuenta...
          </span>
        ) : (
          'Crear Cuenta'
        )}
      </button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        * Campos requeridos
      </p>
    </form>
  );
}

// Componente auxiliar para requisitos
function RequirementCheck({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <svg className="w-3 h-3 text-success flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3 h-3 text-muted-foreground flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span className={`text-xs ${met ? 'text-success' : 'text-muted-foreground'}`}>
        {text}
      </span>
    </div>
  );
}