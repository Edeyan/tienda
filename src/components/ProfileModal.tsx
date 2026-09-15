import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Camera, 
  Save, 
  Check, 
  Sliders,
  Receipt,
  Radio,
  Sparkles,
  QrCode,
  ChevronDown,
  UserCheck,
  BellRing,
  Bell,
  Shield,
  CreditCard
} from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    profileModalOpen,
    setProfileModalOpen,
    setQrScannerOpen,
    currentUser,
    updateCurrentUser,
    orders,
    setSelectedOrder,
    pushPermissionStatus,
    requestPushPermission,
    sendTestPushNotification,
    showToast
  } = useApp();

  if (!profileModalOpen || !currentUser) return null;

  const [firstName, setFirstName] = useState(currentUser.firstName || currentUser.name.split(' ')[0] || '');
  const [lastName, setLastName] = useState(currentUser.lastName || currentUser.name.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '');
  const [country, setCountry] = useState(currentUser.country || 'España');
  const [cedula, setCedula] = useState(currentUser.cedula || '');
  const [pasaporte, setPasaporte] = useState(currentUser.pasaporte || '');
  const [gender, setGender] = useState(
    currentUser.gender && ['masculino', 'femenino', 'otro'].includes(currentUser.gender)
      ? currentUser.gender
      : 'masculino'
  );
  const [userNumber, setUserNumber] = useState(currentUser.userNumber || `USR-${currentUser.id.replace(/\D/g, '').slice(-5) || '10001'}`);
  const [travelerChips, setTravelerChips] = useState<string[]>(currentUser.travelerProfile || ['profesional']);
  const [notificacionesPush, setNotificacionesPush] = useState(currentUser.preferences?.notificacionesPush ?? true);
  const [alertasClima, setAlertasClima] = useState(currentUser.preferences?.alertasClima ?? true);
  const [sincronizacionTriplet, setSincronizacionTriplet] = useState(currentUser.preferences?.sincronizacionTriplet ?? true);
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile');
  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatar || '');
  const [testingPush, setTestingPush] = useState(false);
  const [isSavedRecently, setIsSavedRecently] = useState(false);

  const userOrders = orders.filter(o => o.userId === currentUser.id || o.customerEmail === currentUser.email);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: `${firstName} ${lastName}`.trim(),
      firstName,
      lastName,
      email,
      phone,
      whatsapp,
      country,
      cedula,
      pasaporte,
      gender,
      userNumber,
      avatar: avatarUrl,
      travelerProfile: travelerChips,
      preferences: {
        ...currentUser.preferences,
        notificacionesPush,
        alertasClima,
        sincronizacionTriplet
      }
    });
    setIsSavedRecently(true);
    showToast('Perfil actualizado correctamente', 'success');
    setTimeout(() => {
      setProfileModalOpen(false);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setProfileModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header - Clean Studio with subtle glow */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white overflow-hidden">
          {/* Subtle perimeter glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Avatar with status indicator ring */}
              <div className="relative group shrink-0">
                <img
                  src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={currentUser.name}
                  className="w-13 h-13 rounded-2xl object-cover ring-2 ring-white/20 group-hover:ring-orange-400 transition-all shadow-lg"
                />
                <label className="absolute inset-0 bg-slate-950/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity backdrop-blur-xs">
                  <Camera className="w-5 h-5 text-white" />
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                {/* Active indicator dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-xs" title="Cuenta activa" />
              </div>

              {/* User Identity Info */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white truncate">
                    {currentUser.name}
                  </h2>
                  <span className="text-[10px] bg-orange-500/25 border border-orange-400/40 text-orange-300 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                    {currentUser.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-mono truncate mt-0.5">{currentUser.email}</p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                id="qrScannerButton"
                type="button"
                onClick={() => {
                  setProfileModalOpen(false);
                  setQrScannerOpen(true);
                }}
                title="Abrir Escáner QR"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-xs cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-orange-400" />
                <span className="hidden sm:inline">Escanear QR</span>
              </button>

              <button
                id="closeProfileModalBtn"
                onClick={() => setProfileModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Selection - Segmented Control */}
        <div className="px-5 sm:px-6 pt-4 pb-1 bg-white">
          <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-orange-500" />
              <span>Datos & Preferencias</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/50'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mis Facturas ({userOrders.length})</span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'profile' ? (
            <form id="profileForm" onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Bento Card: Personal Information */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                  <User className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Información Personal
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Nombre</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Apellido</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Teléfono Móvil</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+34 600 000 000"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">País / Región</label>
                    <input
                      type="text"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Cédula / Documento</label>
                    <input
                      type="text"
                      value={cedula}
                      onChange={e => setCedula(e.target.value)}
                      placeholder="Ej. 12345678-A"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Bento Card: Documents & Account Security */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-200/40">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    Documentación & Cuenta
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Número de Pasaporte</label>
                    <input
                      type="text"
                      value={pasaporte}
                      onChange={e => setPasaporte(e.target.value)}
                      placeholder="Ej. PA-87654321"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all font-mono text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Número de Usuario</label>
                    <input
                      type="text"
                      value={userNumber}
                      onChange={e => setUserNumber(e.target.value)}
                      placeholder="Ej. USR-00101"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none transition-all font-mono text-[11px] font-bold text-slate-800"
                    />
                  </div>
                </div>

                {/* Gender Dropdown */}
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-orange-500" />
                      Género
                    </span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {gender === 'masculino' ? '👨 Masculino' : gender === 'femenino' ? '👩 Femenino' : '✨ Inclusivo'}
                    </span>
                  </label>
                  <div className="relative group">
                    <select
                      id="profileGenderSelect"
                      value={gender}
                      onChange={e => setGender(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-xs transition-all duration-200 hover:border-slate-300 focus:border-orange-500 focus:ring-3 focus:ring-orange-500/10 focus:outline-none cursor-pointer pr-10"
                    >
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="otro">Otro / No especificado</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 group-hover:text-slate-600 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Card: Push Notifications & Alerts */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/40">
                  <div className="flex items-center gap-2">
                    <BellRing className="w-3.5 h-3.5 text-fuchsia-500" />
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Notificaciones & Alertas Móviles
                    </span>
                  </div>
                  {pushPermissionStatus === 'granted' && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold uppercase border border-emerald-200">
                      Activo
                    </span>
                  )}
                </div>

                <label className="flex items-start gap-3 cursor-pointer group pt-1">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={notificacionesPush}
                      onChange={(e) => {
                        setNotificacionesPush(e.target.checked);
                        if (e.target.checked && pushPermissionStatus !== 'granted') {
                          requestPushPermission();
                        }
                      }}
                      className="peer sr-only"
                    />
                    <div className="w-5 h-5 bg-white border-2 border-slate-300 rounded-md peer-checked:bg-fuchsia-600 peer-checked:border-fuchsia-600 transition-all flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 scale-50 peer-checked:scale-100 transition-all duration-200" strokeWidth={3} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-fuchsia-600 transition-colors">
                      Alertas de pedidos y promociones directas
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                      Recibe actualizaciones al instante en tu celular o navegador cuando tu pedido cambie de estado.
                    </p>
                  </div>
                </label>

                {pushPermissionStatus !== 'granted' && pushPermissionStatus !== 'unsupported' && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => requestPushPermission()}
                      className="w-full px-3 py-2 bg-fuchsia-50 hover:bg-fuchsia-100 border border-fuchsia-200 text-fuchsia-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      Activar Permisos de Notificaciones
                    </button>
                  </div>
                )}

                {pushPermissionStatus === 'granted' && (
                  <div className="pt-2 border-t border-slate-200/50">
                    <button
                      type="button"
                      onClick={async () => {
                        setTestingPush(true);
                        await sendTestPushNotification();
                        setTimeout(() => setTestingPush(false), 2000);
                      }}
                      disabled={testingPush}
                      className="text-[11px] font-bold text-slate-600 hover:text-fuchsia-600 transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5 text-fuchsia-500" />
                      {testingPush ? 'Enviando prueba...' : 'Enviar alerta push de prueba a este equipo'}
                    </button>
                  </div>
                )}
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-medium">Aún no tienes facturas o pedidos registrados.</p>
                </div>
              ) : (
                userOrders.map(order => (
                  <div
                    key={order.id}
                    onClick={() => {
                      setSelectedOrder(order);
                      setProfileModalOpen(false);
                    }}
                    className="p-4 bg-slate-50/80 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="font-mono font-bold text-xs text-slate-900 flex items-center gap-2">
                        {order.orderNumber}
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                          order.status === 'completada' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          order.status === 'despachada' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          order.status === 'cancelada' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()} • {order.items.length} ítems • Pago: {order.paymentMethod}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black font-mono text-emerald-600 block">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-orange-600 font-bold group-hover:underline">
                        Ver factura →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'profile' && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              id="saveProfileButton"
              onClick={handleSave}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-black shadow-md shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSavedRecently ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Guardado</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
