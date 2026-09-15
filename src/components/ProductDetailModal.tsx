import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getHighQualityImageUrl } from '../utils/imageUtils';
import { generateSingleProductWhatsAppUrl } from '../utils/whatsappHelper';
import { 
  X, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Star, 
  CheckCircle, 
  Tag, 
  Box, 
  AlertTriangle,
  MessageSquare,
  MessageCircle,
  Send,
  Sparkles,
  Bot,
  Loader2,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    toggleFavorite, 
    formatCurrency, 
    getProductReviews,
    addProductReview,
    currentUser,
    storeSettings,
    activeCurrency,
    openAiAssistantWithQuery
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // New review form state
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // AI Advisor State
  const [advisorData, setAdvisorData] = useState<{
    highlights?: string[];
    idealFor?: string;
    accessoriesAdvice?: string;
  } | null>(null);
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  useEffect(() => {
    if (selectedProduct) {
      setAdvisorData(null);
      // Auto fetch advisor insight
      fetchAdvisor(selectedProduct);
    }
  }, [selectedProduct?.id]);

  const fetchAdvisor = async (prod = selectedProduct) => {
    if (!prod) return;
    setLoadingAdvisor(true);
    try {
      const res = await fetch('/api/product-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: prod })
      });
      if (res.ok) {
        const data = await res.json();
        setAdvisorData(data);
      }
    } catch (e) {
      console.warn('Error fetching AI advisor:', e);
    } finally {
      setLoadingAdvisor(false);
    }
  };

  const handleAskAIAboutProduct = () => {
    if (!selectedProduct) return;
    openAiAssistantWithQuery(`Hola, tengo dudas sobre el producto "${selectedProduct.name}" (Precio: $${selectedProduct.price}). ¿Me puedes dar más detalles sobre su rendimiento, compatibilidad y garantía?`);
  };

  if (!selectedProduct) return null;

  const reviews = getProductReviews(selectedProduct.id);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  const handleAdd = () => {
    addToCart(selectedProduct.id, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setSelectedProduct(null);
      setQuantity(1);
    }, 900);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addProductReview({
      productId: selectedProduct.id,
      userName: reviewerName.trim() || 'Cliente Verificado',
      rating,
      comment: comment.trim()
    });

    setComment('');
    setShowReviewForm(false);
  };

  const isLowStock = selectedProduct.stock !== undefined && selectedProduct.stock <= (selectedProduct.minStock || 5);
  const isOutOfStock = selectedProduct.stock !== undefined && selectedProduct.stock <= 0;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-3.5 py-2.5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-100 text-orange-600">
              <Box className="w-3.5 h-3.5" />
            </span>
            <div>
              <h2 className="text-xs sm:text-sm font-black text-[#002147] leading-tight">
                Detalles Técnicos y Ficha Oficial
              </h2>
              <p className="text-[10px] text-slate-500 font-medium">Especificaciones, disponibilidad y opiniones</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedProduct(null)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start">
            {/* Left Column: Image (Clean & Compact) */}
            <div className="sm:col-span-5 flex flex-col items-center">
              <div 
                className="w-full aspect-square max-h-[190px] sm:max-h-[210px] rounded-lg overflow-hidden bg-white border border-slate-200/90 flex items-center justify-center relative shadow-2xs group cursor-pointer"
                onClick={() => setIsImageZoomed(true)}
              >
                <img
                  src={getHighQualityImageUrl(selectedProduct.image)}
                  alt={selectedProduct.name}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Try uncompressed or original image fallback if modified URL failed
                    if (target.src !== selectedProduct.image) {
                      target.src = selectedProduct.image;
                    } else {
                      target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=90';
                    }
                  }}
                  className="w-full h-full object-contain p-1.5 hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Column: Information & Specs */}
            <div className="sm:col-span-7 flex flex-col space-y-2">
              {/* Product Category, Stock & Rating Bar */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9.5px] text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded-md">
                    {selectedProduct.category}
                  </span>
                  {selectedProduct.stock !== undefined && (
                    <span className="text-[9.5px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md font-mono">
                      Stock: {selectedProduct.stock} unids
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-200/60 shadow-2xs">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>{avgRating} ({reviews.length})</span>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <h3 className="text-sm sm:text-base font-black text-[#002147] leading-tight">
                  {selectedProduct.name}
                </h3>
              </div>

              {/* Description */}
              <div className="text-[10px] sm:text-[10.5px] text-slate-600 leading-relaxed bg-slate-50/70 p-2 rounded-lg border border-slate-100">
                <p>{selectedProduct.description || 'Producto original garantizado para repuesto, ensamble y ferretería de alta exigencia.'}</p>
              </div>

              {/* 4. Ficha Técnica y Especificaciones (Structured Table Layout) */}
              {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10.5px] font-black text-[#002147] flex items-center gap-1.5 uppercase tracking-wide">
                      <Tag className="w-3 h-3 text-orange-500" />
                      Ficha de Características
                    </label>
                    <span className="text-[8.5px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                      {Object.keys(selectedProduct.specs).length} atributos
                    </span>
                  </div>

                  <div className="rounded-lg border border-slate-200/90 overflow-hidden bg-white shadow-2xs">
                    <div className="max-h-[160px] overflow-y-auto divide-y divide-slate-100">
                      {Object.entries(selectedProduct.specs).map(([key, val], idx) => (
                        <div
                          key={key}
                          className={`flex items-center justify-between px-2.5 py-1.5 gap-2 transition-colors hover:bg-orange-50/40 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider truncate">
                              {key}
                            </span>
                          </div>
                          <span className="font-black text-[#002147] text-[10.5px] text-right font-mono flex-shrink-0 max-w-[60%] truncate">
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Purchase Advisor Section */}
          <div className="p-3 bg-gradient-to-r from-orange-50/80 via-amber-50/60 to-orange-50/40 border border-orange-200/90 rounded-xl space-y-2 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#002147] flex items-center gap-1.5">
                    Asesor de Compra IA
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-200/80 text-orange-900 font-bold uppercase">
                      Gemini
                    </span>
                  </h4>
                </div>
              </div>

              <button
                onClick={handleAskAIAboutProduct}
                className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-orange-500 hover:text-white border border-orange-200 text-orange-800 text-[10.5px] font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Chatear con la IA</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {loadingAdvisor && (
              <div className="flex items-center gap-2 py-2 text-xs text-orange-800 font-semibold animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-500" />
                <span>Generando asesoría técnica personalizada...</span>
              </div>
            )}

            {!loadingAdvisor && advisorData && (
              <div className="space-y-1.5 text-xs text-slate-700">
                {advisorData.highlights && advisorData.highlights.length > 0 && (
                  <div className="space-y-1">
                    {advisorData.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] leading-tight">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-slate-800">{h}</span>
                      </div>
                    ))}
                  </div>
                )}

                {advisorData.idealFor && (
                  <p className="text-[10.5px] text-slate-600 bg-white/70 p-1.5 rounded-lg border border-orange-100">
                    🎯 <strong className="text-[#002147]">Recomendado para:</strong> {advisorData.idealFor}
                  </p>
                )}

                {advisorData.accessoriesAdvice && (
                  <p className="text-[10.5px] text-slate-600 bg-white/70 p-1.5 rounded-lg border border-orange-100">
                    💡 <strong className="text-[#002147]">Tip de accesorios:</strong> {advisorData.accessoriesAdvice}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-2.5 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                <h4 className="text-xs sm:text-sm font-black text-[#002147]">
                  Opiniones de Clientes ({reviews.length})
                </h4>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-[11px] font-bold text-orange-600 hover:text-orange-700 underline cursor-pointer"
              >
                {showReviewForm ? 'Cancelar' : '+ Dejar una reseña'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-3 bg-orange-50/60 border border-orange-200 rounded-xl space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Tu Nombre *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={e => setReviewerName(e.target.value)}
                      placeholder="Ej. Roberto Díaz"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Calificación</label>
                    <div className="flex items-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-0.5">Comentario sobre el producto *</label>
                  <textarea
                    required
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe tu experiencia..."
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Publicar Reseña</span>
                  </button>
                </div>
              </form>
            )}

            {/* Review Cards list */}
            <div className="space-y-1.5">
              {reviews.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-1">
                  Aún no hay reseñas para este artículo. ¡Sé el primero en calificarlo!
                </p>
              ) : (
                reviews.map(rev => (
                  <div key={rev.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-0.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-800 text-[11px]">{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1 py-0.2 rounded">
                            Compra Verificada
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-2.5 h-2.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-[10.5px] leading-relaxed">{rev.comment}</p>
                    <span className="text-[8px] text-slate-400 block pt-0.2">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer with Quantity and Add Button (Compact) */}
        <div className="p-2.5 sm:p-3 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-2.5">
            {/* Quantity Selector */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-[11px] font-bold text-slate-600">Cantidad:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Disminuir"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-bold font-mono text-xs text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Aumentar"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={generateSingleProductWhatsAppUrl(
                storeSettings.whatsapp,
                selectedProduct,
                quantity,
                formatCurrency(selectedProduct.price * quantity),
                activeCurrency
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs transition-all cursor-pointer"
              title="Consultar o comprar por WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handleAdd}
              disabled={addedSuccess || isOutOfStock}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-[11px] font-extrabold text-white flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer ${
                addedSuccess
                  ? 'bg-emerald-600 shadow-emerald-500/30'
                  : isOutOfStock
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
              }`}
            >
              {addedSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>¡Agregado!</span>
                </>
              ) : isOutOfStock ? (
                <span>Agotado</span>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Agregar al Carrito</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Image Zoom Overlay */}
      {isImageZoomed && (
        <div 
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            onClick={() => setIsImageZoomed(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer z-[70]"
          >
            <X className="w-6 h-6" />
          </button>
          
          <img
            src={getHighQualityImageUrl(selectedProduct.image)}
            alt={selectedProduct.name}
            decoding="async"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-full object-contain rounded-xl shadow-2xl animate-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (target.src !== selectedProduct.image) {
                target.src = selectedProduct.image;
              } else {
                target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=90';
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
