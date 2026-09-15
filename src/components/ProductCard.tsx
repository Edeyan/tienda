import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Star, Plus, Check, Zap, ShieldCheck, CheckCircle2, Tag } from 'lucide-react';
import { getHighQualityImageUrl } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
  index: number;
  layoutMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  index,
  layoutMode = 'grid'
}) => {
  const { toggleFavorite, addToCart, setSelectedProduct, formatCurrency } = useApp();
  const [justAdded, setJustAdded] = useState(false);

  const isOutOfStock = product.stock === 0;

  // Extract all useful technical and commercial specifications
  const specsEntries = product.specs
    ? Object.entries(product.specs).filter(([k]) => {
        const lowerKey = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return !lowerKey.includes('catalogo');
      })
    : [];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product.id, 1);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 800);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  if (layoutMode === 'list') {
    return (
      <article
        id={`product-row-${product.id}`}
        onClick={() => setSelectedProduct(product)}
        className="group relative bg-white rounded-md sm:rounded-lg p-2 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 min-w-0"
      >
        {/* Left Section: Thumbnail Image with Index Badge */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-md overflow-hidden bg-white flex-shrink-0 border border-slate-200/80 flex items-center justify-center relative shadow-2xs">
            {/* Item count number */}
            <span className="absolute top-0.5 left-0.5 z-10 text-[7px] font-mono font-black bg-white/95 text-slate-700 px-0.5 py-0.1 rounded shadow-2xs border border-slate-200/90 leading-none">
              {index + 1}
            </span>
            <img
              src={getHighQualityImageUrl(product.image)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== product.image) {
                  target.src = product.image;
                } else {
                  target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=90';
                }
              }}
            />
            {isOutOfStock && (
              <span className="absolute inset-0 bg-slate-900/70 backdrop-blur-2xs flex items-center justify-center text-[6px] font-black text-white uppercase tracking-wider text-center p-0.5">
                Agotado
              </span>
            )}
          </div>

          {/* Center Info: Product Name, Brand, Specifications and Availability */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="product-card-title text-[11.5px] sm:text-[13px] font-extrabold text-[#002147] tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
                {product.name}
              </h3>
              {product.brand && (
                <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200/80 px-1 py-0.2 rounded leading-none">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Comprehensive Specifications & Characteristics Row */}
            <div className="flex items-center gap-1 flex-wrap">
              {/* Product SKU */}
              {product.sku && (
                <span className="text-[7.5px] sm:text-[8px] bg-slate-100/90 border border-slate-200 text-slate-600 px-1 py-0.2 rounded font-mono leading-none">
                  SKU: {product.sku}
                </span>
              )}

              {/* Technical specs (Capacidad, Batería, etc.) */}
              {specsEntries.map(([k, v]) => (
                <span key={k} className="text-[7.5px] sm:text-[8px] bg-orange-50/80 border border-orange-200/80 text-orange-900 px-1.5 py-0.2 rounded font-medium leading-none flex items-center gap-0.5">
                  <span className="font-bold text-orange-800 uppercase text-[7px]">{k}:</span> {v}
                </span>
              ))}

              {/* Stock / Availability Badge */}
              <span className={`text-[7.5px] sm:text-[8px] px-1.5 py-0.2 rounded font-semibold leading-none flex items-center gap-0.5 ${
                isOutOfStock
                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                <CheckCircle2 className="w-2 h-2 text-emerald-600 inline" />
                {product.specs?.['DISPONIBILIDAD'] || (product.stock ? `${product.stock} un. disponibles` : 'Disponible')}
              </span>

              {/* Warranty badge if present in description */}
              <span className="text-[7.5px] sm:text-[8px] bg-slate-50 border border-slate-200 text-slate-600 px-1 py-0.2 rounded leading-none hidden md:inline-flex items-center gap-0.5">
                <ShieldCheck className="w-2 h-2 text-blue-600" />
                Garantía oficial
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Organized VERTICALLY with PRICE ON TOP */}
        <div className="flex flex-col items-end justify-center gap-1 flex-shrink-0 pl-2 border-l border-slate-100">
          {/* 1. Precio Tachado y Precio con Descuento del 10% */}
          <div className="flex flex-col items-end leading-tight">
            <div className="flex items-center gap-1">
              <span className="text-[8px] sm:text-[8.5px] text-slate-400 line-through font-mono">
                {formatCurrency(product.price / 0.9)}
              </span>
              <span className="text-[6.5px] sm:text-[7px] font-black bg-rose-500 text-white px-0.5 py-0.1 rounded-xs uppercase leading-none">
                -10%
              </span>
            </div>
            <div className="text-[11.5px] sm:text-[13px] font-black text-emerald-600 font-mono leading-none tracking-tight mt-0.5">
              {formatCurrency(product.price)}
            </div>
          </div>

          {/* 2. Botones de Acción (Favorito + Agregar) */}
          <div className="flex items-center gap-1">
            {/* Star Button */}
            <button
              type="button"
              onClick={handleFavoriteClick}
              aria-label={product.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              className={`w-5 h-5 rounded flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${
                product.favorite
                  ? 'text-amber-500 bg-amber-50 border-amber-200'
                  : 'text-slate-300 hover:text-amber-400 hover:bg-slate-50 border-slate-200/80'
              }`}
            >
              <Star className={`w-2.5 h-2.5 ${product.favorite ? 'fill-amber-400' : ''}`} />
            </button>

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              aria-label="Agregar a la compra"
              className={`h-5.5 px-2 rounded flex items-center justify-center font-bold text-white text-[9px] shadow-2xs transition-all cursor-pointer active:scale-95 ${
                justAdded
                  ? 'bg-emerald-500'
                  : isOutOfStock
                  ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                  : 'bg-[#002147] hover:bg-orange-500'
              }`}
            >
              {justAdded ? (
                <Check className="w-2.5 h-2.5 animate-in zoom-in" />
              ) : (
                <Plus className="w-2.5 h-2.5" />
              )}
            </button>
          </div>
        </div>
      </article>
    );
  }

  // Grid Mode Layout
  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => setSelectedProduct(product)}
      className="group relative bg-white rounded-md sm:rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-orange-300 transition-all duration-150 cursor-pointer flex flex-col overflow-hidden"
    >
      {/* Top badges bar: Number on top-left, Favorite Star on top-right */}
      <div className="absolute top-0.5 left-0.5 right-0.5 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[7px] font-mono font-bold bg-white/95 backdrop-blur-xs text-slate-700 px-0.5 py-0.1 rounded shadow-2xs border border-slate-200/80">
          {index + 1}
        </span>
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`pointer-events-auto p-0.5 rounded transition-all shadow-2xs backdrop-blur-xs ${
            product.favorite
              ? 'bg-white text-amber-500 fill-amber-400'
              : 'bg-white/90 text-slate-400 hover:text-amber-500 hover:bg-white'
          }`}
        >
          <Star className={`w-2.5 h-2.5 ${product.favorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* Product Image Stage */}
      <div className="w-full aspect-[4/3] bg-white relative overflow-hidden flex items-center justify-center">
        <img
          src={getHighQualityImageUrl(product.image)}
          alt={product.name}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== product.image) {
              target.src = product.image;
            } else {
              target.src = 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=90';
            }
          }}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center">
            <span className="bg-rose-600 text-white text-[7.5px] font-black uppercase px-1 py-0.5 rounded tracking-wider shadow-xs">
              Agotado
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="p-1 sm:p-1.5 flex-1 flex flex-col justify-between space-y-1">
        <div>
          <h3 className="product-card-title text-[10.5px] sm:text-[11.5px] font-extrabold text-[#002147] tracking-tight group-hover:text-orange-600 transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Multiple Key Characteristics Badges in Grid */}
          <div className="mt-1 flex flex-wrap gap-0.5">
            {product.brand && (
              <span className="text-[6.5px] font-bold bg-blue-50 border border-blue-200/80 px-1 py-0.2 rounded text-blue-800 leading-none">
                {product.brand}
              </span>
            )}

            {specsEntries.slice(0, 2).map(([k, v]) => (
              <span key={k} className="text-[6.5px] bg-orange-50 border border-orange-200/80 px-1 py-0.2 rounded text-orange-950 font-medium truncate max-w-[95px] leading-none">
                <strong className="font-bold text-orange-800">{k}:</strong> {v}
              </span>
            ))}

            {product.sku && (
              <span className="text-[6.5px] bg-slate-50 border border-slate-200 px-1 py-0.2 rounded text-slate-500 font-mono leading-none">
                {product.sku}
              </span>
            )}
          </div>
        </div>

        {/* Footer: Price on the Left, Add Button in Bottom-Right */}
        <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-0.5">
          {/* Price on the Left with crossed-out original price */}
          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-0.5">
              <span className="text-[7.5px] sm:text-[8px] text-slate-400 line-through font-mono">
                {formatCurrency(product.price / 0.9)}
              </span>
              <span className="text-[6px] sm:text-[6.5px] font-black bg-rose-500 text-white px-0.5 py-0.1 rounded-xs uppercase leading-none">
                -10%
              </span>
            </div>
            <div className="text-[10.5px] sm:text-[11.5px] font-black text-emerald-600 font-mono leading-none mt-0.5">
              {formatCurrency(product.price)}
            </div>
          </div>

          {/* Add Button at Bottom-Right */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-1.5 py-0.5 rounded font-bold text-[8.5px] sm:text-[9px] flex items-center gap-0.5 transition-all cursor-pointer text-white active:scale-95 ${
              justAdded
                ? 'bg-emerald-500 shadow-2xs'
                : isOutOfStock
                ? 'bg-slate-200 cursor-not-allowed text-slate-400'
                : 'bg-[#002147] hover:bg-orange-500'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-2.5 h-2.5" />
                <span>Listo</span>
              </>
            ) : (
              <>
                <Plus className="w-2.5 h-2.5" />
                <span>Comprar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
