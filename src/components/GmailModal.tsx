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
  X,
  Plus,
  Sparkles,
  LogOut
} from 'lucide-react';
import { gmailService, GmailMessage } from '../services/gmailService';
import { useApp } from '../context/AppContext';

interface GmailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GmailModal: React.FC<GmailModalProps> = ({ isOpen, onClose }) => {
  const { showToast, orders, storeSettings } = useApp();
  const [isConnected, setIsConnected] = useState<boolean>(gmailService.isConnected());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(null);
  const [userProfile, setUserProfile] = useState<{ emailAddress: string; messagesTotal: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Compose Tab
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [sendingEmail, setSendingEmail] = useState<boolean>(false);
  const [composeForm, setComposeForm] = useState<{
    to: string;
    subject: string;
    body: string;
  }>({
    to: '',
    subject: '',
    body: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (gmailService.isConnected()) {
        setIsConnected(true);
        loadGmailData();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      try {
        const prof = await gmailService.getProfile();
        setUserProfile(prof);
      } catch (e) {
        console.warn('Could not fetch Gmail profile:', e);
      }

      const res = await gmailService.listMessages({
        q: query || undefined,
        maxResults: 15
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
      setActiveTab('inbox');
      setComposeForm({ to: '', subject: '', body: '' });
      loadGmailData();
    } catch (err: any) {
      showToast(err.message || 'Error al enviar correo', 'error');
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[90vh] max-h-[700px]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">Gmail Workspace</h3>
              <p className="text-xs text-rose-100">
                {userProfile?.emailAddress || 'Bandeja de correos y facturación'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isConnected && (
              <>
                <div className="flex bg-white/20 p-0.5 rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeTab === 'inbox' ? 'bg-white text-rose-700 font-bold shadow' : 'text-white'
                    }`}
                  >
                    Bandeja
                  </button>
                  <button
                    onClick={() => setActiveTab('compose')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                      activeTab === 'compose' ? 'bg-white text-rose-700 font-bold shadow' : 'text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Redactar
                  </button>
                </div>

                <button
                  onClick={() => loadGmailData(searchQuery)}
                  disabled={isLoading}
                  className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
                  title="Actualizar correos"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isConnected ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-3xl flex items-center justify-center mb-4 border border-rose-100 dark:border-rose-900/40 shadow-inner">
              <Mail className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Conexión Directa con Gmail
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Conecta tu cuenta de Google para leer y enviar mensajes, responder cotizaciones de clientes y remitir facturas al instante.
            </p>
            <button
              onClick={handleConnect}
              disabled={isLoading}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black inline-flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all cursor-pointer"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              Conectar Cuenta de Gmail
            </button>
          </div>
        ) : activeTab === 'compose' ? (
          <div className="flex-1 p-6 overflow-y-auto">
            <form onSubmit={handleSendEmail} className="max-w-2xl mx-auto space-y-4">
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
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Asunto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Detalles sobre tu pedido..."
                  value={composeForm.subject}
                  onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Mensaje *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Escribe tu mensaje..."
                  value={composeForm.body}
                  onChange={(e) => setComposeForm({ ...composeForm, body: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Volver a Bandeja
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md"
                >
                  {sendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Enviar vía Gmail
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
            {/* List */}
            <div className="md:col-span-5 border-r border-slate-100 dark:border-slate-800 flex flex-col h-full overflow-hidden">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Buscar correos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadGmailData(searchQuery)}
                    className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {isLoading && messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto text-rose-500 mb-2" />
                    <span className="text-xs">Cargando...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No hay correos en la bandeja.
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedMessage?.id === msg.id
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-l-4 border-rose-600'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white truncate">
                        <span className="truncate">{msg.from || 'Google User'}</span>
                      </div>
                      <div className="text-xs text-slate-700 dark:text-slate-300 truncate font-medium mt-0.5">
                        {msg.subject || '(Sin Asunto)'}
                      </div>
                      <div className="text-[10.5px] text-slate-400 line-clamp-1 mt-0.5">
                        {msg.bodyText || msg.snippet}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Viewer */}
            <div className="md:col-span-7 flex flex-col h-full overflow-hidden bg-slate-50/30 dark:bg-slate-900/30">
              {selectedMessage ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                      {selectedMessage.subject || '(Sin Asunto)'}
                    </h4>
                    <div className="text-xs text-slate-500 flex flex-col gap-0.5">
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">De:</span> {selectedMessage.from}</div>
                      <div><span className="font-semibold text-slate-700 dark:text-slate-300">Fecha:</span> {selectedMessage.date}</div>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.bodyText || selectedMessage.snippet}
                  </div>

                  <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end">
                    <button
                      onClick={() => {
                        setComposeForm({
                          to: selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || '',
                          subject: `Re: ${selectedMessage.subject || ''}`,
                          body: `\n\n--- Mensaje anterior ---\n${selectedMessage.bodyText?.slice(0, 200)}...`
                        });
                        setActiveTab('compose');
                      }}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Responder
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                  Selecciona un correo para leerlo
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
