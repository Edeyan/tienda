import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Receipt, 
  Settings, 
  ArrowLeft, 
  ShieldAlert, 
  Store, 
  AlertTriangle, 
  Mail,
  Megaphone,
  Cloud
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { ProductManager } from './ProductManager';
import { UserManager } from './UserManager';
import { OrderManager } from './OrderManager';
import { SettingsManager } from './SettingsManager';
import { WorkspaceManager } from './WorkspaceManager';
import { PushMarketingManager } from './PushMarketingManager';

export const AdminHub: React.FC = () => {
  const { adminTab, setAdminTab, setViewMode, currentUser, products } = useApp();

  const lowStockCount = products.filter(p => (p.stock ?? 0) < 5).length;

  const tabs = [
    { id: 'dashboard', label: 'Resumen & Métricas', icon: LayoutDashboard },
    { id: 'products', label: 'Inventario / Productos', icon: Package, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'marketing', label: 'Promociones Push', icon: Megaphone },
    { id: 'users', label: 'Usuarios & Accesos', icon: Users },
    { id: 'orders', label: 'Facturas & Pedidos', icon: Receipt },
    { id: 'workspace', label: 'Google Workspace', icon: Cloud },
    { id: 'settings', label: 'Configuración Negocio', icon: Settings }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100/90 pt-16 pb-24 md:pb-12">
      {/* Top Admin Sub-bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode('catalog')}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </button>
            <div className="h-5 w-[1px] bg-slate-200" />
            <span className="text-xs font-black text-[#002147] uppercase tracking-wider font-['Outfit']">
              Centro de Administración
            </span>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#002147] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {'badge' in tab && tab.badge !== undefined && (
                    <span 
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}
                      title={`${tab.badge} productos con bajo stock (< 5)`}
                    >
                      <AlertTriangle className="w-2.5 h-2.5" />
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={adminTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {adminTab === 'dashboard' && <AdminDashboard />}
            {adminTab === 'products' && <ProductManager />}
            {adminTab === 'marketing' && <PushMarketingManager />}
            {adminTab === 'users' && <UserManager />}
            {adminTab === 'orders' && <OrderManager />}
            {adminTab === 'workspace' && <WorkspaceManager />}
            {adminTab === 'settings' && <SettingsManager />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
