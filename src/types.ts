export type Role = 'admin' | 'seller' | 'customer';
export type CurrencyType = 'USD' | 'EUR' | 'CUP' | 'MLC';

export interface User {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  whatsapp?: string;
  country?: string;
  cedula?: string;
  pasaporte?: string;
  gender?: 'masculino' | 'femenino' | 'otro' | 'no_especificado' | string;
  userNumber?: string;
  createdAt: string;
  status: 'active' | 'inactive';
  deletedAt?: string;
  points?: number;
  membershipLevel?: 'bronce' | 'plata' | 'oro' | 'platino';
  referralCode?: string;
  referredBy?: string;
  travelerProfile?: string[];
  preferences?: {
    alertasClima?: boolean;
    sincronizacionTriplet?: boolean;
    notificacionesEmail?: boolean;
    notificacionesPush?: boolean;
    [key: string]: boolean | undefined;
  };
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  orderId?: string;
  orderNumber?: string;
  newStatus?: Order['status'];
  icon?: string;
  url?: string;
  timestamp: string;
  read?: boolean;
}

export interface FCMTokenRecord {
  token: string;
  userId?: string;
  userEmail?: string;
  device: string;
  isMobile?: boolean;
  platform?: 'android' | 'ios' | 'desktop' | 'pwa';
  model?: string;
  createdAt?: string;
  updatedAt: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

export interface Coupon {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
  category: string;
  section: string;
  brand: string;
  sku: string;
  specs: Record<string, string>;
  image: string;
  favorite?: boolean;
  stock?: number;
  minStock?: number;
  description?: string;
  variants?: {
    colors?: string[];
    capacities?: string[];
  };
  rating?: number;
  reviewsCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  couponCode?: string;
  tax: number;
  total: number;
  currency?: CurrencyType;
  exchangeRate?: number;
  status: 'completada' | 'pendiente' | 'despachada' | 'cancelada';
  paymentMethod: 'efectivo' | 'western_union' | 'zelle' | 'transferencia' | 'tarjeta' | 'credito';
  createdAt: string;
  notes?: string;
}

export interface StoreSettings {
  storeName: string;
  storeSubtitle: string;
  promoBanner: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  taxRate: number; // percentage, e.g. 0 or 16
  currency: CurrencyType;
  currencyRates: Record<CurrencyType, number>;
  minStockAlert: number;
  policies: {
    devoluciones: string;
    garantia: string;
    envios: string;
    pagos: string;
    facturacion: string;
  };
  paymentInstructions?: {
    zelle: {
      email: string;
      holder: string;
      note: string;
    };
    westernUnion: {
      receiver: string;
      cityCountry: string;
      idNumber: string;
      note: string;
    };
    transferencia: {
      bankName: string;
      accountNumber: string;
      holder: string;
      note: string;
    };
    efectivo: {
      instructions: string;
      currencies: string;
    };
  };
}
