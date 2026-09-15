import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ShoppingBag, 
  Check, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHighQualityImageUrl } from '../utils/imageUtils';
import { Product } from '../types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedProductIds?: string[];
  quickReplies?: string[];
}

const DEFAULT_PROMPTS = [
  { label: '🛵 Motos y Triciclos', query: '¿Qué modelos de motos y triciclos eléctricos tienen disponibles y cuáles son sus precios?' },
  { label: '🔋 Baterías de Litio', query: '¿Qué opciones de baterías de Litio y LiFePO4 tienen para 72V y 60V?' },
  { label: '⚡ Ofertas y Descuentos', query: '¿Cuáles son las mejores ofertas y productos destacados hoy?' },
  { label: '📦 Rastrear mi pedido', query: '¿Cómo puedo rastrear el estado y envío de mi pedido?' },
  { label: '🛠️ Repuestos y Garantía', query: '¿Tienen repuestos originales y qué garantía ofrecen en sus vehículos?' }
];

export const AIAssistant: React.FC = () => {
  const { 
    products, 
    addToCart, 
    setSelectedProduct, 
    formatCurrency, 
    showToast, 
    cartItemsList, 
    currentSection,
    aiAssistantOpen,
    setAiAssistantOpen,
    aiInitialQuery,
    setAiInitialQuery
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu **Asistente Experto de BUSINESS** impulsado por IA.\n\n¿En qué te puedo asesorar hoy? Puedo buscarte productos, verificar compatibilidad de baterías, recomendarte repuestos o resolver dudas de envíos.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['🛵 Ver Motos', '🔋 Baterías 72V', '⚡ Ofertas', '📦 Envíos']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (aiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, aiAssistantOpen, isLoading]);

  // Handle incoming initial query triggered from outside (e.g. product card or modal)
  useEffect(() => {
    if (aiInitialQuery && aiAssistantOpen) {
      handleSend(aiInitialQuery);
      setAiInitialQuery('');
    }
  }, [aiInitialQuery, aiAssistantOpen]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-ES';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      showToast('Reconocimiento de voz no soportado en este navegador', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        showToast('Escuchando... habla ahora', 'info');
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Síntesis de voz no disponible', 'info');
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*_#`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customQuery?: string) => {
    const textToSend = (customQuery || inputValue).trim();
    if (!textToSend || isLoading) return;

    if (!customQuery) {
      setInputValue('');
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build lightweight context of relevant products
      const contextSlice = products.slice(0, 60).map(p => 
        `ID: "${p.id}", Nombre: "${p.name}", Categoría: "${p.category}", Sección: "${p.section}", Precio: $${p.price}, Stock: ${p.stock ?? 10}`
      ).join('\n');

      const cartSlice = cartItemsList.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        category: item.product.category
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: contextSlice,
          cartItems: cartSlice,
          activeSection: currentSection,
          productsList: products.slice(0, 80)
        })
      });

      const data = await response.json();

      if (response.ok && data) {
        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.response || 'Aquí tienes la información solicitada.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          recommendedProductIds: Array.isArray(data.recommendedProductIds) ? data.recommendedProductIds : [],
          quickReplies: Array.isArray(data.quickReplies) ? data.quickReplies : []
        };
        setMessages(prev => [...prev, assistantMsg]);
      } else {
        setMessages(prev => [...prev, {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          content: 'No pude conectar con el servidor en este momento. Por favor revisa tu conexión o intenta nuevamente.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        content: 'Ocurrió un problema de comunicación. Por favor intenta otra vez.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product.id, 1);
    setAddedIds(prev => new Set(prev).add(product.id));
    showToast(`¡${product.name} agregado al carrito!`, 'success');
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const clearChatHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: 'Historial reiniciado. ✨ ¿En qué puedo ayudarte ahora con nuestro catálogo?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['🛵 Ver Motos', '🔋 Baterías 72V', '⚡ Ofertas', '📦 Envíos']
      }
    ]);
    if (speakingId) {
      window.speechSynthesis?.cancel();
      setSpeakingId(null);
    }
    showToast('Conversación reiniciada', 'info');
  };

  // Simple Markdown renderer for bold, lists, and line breaks
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) return <div key={idx} className="h-1" />;

          // Bullet points
          const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ') || line.trim().startsWith('* ');
          const lineContent = isBullet ? line.trim().substring(2) : line;

          // Parse **bold** parts
          const parts = lineContent.split(/(\*\*.*?\*\*)/g);
          const renderedLine = parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={pIdx} className="font-extrabold text-[#002147]">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          if (isBullet) {
            return (
              <div key={idx} className="flex items-start gap-1.5 pl-1">
                <span className="text-orange-500 font-bold">•</span>
                <span>{renderedLine}</span>
              </div>
            );
          }

          return <p key={idx}>{renderedLine}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!aiAssistantOpen && (
        <button
          onClick={() => setAiAssistantOpen(true)}
          className="fixed bottom-5 right-5 z-50 p-3.5 sm:p-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center group cursor-pointer border-2 border-white/80 ring-4 ring-orange-500/20"
          aria-label="Abrir Asistente Virtual Gemini"
        >
          <div className="relative">
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 group-hover:rotate-12 transition-transform drop-shadow-xs" />
            <Sparkles className="w-3.5 h-3.5 text-amber-200 absolute -top-1.5 -right-1.5 animate-spin" style={{ animationDuration: '4s' }} />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
          {/* Tooltip badge on hover */}
          <span className="absolute right-full mr-3 px-2.5 py-1 bg-[#002147] text-white text-xs font-bold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            ✨ Asistente IA Gemini
          </span>
        </button>
      )}

      {/* Main Chat Window */}
      {aiAssistantOpen && (
        <div 
          className={`fixed z-50 transition-all duration-300 bg-white shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 animate-in slide-in-from-bottom-6 ${
            isExpanded 
              ? 'inset-3 sm:inset-6 md:inset-10 rounded-2xl sm:rounded-3xl max-w-4xl mx-auto' 
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[94vw] sm:w-[410px] h-[580px] max-h-[85vh] rounded-2xl sm:rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002147] via-[#002b5c] to-[#001833] p-3.5 sm:p-4 text-white flex items-center justify-between border-b border-blue-900/40 shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <Sparkles className="w-3 h-3 text-amber-200 absolute -bottom-1 -right-1" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-white">
                    BUSINESS AI Assistant
                  </h3>
                  <span className="px-1.5 py-0.5 text-[9px] font-black uppercase bg-orange-500/90 text-white rounded-md tracking-wider">
                    Gemini 3
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-blue-200 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  Asesor de ventas en tiempo real
                </p>
              </div>
            </div>

            {/* Window action buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-blue-200">
              <button
                onClick={clearChatHistory}
                title="Reiniciar chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Minimizar ventana' : 'Expandir ventana'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer hidden sm:block"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setAiAssistantOpen(false)}
                title="Cerrar chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Carousel Bar */}
          <div className="bg-slate-50/90 px-3 py-2 border-b border-slate-200/80 overflow-x-auto scrollbar-none flex gap-1.5 flex-nowrap">
            {DEFAULT_PROMPTS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.query)}
                disabled={isLoading}
                className="flex-shrink-0 px-2.5 py-1 bg-white hover:bg-orange-50 hover:border-orange-300 border border-slate-200 text-slate-700 hover:text-orange-700 text-[11px] font-semibold rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 bg-slate-100/70 space-y-4 scroll-smooth">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              const recommendedProds = (msg.recommendedProductIds || [])
                .map(id => products.find(p => p.id === id))
                .filter(Boolean) as Product[];

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}>
                  <div className={`flex items-end gap-2 max-w-[92%] sm:max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs ${
                      isUser ? 'bg-orange-500 text-white' : 'bg-[#002147] text-amber-400'
                    }`}>
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    {/* Speech Bubble */}
                    <div className={`relative rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm shadow-xs ${
                      isUser
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-xs'
                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                    }`}>
                      {renderFormattedText(msg.content)}

                      {/* Message Footer: Timestamp & Audio TTS toggle */}
                      <div className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[9.5px] ${
                        isUser ? 'border-orange-400/40 text-orange-100' : 'border-slate-100 text-slate-400'
                      }`}>
                        <span>{msg.timestamp}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleSpeakMessage(msg.id, msg.content)}
                            title={speakingId === msg.id ? 'Detener voz' : 'Escuchar respuesta'}
                            className="p-1 hover:text-orange-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                          >
                            {speakingId === msg.id ? (
                              <VolumeX className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Recommended Product Cards Attached to this message */}
                  {!isUser && recommendedProds.length > 0 && (
                    <div className="pl-9 w-full max-w-[95%] space-y-2 mt-1">
                      <p className="text-[10px] font-black uppercase text-orange-700 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-orange-500" />
                        Productos recomendados para ti:
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {recommendedProds.map(prod => {
                          const isAdded = addedIds.has(prod.id);
                          return (
                            <div
                              key={prod.id}
                              className="p-2.5 bg-white rounded-xl border border-orange-200/80 shadow-xs hover:shadow-md hover:border-orange-400 transition-all flex items-center justify-between gap-2.5"
                            >
                              {/* Product Thumbnail */}
                              <div 
                                onClick={() => handleOpenProduct(prod)}
                                className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 cursor-pointer group"
                              >
                                <img
                                  src={getHighQualityImageUrl(prod.image)}
                                  alt={prod.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              </div>

                              {/* Details */}
                              <div className="flex-1 min-w-0">
                                <h4 
                                  onClick={() => handleOpenProduct(prod)}
                                  className="text-xs font-bold text-[#002147] truncate hover:text-orange-600 cursor-pointer leading-tight"
                                >
                                  {prod.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs font-extrabold text-orange-600 font-mono">
                                    {formatCurrency(prod.price)}
                                  </span>
                                  {prod.brand && (
                                    <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                      {prod.brand}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-col gap-1 flex-shrink-0">
                                <button
                                  onClick={() => handleAddToCart(prod)}
                                  disabled={isAdded}
                                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    isAdded 
                                      ? 'bg-emerald-100 text-emerald-700' 
                                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-xs active:scale-95'
                                  }`}
                                  title={isAdded ? 'Agregado' : 'Agregar al carrito'}
                                >
                                  {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleOpenProduct(prod)}
                                  className="p-1.5 text-slate-400 hover:text-[#002147] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-center"
                                  title="Ver ficha técnica"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Quick Reply Pills */}
                  {!isUser && msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="pl-9 flex flex-wrap gap-1.5 pt-1">
                      {msg.quickReplies.map((qr, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(qr)}
                          disabled={isLoading}
                          className="px-2.5 py-1 bg-white hover:bg-orange-500 hover:text-white border border-slate-200 text-slate-700 text-[10.5px] font-semibold rounded-full shadow-2xs transition-all cursor-pointer"
                        >
                          {qr}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator with Typing Animation */}
            {isLoading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-7 h-7 rounded-xl bg-[#002147] text-amber-400 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3.5 shadow-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 animate-pulse">Consultando a Gemini...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 sm:p-3 bg-white border-t border-slate-200/90 flex flex-col gap-2">
            <div className="flex items-end gap-2">
              
              {/* Voice recognition button */}
              <button
                onClick={toggleSpeechRecognition}
                title={isListening ? 'Detener dictado' : 'Hablar por micrófono'}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300/50' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Textarea */}
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isListening ? 'Escuchando tu voz...' : 'Pregunta sobre productos, precios, compatibilidad...'}
                  className="w-full bg-slate-100 text-slate-900 text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none max-h-24 scrollbar-thin placeholder:text-slate-400"
                  rows={1}
                />
              </div>

              {/* Send Button */}
              <button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isLoading}
                className="p-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
                aria-label="Enviar mensaje"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Presiona <kbd className="px-1 py-0.5 bg-slate-100 border rounded font-mono text-[9px]">Enter ↵</kbd> para enviar</span>
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Zap className="w-3 h-3 text-amber-500" /> Respaldado por Gemini AI
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
