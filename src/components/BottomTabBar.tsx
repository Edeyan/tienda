import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Receipt, 
  Crown, 
  Calculator, 
  FileText, 
  ShieldCheck,
  Truck
} from 'lucide-react';

export const BottomTabBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    cartCount,
    setCartModalOpen,
    setMembershipModalOpen,
    setCalcModalOpen,
    setNotesModalOpen,
    setPoliciesModalOpen,
    setTrackingModalOpen,
    currentUser
  } = useApp();

  return (
    <nav className="fixed bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/90 p-1 sm:p-1.5 flex items-center justify-between sm:justify-center gap-0.5 sm:gap-1.5 w-[calc(100vw-0.75rem)] max-w-xl">
      {/* Home / Catalog */}
      <button
        onClick={() => setViewMode('catalog')}
        className={`flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold transition-all cursor-pointer ${
          viewMode === 'catalog'
            ? 'text-[#002147] bg-slate-100'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 flex-shrink-0" />
        <span className="truncate max-w-full">Inicio</span>
      </button>

      {/* Compra / Cart */}
      <button
        onClick={() => setCartModalOpen(true)}
        className="relative flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
      >
        <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
        <span className="truncate max-w-full">Compra</span>
        {cartCount > 0 && (
          <span className="absolute -top-0.5 right-0 sm:top-0.5 sm:right-1 bg-orange-500 text-white font-mono text-[8px] sm:text-[9px] font-black w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center animate-bounce">
            {cartCount}
          </span>
        )}
      </button>

      {/* Rastreo de Pedido */}
      <button
        onClick={() => setTrackingModalOpen(true)}
        className="flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
      >
        <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
        <span className="truncate max-w-full">Rastreo</span>
      </button>

      {/* Membresía (VIP Points + Referidos) */}
      <button
        onClick={() => setMembershipModalOpen(true)}
        className="relative flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50/70 hover:bg-amber-100/80 transition-all cursor-pointer"
      >
        <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
        <span className="truncate max-w-full font-black">Membresía</span>
        {currentUser?.points ? (
          <span className="absolute -top-1 right-0 bg-amber-500 text-white font-mono text-[7px] font-black px-1 rounded-full">
            {currentUser.points}p
          </span>
        ) : null}
      </button>

      {/* Calculator */}
      <button
        onClick={() => setCalcModalOpen(true)}
        className="flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
      >
        <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
        <span className="truncate max-w-full">Calc</span>
      </button>

      {/* Notes */}
      <button
        onClick={() => setNotesModalOpen(true)}
        className="flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
        <span className="truncate max-w-full">Notas</span>
      </button>

      {/* Policies */}
      <button
        onClick={() => setPoliciesModalOpen(true)}
        className="flex-1 sm:flex-initial flex flex-col items-center justify-center min-w-0 px-1 sm:px-2 py-1 sm:py-1.5 rounded-xl text-[8px] xs:text-[9px] sm:text-[10px] font-extrabold text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
      >
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
        <span className="truncate max-w-full">Políticas</span>
      </button>
    </nav>
  );
};
