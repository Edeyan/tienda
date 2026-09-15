import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  RefreshCw, 
  Inbox, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  User as UserIcon, 
  Calendar, 
  FileText, 
  LogOut, 
  Sparkles,
  Paperclip,
  ExternalLink,
  Plus
} from 'lucide-react';
import { gmailService, GmailMessage } from '../../services/gmailService';
import { useApp } from '../../context/AppContext';

export const GmailManager: React.FC = () => {
  const { showToast, orders, storeSettings } = useApp();
  const [isConnected, setIsConnected] = useState<boolean>(gmailService.isConnected());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [userProfile, setUserProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Compose modal/tab state
  const [composeOpen, setComposeOpen] = useState<boolean>(false);
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [composeForm, setComposeForm] = useState<{
    to: string;
    subject: string;
    body: string;
    selectedOrderId?: string;
  }>({
    to: '',
    subject: '',
    body: '',
    selectedOrderId: ''
  });

  // Check connection status on mount
  useEffect(() => {
    if (gmailService.isConnected()) {
      setIsConnected(true);
      loadGmailData();
    }
  }, []);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const res = await gmailService.connectGmail();
      if (res.success) {
        setIsConnected(true);
        showToast('Gmail conectado exitosamente', 'success');
        await loadGmailData();
      } else {
        showToast(res.error || 'Error al conectar con Gmail', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error durante la conexión', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await gmailService.disconnectGmail();
    setIsConnected(false);
    setMessages([]);
    setUserProfile(null);
    setSelectedMessage(null);
    showToast('Sesión de Gmail cerrada', 'info');
  };

  const loadGmailData = async (query?: string) => {
    setIsLoading(true);
    try {
      // Profile
      try {
        const prof = await gmailService.getProfile();
        setUserProfile(prof);
      } catch (e) {
        console.warn('Could not fetch Gmail profile:', e);
      }

      // Messages
      const res = await gmailService.listMessages({
        q: query || undefined,
        maxResults: 20
      });
      setMessages(res.messages || []);
      if (res.messages && res.messages.length > 0 && !selectedMessage) {
        setSelectedMessage(res.messages[0]);
      }
    } catch (err: any) {
      console.error('Error loading Gmail data:', err);
      showToast(err.message || 'Error al cargar correos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadGmailData(searchQuery);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeForm.to.trim() || !composeForm.subject.trim()) {
      showToast('Por favor completa el destinatario y el asunto', 'error');
      return;
    }

    setSendingEmail(true);
    try {
      await gmailService.sendEmail({
        to: composeForm.to,
        subject: composeForm.subject,
        bodyText: composeForm.body,
        bodyHtml: `
          <div style="font-family: Arial, sans-serif; font-size: 14px; color: #1e293b; line-height: 1.6; padding: 16px;">
            <p>${composeForm.body.replace(/\n/g, '<br/>')}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 11px; color: #64748b;">
              <strong>${storeSettings.storeName}</strong> • Moto & Bike Store<br/>
              ${storeSettings.address} | Tel: ${storeSettings.phone}
            </p>
          </div>
        `
      });

      showToast('Correo enviado exitosamente vía Gmail', 'success');
      setComposeOpen(false);
      setComposeForm({ to: '', subject: '', body: '', selectedOrderId: '' });
      // Refresh list
      loadGmailData();
    } catch (err: any) {
      showToast(err.message || 'Error al enviar correo', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleFillOrderTemplate = (orderId: string) => {
    const order = orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return;

    setComposeForm({
      to: order.customerEmail || '',
      subject: `Información de tu pedido #${order.orderNumber} - ${storeSettings.storeName}`,
      body: `Estimado/a ${order.customerName},\n\nLe escribimos de ${storeSettings.storeName} en relación con su pedido #${order.orderNumber}.\n\nEstado actual: ${order.status.toUpperCase()}\nMétodo de pago: ${order.paymentMethod}\nTotal: $${order.total} USD\n\nSi tiene alguna consulta adicional o necesita servicio técnico para sus productos, estamos a su total disposición.\n\nSaludos cordiales,\nEquipo de ${storeSettings.storeName}`,
      selectedOrderId: order.id
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase">
              <Mail className="w-3.5 h-3.5" />
              Integración Oficial Google Workspace
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Gmail Cloud Hub
            </h2>
            <p className="text-rose-100 text-sm leading-relaxed">
              Gestiona correos, envía cotizaciones, notificaciones de facturas y confirma pedidos directamente usando tu cuenta de Google.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isConnected ? (
              <>
                <button
                  onClick={() => setComposeOpen(true)}
                  className="px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                  Redactar Correo
                </button>
                <button
                  onClick={() => loadGmailData(searchQuery)}
                  disabled={isLoading}
                  className="p-2.5 bg-white/15 hover:bg-white/25 rounded-2xl text-white transition-all cursor-pointer"
                  title="Actualizar bandeja"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
                <button
                  onClick={handleDisconnect}
                  className="p-2.5 bg-rose-900/40 hover:bg-rose-900/70 border border-rose-400/30 rounded-2xl text-rose-200 transition-all cursor-pointer"
                  title="Cerrar sesión de Gmail"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="px-6 py-3 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl text-sm font-black flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-rose-600" /> : <Mail className="w-4 h-4 text-rose-600" />}
                Conectar con Gmail
              </button>
            )}
          </div>
        </div>

        {/* Decorative Mail shape */}
        <div className="absolute right-[-20px] bottom-[-30px] opacity-10 pointer-events-none">
          <Mail className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* Main Content */}
      {!isConnected ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100 dark:border-rose-900/40 shadow-inner">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Conecta tu cuenta de Gmail
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
            Autoriza el acceso a Gmail para enviar facturas electrónicas a tus clientes, revisar mensajes entrantes y responder directamente desde el panel.
          </p>
          <button
            onClick={handleConnect}
            disabled={isLoading}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-sm font-black inline-flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Autorizar Google Gmail
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Messages list (Col 5) */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-[620px]">
            {/* Search & Profile bar */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
              {userProfile && (
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {userProfile.emailAddress}
                  </span>
                  <span className="text-slate-400">
                    {userProfile.messagesTotal} mensajes
                  </span>
                </div>
              )}

              <form onSubmit={handleSearch} className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar en correos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </form>
            </div>

            {/* Email list */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading && messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin text-rose-500 mb-2" />
                  <span className="text-xs">Cargando correos...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-slate-400 text-center">
                  <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-semibold">No se encontraron correos</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">La bandeja está vacía o el filtro no coincide.</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-l-4 border-rose-600' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {msg.from || 'Desconocido'}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {msg.date ? new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate mb-1">
                        {msg.subject || '(Sin Asunto)'}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1">
                        {msg.bodyText || msg.snippet || ''}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Reader / Detail (Col 7) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden h-[620px]">
            {selectedMessage ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Email Subject Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/20">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {selectedMessage.subject || '(Sin Asunto)'}
                  </h3>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">De:</span> {selectedMessage.from}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Fecha:</span> {selectedMessage.date || 'Desconocida'}
                    </div>
                  </div>
                  {selectedMessage.to && (
                    <div className="text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-slate-500">Para:</span> {selectedMessage.to}
                    </div>
                  )}
                </div>

                {/* Email Body */}
                <div className="flex-1 p-6 overflow-y-auto text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {selectedMessage.bodyText || selectedMessage.snippet || '(Sin contenido legible)'}
                </div>

                {/* Quick Reply Bar */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    ID: {selectedMessage.id}
                  </span>
                  <button
                    onClick={() => {
                      setComposeForm({
                        to: selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || '',
                        subject: `Re: ${selectedMessage.subject || ''}`,
                        body: `\n\n--- En respuesta al correo del ${selectedMessage.date} ---\n${selectedMessage.bodyText?.slice(0, 300)}...`,
                        selectedOrderId: ''
                      });
                      setComposeOpen(true);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Responder
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
                <Mail className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-3" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">Selecciona un correo</p>
                <p className="text-xs text-slate-400 max-w-xs mt-1">
                  Haz clic en cualquier mensaje de la lista izquierda para leer su contenido completo.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Compose Email Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <Mail className="w-5 h-5" />
                <span>Nuevo Mensaje Gmail</span>
              </div>
              <button
                onClick={() => setComposeOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg text-white transition-all cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4 flex-1 overflow-y-auto">
              {/* Quick Template Selector */}
              {orders.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                    Plantilla de Pedido Rápido:
                  </div>
                  <select
                    value={composeForm.selectedOrderId || ''}
                    onChange={(e) => handleFillOrderTemplate(e.target.value)}
                    className="w-full sm:w-auto text-xs bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">Seleccionar orden...</option>
                    {orders.slice(0, 10).map((o) => (
                      <option key={o.id} value={o.id}>
                        #{o.orderNumber} - {o.customerName} (${o.total})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Para (Destinatario) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="cliente@ejemplo.com"
                  value={composeForm.to}
                  onChange={(e) => setComposeForm({ ...composeForm, to: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Asunto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Detalle o consulta sobre producto..."
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Cuerpo del Mensaje *
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Escribe tu mensaje aquí..."
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setComposeOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando vía Gmail...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Enviar Correo
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
