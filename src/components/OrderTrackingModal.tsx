import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt, 
  Phone, 
  Calendar,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  FileText,
  Bell,
  BellRing,
  Radio,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';

export const OrderTrackingModal: React.FC = () => {
  const { 
    trackingModalOpen, 
    setTrackingModalOpen, 
    orders, 
    setSelectedOrder,
    storeSettings,
    formatCurrency,
    requestPushPermission,
    pushPermissionStatus,
    notifyOrderPush,
    sendTestPushNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isActivatingPush, setIsActivatingPush] = useState(false);

  if (!trackingModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.trim().toLowerCase();
    const found = orders.find(o => 
      o.orderNumber.toLowerCase().includes(term) ||
      o.customerEmail.toLowerCase() === term ||
      o.id.toLowerCase() === term
    );

    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepProgress = (status: Order['status']) => {
    switch (status) {
      case 'completada':
        return 2; // Pagada / Preparando
      case 'despachada':
        return 3; // En camino
      case 'cancelada':
        return -1; // Cancelada
      default:
        return 1; // Registrada / Pendiente
    }
  };

  const steps = [
    { title: 'Pedido Registrado', desc: 'Recibido en sistema', icon: Clock },
    { title: 'Confirmado & Preparación', desc: 'Embalaje y garantía', icon: Package },
    { title: 'Despachado / En Ruta', desc: 'Asignado a logística', icon: Truck },
    { title: 'Entregado con Éxito', desc: 'Recepción por el cliente', icon: CheckCircle2 }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => {
        setTrackingModalOpen(false);
        setHasSearched(false);
        setSearchedOrder(null);
      }}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-xs">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-black text-[#002147] flex items-center gap-2">
                Rastreo y Estado de Pedidos
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Consulta en tiempo real la preparación, garantía y entrega de tu compra
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setTrackingModalOpen(false);
              setHasSearched(false);
              setSearchedOrder(null);
            }}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Ingresa tu No. de Factura (ej. FAC-2025-001) o correo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs font-medium"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Rastrear</span>
            </button>
          </form>

          {/* Quick test pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-slate-500">
            <span className="font-semibold">Prueba rápida:</span>
            {orders.slice(0, 3).map(o => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSearchQuery(o.orderNumber);
                  setSearchedOrder(o);
                  setHasSearched(true);
                }}
                className="px-2 py-0.5 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg font-mono text-[10px] transition-colors cursor-pointer"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6">
          {hasSearched && !searchedOrder && (
            <div className="text-center py-10 space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-black text-slate-800">Factura no encontrada</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Verifica haber escrito correctamente el número de comprobante o el correo electrónico registrado al realizar la compra.
              </p>
            </div>
          )}

          {searchedOrder && (
            <div className="space-y-6">
              {/* Status Header Banner */}
              <div className="bg-gradient-to-br from-[#002147] to-slate-900 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase bg-orange-500 text-white font-black px-2 py-0.5 rounded-md">
                      {searchedOrder.orderNumber}
                    </span>
                    <span className="text-xs text-blue-200">
                      {new Date(searchedOrder.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-1">
                    Cliente: {searchedOrder.customerName}
                  </h3>
                  <p className="text-xs text-slate-300">
                    Método de Pago: <strong className="uppercase text-orange-400">{searchedOrder.paymentMethod}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[10px] text-blue-200 block uppercase font-bold">Total Factura</span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    ${searchedOrder.total.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">Línea de Progreso del Pedido</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const currentProgress = getStepProgress(searchedOrder.status);
                    const isDone = currentProgress >= stepNum;
                    const isCurrent = currentProgress === stepNum;
                    const Icon = step.icon;

                    return (
                      <div 
                        key={step.title}
                        className={`p-3 rounded-xl border transition-all ${
                          isDone 
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                            : isCurrent
                            ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-400 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono ${
                            isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {idx + 1}
                          </span>
                          <Icon className={`w-4 h-4 ${isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                        </div>
                        <p className="text-xs font-bold leading-tight text-slate-800">{step.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FCM Push Notification Live Alert Card */}
              <div className="p-4 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-blue-500/10 rounded-2xl border border-orange-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/20 shrink-0">
                    <BellRing className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-[#002147]">
                        Alertas Push en Vivo (Firebase Cloud Messaging)
                      </h4>
                      {pushPermissionStatus === 'granted' ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          Activo
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                          Pendiente
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Recibe notificaciones automáticas en tu dispositivo cuando cambie el estado de esta orden ({searchedOrder.orderNumber}).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                  {pushPermissionStatus !== 'granted' ? (
                    <button
                      type="button"
                      disabled={isActivatingPush}
                      onClick={async () => {
                        setIsActivatingPush(true);
                        await requestPushPermission();
                        setIsActivatingPush(false);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>{isActivatingPush ? 'Activando...' : 'Activar Alertas Push'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => notifyOrderPush(searchedOrder, searchedOrder.status)}
                      className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                      title="Probar sonido y notificación de este pedido"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Probar Alerta Push</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Items Summary & Guarantee */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 pb-1 border-b border-slate-100 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-orange-500" />
                    Artículos en el Pedido ({searchedOrder.items.length})
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pt-1">
                    {searchedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <span className="text-[10px] text-slate-400">SKU: {item.sku} • Cant: {item.quantity}</span>
                        </div>
                        <span className="font-mono font-bold text-slate-700">${item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-5 bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black">
                    <ShieldCheck className="w-4 h-4 text-orange-600" />
                    Garantía Oficial
                  </div>
                  <p className="text-amber-800 text-[11px] leading-relaxed">
                    Este pedido cuenta con <strong>1 año de garantía directa</strong> en piezas y servicio técnico con {storeSettings.storeName}.
                  </p>
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${storeSettings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, quisiera soporte o consultar sobre mi pedido #${searchedOrder.orderNumber}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Soporte por WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!hasSearched && (
            <div className="text-center py-8 space-y-2 text-slate-500">
              <Package className="w-12 h-12 mx-auto text-blue-500 opacity-60" />
              <h3 className="text-sm font-bold text-slate-700">Introduce tu número de factura o correo</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Podrás revisar el estado de aprobación del pago, la preparación en bodega y descargar tu factura oficial en cualquier momento.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchedOrder && (
          <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-3">
            <button
              onClick={() => {
                setTrackingModalOpen(false);
                setSelectedOrder(searchedOrder);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4 text-orange-400" />
              <span>Ver Factura Completa</span>
            </button>

            <button
              onClick={() => {
                setTrackingModalOpen(false);
                setHasSearched(false);
                setSearchedOrder(null);
              }}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
