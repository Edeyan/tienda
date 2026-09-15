import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { sectionSubcategories, sectionLabels, sectionOrder } from '../data/initialData';
import { 
  Car, 
  Wrench, 
  Footprints, 
  BatteryCharging, 
  Shirt, 
  Fan, 
  Bike, 
  Star,
  Layers,
  ChevronDown,
  Cog,
  Sparkles,
  ShoppingBag,
  Droplets
} from 'lucide-react';

export const categoryIcons: Record<string, React.ReactNode> = {
  favoritos: <Star className="w-4 h-4 text-amber-500 fill-amber-400" />,
  nuevo: <Sparkles className="w-4 h-4 text-emerald-500" />,
  vehiculos: <Car className="w-4 h-4" />,
  respuestos_motos: <Cog className="w-4 h-4" />,
  ferreteria: <Wrench className="w-4 h-4" />,
  calzado: <Footprints className="w-4 h-4" />,
  baterias: <BatteryCharging className="w-4 h-4" />,
  ropa: <Shirt className="w-4 h-4" />,
  bolsos: <ShoppingBag className="w-4 h-4" />,
  filtros_agua: <Droplets className="w-4 h-4" />,
  ventiladores: <Fan className="w-4 h-4" />,
  bicicletas: <Bike className="w-4 h-4" />
};

export const Sidebar: React.FC = () => {
  const {
    products,
    currentSection,
    setCurrentSection,
    currentFilter,
    setCurrentFilter
  } = useApp();

  // Accordion state: controls which category's subcategories are unfolded
  const [unfoldedSection, setUnfoldedSection] = useState<string | null>(currentSection);

  const handleCategoryClick = (section: string) => {
    if (unfoldedSection === section) {
      // Toggle fold / plegar if already open
      setUnfoldedSection(null);
    } else {
      // Unfold / desplegar and select
      setUnfoldedSection(section);
      setCurrentSection(section);
      setCurrentFilter('all');
    }
  };

  const handleSubcategoryClick = (subValue: string, parentSection: string) => {
    setCurrentSection(parentSection);
    setCurrentFilter(subValue);
  };

  return (
    <aside
      id="categories-left-pane"
      className="w-full md:w-64 lg:w-72 xl:w-80 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-slate-200/90 flex flex-col h-auto md:h-[calc(100vh-4rem)] md:sticky md:top-16 select-none overflow-y-auto shadow-2xs"
    >
      {/* Header for the Left Pane */}
      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-xs font-black text-[#002147] uppercase tracking-wider font-['Outfit']">
          <Layers className="w-4 h-4 text-orange-500" />
          <span>Categorías</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
          {products.length} productos
        </span>
      </div>

      {/* Accordion Categories List */}
      <div className="p-3 space-y-1.5 flex-1">
        {/* Favoritos item */}
        <button
          type="button"
          onClick={() => {
            setCurrentSection('favoritos');
            setCurrentFilter('all');
            setUnfoldedSection('favoritos');
          }}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
            currentSection === 'favoritos'
              ? 'bg-orange-500 text-white shadow-xs'
              : 'text-slate-800 hover:bg-slate-100/80 hover:text-slate-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Star className={`w-4 h-4 ${currentSection === 'favoritos' ? 'text-white fill-white' : 'text-amber-400 fill-amber-400'}`} />
            <span>Favoritos</span>
          </div>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
            currentSection === 'favoritos' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}>
            {products.filter(p => p.favorite).length}
          </span>
        </button>

        {/* Regular Sections */}
        {sectionOrder.filter(s => s !== 'favoritos').map(section => {
          const isActive = currentSection === section;
          const isUnfolded = unfoldedSection === section;
          const subcats = sectionSubcategories[section] || [];
          const count = products.filter(p => p.section === section).length;

          return (
            <div key={section} className="space-y-1">
              {/* Category Button Header */}
              <button
                type="button"
                onClick={() => handleCategoryClick(section)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer group ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-slate-800 hover:bg-slate-100/80 hover:text-slate-950'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`transition-transform flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-700'}`}>
                    {categoryIcons[section]}
                  </span>
                  <span className="truncate">{sectionLabels[section] || section}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}>
                    {count}
                  </span>

                  {subcats.length > 0 && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                      } ${isUnfolded ? 'rotate-180' : 'rotate-0'}`}
                    />
                  )}
                </div>
              </button>

              {/* Subcategories (Fold / Unfold accordion behavior) */}
              {isUnfolded && subcats.length > 0 && (
                <div className="space-y-1 py-1 px-1 bg-slate-50/80 rounded-xl border border-slate-100 animate-in fade-in slide-in-from-top-1 duration-150 ml-2">
                  {subcats.map(sub => {
                    const isSubActive = isActive && currentFilter === sub.value;
                    return (
                      <button
                        key={sub.value}
                        type="button"
                        onClick={() => handleSubcategoryClick(sub.value, section)}
                        className={`w-full text-center text-xs py-1.5 px-3 rounded-lg transition-all block cursor-pointer ${
                          isSubActive
                            ? 'bg-[#002147] text-white shadow-xs font-bold'
                            : 'text-slate-800 hover:bg-slate-200/70 hover:text-slate-950 font-medium'
                        }`}
                      >
                        {sub.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
