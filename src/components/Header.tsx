import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Search, 
  ShoppingBag, 
  User as UserIcon, 
  ShieldCheck, 
  Power, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  Store,
  LogOut,
  Cloud,
  Wifi,
  QrCode,
  Mail
  , ChevronDown
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    storeSettings,
    searchQuery,
    setSearchQuery,
    cartCount,
    setCartModalOpen,
    currentUser,
    setAuthModalOpen,
    setAuthModalMode,
    setProfileModalOpen,
    setQrScannerOpen,
    
    setGmailModalOpen,
    logout,
    viewMode,
    setViewMode,
    isPowerOn,
    togglePower,
  } = useApp();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#userMenuContainer')) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#002147] text-white px-2.5 sm:px-4 md:px-6 flex items-center justify-between shadow-lg border-b border-white/10">
      {/* Left: Logo and Brand Name */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button 
          onClick={() => setViewMode('catalog')}
          className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <svg viewBox="0 0 64 64" className="w-6 h-6 sm:w-7 sm:h-7" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 38c2-6 8-14 16-18l2 4c-6 3-10 10-12 14-1 2-5 2-6 0-1-1-1-2 0-4z" fill="#ffffff" opacity="0.9"/>
              <path d="M48 38c-2-6-8-14-16-18l-2 4c6 3 10 10 12 14 1 2 5 2 6 0 1-1 1-2 0-4z" fill="#ffffff" opacity="0.9"/>
              <path d="M20 46 L26 22 L32 16 L38 22 L44 46 L40 46 L36 34 L28 34 L24 46 Z" fill="none" stroke="#002147" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base md:text-lg font-black tracking-wider leading-none text-white flex items-center gap-1 font-['Outfit'] truncate">
              {storeSettings.storeName}
            </h1>
            <p className="text-[9px] sm:text-[10px] text-blue-200 tracking-wider font-semibold mt-0.5 truncate max-w-[140px] sm:max-w-none">
              {storeSettings.storeSubtitle}
            </p>
          </div>
        </button>
      </div>

      {/* Center Text */}
      <div className="flex-1 flex justify-center text-orange-400 font-black text-[10px] sm:text-xs md:text-sm italic tracking-widest animate-pulse whitespace-nowrap ml-1 sm:ml-2">
        ¡MIRA ESTO!
      </div>

      {/* Right: Search Bar and Auth */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-1">
        
        {/* PWA Install Button */}
        <div className="hidden sm:block">
          <PWAInstallButton />
        </div>

        <div className="max-w-[100px] sm:max-w-[180px] flex items-center bg-white rounded-full px-2 py-0.5 shadow-inner focus-within:ring-2 focus-within:ring-orange-500 transition-all border border-white/20">
          <Search className="w-3 h-3 text-slate-400 mr-1 flex-shrink-0" />
          <input
            type="search"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-[10px] sm:text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none min-w-0 font-medium h-4 sm:h-5"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600 text-[10px] px-1 flex-shrink-0 cursor-pointer flex items-center"
              aria-label="Borrar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* User Auth Section */}
        {currentUser ? (
          <div className="relative" id="userMenuContainer">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 p-1 sm:p-1.5 sm:pr-2 rounded-xl border border-white/10 transition-all text-left cursor-pointer"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-white/20"
              />
              <div className="hidden md:block">
                <div className="text-xs font-bold leading-tight truncate max-w-[90px]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] text-orange-300 font-mono capitalize">
                  {currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'seller' ? 'Vendedor' : 'Cliente'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-0.5 hidden xs:block" />
            </button>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-700/60 p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setUserDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                  <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    currentUser.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                    currentUser.role === 'seller' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {currentUser.role === 'admin' ? '👑 Administrador' : currentUser.role === 'seller' ? '💼 Vendedor' : '👤 Cliente Registrado'}
                  </span>
                </div>

                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-left cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  Mi Perfil & Ajustes
                </button>

                <button
                  onClick={() => setQrScannerOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-left cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-orange-400" />
                  Escanear Código QR
                </button>

                <button
                  onClick={() => setGmailModalOpen(true)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-left cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-rose-400" />
                  Gmail Workspace
                </button>

                <button
                  onClick={() => setViewMode(viewMode === 'admin' ? 'catalog' : 'admin')}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-white rounded-xl transition-all text-left"
                >
                  <LayoutDashboard className="w-4 h-4 text-orange-400" />
                  {viewMode === 'admin' ? 'Ver Catálogo Público' : 'Ir a Panel de Control'}
                </button>


                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 border border-white/15 transition-all"
            >
              <LogIn className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setAuthModalOpen(true);
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Registrarse</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
