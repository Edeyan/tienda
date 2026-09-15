import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CatalogView } from './components/CatalogView';
import { AdminHub } from './components/AdminPanel/AdminHub';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartModal } from './components/CartModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { CalculatorModal } from './components/CalculatorModal';
import { NotesModal } from './components/NotesModal';
import { PoliciesModal } from './components/PoliciesModal';
import { InvoiceDetailModal } from './components/InvoiceDetailModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { MembershipModal } from './components/MembershipModal';
import { QRScannerModal } from './components/QRScannerModal';

import { GmailModal } from './components/GmailModal';
import { BottomTabBar } from './components/BottomTabBar';
import { Toast } from './components/Toast';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { AIAssistant } from './components/AIAssistant';

const MainApp: React.FC = () => {
  const { 
    viewMode, 
    isPowerOn, 
     
    
    gmailModalOpen,
    setGmailModalOpen
  } = useApp();

  // Keyboard shortcut listener for quick search ('/') and Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isPowerOn ? 'bg-slate-100' : 'bg-slate-100/95'}`}>
      {/* Top Header */}
      <Header />

      {/* Main View: Either Public Catalog or Admin Control Panel with smooth fade transitions */}
      <AnimatePresence mode="wait">
        {viewMode === 'admin' ? (
          <motion.div
            key="admin-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <AdminHub />
          </motion.div>
        ) : (
          <motion.div
            key="catalog-view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <CatalogView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bottom Tab Bar */}
      <BottomTabBar />

      {/* Global Modals */}
      <ProductDetailModal />
      <CartModal />
      <AuthModal />
      <ProfileModal />
      <CalculatorModal />
      <NotesModal />
      <PoliciesModal />
      <InvoiceDetailModal />
      <OrderTrackingModal />
      <MembershipModal />
      <QRScannerModal />
      <GmailModal
        isOpen={gmailModalOpen}
        onClose={() => setGmailModalOpen(false)}
      />
      
      {/* AI Assistant Chatbot */}
      <AIAssistant />

      {/* Toast & Push Notifications */}
      <PushNotificationBanner />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
