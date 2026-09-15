import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Send, 
  Bell, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Loader2, 
  Smartphone, 
  RefreshCw, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { fcmService } from '../../services/fcmService';
import { Product, FCMTokenRecord } from '../../types';

export const PushMarketingManager: React.FC = () => {
  const { showToast, products, sendTestPushNotification } = useApp();
  
  const [activeTab, setActiveTab] = useState<'compose' | 'devices'>('compose');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [url, setUrl] = useState('/');
  const [isSending, setIsSending] = useState(false);
  
  // Registered FCM Devices
  const [devices, setDevices] = useState<FCMTokenRecord[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = useState(false);

  const fetchDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const list = await fcmService.getRegisteredDevices();
      setDevices(list);
    } catch (e) {
      console.warn('Error fetching FCM devices:', e);
    } finally {
      setIsLoadingDevices(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);
  
  const handleSelectProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (product) {
      setTitle(`¡Oferta en ${product.name}!`);
      setBody(`No te pierdas nuestra nueva promoción en ${product.name}. Precio: $${product.price}`);
      setImageUrl(product.image);
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      showToast('El título y el mensaje son obligatorios', 'error');
      return;
    }

    try {
      setIsSending(true);
      await fcmService.sendPromotionalPushNotification(title, body, imageUrl || undefined, url || undefined);
      showToast('¡Notificación Push enviada a todos los dispositivos suscritos!', 'success');
      setTitle('');
      setBody('');
      setImageUrl('');
      setUrl('/');
    } catch (err) {
      console.error('Error enviando push promocional:', err);
      showToast('Error al enviar la notificación Push.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const mobileCount = devices.filter(d => d.isMobile || d.platform === 'android' || d.platform === 'ios').length;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-fuchsia-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-fuchsia-800/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Megaphone className="w-48 h-48 text-fuchsia-300 transform rotate-[-15deg]" />
        </div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-fuchsia-500/20 rounded-2xl border border-fuchsia-500/30">
              <Megaphone className="w-7 h-7 text-fuchsia-400" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white font-['Outfit'] tracking-tight">
                Firebase Cloud Messaging (FCM)
              </h2>
              <p className="text-sm text-fuchsia-200/80">
                Alertas de pedidos a móviles y difusión push en tiempo real.
              </p>
            </div>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center bg-slate-900/80 p-1.5 rounded-2xl border border-slate-700/60 shrink-0">
            <button
              onClick={() => setActiveTab('compose')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Redactar Push</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('devices');
                fetchDevices();
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'devices'
                  ? 'bg-fuchsia-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Dispositivos Móviles ({devices.length})</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'devices' ? (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Móviles Registrados</div>
                <div className="text-2xl font-black text-slate-800">{mobileCount}</div>
                <div className="text-[10px] text-emerald-600 font-bold">Android & iOS FCM</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Total Dispositivos</div>
                <div className="text-2xl font-black text-slate-800">{devices.length}</div>
                <div className="text-[10px] text-slate-500">Listos para recibir alertas</div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase">Probar Servicio</div>
                <div className="text-xs text-slate-600 mt-0.5">Envía alerta instantánea</div>
              </div>
              <button
                onClick={() => sendTestPushNotification()}
                className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Test Push</span>
              </button>
            </div>
          </div>

          {/* Device Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-orange-500" />
                  Tokens y Dispositivos Móviles Registrados en Firebase
                </h3>
                <p className="text-xs text-slate-500">
                  Tokens almacenados en la colección Firestore <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">fcm_tokens</code>
                </p>
              </div>
              <button
                onClick={fetchDevices}
                disabled={isLoadingDevices}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title="Actualizar lista de dispositivos"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingDevices ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Dispositivo / Modelo</th>
                    <th className="p-3.5">Plataforma</th>
                    <th className="p-3.5">Usuario / Correo</th>
                    <th className="p-3.5">Token FCM</th>
                    <th className="p-3.5 text-right">Última Conexión</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {devices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        {isLoadingDevices ? (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                            <span>Cargando dispositivos FCM...</span>
                          </div>
                        ) : (
                          <span>No hay dispositivos móviles registrados todavía. Abre la app desde un teléfono y acepta las notificaciones para registrarlo.</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    devices.map((device, idx) => (
                      <tr key={device.token || idx} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <span className="truncate max-w-[200px]">{device.model || device.device || 'Dispositivo'}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                            {device.device}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            device.platform === 'android'
                              ? 'bg-emerald-100 text-emerald-800'
                              : device.platform === 'ios'
                              ? 'bg-blue-100 text-blue-800'
                              : device.platform === 'pwa'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {device.platform || (device.isMobile ? 'Móvil' : 'Web')}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-700">{device.userEmail || 'Visitante'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">ID: {device.userId || 'N/A'}</div>
                        </td>
                        <td className="p-3.5">
                          <code className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-mono block truncate max-w-[140px]" title={device.token}>
                            {device.token.substring(0, 18)}...
                          </code>
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-500 text-[11px]">
                          {new Date(device.updatedAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                <Bell className="w-5 h-5 text-indigo-500" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Redactar Promoción</h3>
              </div>
              
              <form onSubmit={handleSendPush} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Autocompletar con Producto</label>
                  <select 
                    onChange={handleSelectProduct}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all"
                  >
                    <option value="">-- Seleccionar un producto del catálogo --</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500 mt-1">Selecciona un producto para cargar automáticamente su imagen y datos.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Título de la Notificación *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Ej: 🔥 20% de Descuento en Neumáticos Mishozuki"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Mensaje o Contenido *</label>
                    <textarea
                      rows={3}
                      value={body}
                      onChange={e => setBody(e.target.value)}
                      placeholder="Aprovecha hoy esta gran oferta por tiempo limitado con envío prioritario."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                      URL de la Imagen (Opcional)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                      URL de Destino
                    </label>
                    <input
                      type="text"
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                      placeholder="/"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-fuchsia-500/50 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending || !title.trim() || !body.trim()}
                    className="px-6 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-fuchsia-500/20 active:scale-95"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>{isSending ? 'Enviando Push...' : 'Enviar Promoción Push'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl sticky top-28">
              <div className="mb-5 pb-4 border-b border-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black text-white uppercase tracking-widest">Vista Previa Dispositivo</h3>
              </div>
              
              <div className="bg-slate-800/80 rounded-2xl border border-slate-700/50 p-4 relative overflow-hidden shadow-inner">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt="Preview" 
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&q=80'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center border border-slate-600">
                        <Bell className="w-6 h-6 text-slate-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                        BUSINESS Notificaciones
                      </span>
                      <span className="text-[9px] text-slate-500">Ahora</span>
                    </div>
                    
                    <h4 className="text-[13px] font-bold text-white leading-tight truncate">
                      {title || 'Título de la promoción'}
                    </h4>
                    
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-snug line-clamp-2">
                      {body || 'El texto descriptivo de la oferta o promoción aparecerá aquí.'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-3 bg-slate-700/50 rounded-lg p-2 text-center text-[10px] font-bold text-slate-300 border border-slate-600/50">
                  Toque para abrir {url === '/' ? 'la app' : url}
                </div>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="bg-amber-900/20 border border-amber-800/30 rounded-xl p-4 text-xs text-amber-200/80">
                  <strong className="text-amber-400 font-bold block mb-1">Aviso Importante:</strong>
                  Los clientes que hayan abierto la app en su teléfono móvil o navegador recibirán esta alerta en segundo plano mediante Firebase Cloud Messaging.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
