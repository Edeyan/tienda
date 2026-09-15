import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Briefcase,
  KeyRound,
  Loader2
} from 'lucide-react';
import { Role } from '../types';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    loginWithGoogle,
    loginWithFirebaseEmail,
    sendPasswordReset,
    registerWithFirebaseEmail,
  } = useApp();

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCedula, setRegCedula] = useState('');
  const [regRole, setRegRole] = useState<Role>('customer');
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        setErrorMessage(res.message || 'Error al conectar con Google.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error durante la autenticación con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const res = await loginWithFirebaseEmail(loginEmail, loginPassword);
      if (res.success) {
        setAuthModalOpen(false);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        setErrorMessage(res.message || 'Error al iniciar sesión.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage('');
    if (!loginEmail.trim()) {
      setErrorMessage('Escribe tu correo electrónico para recuperar la contraseña.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await sendPasswordReset(loginEmail);
      setErrorMessage(result.message || 'No se pudo recuperar la contraseña.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!regFirstName || !regLastName) {
      setErrorMessage('Por favor ingresa nombre y apellido.');
      return;
    }
    if (!regEmail || !regEmail.includes('@')) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }
    if (regPassword.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptTerms) {
      setErrorMessage('Debes aceptar los términos y condiciones.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerWithFirebaseEmail({
        name: `${regFirstName} ${regLastName}`.trim(),
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        phone: regPhone,
        whatsapp: regPhone,
        cedula: regCedula
      });

      if (res.success) {
        setAuthModalOpen(false);
        // Reset form
        setRegFirstName('');
        setRegLastName('');
        setRegEmail('');
        setRegPassword('');
        setRegConfirmPassword('');
        setRegPhone('');
        setRegCedula('');
      } else {
        setErrorMessage(res.message || 'Error al registrar usuario en la base de datos');
      }
    } catch (err: any) {
      setErrorMessage(
        err?.code === 'auth/operation-not-allowed'
          ? 'El registro por correo está desactivado en Firebase. El administrador debe activar Email/Password en Firebase Console.'
          : 'No se pudo completar el registro. Revisa tu conexión e inténtalo de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setAuthModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500 text-white shadow-xs">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide">
                {authModalMode === 'login' ? 'Acceso al Sistema' : 'Registro de Nueva Cuenta'}
              </h2>
              <p className="text-xs text-blue-200">MISHOZUKI MOTORS — Sincronización en la Nube</p>
            </div>
          </div>

          <button
            onClick={() => setAuthModalOpen(false)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authModalMode === 'login'
                ? 'bg-white text-[#002147] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
              authModalMode === 'register'
                ? 'bg-white text-[#002147] shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Crear Cuenta
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[75vh] space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Social Sign-In (Google) */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 active:scale-98 text-slate-700 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>{authModalMode === 'login' ? 'Continuar con Google' : 'Registrarse con Google'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider absolute">
              o con correo electrónico
            </span>
          </div>

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="tu correo electrónico"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordReset}
                    disabled={isLoading}
                    className="mt-2 text-[11px] font-bold text-orange-600 hover:text-orange-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contraseña</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Ingresar a la Plataforma</span>
              </button>

            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-3 text-xs">
                {/* Names */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={regFirstName}
                      onChange={e => setRegFirstName(e.target.value)}
                      placeholder="Carlos"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Apellido *</label>
                    <input
                      type="text"
                      required
                      value={regLastName}
                      onChange={e => setRegLastName(e.target.value)}
                      placeholder="Mendoza"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    placeholder="nuevo.usuario@empresa.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                {/* Phone & ID */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Teléfono / Móvil</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="+53 50000000"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cédula / DNI / NIF</label>
                    <input
                      type="text"
                      value={regCedula}
                      onChange={e => setRegCedula(e.target.value)}
                      placeholder="00000000-X"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Role selection */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Cuenta (Rol)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'customer', label: 'Cliente', desc: 'Compras y pedidos' },
                      { role: 'seller', label: 'Vendedor', desc: 'Ventas y catálogo' },
                      { role: 'admin', label: 'Admin', desc: 'Control total' }
                    ].map(r => (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setRegRole(r.role as Role)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                          regRole === r.role
                            ? 'bg-[#002147] text-white border-[#002147] shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="font-bold text-xs">{r.label}</div>
                        <div className="text-[9px] opacity-80">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Contraseña *</label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={e => setRegPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Confirmar *</label>
                    <input
                      type="password"
                      required
                      value={regConfirmPassword}
                      onChange={e => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={e => setAcceptTerms(e.target.checked)}
                    className="rounded text-orange-500 focus:ring-orange-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-600">
                    Acepto las políticas de privacidad y condiciones de servicio.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white rounded-xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Completar Registro con Firebase</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
