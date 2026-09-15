import { Product, StoreSettings, User, Order, Coupon, ProductReview } from '../types';
import { mishozukiFullProducts } from './mishozukiCatalog';
import { megaproHardwareProducts } from './megaproCatalog';
import { impegniProducts } from './impegniCatalog';
import { klgoProducts } from './klgoCatalog';
import { greenproProducts } from './greenproCatalog';
import { nuevoProducts } from './nuevoCatalog';
import { bolsosProducts, filtrosAguaProducts } from './bolsosYFiltrosCatalog';

export const initialCoupons: Coupon[] = [
  {
    code: 'DESCUENTO10',
    discountPercent: 10,
    description: '10% de descuento en toda la tienda',
    minSpend: 50
  },
  {
    code: 'BIENVENIDO',
    discountPercent: 15,
    description: '15% de descuento especial de bienvenida',
    minSpend: 100
  },
  {
    code: 'PROMO20',
    discountPercent: 20,
    description: '20% de descuento en compras superiores a $300',
    minSpend: 300
  }
];

export const initialReviews: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'mzk_1',
    userName: 'Manuel Rodríguez',
    rating: 5,
    comment: 'Excelente calidad de materiales, el producto llegó antes de lo esperado y funciona perfecto.',
    createdAt: '2025-02-18T10:30:00.000Z',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'mzk_1',
    userName: 'Carla Morales',
    rating: 5,
    comment: 'Completamente satisfecho con la compra y el soporte por WhatsApp. Recomendado 100%.',
    createdAt: '2025-02-21T14:15:00.000Z',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'mzk_20',
    userName: 'Roberto Díaz',
    rating: 5,
    comment: 'La batería tiene un rendimiento formidable y el cargador inteligente corta exacto.',
    createdAt: '2025-02-24T19:00:00.000Z',
    verified: true
  }
];

export const initialProducts: Product[] = [
  ...megaproHardwareProducts, 
  ...mishozukiFullProducts, 
  ...impegniProducts, 
  ...klgoProducts, 
  ...greenproProducts, 
  ...nuevoProducts,
  ...bolsosProducts,
  ...filtrosAguaProducts
];

export const initialUsers: User[] = [
  {
    id: 'u-seller-1',
    name: 'Elena Ramos (Ventas)',
    firstName: 'Elena',
    lastName: 'Ramos',
    email: 'ventas@business.com',
    role: 'seller',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '+34 689 123 456',
    whatsapp: '+34 689 123 456',
    country: 'España',
    cedula: '38192044-P',
    pasaporte: 'PA-ES-7129034',
    gender: 'femenino',
    userNumber: 'USR-00102',
    createdAt: '2025-02-01T14:30:00.000Z',
    status: 'active',
    travelerProfile: ['minimalista'],
    preferences: {
      alertasClima: false,
      sincronizacionTriplet: true,
      notificacionesEmail: true
    }
  },
  {
    id: 'u-client-1',
    name: 'Juan Pérez',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'cliente@business.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+34 655 987 654',
    whatsapp: '+34 655 987 654',
    country: 'España',
    cedula: '52893012-M',
    pasaporte: 'PA-ES-6301982',
    gender: 'masculino',
    userNumber: 'USR-00103',
    createdAt: '2025-02-15T09:15:00.000Z',
    status: 'active',
    points: 450,
    membershipLevel: 'oro',
    referralCode: 'VIP-JUAN-772',
    travelerProfile: ['minimalista', 'preparado'],
    preferences: {
      alertasClima: true,
      sincronizacionTriplet: false,
      notificacionesEmail: true
    }
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'FAC-2025-001',
    userId: 'u-client-1',
    customerName: 'Juan Pérez',
    customerEmail: 'cliente@business.com',
    customerPhone: '+34 655 987 654',
    items: [
      {
        productId: 'mzk_1',
        productName: 'MOTOCICLETA ELÉCTRICA MISHOZUKI COYOTE2 LT PO4 40AH',
        brand: 'MISHOZUKI',
        sku: 'MSK-1000',
        price: 1300.00,
        quantity: 1,
        subtotal: 1300.00
      },
      {
        productId: 'mzk_9',
        productName: 'ABANICO RECARGABLE 16 LITHIUM',
        brand: 'MISHOZUKI',
        sku: 'MSK-1008',
        price: 35.00,
        quantity: 2,
        subtotal: 70.00
      }
    ],
    subtotal: 1370.00,
    tax: 0,
    total: 1370.00,
    status: 'completada',
    paymentMethod: 'transferencia',
    createdAt: '2025-02-20T16:40:00.000Z',
    notes: 'Entregar en horario de mañana.'
  },
  {
    id: 'ord-1002',
    orderNumber: 'FAC-2025-002',
    customerName: 'María Gómez',
    customerEmail: 'maria.g@correo.com',
    customerPhone: '+34 611 223 344',
    items: [
      {
        productId: 'mzk_3',
        productName: 'SCOOTER ELÉCTRICO MISHOZUKI NEW BIG SHARK-2 PRO ION 45AH',
        brand: 'MISHOZUKI',
        sku: 'MSK-1002',
        price: 1450.00,
        quantity: 1,
        subtotal: 1450.00
      }
    ],
    subtotal: 1450.00,
    tax: 0,
    total: 1450.00,
    status: 'despachada',
    paymentMethod: 'tarjeta',
    createdAt: '2025-02-23T11:15:00.000Z',
    notes: 'Pedido web directo con entrega programada.'
  },
  {
    id: 'ord-1003',
    orderNumber: 'FAC-2025-003',
    customerName: 'Taller San José',
    customerEmail: 'tallersanjose@gmail.com',
    customerPhone: '+34 677 889 900',
    items: [
      {
        productId: 'mzk_20',
        productName: 'BATERÍA 72V 35AH LITHIUM+CARGADOR KIT MISHOZUKI',
        brand: 'MISHOZUKI',
        sku: 'MSK-1019',
        price: 490.00,
        quantity: 2,
        subtotal: 980.00
      }
    ],
    subtotal: 980.00,
    tax: 0,
    total: 980.00,
    status: 'pendiente',
    paymentMethod: 'efectivo',
    createdAt: '2025-02-25T18:20:00.000Z',
    notes: 'Pago contra entrega en taller.'
  }
];

export const initialStoreSettings: StoreSettings = {
  storeName: 'BUSINESS',
  storeSubtitle: 'ASOCIADOS',
  promoBanner: '¡MIRA ESTO!',
  phone: '+1 (786) 555-0199',
  whatsapp: '+1 (786) 555-0199',
  email: 'ventas@businessasociados.com',
  address: 'Distribución Nacional & Almacén Central',
  taxRate: 0,
  currency: 'USD',
  currencyRates: {
    USD: 1.0,
    EUR: 0.92,
    CUP: 320.0,
    MLC: 1.15
  },
  minStockAlert: 5,
  policies: {
    devoluciones: 'Se aceptan devoluciones y cambios dentro de los 30 días posteriores a la entrega presentando el comprobante oficial.',
    garantia: 'Garantía oficial directa en baterías de litio, chasis, motores brushless y controladores.',
    envios: 'Envíos rápidos a todo el país con entrega estimada en 24 a 48 horas.',
    pagos: 'Aceptamos pagos en Efectivo (tienda/contra entrega), Western Union (remesas), Zelle y Transferencias bancarias.',
    facturacion: 'Factura y certificado de importación oficial por cada vehículo y batería adquirida.'
  },
  paymentInstructions: {
    zelle: {
      email: 'pagos@businessasociados.com',
      holder: 'Business Asociados LLC',
      note: 'Colocar en la nota el número de factura o su nombre completo.'
    },
    westernUnion: {
      receiver: 'Alejandro Valdés Rodríguez',
      cityCountry: 'La Habana, Cuba / Miami FL, USA',
      idNumber: 'ID: 881024-91230',
      note: 'Enviar foto del comprobante con el código MTCN de 10 dígitos por WhatsApp.'
    },
    transferencia: {
      bankName: 'Banco Metropolitano / Banco Internacional',
      accountNumber: '9224 8812 0041 5590',
      holder: 'Business Asociados S.R.L.',
      note: 'Enviar captura del comprobante bancario a nuestro WhatsApp oficial.'
    },
    efectivo: {
      instructions: 'Pago contra entrega al mensajero o directo en caja de almacén central.',
      currencies: 'Aceptamos USD, EUR, CUP (Tasa del día) y MLC.'
    }
  }
};

export const sectionSubcategories: Record<string, { label: string; value: string }[]> = {
  favoritos: [{ label: 'Todas', value: 'all' }],
  nuevo: [
    { label: 'Todas', value: 'all' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' }
  ],
  vehiculos: [
    { label: 'Todas', value: 'all' },
    { label: 'Moto Eléctrica', value: 'moto_electrica' },
    { label: 'Bicimoto', value: 'bicimoto' },
    { label: 'Triciclo', value: 'triciclo' },
    { label: 'Scooter Eléctrico', value: 'scooter_electrico' }
  ],
  respuestos_motos: [
    { label: 'Todas', value: 'all' },
    { label: 'Neumáticos', value: 'neumaticos' },
    { label: 'Amortiguadores', value: 'amortiguadores' },
    { label: 'Tornillos Robóticos', value: 'tornillos_roboticos' },
    { label: 'Rodamientos', value: 'rodamientos' },
    { label: 'Frenos', value: 'frenos' },
    { label: 'Respuestos Plásticos', value: 'respuestos_plasticos' },
    { label: 'Puño de Acelerador', value: 'puno_acelerador' },
    { label: 'Motor CC', value: 'motor_cc' },
    { label: 'Extensor de Rango', value: 'extensor_rango' }
  ],
  ferreteria: [
    { label: 'Todas', value: 'all' },
    { label: 'Cerraduras & Llavines', value: 'llavin_yale' },
    { label: 'Grifos [Plumas]', value: 'grifos_plumas' },
    { label: 'Plomería', value: 'plomeria' },
    { label: 'Eléctrico', value: 'electrico' },
    { label: 'Breke', value: 'breke' },
    { label: 'Cable', value: 'cable' },
    { label: 'Alarmas', value: 'alarmas' },
    { label: 'Compresores', value: 'compresores' },
    { label: 'Controladores Eléctricos', value: 'controladores_electricos' },
    { label: 'Ducha Eléctrica', value: 'ducha_electrica' },
    { label: 'Ducha / Cabezal', value: 'ducha_cabezal' },
    { label: 'Cocina', value: 'cocina' },
    { label: 'Filtros de Agua', value: 'filtros_agua' },
    { label: 'Clima & Split', value: 'clima' },
    { label: 'Herramientas', value: 'herramientas' }
  ],
  calzado: [
    { label: 'Todas', value: 'all' },
    { label: 'Deportivo', value: 'deportivo' },
    { label: 'Formal', value: 'formal' },
    { label: 'Casual', value: 'casual' },
    { label: 'Botas', value: 'botas' }
  ],
  baterias: [
    { label: 'Todas', value: 'all' },
    { label: 'Baterías Litio (72V/60V/48V)', value: 'bateria_moto' },
    { label: 'Baterías LiFePO4', value: 'bateria_lipo4' },
    { label: 'Baterías Gel', value: 'bateria_gel' },
    { label: 'Cargadores', value: 'cargadores' }
  ],
  ropa: [
    { label: 'Todas', value: 'all' },
    { label: 'Hombre', value: 'hombre' },
    { label: 'Mujer', value: 'mujer' },
    { label: 'Niños', value: 'niños' },
    { label: 'Deportiva', value: 'deportiva' }
  ],
  ventiladores: [
    { label: 'Todas', value: 'all' },
    { label: 'Recargables Litio', value: 'recargable' },
    { label: 'Con Panel Solar', value: 'solar' },
    { label: 'De Pedestal', value: 'pedestal' },
    { label: 'De Mesa', value: 'mesa' }
  ],
  bicicletas: [
    { label: 'Todas', value: 'all' },
    { label: 'Pedales', value: 'pedales' },
    { label: 'Accesorios', value: 'accesorios' },
    { label: 'Repuestos Eléctricos', value: 'repuestos_electricos' },
    { label: 'Piezas & Asientos', value: 'piezas_bici' }
  ],
  bolsos: [
    { label: 'Todas', value: 'all' },
    { label: 'Mochilas', value: 'mochilas' },
    { label: 'Bolsos de Mano', value: 'bolsos_mano' },
    { label: 'Bandoleras', value: 'bandoleras' },
    { label: 'Bolsos Deportivos', value: 'bolsos_deportivos' },
    { label: 'Maletines', value: 'maletines' }
  ],
  filtros_agua: [
    { label: 'Todas', value: 'all' },
    { label: 'Purificadores de Grifo', value: 'purificadores_grifo' },
    { label: 'Ósmosis Inversa', value: 'osmosis_inversa' },
    { label: 'Cartuchos & Repuestos', value: 'cartuchos_repuestos' },
    { label: 'Filtros de Sedimento', value: 'filtros_sedimento' },
    { label: 'Dispensadores', value: 'dispensadores' }
  ]
};

export const sectionLabels: Record<string, string> = {
  favoritos: 'Favoritos',
  nuevo: 'Nuevo',
  vehiculos: 'Vehículos',
  respuestos_motos: 'Respuestos de Motos',
  ferreteria: 'Ferretería',
  calzado: 'Calzado',
  baterias: 'Baterías',
  ropa: 'Ropa',
  bolsos: 'Bolsos',
  filtros_agua: 'Filtros de Agua',
  ventiladores: 'Ventiladores',
  bicicletas: 'Bicicletas'
};

export const sectionOrder = [
  'favoritos',
  'nuevo',
  'vehiculos',
  'respuestos_motos',
  'ferreteria',
  'calzado',
  'baterias',
  'ropa',
  'bolsos',
  'filtros_agua',
  'ventiladores',
  'bicicletas'
];
