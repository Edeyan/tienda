import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { sectionSubcategories, sectionLabels, sectionOrder } from '../data/initialData';
import { 
  Search, 
  Car, 
  Wrench, 
  Footprints, 
  BatteryCharging, 
  Shirt, 
  Fan, 
  Bike, 
  Star,
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Cog,
  Sparkles,
  ShoppingBag,
  Droplets,
} from 'lucide-react';

export const categoryIcons: Record<string, React.ReactNode> = {
  favoritos: <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />,
  nuevo: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
  vehiculos: <Car className="w-3.5 h-3.5" />,
  respuestos_motos: <Cog className="w-3.5 h-3.5" />,
  ferreteria: <Wrench className="w-3.5 h-3.5" />,
  calzado: <Footprints className="w-3.5 h-3.5" />,
  baterias: <BatteryCharging className="w-3.5 h-3.5" />,
  ropa: <Shirt className="w-3.5 h-3.5" />,
  bolsos: <ShoppingBag className="w-3.5 h-3.5" />,
  filtros_agua: <Droplets className="w-3.5 h-3.5" />,
  ventiladores: <Fan className="w-3.5 h-3.5" />,
  bicicletas: <Bike className="w-3.5 h-3.5" />
};

export const CatalogView: React.FC = () => {
  const {
    products,
    currentSection,
    setCurrentSection,
    currentFilter,
    setCurrentFilter,
    searchQuery,
    setSearchQuery,
    storeSettings,
  } = useApp();

  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Subcategories for the current active section
  const currentSubcategories = sectionSubcategories[currentSection] || [];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      // Section filter
      if (currentSection === 'favoritos') {
        if (!p.favorite) return false;
      } else {
        if (p.section !== currentSection) return false;
        if (currentFilter !== 'all' && p.category !== currentFilter) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.price.toString().includes(q);
        if (!match) return false;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, currentSection, currentFilter, searchQuery, sortBy]);

  const activeSubcategoryLabel = currentFilter === 'all' 
    ? 'Todas' 
    : currentSubcategories.find(s => s.value === currentFilter)?.label || currentFilter;

  return (
    <div className="pt-16 pb-16 min-h-screen bg-slate-100/90">
      <div className="w-full max-w-[1720px] mx-auto px-2 sm:px-3 md:px-4 lg:px-5">
        
        {/* Side-by-Side Optimized Viewport Layout: Left Categories + Right Products */}
        <div className="flex flex-row items-start gap-2 sm:gap-3 lg:gap-4">

          {/* Left Sidebar: Categories Deployed Vertically Downwards (Ultra-Compact) */}
          <aside className="w-24 xs:w-28 sm:w-32 md:w-36 lg:w-40 flex-shrink-0 sticky top-16 z-10">
            
            {/* Categories Card */}
            <div className="bg-white rounded-lg sm:rounded-xl p-0.5 sm:p-1 shadow-2xs border border-slate-200/90 space-y-0.5">
              {/* Vertical Category List */}
              <nav className="space-y-0.5 max-h-[calc(100vh-76px)] overflow-y-auto pr-0.5 scrollbar-thin" aria-label="Categorías del catálogo">
                {sectionOrder.map(sec => {
                  const isActive = currentSection === sec;
                  const subcats = sectionSubcategories[sec] || [];
                  const sectionCount = sec === 'favoritos'
                    ? products.filter(p => p.favorite).length
                    : products.filter(p => p.section === sec).length;

                  return (
                    <div key={sec} className="space-y-0.5">
                      {/* Main Category Button with Count */}
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentSection(sec);
                          setCurrentFilter('all');
                        }}
                        className={`w-full flex items-center justify-between gap-1 px-1.5 py-1 rounded-md text-[10px] sm:text-[11px] font-bold transition-all cursor-pointer text-left leading-tight ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-slate-50/70'
                        }`}
                      >
                        <div className="flex items-center gap-1 min-w-0 truncate">
                          <span className={`p-0.5 rounded flex-shrink-0 ${isActive ? 'bg-white/20 text-white' : 'text-slate-600'}`}>
                            {categoryIcons[sec]}
                          </span>
                          <span className="leading-tight break-words min-w-0 truncate">
                            {sectionLabels[sec] || sec}
                          </span>
                        </div>
                        <span className={`text-[8px] sm:text-[8.5px] font-mono px-1 py-0.2 rounded-full font-bold flex-shrink-0 ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-600'
                        }`}>
                          {sectionCount}
                        </span>
                      </button>

                      {/* Subcategories Deployed Downwards with Tree Guide Line and Counts */}
                      {isActive && subcats.length > 0 && (
                        <div className="pl-1 pr-0.5 py-0.5 space-y-0.5 border-l-2 border-orange-400 ml-1.5 my-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          {subcats.map(sub => {
                            const isSubActive = currentFilter === sub.value;
                            const subCount = products.filter(p => p.section === sec && p.category === sub.value).length;

                            return (
                              <button
                                key={sub.value}
                                type="button"
                                onClick={() => setCurrentFilter(sub.value)}
                                className={`w-full flex items-center justify-between gap-1 px-1 py-0.5 rounded text-[9px] sm:text-[9.5px] transition-all cursor-pointer text-left leading-tight ${
                                  isSubActive
                                    ? 'bg-[#002147] text-white font-bold shadow-2xs'
                                    : 'text-slate-600 hover:text-[#002147] hover:bg-slate-100 font-medium'
                                }`}
                              >
                                <span className="leading-tight truncate">{sub.label}</span>
                                <span className={`text-[7.5px] font-mono px-0.5 py-0.2 rounded font-semibold flex-shrink-0 ${
                                  isSubActive ? 'bg-white/20 text-white' : 'text-slate-400'
                                }`}>
                                  {subCount}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Right Main Content: High Density Optimized Products Feed */}
          <main className="flex-1 min-w-0 space-y-1.5">

            {/* Compact Header Toolbar */}
            <div className="bg-white rounded-lg sm:rounded-xl px-2 sm:px-3 py-1 sm:py-1.5 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <span className="text-[10.5px] sm:text-[11.5px] font-black text-[#002147] capitalize truncate">
                  {sectionLabels[currentSection] || currentSection}
                </span>
                <span className="text-slate-300 text-xs">/</span>
                <span className="text-[9.5px] sm:text-[10.5px] text-orange-600 font-bold truncate">
                  {activeSubcategoryLabel}
                </span>
                <span className="text-[8.5px] sm:text-[9.5px] text-slate-400 font-mono bg-slate-100 px-1 py-0.2 rounded-md font-semibold flex-shrink-0">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>

              {/* Toolbar Controls: Sort & Layout Mode */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto">
                <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded-md text-[9.5px] sm:text-[10.5px]">
                  <ArrowUpDown className="w-2.5 h-2.5 text-slate-500" />
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    className="bg-transparent text-slate-700 font-bold focus:outline-none cursor-pointer text-[9.5px] sm:text-[10.5px]"
                  >
                    <option value="default">Orden Normal</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="name">Nombre A-Z</option>
                  </select>
                </div>

                <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200/80">
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`p-0.5 rounded cursor-pointer transition-all ${
                      layoutMode === 'grid' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Vista Cuadrícula"
                  >
                    <LayoutGrid className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => setLayoutMode('list')}
                    className={`p-0.5 rounded cursor-pointer transition-all ${
                      layoutMode === 'list' ? 'bg-white text-orange-600 shadow-2xs' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title="Vista Compacta Multicolumna"
                  >
                    <List className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Display Feed in High Space-Efficiency Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                  <Search className="w-5 h-5 opacity-60" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">No encontramos productos coincidentes</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Prueba ajustando los términos de búsqueda o el filtro de categoría.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentFilter('all');
                  }}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-[11px] font-bold shadow-xs transition-all cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : layoutMode === 'list' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1 sm:gap-1.5">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    layoutMode="list"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1 sm:gap-1.5">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    layoutMode="grid"
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
