import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Crown,
  Gift,
  Users,
  Copy,
  Check,
  Share2,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  TrendingUp,
  Percent,
  Wrench,
  Truck
} from 'lucide-react';
import { Coupon } from '../types';

export const MembershipModal: React.FC = () => {
  const {
    membershipModalOpen,
    setMembershipModalOpen,
    currentUser,
    setAuthModalOpen,
    redeemRewardPoints,
    showToast,
    storeSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'puntos' | 'referidos'>('puntos');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!membershipModalOpen) return null;

  const points = currentUser?.points ?? 450;
  const level = currentUser?.membershipLevel ?? 'oro';
  const referralCode = currentUser?.referralCode || `VIP-${currentUser?.name?.split(' ')[0]?.toUpperCase() || 'CLIENTE'}-${Math.floor(100 + Math.random() * 900)}`;

  const levelConfigs = {
    bronce: { name: 'Bronce VIP', color: 'from-amber-700 to-amber-900', badge: 'bg-amber-100 text-amber-900 border-amber-300', nextTier: 'Plata (200 pts)', progress: Math.min(100, (points / 200) * 100) },
    plata: { name: 'Plata VIP', color: 'from-slate-400 to-slate-600', badge: 'bg-slate-100 text-slate-800 border-slate-300', nextTier: 'Oro (500 pts)', progress: Math.min(100, (points / 500) * 100) },
    oro: { name: 'Oro VIP', color: 'from-amber-400 to-yellow-600', badge: 'bg-yellow-100 text-yellow-900 border-yellow-400', nextTier: 'Platino (1000 pts)', progress: Math.min(100, (points / 1000) * 100) },
    platino: { name: 'Platino Elite', color: 'from-indigo-600 to-purple-800', badge: 'bg-purple-100 text-purple-900 border-purple-300', nextTier: 'Nivel Máximo Alcanzado', progress: 100 }
  };

  const currentLevelConfig = levelConfigs[level] || levelConfigs.oro;

  const rewardsList = [
    {
      id: 'rew_1',
      title: 'Bono $10 USD de Descuento',
      pointsCost: 150,
      icon: Percent,
      color: 'text-emerald-600 bg-emerald-50',
      description: 'Aplicable en cualquier compra mínima de $50 USD.',
      couponData: {
        code: `PUNTOS10-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fixed' as const,
        discount: 10,
        minOrder: 50,
        description: 'Cupón de $10 USD por canje de Puntos VIP',
        active: true
      }
    },
    {
      id: 'rew_2',
      title: 'Diagnóstico y Balanceo de Batería',
      pointsCost: 200,
      icon: Zap,
      color: 'text-amber-600 bg-amber-50',
      description: 'Chequeo computarizado de celdas y BMS en taller oficial.',
      couponData: {
        code: `SERVICE-BMS-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fixed' as const,
        discount: 15,
        minOrder: 0,
        description: 'Mantenimiento de batería gratis por Puntos VIP',
        active: true
      }
    },
    {
      id: 'rew_3',
      title: 'Envío Gratis a Provincias',
      pointsCost: 250,
      icon: Truck,
      color: 'text-blue-600 bg-blue-50',
      description: 'Flete 100% cubierto para repuestos o accesorios.',
      couponData: {
        code: `FREESHIP-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fixed' as const,
        discount: 20,
        minOrder: 30,
        description: 'Bono de envío gratuito canjeado',
        active: true
      }
    },
    {
      id: 'rew_4',
      title: 'Bono $25 USD de Descuento',
      pointsCost: 350,
      icon: Gift,
      color: 'text-purple-600 bg-purple-50',
      description: 'Válido para baterías de litio y motos eléctricas.',
      couponData: {
        code: `PUNTOS25-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fixed' as const,
        discount: 25,
        minOrder: 150,
        description: 'Descuento de $25 USD por Puntos VIP',
        active: true
      }
    },
    {
      id: 'rew_5',
      title: 'Kit de Seguridad: Candado de Disco + Alarma',
      pointsCost: 450,
      icon: ShieldCheck,
      color: 'text-rose-600 bg-rose-50',
      description: 'Retiro directo en tienda o con tu próximo pedido.',
      couponData: {
        code: `GIFT-SECURITY-${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'fixed' as const,
        discount: 30,
        minOrder: 0,
        description: 'Kit de seguridad canjeado con Puntos VIP',
        active: true
      }
    }
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    showToast('Código de referido copiado al portapapeles', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    const inviteLink = `${window.location.origin}?ref=${referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    showToast('Enlace de invitación copiado', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const phone = storeSettings.supportPhone.replace(/[^0-9]/g, '') || '5350000000';
    const text = `🛵 *¡Únete al Club de Business Asociados!* %0A%0AHe comprado mi moto / batería de litio con ellos y te regalo mi código de referido: *${referralCode}* para que obtengas *$15 USD de descuento* en tu primera compra.%0A%0AConsulta el catálogo y compra aquí: ${window.location.origin}`;
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleRedeem = (reward: typeof rewardsList[0]) => {
    if (!currentUser) {
      setMembershipModalOpen(false);
      setAuthModalOpen(true);
      return;
    }
    redeemRewardPoints(reward.pointsCost, reward.title, reward.couponData);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setMembershipModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden cursor-default"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Header con gradiente VIP */}
        <div className="bg-linear-to-r from-[#002147] via-[#003366] to-[#0f172a] text-white p-5 sm:p-6 relative">
          <button
            onClick={() => setMembershipModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-[#002147]">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight">Membresía & Beneficios</h2>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${currentLevelConfig.badge}`}>
                    {currentLevelConfig.name}
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {currentUser ? `Bienvenido, ${currentUser.name}` : 'Inicia sesión para acumular y canjear tus puntos'}
                </p>
              </div>
            </div>

            {/* Puntos Balance Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 text-right flex sm:flex-col items-center sm:items-end justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider">
                Puntos Acumulados
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black font-mono text-white">{points}</span>
                <span className="text-xs font-bold text-amber-400">PTS</span>
              </div>
            </div>
          </div>

          {/* Barra de progreso de nivel */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <div className="flex justify-between text-[11px] font-medium text-slate-300 mb-1">
              <span>Nivel actual: <strong className="text-white">{currentLevelConfig.name}</strong></span>
              <span>Siguiente meta: <strong className="text-amber-300">{currentLevelConfig.nextTier}</strong></span>
            </div>
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-500"
                style={{ width: `${currentLevelConfig.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-2">
          <button
            onClick={() => setActiveTab('puntos')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'puntos'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Club Asociados VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('referidos')}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'referidos'
                ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Invita a un Amigo</span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-1.5 py-0.2 rounded-full">
              +$20 USD
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: CLUB ASOCIADOS VIP */}
          {activeTab === 'puntos' && (
            <div className="space-y-6">
              
              {/* How it works banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-orange-50/70 border border-orange-100 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-orange-500 text-white rounded-xl">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Gana 1 punto x $1</h4>
                    <p className="text-[11px] text-slate-500">En todas tus compras de motos y repuestos.</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Sube de Nivel</h4>
                    <p className="text-[11px] text-slate-500">Desbloquea multiplicadores de puntos y atención VIP.</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-xl">
                    <Gift className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800">Canje Inmediato</h4>
                    <p className="text-[11px] text-slate-500">Cupones de descuento, mantenimiento y regalos.</p>
                  </div>
                </div>
              </div>

              {/* Rewards Store */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm sm:text-base font-black text-slate-800 flex items-center gap-2">
                    <Gift className="w-4 h-4 text-orange-500" />
                    Catálogo de Recompensas Disponibles
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    Tu saldo: <strong className="text-[#002147]">{points} pts</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {rewardsList.map(reward => {
                    const Icon = reward.icon;
                    const canAfford = points >= reward.pointsCost;

                    return (
                      <div
                        key={reward.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          canAfford
                            ? 'bg-white border-slate-200 hover:border-orange-300 shadow-2xs'
                            : 'bg-slate-50/70 border-slate-200/60 opacity-80'
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2.5 rounded-xl ${reward.color} flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-800 leading-tight">
                              {reward.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                              {reward.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                          <div className="flex items-center gap-1 font-mono font-black text-xs text-amber-600">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{reward.pointsCost} PTS</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRedeem(reward)}
                            disabled={!canAfford}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              canAfford
                                ? 'bg-[#002147] hover:bg-orange-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            <span>{canAfford ? 'Canjear' : `Faltan ${reward.pointsCost - points} pts`}</span>
                            {canAfford && <ArrowRight className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: INVITA A UN AMIGO */}
          {activeTab === 'referidos' && (
            <div className="space-y-6">
              
              {/* Promo Banner */}
              <div className="bg-linear-to-br from-emerald-500 via-teal-600 to-[#002147] text-white p-5 rounded-3xl shadow-md relative overflow-hidden">
                <div className="relative z-10 max-w-md">
                  <span className="text-[10px] font-black uppercase bg-white/20 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    Programa Oficial de Referidos
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black mt-2 leading-tight">
                    Invita a tus amigos y ambos ganan dinero
                  </h3>
                  <p className="text-xs text-emerald-100 mt-1.5">
                    Comparte tu código personal. Cuando tu amigo haga su primera compra, él recibe descuento y tú recibes saldo directo.
                  </p>
                </div>
                <div className="absolute right-3 bottom-3 opacity-15 hidden sm:block">
                  <Users className="w-32 h-32" />
                </div>
              </div>

              {/* Benefits breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-emerald-600 text-white rounded-xl flex-shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-emerald-700 tracking-wider">Tu amigo recibe</span>
                    <h4 className="text-sm font-black text-slate-800 mt-0.5">$15 USD de Descuento</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Cupón de bienvenida automático para su compra de moto o batería.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-orange-50/70 border border-orange-200/80 rounded-2xl flex items-start gap-3">
                  <div className="p-2 bg-orange-500 text-white rounded-xl flex-shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-black text-orange-700 tracking-wider">Tú recibes</span>
                    <h4 className="text-sm font-black text-slate-800 mt-0.5">$20 USD + 100 Puntos VIP</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                      Bono en crédito para repuestos o servicios de taller garantizados.
                    </p>
                  </div>
                </div>
              </div>

              {/* Share Box */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-xs font-bold text-slate-700 block">
                  Tu Código de Referido Personal
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 bg-white border border-slate-300 px-4 py-2.5 rounded-xl flex items-center justify-between font-mono font-black text-base text-slate-800">
                    <span>{referralCode}</span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleShareWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Compartir por WhatsApp</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Enlace directo para compartir:</span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="font-bold text-orange-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Completo'}
                  </button>
                </div>
              </div>

              {/* Simulated Referrals List */}
              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    Historial de Amigos Invitados
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    2 Amigos Referidos Activos
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-bold text-slate-800">Carlos Morales (Habana)</p>
                        <p className="text-[10px] text-slate-400">Compró Moto Raybar 72V</p>
                      </div>
                    </div>
                    <span className="font-black font-mono text-emerald-600">+$20 USD acreditado</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-bold text-slate-800">Yosvani Pérez (Matanzas)</p>
                        <p className="text-[10px] text-slate-400">Compró Batería Litio 72V 45Ah</p>
                      </div>
                    </div>
                    <span className="font-black font-mono text-emerald-600">+$20 USD acreditado</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Beneficios válidos en tienda física y pedidos en línea.</span>
          </div>
          <button
            type="button"
            onClick={() => setMembershipModalOpen(false)}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
