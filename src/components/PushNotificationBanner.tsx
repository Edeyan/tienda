import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Bell, Truck, CheckCircle2, Clock, XCircle, X, ExternalLink, Tag } from 'lucide-react';

export const PushNotificationBanner: React.FC = () => {
  const { inAppPushNotification, dismissInAppPushNotification, setTrackingModalOpen, setSelectedOrder, orders } = useApp();

  if (!inAppPushNotification) return null;

  const isPromo = !inAppPushNotification.newStatus;

  const getStatusIcon = () => {
    if (isPromo) {
      if (inAppPushNotification.icon && inAppPushNotification.icon !== '/favicon.ico') {
        return (
          <img 
            src={inAppPushNotification.icon} 
            alt="Promo" 
            className="w-10 h-10 rounded-lg object-cover" 
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80'; }}
          />
        );
      }
      return <Tag className="w-6 h-6 text-fuchsia-400" />;
    }

    switch (inAppPushNotification.newStatus) {
      case 'completada':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'despachada':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'cancelada':
        return <XCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Clock className="w-5 h-5 text-amber-400" />;
    }
  };

  const handleActionClick = () => {
    if (isPromo) {
      dismissInAppPushNotification();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (inAppPushNotification.orderId) {
      const found = orders.find(o => o.id === inAppPushNotification.orderId || o.orderNumber === inAppPushNotification.orderNumber);
      if (found) {
        setSelectedOrder(found);
      } else {
        setTrackingModalOpen(true);
      }
    } else {
      setTrackingModalOpen(true);
    }
    dismissInAppPushNotification();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="fixed top-4 right-4 z-[9999] max-w-md w-[calc(100vw-2rem)] sm:w-96 shadow-2xl rounded-2xl overflow-hidden border border-slate-700 bg-slate-900/95 text-white backdrop-blur-md"
      >
        <div className="p-4 flex items-start gap-3">
          <div className={`rounded-xl shrink-0 flex items-center justify-center overflow-hidden ${isPromo && inAppPushNotification.icon !== '/favicon.ico' ? '' : 'p-2.5 bg-slate-800 border border-slate-700'}`}>
            {getStatusIcon()}
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border ${
                isPromo 
                  ? 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30' 
                  : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
              }`}>
                {isPromo ? 'FCM Promoción' : 'FCM Push Alert'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date(inAppPushNotification.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <h4 className="text-xs font-black text-white leading-snug">
              {inAppPushNotification.title}
            </h4>

            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed line-clamp-3">
              {inAppPushNotification.body}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleActionClick}
                className={`px-3 py-1.5 active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer ${
                  isPromo 
                    ? 'bg-fuchsia-500 hover:bg-fuchsia-600 shadow-fuchsia-500/20' 
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
                }`}
              >
                <span>{isPromo ? 'Ver Catálogo' : 'Rastrear Pedido'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={dismissInAppPushNotification}
                className="px-2.5 py-1.5 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Descartar
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={dismissInAppPushNotification}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className={`h-1 bg-gradient-to-r ${
          isPromo 
            ? 'from-fuchsia-500 via-purple-500 to-indigo-500' 
            : 'from-orange-500 via-amber-500 to-emerald-500'
        }`} />
      </motion.div>
    </AnimatePresence>
  );
};
