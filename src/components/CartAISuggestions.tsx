import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Plus, Check, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getHighQualityImageUrl } from '../utils/imageUtils';
import { Product } from '../types';

interface SuggestionItem {
  productId: string;
  reason: string;
  product?: Product;
}

export const CartAISuggestions: React.FC = () => {
  const { cartItemsList, products, addToCart, formatCurrency, showToast } = useApp();
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Keep track of the last serialized cart IDs to avoid duplicate API calls if cart didn't change
  const lastCartKeyRef = useRef<string>('');

  useEffect(() => {
    if (cartItemsList.length === 0) {
      setSuggestions([]);
      lastCartKeyRef.current = '';
      return;
    }

    const currentCartKey = cartItemsList
      .map(item => item.product.id)
      .sort()
      .join(',');

    // If items haven't changed, don't refetch
    if (currentCartKey === lastCartKeyRef.current) {
      return;
    }

    lastCartKeyRef.current = currentCartKey;
    fetchSuggestions();
  }, [cartItemsList]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      // Send cart items and a clean slice of catalog
      const cartSummary = cartItemsList.map(item => ({
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
      }));

      // Send catalog excluding what is already in cart
      const cartIdSet = new Set(cartItemsList.map(item => item.product.id));
      const availableCatalog = products
        .filter(p => !cartIdSet.has(p.id))
        .slice(0, 40)
        .map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          price: p.price,
        }));

      if (availableCatalog.length === 0) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/cart-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: cartSummary,
          catalog: availableCatalog,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al consultar la IA');
      }

      const data = await response.json();
      const rawList: { productId: string; reason: string }[] = data.suggestions || [];

      // Match suggested IDs with full product info
      const mapped: SuggestionItem[] = [];
      for (const item of rawList) {
        const prod = products.find(p => p.id === item.productId);
        if (prod && !cartIdSet.has(prod.id)) {
          mapped.push({
            productId: item.productId,
            reason: item.reason,
            product: prod,
          });
        }
      }

      // If AI didn't return matches, fallback to 2 popular products of same category
      if (mapped.length === 0 && availableCatalog.length > 0) {
        const firstCategory = cartItemsList[0]?.product.category;
        const fallbackProds = products
          .filter(p => !cartIdSet.has(p.id) && (p.category === firstCategory || true))
          .slice(0, 2);

        fallbackProds.forEach(p => {
          mapped.push({
            productId: p.id,
            reason: 'Complemento recomendado para tu pedido',
            product: p,
          });
        });
      }

      setSuggestions(mapped.slice(0, 3));
    } catch (err) {
      console.warn('AI suggestions error:', err);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = (product: Product) => {
    addToCart(product.id, 1);
    setAddedIds(prev => new Set(prev).add(product.id));
    showToast(`¡${product.name} agregado al carrito!`, 'success');
  };

  if (cartItemsList.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/50 border border-orange-200/90 rounded-2xl shadow-xs">
      {/* Title */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
          <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          <span>Recomendados con IA para tu compra</span>
        </div>
        {isLoading && (
          <div className="flex items-center gap-1 text-[10px] font-semibold text-orange-600 animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Consultando IA...</span>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading && suggestions.length === 0 && (
        <div className="space-y-2 py-1">
          <div className="h-12 bg-white/60 rounded-xl animate-pulse border border-orange-100"></div>
          <div className="h-12 bg-white/60 rounded-xl animate-pulse border border-orange-100"></div>
        </div>
      )}

      {/* Suggested Items List */}
      {!isLoading && suggestions.length === 0 && (
        <p className="text-[11px] text-slate-500 italic">No hay más recomendaciones para los productos actuales.</p>
      )}

      <div className="space-y-2">
        {suggestions.map(({ product, reason }) => {
          if (!product) return null;
          const isAdded = addedIds.has(product.id);

          return (
            <div
              key={product.id}
              className="flex items-center justify-between gap-2.5 p-2 bg-white rounded-xl border border-orange-200/70 hover:border-orange-300 transition-all shadow-2xs"
            >
              {/* Product Thumbnail */}
              <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={getHighQualityImageUrl(product.image)}
                  alt={product.name}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info & Reason */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-[#002147] truncate leading-tight">
                    {product.name}
                  </h4>
                  <span className="text-[9.5px] font-bold text-orange-600 font-mono flex-shrink-0">
                    {formatCurrency(product.price)}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                  💡 <span className="text-slate-600 font-medium">{reason}</span>
                </p>
              </div>

              {/* Add Button */}
              <button
                onClick={() => handleAdd(product)}
                disabled={isAdded}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex-shrink-0 ${
                  isAdded
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                    : 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs active:scale-95 cursor-pointer'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Listo</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agregar</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
