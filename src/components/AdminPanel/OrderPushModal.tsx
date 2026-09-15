import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Smartphone, 
  Send, 
  X, 
  CheckCircle2, 
  Truck, 
  Clock, 
  AlertCircle, 
  Loader2, 
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Order, FCMTokenRecord } from '../../types';
import { fcmService } from '../../services/fcmService';
import { useApp } from '../../context/AppContext';

interface OrderPushModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
}

export const OrderPushModal: React.FC<OrderPushModalProps> = ({ isOpen, order, onClose }) => {
  const { showToast, setInAppPushNotification, updateOrderStatus } = useApp();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [registeredDevices, setRegisteredDevices] = useState<FCMTokenRecord[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);
  const [updateStatusAlso, setUpdateStatusAlso] = useState<Order['status'] | ''>('');

  // Load registered devices for context
  useEffect(() => {
    if (isOpen && order) {
      setIsLoadingDevices(true);
      fcmService.getRegisteredDevices().then((devices) => {
        setRegisteredDevices(devices);
        setIsLoadingDevices(false);
      });

      // Default quick message based on current order status
      applyTemplate(order.status);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  // Filter devices matching user email or anonymous
  const userDevices = registeredDevices.filter(d => 
    (d.userEmail && d.userEmail.toLowerCase() === order.customerEmail.toLowerCase()) ||
    (d.userId && d.userId === order.userId)
  );

  const applyTemplate = (type: string) => {
    switch (type) {
      case 'preparacion':
        setTitle(`📦 Pedido #${order.orderNumber} en preparación`);
        setMessage(`Hola ${order.customerName}, tu orden de ${order.items.length} producto(s) está siendo embalada cuidadosamente.`);
        setUpdateStatusAlso('pendiente');
        break;
      case 'despachada':
        setTitle(`🚚 ¡Tu pedido #${order.orderNumber} va en camino!`);
        setMessage(`¡Buenas noticias! Tu pedido ha salido a despacho. El mensajero llegará a tu dirección en breve.`);
        setUpdateStatusAlso('despachada');
        break;
      case 'completada':
        setTitle(`✅ Pedido #${order.orderNumber} entregado con éxito`);
        setMessage(`Tu compra en BUSINESS por un total de $${order.total.toFixed(2)} se completó. ¡Esperamos que lo disfrutes!`);
        setUpdateStatusAlso('completada');
        break;
      case 'pago_recibido':
        setTitle(`💳 Pago verificado - Pedido #${order.orderNumber}`);
        setMessage(`Hemos confirmado tu pago por ${order.paymentMethod.toUpperCase()}. Tu pedido pasa a embalaje.`);
        setUpdateStatusAlso('');
        break;
      default:
        setTitle(`🔔 Actualización de tu pedido #${order.orderNumber}`);
        setMessage(`Hola ${order.customerName}, hay una novedad sobre tu compra en BUSINESS.`);
        setUpdateStatusAlso('');
    }
  };

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Por favor completa el título y el mensaje', 'warning');
      return;
    }

    try {
      setIsSending(true);

      // If status change was selected, update order status first
      if (updateStatusAlso && updateStatusAlso !== order.status) {
        updateOrderStatus(order.id, updateStatusAlso);
      }

      // Send the FCM alert
      await fcmService.sendCustomOrderAlert(order, title, message, {
        onInAppAlert: (payload) => setInAppPushNotification(payload)
      });

      showToast(`¡Alerta Push enviada al cliente para el pedido #${order.orderNumber}!`, 'success');
      onClose();
    } catch (err) {
      console.error('Error sending order alert:', err);
      showToast('No se pudo enviar la alerta push', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002147] via-slate-900 to-orange-950 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/20 text-orange-400 rounded-2xl border border-orange-500/30">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                  Firebase Cloud Messaging (FCM)
                </span>
                <h3 className="text-xl font-black font-['Outfit']">
                  Enviar Alerta al Móvil
                </h3>
              </div>
            </div>

            {/* Target Order Summary Bar */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Orden:</span>{' '}
                <span className="font-mono font-bold text-orange-300">#{order.orderNumber}</span>
              </div>
              <div>
                <span className="text-slate-400">Cliente:</span>{' '}
                <span className="font-bold text-white">{order.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400">Total:</span>{' '}
                <span className="font-bold text-emerald-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSendAlert} className="p-6 space-y-5">
            {/* Device detection status banner */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${registeredDevices.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <div>
                  <div className="font-bold text-slate-800">
                    {isLoadingDevices ? (
                      <span className="text-slate-500">Consultando dispositivos FCM...</span>
                    ) : userDevices.length > 0 ? (
                      <span className="text-emerald-700 font-bold">
                        📱 {userDevices.length} dispositivo(s) móvil(es) vinculado(s) al cliente
                      </span>
                    ) : (
                      <span className="text-slate-700">
                        📱 {registeredDevices.length} dispositivo(s) activo(s) en la red comercial
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    FCM entregará la alerta push directamente a la pantalla de bloqueo o barra de notificaciones.
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                Plantillas Instantáneas de Estado
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('preparacion')}
                  className="p-2 text-left bg-slate-100 hover:bg-orange-50 hover:border-orange-300 border border-slate-200 rounded-xl transition-all text-[11px] font-semibold text-slate-700 flex flex-col gap-1"
                >
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>En Preparación</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('despachada')}
                  className="p-2 text-left bg-slate-100 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl transition-all text-[11px] font-semibold text-slate-700 flex flex-col gap-1"
                >
                  <Truck className="w-4 h-4 text-blue-500" />
                  <span>Despachado</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('completada')}
                  className="p-2 text-left bg-slate-100 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl transition-all text-[11px] font-semibold text-slate-700 flex flex-col gap-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Entregado</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('pago_recibido')}
                  className="p-2 text-left bg-slate-100 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 rounded-xl transition-all text-[11px] font-semibold text-slate-700 flex flex-col gap-1"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-500" />
                  <span>Pago Aprobado</span>
                </button>
              </div>
            </div>

            {/* Notification Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Título de la Alerta en el Teléfono *
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ej: 🚚 Tu pedido #MSK-1002 ya está despachado"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-orange-500/40 outline-none"
                required
              />
            </div>

            {/* Notification Message */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Mensaje de la Notificación Push *
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Escribe el mensaje que el usuario leerá en su celular..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:ring-2 focus:ring-orange-500/40 outline-none resize-none"
                required
              />
            </div>

            {/* Optional Status Sync */}
            <div className="flex items-center justify-between p-3 bg-orange-50/60 rounded-xl border border-orange-100 text-xs">
              <span className="text-slate-700 font-medium">
                Actualizar estado del pedido también a:
              </span>
              <select
                value={updateStatusAlso}
                onChange={e => setUpdateStatusAlso(e.target.value as Order['status'])}
                className="bg-white border border-orange-200 text-xs font-bold text-orange-950 rounded-lg px-2.5 py-1 outline-none"
              >
                <option value="">(No cambiar estado)</option>
                <option value="pendiente">Pendiente</option>
                <option value="despachada">Despachada</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSending || !title.trim() || !message.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{isSending ? 'Enviando Alerta FCM...' : 'Enviar Alerta Push al Móvil'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
