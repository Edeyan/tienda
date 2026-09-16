import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Product, User, Order, StoreSettings, CartItem, Role, CurrencyType, Coupon, ProductReview, PushNotificationPayload } from '../types';
import { initialProducts, initialOrders, initialStoreSettings, initialCoupons, initialReviews } from '../data/initialData';
import { getHighQualityImageUrl } from '../utils/imageUtils';
import { cleanProductName } from '../utils/productUtils';
import { syncFirebase } from '../services/firestoreSync';
import { isPrimaryAdmin } from '../config/admin';
import { firebaseAuthService } from '../services/authService';
import { fcmService } from '../services/fcmService';
import { auth } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Cloud Sync
  isCloudSynced: boolean;
  cloudSyncStatus: 'synced' | 'syncing' | 'offline';

  // Push Notifications (FCM)
  isPushSupported: boolean;
  pushPermissionStatus: NotificationPermission | 'unsupported';
  inAppPushNotification: PushNotificationPayload | null;
  requestPushPermission: () => Promise<{ success: boolean; token?: string; error?: string }>;
  sendTestPushNotification: () => Promise<{ success: boolean; message: string }>;
  dismissInAppPushNotification: () => void;
  notifyOrderPush: (order: Order, status: Order['status']) => Promise<PushNotificationPayload>;
  // Products
  products: Product[];
  currentSection: string;
  setCurrentSection: (s: string) => void;
  currentFilter: string;
  setCurrentFilter: (f: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  addProductsBatch: (productsList: Omit<Product, 'id'>[]) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleFavorite: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;

  // Currency & Commercial
  activeCurrency: CurrencyType;
  setActiveCurrency: (curr: CurrencyType) => void;
  formatCurrency: (amountInUSD: number, targetCurrency?: CurrencyType) => string;
  convertCurrency: (amountInUSD: number, targetCurrency?: CurrencyType) => number;

  // Cart & Orders & Coupons
  cart: Record<string, number>;
  addToCart: (id: string, qty?: number) => void;
  updateCartQty: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartItemsList: CartItem[];
  appliedCoupon: Coupon | null;
  coupons: Coupon[];
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  discountAmount: number;
  orders: Order[];
  createOrder: (customerData: { name: string; email: string; phone?: string; paymentMethod: Order['paymentMethod']; notes?: string }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  deleteOrder: (orderId: string) => void;

  // Reviews
  reviews: ProductReview[];
  getProductReviews: (productId: string) => ProductReview[];
  addProductReview: (review: Omit<ProductReview, 'id' | 'createdAt' | 'verified'>) => void;

  // Auth & Users
  currentUser: User | null;
  users: User[];
  refreshUsers: () => Promise<{ success: boolean; message?: string }>;
  login: (email: string, password?: string) => { success: boolean; message?: string };
  loginWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  loginWithFirebaseEmail: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  sendPasswordReset: (email: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: { name: string; firstName?: string; lastName?: string; email: string; password?: string; role?: Role; phone?: string; whatsapp?: string; country?: string; cedula?: string }) => Promise<{ success: boolean; message?: string }>;
  registerWithFirebaseEmail: (userData: { name: string; firstName?: string; lastName?: string; email: string; password?: string; role?: Role; phone?: string; whatsapp?: string; country?: string; cedula?: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  updateUserRole: (userId: string, role: Role) => void;
  toggleUserStatus: (userId: string) => void;
  deleteUser: (userId: string) => Promise<{ success: boolean; message?: string }>;

  // View & UI Navigation
  viewMode: 'catalog' | 'admin';
  setViewMode: (mode: 'catalog' | 'admin') => void;
  adminTab: 'dashboard' | 'products' | 'users' | 'orders' | 'settings' | 'workspace' | 'marketing';
  setAdminTab: (tab: 'dashboard' | 'products' | 'users' | 'orders' | 'settings' | 'workspace' | 'marketing') => void;

  // Power
  isPowerOn: boolean;
  togglePower: () => void;

  // Notes
  notes: string;
  saveNotes: (text: string) => void;

  // Store Settings
  storeSettings: StoreSettings;
  updateStoreSettings: (settings: Partial<StoreSettings>) => void;

  // Modals
  closeAllModals: () => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (m: 'login' | 'register') => void;
  cartModalOpen: boolean;
  setCartModalOpen: (open: boolean) => void;
  profileModalOpen: boolean;
  setProfileModalOpen: (open: boolean) => void;
  calcModalOpen: boolean;
  setCalcModalOpen: (open: boolean) => void;
  notesModalOpen: boolean;
  setNotesModalOpen: (open: boolean) => void;
  policiesModalOpen: boolean;
  setPoliciesModalOpen: (open: boolean) => void;
  trackingModalOpen: boolean;
  setTrackingModalOpen: (open: boolean) => void;
  membershipModalOpen: boolean;
  setMembershipModalOpen: (open: boolean) => void;
  qrScannerOpen: boolean;
  setQrScannerOpen: (open: boolean) => void;
  
  
  gmailModalOpen: boolean;
  setGmailModalOpen: (open: boolean) => void;
  addPointsToUser: (amount: number) => void;
  redeemRewardPoints: (pointsCost: number, rewardTitle: string, generatedCoupon?: Coupon) => boolean;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (o: Order | null) => void;

  // AI Assistant Modal & Query
  aiAssistantOpen: boolean;
  setAiAssistantOpen: (open: boolean) => void;
  aiInitialQuery: string;
  setAiInitialQuery: (q: string) => void;
  openAiAssistantWithQuery: (q: string) => void;

  // Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Explicitly forbidden deleted IDs from catalog
  const DELETED_PRODUCT_IDS = new Set([
    'mzk_5', 'mzk_254',
    'mzk_53', 'mzk_55', 'mzk_148',
    'mzk_122', 'mzk_123', 'mzk_124', 'mzk_125', 'mzk_126', 'mzk_128', 'mzk_129', 'mzk_131', 'mzk_132', 'mzk_133', 'mzk_135', 'mzk_136', 'mzk_137',
    'mzk_103',
    'mzk_75', 'mzk_76', 'mzk_77', 'mzk_78', 'mzk_151', 'mzk_152',
    'mzk_165', 'mzk_169', 'mzk_193', 'mzk_194', 'mzk_195', 'mzk_203',
    'mzk_204', 'mzk_205', 'mzk_208', 'mzk_256', 'mzk_273', 'mzk_288', 'mzk_289',
    'greenpro_11812', 'greenpro_11811', 'greenpro_10011', 'greenpro_10012',
    'greenpro_11802', 'greenpro_11803', 'greenpro_11073', 'greenpro_10008',
    'greenpro_10006',
    'greenpro_12075',
    // Cerraduras & Llavines deleted products [1-71]
    "megapro_11306","megapro_11299","megapro_11300","megapro_11252","megapro_11307","megapro_11301","megapro_11308","megapro_11302","megapro_11309","megapro_11303","megapro_11304","megapro_11311","megapro_11305","megapro_11295","megapro_11247","megapro_11293","megapro_11243","megapro_11249","megapro_11298","megapro_11241","megapro_11244","megapro_11296","megapro_11242","megapro_11245","megapro_11248","megapro_11294","megapro_11246","megapro_11251","megapro_11297","megapro_13101","megapro_13102","megapro_13103","megapro_13104","megapro_13105","megapro_13106","megapro_13107","megapro_13108","megapro_13117","megapro_13118","megapro_13116","megapro_10913","megapro_10914","megapro_10265","megapro_11644","megapro_10284","megapro_10286","megapro_10275","megapro_10278","megapro_10279","megapro_10290","megapro_13110","megapro_13111","megapro_13109","megapro_12949","megapro_10296","megapro_10297","megapro_10292","megapro_10293","megapro_10294","megapro_11701","megapro_10257","megapro_11423","megapro_11422","megapro_11421","megapro_11420","megapro_11419","megapro_11418","megapro_13114","megapro_13113","megapro_13112","megapro_10602"
  ]);

  // Load initial states from localStorage if present
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      // Clear all legacy localStorage keys
      for (let i = 1; i <= 66; i++) {
        localStorage.removeItem(`mishozuki_products_v${i}`);
      }
      const saved = localStorage.getItem('mishozuki_products_v67');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const validParsed = parsed.filter(p => !DELETED_PRODUCT_IDS.has(p.id));
        const existingIds = new Set(validParsed.map(p => p.id));
        const initialMap = new Map(initialProducts.map(p => [p.id, p]));
        const updatedParsed = validParsed.map(p => {
          const init = initialMap.get(p.id);
          if (init) {
            return {
              ...p,
              name: cleanProductName(init.name || p.name),
              image: init.image || p.image,
              specs: init.specs || p.specs,
              section: init.section,
              category: init.category
            };
          }
          return {
            ...p,
            name: cleanProductName(p.name)
          };
        });
        const missingInitial = initialProducts.filter(p => !existingIds.has(p.id) && !DELETED_PRODUCT_IDS.has(p.id));
        return [...missingInitial, ...updatedParsed]
          .filter(p => !DELETED_PRODUCT_IDS.has(p.id))
          .map(p => ({ ...p, name: cleanProductName(p.name), image: getHighQualityImageUrl(p.image) }));
      }
    } catch (e) {
      console.error(e);
    }
    return initialProducts
      .filter(p => !DELETED_PRODUCT_IDS.has(p.id))
      .map(p => ({ ...p, name: cleanProductName(p.name), image: getHighQualityImageUrl(p.image) }));
  });

  const [users, setUsers] = useState<User[]>(() => {
    // User records are authoritative in Firebase; never rehydrate deleted
    // profiles from browser storage.
    return [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Authentication must come from Firebase Auth, never from client storage.
    return null;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('asociados_orders_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialOrders;
  });

  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('asociados_settings_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialStoreSettings;
  });

  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      localStorage.removeItem('asociados_factura_v1');
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  const [currentSection, setCurrentSection] = useState<string>('vehiculos');
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [viewMode, setViewMode] = useState<'catalog' | 'admin'>('catalog');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'users' | 'orders' | 'settings' | 'workspace' | 'marketing'>('dashboard');

  const [isPowerOn, setIsPowerOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('asociados_power_state') === 'on';
    } catch {
      return false;
    }
  });

  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem('asociados_notas') || '';
    } catch {
      return '';
    }
  });

  const [activeCurrency, setActiveCurrency] = useState<CurrencyType>(() => {
    try {
      const saved = localStorage.getItem('asociados_active_currency');
      if (saved && ['USD', 'EUR', 'CUP', 'MLC'].includes(saved)) {
        return saved as CurrencyType;
      }
    } catch (e) {
      console.error(e);
    }
    return 'USD';
  });

  useEffect(() => {
    localStorage.setItem('asociados_active_currency', activeCurrency);
  }, [activeCurrency]);

  const convertCurrency = (amountInUSD: number, targetCurrency?: CurrencyType): number => {
    const target = targetCurrency || activeCurrency;
    const rate = storeSettings.currencyRates?.[target] ?? 1.0;
    return Number((amountInUSD * rate).toFixed(2));
  };

  const formatCurrency = (amountInUSD: number, targetCurrency?: CurrencyType): string => {
    const target = targetCurrency || activeCurrency;
    const converted = convertCurrency(amountInUSD, target);
    const symbols: Record<CurrencyType, string> = {
      USD: '$',
      EUR: '€',
      CUP: 'CUP $',
      MLC: 'MLC $'
    };
    return `${symbols[target]} ${converted.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Modals
  const [authModalOpen, setAuthModalOpenState] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [cartModalOpen, setCartModalOpenState] = useState(false);
  const [profileModalOpen, setProfileModalOpenState] = useState(false);
  const [calcModalOpen, setCalcModalOpenState] = useState(false);
  const [notesModalOpen, setNotesModalOpenState] = useState(false);
  const [policiesModalOpen, setPoliciesModalOpenState] = useState(false);
  const [trackingModalOpen, setTrackingModalOpenState] = useState(false);
  const [membershipModalOpen, setMembershipModalOpenState] = useState(false);
  const [qrScannerOpen, setQrScannerOpenState] = useState(false);
  
  const [gmailModalOpen, setGmailModalOpenState] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [aiInitialQuery, setAiInitialQuery] = useState('');
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrderState] = useState<Order | null>(null);

  const openAiAssistantWithQuery = (q: string) => {
    setAiInitialQuery(q);
    setAiAssistantOpen(true);
  };

  const closeAllModals = () => {
    setAuthModalOpenState(false);
    setCartModalOpenState(false);
    setProfileModalOpenState(false);
    setCalcModalOpenState(false);
    setNotesModalOpenState(false);
    setPoliciesModalOpenState(false);
    setTrackingModalOpenState(false);
    setMembershipModalOpenState(false);
    setQrScannerOpenState(false);
    
    setGmailModalOpenState(false);
    setSelectedProductState(null);
    setSelectedOrderState(null);
  };

  const setAuthModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setAuthModalOpenState(open);
  };

  const setCartModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setCartModalOpenState(open);
  };

  const setProfileModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setProfileModalOpenState(open);
  };

  const setCalcModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setCalcModalOpenState(open);
  };

  const setNotesModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setNotesModalOpenState(open);
  };

  const setPoliciesModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setPoliciesModalOpenState(open);
  };

  const setTrackingModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setTrackingModalOpenState(open);
  };

  const setMembershipModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setMembershipModalOpenState(open);
  };

  const setQrScannerOpen = (open: boolean) => {
    if (open) closeAllModals();
    setQrScannerOpenState(open);
  };

  const setGmailModalOpen = (open: boolean) => {
    if (open) closeAllModals();
    setGmailModalOpenState(open);
  };

  const setSelectedProduct = (p: Product | null) => {
    if (p) closeAllModals();
    setSelectedProductState(p);
  };

  const setSelectedOrder = (o: Order | null) => {
    if (o) closeAllModals();
    setSelectedOrderState(o);
  };

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeAllModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('asociados_coupons_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialCoupons;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('asociados_applied_coupon');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Reviews
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    try {
      const saved = localStorage.getItem('asociados_reviews_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialReviews;
  });

  useEffect(() => {
    localStorage.setItem('asociados_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('asociados_applied_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('asociados_applied_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('asociados_reviews_v1', JSON.stringify(reviews));
  }, [reviews]);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Push Notifications (Firebase Cloud Messaging)
  const [isPushSupported, setIsPushSupported] = useState<boolean>(false);
  const [pushPermissionStatus, setPushPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [inAppPushNotification, setInAppPushNotification] = useState<PushNotificationPayload | null>(null);
  const prevOrdersRef = useRef<Record<string, Order['status']>>({});

  // Real-time Firestore Cloud Synchronization
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(true);
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Initialize FCM on mount
  useEffect(() => {
    fcmService.init().then(supported => {
      setIsPushSupported(supported);
      setPushPermissionStatus(fcmService.getPermissionStatus());
    });

    const unsubscribeForeground = fcmService.onForegroundMessage((payload) => {
      setInAppPushNotification(payload);
    });

    return () => {
      if (unsubscribeForeground) unsubscribeForeground();
    };
  }, []);

  // Request FCM Push Permission
  const requestPushPermission = async () => {
    const res = await fcmService.requestPermissionAndGetToken(currentUser?.id, currentUser?.email);
    setPushPermissionStatus(fcmService.getPermissionStatus());
    if (res.success) {
      showToast('🔔 ¡Notificaciones Push activadas en este dispositivo!', 'success');
      if (currentUser) {
        updateCurrentUser({
          preferences: {
            ...currentUser.preferences,
            notificacionesPush: true
          }
        });
      }
    } else {
      showToast(res.error || 'No se pudo activar las notificaciones push', 'warning');
    }
    return res;
  };

  // Test Push Notification
  const sendTestPushNotification = async () => {
    const res = await fcmService.sendTestPushNotification();
    setPushPermissionStatus(fcmService.getPermissionStatus());
    if (res.success) {
      showToast('🚀 Notificación push de prueba enviada al dispositivo', 'success');
    } else {
      showToast(res.message, 'warning');
    }
    return res;
  };

  const dismissInAppPushNotification = () => {
    setInAppPushNotification(null);
  };

  const notifyOrderPush = async (order: Order, status: Order['status']) => {
    return fcmService.notifyOrderStatusChange(order, status, {
      onInAppAlert: (payload) => setInAppPushNotification(payload)
    });
  };

  // Listen to Firestore real-time collections on mount
  useEffect(() => {
    setCloudSyncStatus('syncing');

    // Subscribe to products
    const unsubProducts = syncFirebase.subscribeProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        const cloudIds = new Set(cloudProducts.map(p => p.id));
        // Automatically purge any permanently deleted products that remain in Firestore
        cloudProducts.forEach(p => {
          if (DELETED_PRODUCT_IDS.has(p.id)) {
            void syncFirebase.deleteProduct(p.id);
          }
        });
        const missingInitial = initialProducts.filter(p => !cloudIds.has(p.id) && !DELETED_PRODUCT_IDS.has(p.id));
        if (missingInitial.length > 0 && auth.currentUser) {
          void syncFirebase.seedProductsBatch(missingInitial);
        }
        const initialMap = new Map(initialProducts.map(p => [p.id, p]));
        const merged = [...missingInitial, ...cloudProducts]
          .filter(p => !DELETED_PRODUCT_IDS.has(p.id))
          .map(p => {
            const canonical = initialMap.get(p.id);
            // If the canonical initial catalog updated category or section, propagate it
            const category = canonical ? canonical.category : p.category;
            const section = canonical ? canonical.section : p.section;
            return {
              ...p,
              name: cleanProductName(canonical?.name || p.name),
              category,
              section,
              image: getHighQualityImageUrl(canonical?.image || p.image)
            };
          });
        setProducts(merged);
        setCloudSyncStatus('synced');
      } else {
        // Initial cloud seed if empty
        if (auth.currentUser) {
          void syncFirebase.seedProductsBatch(products);
        }
      }
    });

    let unsubOrders = () => {};
    let unsubUsers = () => {};

    const subscribePrivateCollections = (firebaseUser: typeof auth.currentUser) => {
      unsubOrders();
      unsubUsers();

      if (!firebaseUser) {
        setCurrentUser(null);
        return;
      }

      void (async () => {
        const profile = await syncFirebase.getUser(firebaseUser.uid);
        if (profile) {
          setCurrentUser(profile);
        }
        if (isPrimaryAdmin(firebaseUser.uid)) {
          const adminProfile = profile
            ? { ...profile, role: 'admin' as const, email: firebaseUser.email || profile.email }
            : null;
          if (adminProfile) setCurrentUser(adminProfile);
          unsubUsers = syncFirebase.subscribeUsers((cloudUsers) => {
            setUsers(cloudUsers.map(user =>
              user.id === firebaseUser.uid
                ? { ...user, role: 'admin' as const }
                : user.role === 'admin'
                  ? { ...user, role: 'customer' as const }
                  : user
            ));
            setCloudSyncStatus('synced');
          });
        }
      })().catch((error) => {
        console.warn('No se pudo sincronizar el perfil; se mantiene la sesión local.', error);
      });

      // Customers receive only their orders; administrators receive all orders.
      unsubOrders = syncFirebase.subscribeOrders((cloudOrders) => {
        cloudOrders.forEach(order => {
          const prevStatus = prevOrdersRef.current[order.id];
          if (prevStatus && prevStatus !== order.status) {
            fcmService.notifyOrderStatusChange(order, order.status, {
              onInAppAlert: (payload) => setInAppPushNotification(payload)
            });
          }
          prevOrdersRef.current[order.id] = order.status;
        });

        setOrders(cloudOrders);
        setCloudSyncStatus('synced');
      });

    };

    const unsubAuth = firebaseAuthService.onAuthStateChanged(subscribePrivateCollections);

    // Subscribe to settings
    const unsubSettings = syncFirebase.subscribeSettings((cloudSettings) => {
      if (cloudSettings) {
        setStoreSettings(cloudSettings);
        setCloudSyncStatus('synced');
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubUsers();
      unsubSettings();
      unsubAuth();
    };
  }, []);

  // Persistence helpers
  useEffect(() => {
    localStorage.setItem('mishozuki_products_v67', JSON.stringify(products.filter(p => !DELETED_PRODUCT_IDS.has(p.id))));
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      // Link push notification device token to user account in Firestore
      fcmService.syncUserDeviceToken(currentUser.id, currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('asociados_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('asociados_settings_v2', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('asociados_factura_v1', JSON.stringify({ items: cart }));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('asociados_power_state', isPowerOn ? 'on' : 'off');
  }, [isPowerOn]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const togglePower = () => {
    setIsPowerOn(prev => !prev);
    if (navigator.vibrate) navigator.vibrate(15);
  };

  const saveNotes = (text: string) => {
    setNotes(text);
    localStorage.setItem('asociados_notas', text);
    showToast('Notas guardadas con éxito', 'success');
  };

  // Cart operations
  const addToCart = (id: string, qty: number = 1) => {
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + qty
    }));
    if (navigator.vibrate) navigator.vibrate(10);
    const prod = products.find(p => p.id === id);
    showToast(`Agregado: ${prod?.name || 'Producto'}`, 'info');
  };

  const updateCartQty = (id: string, qty: number) => {
    setCart(prev => {
      const next = { ...prev };
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
    showToast('Factura / Carrito vaciado', 'warning');
  };

  const cartCount = (Object.values(cart) as number[]).reduce((sum: number, n: number) => sum + n, 0);

  const cartItemsList: CartItem[] = Object.keys(cart)
    .map(id => {
      const product = products.find(p => p.id === id);
      if (!product) return null;
      return { product, quantity: cart[id] };
    })
    .filter(Boolean) as CartItem[];

  const cartTotal = cartItemsList.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Discount Calculation
  const discountAmount = appliedCoupon 
    ? (cartTotal * appliedCoupon.discountPercent) / 100 
    : 0;

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === cleanCode);

    if (!found) {
      return { success: false, message: 'El código de cupón no es válido o ha expirado.' };
    }

    if (found.minSpend && cartTotal < found.minSpend) {
      return { 
        success: false, 
        message: `Este cupón requiere una compra mínima de $${found.minSpend.toFixed(2)} USD.` 
      };
    }

    setAppliedCoupon(found);
    showToast(`¡Cupón "${found.code}" aplicado con éxito (${found.discountPercent}% OFF)!`, 'success');
    return { success: true, message: `Descuento del ${found.discountPercent}% aplicado.` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón de descuento removido', 'info');
  };

  // Product Reviews
  const getProductReviews = (productId: string): ProductReview[] => {
    return reviews.filter(r => r.productId === productId);
  };

  const addProductReview = (reviewData: Omit<ProductReview, 'id' | 'createdAt' | 'verified'>) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString(),
      verified: true
    };
    setReviews(prev => [newReview, ...prev]);
    showToast('¡Gracias por tu reseña y valoración!', 'success');
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
    if (navigator.vibrate) navigator.vibrate(12);
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = 'p-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const newProduct: Product = {
      ...prodData,
      id: newId,
      favorite: false
    };
    setProducts(prev => [newProduct, ...prev]);
    syncFirebase.saveProduct(newProduct);
    showToast('Producto agregado al catálogo', 'success');
  };

  const addProductsBatch = (productsList: Omit<Product, 'id'>[]) => {
    if (!productsList || productsList.length === 0) return;
    
    const timestamp = Date.now();
    const created: Product[] = productsList.map((p, idx) => ({
      ...p,
      id: `p-imp-${timestamp}-${idx}-${Math.floor(Math.random() * 1000)}`,
      favorite: p.favorite ?? false,
      stock: p.stock ?? 10
    }));

    setProducts(prev => [...created, ...prev]);
    syncFirebase.seedProductsBatch(created);
    
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`¡${created.length} productos importados y agregados al catálogo con éxito!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          syncFirebase.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
    showToast('Producto actualizado', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    syncFirebase.deleteProduct(id);
    removeFromCart(id);
    showToast('Producto eliminado del catálogo', 'warning');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, stock: Math.max(0, newStock) };
          syncFirebase.saveProduct(updated);
          return updated;
        }
        return p;
      })
    );
  };

  // Auth Operations
  const login = (email: string, password?: string): { success: boolean; message?: string } => {
    void email;
    void password;
    return {
      success: false,
      message: 'El inicio de sesión requiere una cuenta autenticada en Firebase.'
    };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; message?: string }> => {
    const res = await firebaseAuthService.signInWithGoogle();
    if (!res.success || !res.user) {
      return { success: false, message: res.error || 'No se pudo iniciar sesión con Google.' };
    }

    const fbUser = res.user;
    const cleanEmail = (fbUser.email || '').trim().toLowerCase();
    
    // Check if user already exists in Firestore/users list
    let existing = await syncFirebase.getUser(fbUser.uid);
    if (existing) {
      if (existing.status === 'inactive') {
        await firebaseAuthService.signOut();
        return { success: false, message: 'Esta cuenta ha sido desactivada por administración.' };
      }
      if (fbUser.photoURL && existing.avatar !== fbUser.photoURL) {
        existing = { ...existing, avatar: fbUser.photoURL };
        syncFirebase.saveUser(existing);
      }
      setCurrentUser(existing);
      showToast(`¡Bienvenido de nuevo, ${existing.name}!`, 'success');
      return { success: true };
    }

    // New Google user: create user in system
    const [firstName, ...restName] = (fbUser.displayName || 'Usuario').split(' ');
    const lastName = restName.join(' ');
    const newUser: User = {
      id: fbUser.uid || ('u-' + Date.now()),
      name: fbUser.displayName || 'Usuario Google',
      firstName: firstName || 'Usuario',
      lastName: lastName || '',
      email: cleanEmail,
      role: 'customer',
      avatar: fbUser.photoURL || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      phone: fbUser.phoneNumber || '',
      whatsapp: fbUser.phoneNumber || '',
      country: 'Cuba / Internacional',
      cedula: '',
      createdAt: new Date().toISOString(),
      status: 'active',
      travelerProfile: ['profesional'],
      preferences: {
        alertasClima: true,
        sincronizacionTriplet: true,
        notificacionesEmail: true
      }
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    try {
      await syncFirebase.saveUser(newUser);
    } catch (error) {
      await firebaseAuthService.signOut();
      setUsers(prev => prev.filter(user => user.id !== newUser.id));
      setCurrentUser(null);
      console.error('No se pudo crear el perfil de Google en Firestore.', error);
      return {
        success: false,
        message: 'Google inició sesión, pero no se pudo guardar el perfil. Verifica las reglas de Firestore e inténtalo de nuevo.'
      };
    }

    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch {}

    showToast(`¡Bienvenido a Mishozuki, ${newUser.name}!`, 'success');
    return { success: true };
  };

  const loginWithFirebaseEmail = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Try Firebase Email Auth first
    if (password && password.length >= 8) {
      const fbRes = await firebaseAuthService.signInWithEmail(email, password);
      if (fbRes.success && fbRes.user) {
        const cleanEmail = email.trim().toLowerCase();
        let existing = await syncFirebase.getUser(fbRes.user.uid);
        if (existing) {
          setCurrentUser(existing);
          showToast(`¡Bienvenido, ${existing.name}!`, 'success');
          return { success: true };
        }

        const firebaseUser: User = {
          id: fbRes.user.uid,
          name: fbRes.user.displayName || cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'customer',
          avatar: fbRes.user.photoURL || '',
          phone: fbRes.user.phoneNumber || '',
          whatsapp: fbRes.user.phoneNumber || '',
          country: '',
          createdAt: new Date().toISOString(),
          status: 'active',
          preferences: {
            alertasClima: true,
            sincronizacionTriplet: true,
            notificacionesEmail: true
          }
        };

        setUsers(prev => [firebaseUser, ...prev]);
        setCurrentUser(firebaseUser);
        try {
          await syncFirebase.saveUser(firebaseUser);
        } catch (error) {
          console.warn('La sesión inició correctamente, pero el perfil no pudo sincronizarse.', error);
        }
        showToast(`¡Bienvenido, ${firebaseUser.name}!`, 'success');
        return { success: true };
      } else if (fbRes.error && !fbRes.error.includes('incorrectos')) {
        // Only return if it's not a generic credential error (which could be a demo account)
      }
    }
    return {
      success: false,
      message: 'No se pudo iniciar sesión con Firebase. Verifica el correo y la contraseña.'
    };
  };

  const sendPasswordReset = async (email: string): Promise<{ success: boolean; message?: string }> => {
    const result = await firebaseAuthService.sendPasswordReset(email);
    return result.success
      ? { success: true, message: 'Revisa tu correo para restablecer la contraseña.' }
      : { success: false, message: result.error || 'No se pudo recuperar la contraseña.' };
  };

  const register = async (userData: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    role?: Role;
    phone?: string;
    whatsapp?: string;
    country?: string;
    cedula?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!isPrimaryAdmin(auth.currentUser?.uid)) {
      return { success: false, message: 'Solo el administrador principal puede crear usuarios.' };
    }
    const password = userData.password || '';
    if (password.length < 8) {
      return { success: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    }
    const email = userData.email.trim().toLowerCase();
    const result = await firebaseAuthService.createUserAsAdmin(
      email,
      password,
      userData.name.trim()
    );
    if (!result.success || !result.user) {
      return { success: false, message: result.error };
    }
    const profile: User = {
      id: result.user.uid,
      name: userData.name.trim(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email,
      role: userData.role === 'seller' ? 'seller' : 'customer',
      avatar: '',
      phone: userData.phone || '',
      whatsapp: userData.phone || '',
      country: userData.country || '',
      cedula: userData.cedula || '',
      createdAt: new Date().toISOString(),
      status: 'active',
      preferences: {
        alertasClima: true,
        sincronizacionTriplet: true,
        notificacionesEmail: true
      }
    };
    try {
      await syncFirebase.saveUser(profile);
      // Re-read the authoritative collection so deleted local profiles cannot
      // be reintroduced when a new account is created.
      const cloudUsers = await syncFirebase.getUsers();
      setUsers(cloudUsers);
      showToast('Usuario creado en Firebase y Firestore.', 'success');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error
          ? `La cuenta de Firebase se creó, pero el perfil no pudo guardarse: ${error.message}`
          : 'La cuenta se creó, pero el perfil no pudo guardarse.'
      };
    }
  };

  const registerWithFirebaseEmail = async (userData: {
    name: string;
    firstName?: string;
    lastName?: string;
    email: string;
    password?: string;
    role?: Role;
    phone?: string;
    whatsapp?: string;
    country?: string;
    cedula?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (userData.password && userData.password.length >= 8) {
      const fbRes = await firebaseAuthService.registerWithEmail(userData.email, userData.password, userData.name);
      if (fbRes.success && fbRes.user) {
        await firebaseAuthService.signOut();
        showToast('Cuenta creada. Revisa tu correo para verificarla antes de iniciar sesión.', 'success');
        return {
          success: true,
          message: 'Te enviamos un enlace de verificación. Confirma tu correo antes de iniciar sesión.'
        };
      }

      if (!fbRes.success) {
        return { success: false, message: fbRes.error || 'No se pudo crear la cuenta en Firebase.' };
      }
    }
    return {
      success: false,
      message: 'Debes crear la cuenta con una contraseña válida de Firebase.'
    };
  };

  const logout = () => {
    firebaseAuthService.signOut();
    setCurrentUser(null);
    setViewMode('catalog');
    showToast('Sesión cerrada correctamente', 'info');
  };

  const refreshUsers = async (): Promise<{ success: boolean; message?: string }> => {
    if (currentUser?.role !== 'admin' || !auth.currentUser) {
      return { success: false, message: 'Solo un administrador autenticado puede cargar usuarios.' };
    }

    try {
      const cloudUsers = await syncFirebase.getUsers();
      setUsers(cloudUsers);
      setCloudSyncStatus('synced');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudieron cargar los usuarios.';
      return { success: false, message };
    }
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    syncFirebase.saveUser(updated);
    showToast('Perfil actualizado correctamente', 'success');
  };

  const updateUserRole = (userId: string, role: Role) => {
    if (currentUser?.role !== 'admin' || !auth.currentUser) {
      showToast('Solo un administrador puede cambiar roles.', 'warning');
      return;
    }

    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, role };
        syncFirebase.saveUser(updated);
        return updated;
      }
      return u;
    }));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role } : null);
    }
    showToast('Rol de usuario modificado', 'info');
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'inactive' : 'active';
          const updated = { ...u, status: newStatus };
          syncFirebase.saveUser(updated);
          return updated;
        }
        return u;
      })
    );
    showToast('Estado del usuario actualizado', 'info');
  };

  const deleteUser = async (userId: string): Promise<{ success: boolean; message?: string }> => {
    if (!isPrimaryAdmin(auth.currentUser?.uid)) {
      const message = 'Solo el administrador principal puede eliminar usuarios.';
      showToast(message, 'warning');
      return { success: false, message };
    }
    try {
      await syncFirebase.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      showToast('Perfil eliminado y excluido de futuras sincronizaciones.', 'warning');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo eliminar el perfil.';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  // Orders
  const createOrder = (customerData: {
    name: string;
    email: string;
    phone?: string;
    paymentMethod: Order['paymentMethod'];
    notes?: string;
  }): Order => {
    const orderItems = cartItemsList.map(item => ({
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      sku: item.product.sku,
      price: item.product.price,
      quantity: item.quantity,
      subtotal: item.product.price * item.quantity
    }));

    const discountedSubtotal = Math.max(0, cartTotal - discountAmount);
    const taxAmount = (discountedSubtotal * (storeSettings.taxRate || 0)) / 100;
    const finalTotal = discountedSubtotal + taxAmount;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: `FAC-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      userId: currentUser?.id,
      customerName: customerData.name || currentUser?.name || 'Cliente Mostrador',
      customerEmail: customerData.email || currentUser?.email || 'cliente@business.com',
      customerPhone: customerData.phone || currentUser?.phone || '',
      items: orderItems,
      subtotal: cartTotal,
      discount: discountAmount > 0 ? discountAmount : undefined,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
      tax: taxAmount,
      total: finalTotal,
      status: 'pendiente',
      paymentMethod: customerData.paymentMethod || 'efectivo',
      createdAt: new Date().toISOString(),
      notes: customerData.notes || ''
    };

    // Decrease stock of purchased items
    setProducts(prev =>
      prev.map(p => {
        const inCart = cart[p.id];
        if (inCart) {
          return { ...p, stock: Math.max(0, (p.stock ?? 10) - inCart) };
        }
        return p;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    syncFirebase.saveOrder(newOrder);
    clearCart();
    setAppliedCoupon(null);

    // Award loyalty points to user
    if (currentUser) {
      const earnedPoints = Math.floor(finalTotal);
      if (earnedPoints > 0) {
        addPointsToUser(earnedPoints);
      }
    }

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    showToast(`¡Factura ${newOrder.orderNumber} generada con éxito!`, 'success');
    return newOrder;
  };

  const addPointsToUser = (amount: number) => {
    if (!currentUser) return;
    const newPoints = (currentUser.points || 0) + amount;
    let newLevel: User['membershipLevel'] = currentUser.membershipLevel || 'bronce';
    if (newPoints >= 1000) newLevel = 'platino';
    else if (newPoints >= 500) newLevel = 'oro';
    else if (newPoints >= 200) newLevel = 'plata';
    else newLevel = 'bronce';

    const updated = {
      ...currentUser,
      points: newPoints,
      membershipLevel: newLevel
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    syncFirebase.saveUser(updated);
    showToast(`+${amount} Puntos VIP añadidos a tu cuenta`, 'success');
  };

  const redeemRewardPoints = (pointsCost: number, rewardTitle: string, generatedCoupon?: Coupon): boolean => {
    if (!currentUser) {
      showToast('Debes iniciar sesión para canjear recompensas', 'error');
      return false;
    }
    const currentPoints = currentUser.points || 0;
    if (currentPoints < pointsCost) {
      showToast(`Puntos insuficientes (${currentPoints}/${pointsCost} pts)`, 'warning');
      return false;
    }

    const newPoints = currentPoints - pointsCost;
    const updated = {
      ...currentUser,
      points: newPoints
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    syncFirebase.saveUser(updated);

    if (generatedCoupon) {
      setCoupons(prev => [generatedCoupon, ...prev]);
    }

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 }
      });
    } catch {
      // ignore
    }

    showToast(`¡Recompensa "${rewardTitle}" canjeada con éxito!`, 'success');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const targetOrder = orders.find(o => o.id === orderId);
    setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    syncFirebase.updateOrderStatus(orderId, status);
    
    if (targetOrder) {
      const updatedOrder = { ...targetOrder, status };
      fcmService.notifyOrderStatusChange(updatedOrder, status, {
        onInAppAlert: (payload) => setInAppPushNotification(payload)
      });
      showToast(`🔔 Pedido ${targetOrder.orderNumber}: Estado actualizado y notificación Push enviada`, 'success');
    } else {
      showToast('Estado del pedido actualizado', 'info');
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    syncFirebase.deleteOrder(orderId);
    showToast('Pedido eliminado del registro', 'warning');
  };

  const updateStoreSettings = (updates: Partial<StoreSettings>) => {
    const updated = { ...storeSettings, ...updates };
    setStoreSettings(updated);
    syncFirebase.saveSettings(updated);
    showToast('Configuraciones comerciales guardadas', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        isCloudSynced,
        cloudSyncStatus,
        isPushSupported,
        pushPermissionStatus,
        inAppPushNotification,
        requestPushPermission,
        sendTestPushNotification,
        dismissInAppPushNotification,
        notifyOrderPush,
        products,
        currentSection,
        setCurrentSection,
        currentFilter,
        setCurrentFilter,
        searchQuery,
        setSearchQuery,
        addProduct,
        addProductsBatch,
        updateProduct,
        deleteProduct,
        toggleFavorite,
        updateStock,
        activeCurrency,
        setActiveCurrency,
        formatCurrency,
        convertCurrency,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        cartItemsList,
        appliedCoupon,
        coupons,
        applyCoupon,
        removeCoupon,
        discountAmount,
        reviews,
        getProductReviews,
        addProductReview,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        currentUser,
        users,
        refreshUsers,
        login,
        loginWithGoogle,
        loginWithFirebaseEmail,
        sendPasswordReset,
        register,
        registerWithFirebaseEmail,
        logout,
        updateCurrentUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser,
        viewMode,
        setViewMode,
        adminTab,
        setAdminTab,
        isPowerOn,
        togglePower,
        notes,
        saveNotes,
        storeSettings,
        updateStoreSettings,
        closeAllModals,
        authModalOpen,
        setAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        cartModalOpen,
        setCartModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        calcModalOpen,
        setCalcModalOpen,
        notesModalOpen,
        setNotesModalOpen,
        policiesModalOpen,
        setPoliciesModalOpen,
        trackingModalOpen,
        setTrackingModalOpen,
        membershipModalOpen,
        setMembershipModalOpen,
        qrScannerOpen,
        setQrScannerOpen,
        
        
        gmailModalOpen,
        setGmailModalOpen,
        aiAssistantOpen,
        setAiAssistantOpen,
        aiInitialQuery,
        setAiInitialQuery,
        openAiAssistantWithQuery,
        addPointsToUser,
        redeemRewardPoints,
        selectedProduct,
        setSelectedProduct,
        selectedOrder,
        setSelectedOrder,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
