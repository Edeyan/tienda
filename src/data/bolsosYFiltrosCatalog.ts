import { Product } from '../types';

export const bolsosProducts: Product[] = [
  {
    id: 'bolso_1',
    name: 'Mochila Ejecutiva Impermeable Antirrobo con Puerto USB',
    price: 38.50,
    costPrice: 22.00,
    category: 'mochilas',
    section: 'bolsos',
    brand: 'SwissGear Pro',
    sku: 'BG-MCH-USB01',
    specs: {
      'Capacidad': '25 Litros',
      'Material': 'Oxford 900D impermeable y antirasgaduras',
      'Compatibilidad': 'Laptops de hasta 15.6 pulgadas',
      'Conectividad': 'Puerto exterior de carga USB',
      'Seguridad': 'Bolsillo trasero oculto antirrobo'
    },
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    stock: 45,
    description: 'Mochila ejecutiva impermeable de alta resistencia con compartimento acolchado para laptop, puerto de carga USB exterior y cremalleras selladas contra la intemperie.'
  },
  {
    id: 'bolso_2',
    name: 'Bolso Tote de Cuero Sintético Premium para Dama',
    price: 29.99,
    costPrice: 17.50,
    category: 'bolsos_mano',
    section: 'bolsos',
    brand: 'Moda Urbana',
    sku: 'BG-TOT-LAD02',
    specs: {
      'Material': 'Cuero sintético PU de alta gama',
      'Dimensiones': '38cm x 28cm x 13cm',
      'Cierre': 'Cremallera superior de metal reforzado',
      'Color': 'Negro clásico con herrajes dorados'
    },
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 30,
    description: 'Elegante bolso tote para uso diario o profesional con amplios compartimentos internos, forro suave satinado y bolsillos para celular y cosméticos.'
  },
  {
    id: 'bolso_3',
    name: 'Bandolera Táctica Cruzada de Hombro Compacta',
    price: 18.50,
    costPrice: 9.80,
    category: 'bandoleras',
    section: 'bolsos',
    brand: 'Tactical Gear',
    sku: 'BG-BND-TAC03',
    specs: {
      'Material': 'Nylon balístico 1000D resistente al agua',
      'Correa': 'Ajustable y desmontable ambidiestra',
      'Bolsillos': '4 compartimentos con cierre militar',
      'Uso': 'Urbano, viajes y senderismo rápido'
    },
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 60,
    description: 'Bandolera cruzada compacta y funcional diseñada para llevar llaves, billetera, pasaporte y móvil con total seguridad y comodidad.'
  },
  {
    id: 'bolso_4',
    name: 'Bolso Deportivo Duffel de Gimnasio con Zapatero Separado',
    price: 26.00,
    costPrice: 14.20,
    category: 'bolsos_deportivos',
    section: 'bolsos',
    brand: 'AeroSport',
    sku: 'BG-DUF-GYM04',
    specs: {
      'Capacidad': '35 Litros',
      'Zapatero': 'Compartimento lateral independiente con ventilación',
      'Bolsillo Húmedo': 'Separador impermeable para ropa mojada',
      'Asas': 'Doble asa de mano + correa de hombro acolchada'
    },
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    stock: 35,
    description: 'Bolso deportivo completo para fitness, natación o viajes cortos de fin de semana con área impermeable y zapatero separado.'
  },
  {
    id: 'bolso_5',
    name: 'Maletín Portadocumentos Ejecutivo para Laptop 15.6"',
    price: 34.00,
    costPrice: 19.50,
    category: 'maletines',
    section: 'bolsos',
    brand: 'Bantex Executive',
    sku: 'BG-MAL-EJEC05',
    specs: {
      'Material': 'Poliéster jacquard repelente al agua',
      'Protección': 'Espuma EVA absorbente de impactos 360°',
      'Capacidad': 'Laptop 15.6" + Tablet + Carpetas A4',
      'Fijación': 'Banda trasera para anclar a maleta de ruedas'
    },
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 25,
    description: 'Maletín profesional de oficina de perfil estilizado con compartimento acolchado para notebook y organizador de cables y bolígrafos.'
  },
  {
    id: 'bolso_6',
    name: 'Mochila de Senderismo y Trekking Ergonómica 45L',
    price: 46.00,
    costPrice: 28.00,
    category: 'mochilas',
    section: 'bolsos',
    brand: 'Mountain Peak',
    sku: 'BG-MCH-TRK06',
    specs: {
      'Capacidad': '45 Litros',
      'Espaldar': 'Malla ergonómica con circulación de aire',
      'Protección': 'Cubremochila impermeable incluido en la base',
      'Cinturón': 'Acolchado con bolsillos rápidos para móvil'
    },
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 20,
    description: 'Mochila de gran capacidad para expediciones, viajes y campismo con distribución equilibrada de peso y correas de compresión.'
  }
];

export const filtrosAguaProducts: Product[] = [
  {
    id: 'filtro_1',
    name: 'Purificador de Agua para Grifo con Filtro Cerámico de 7 Capas',
    price: 22.50,
    costPrice: 11.50,
    category: 'purificadores_grifo',
    section: 'filtros_agua',
    brand: 'AquaPure Pro',
    sku: 'FLT-GRF-CER01',
    specs: {
      'Filtración': '7 capas (Cerámica diatomea, carbón activado, sulfito de calcio)',
      'Instalación': 'Directa al grifo con adaptadores universales incluidos',
      'Rendimiento': 'Hasta 1,500 litros de agua pura filtrada',
      'Selector': 'Palanca de 2 vías: agua purificada o agua común para lavado'
    },
    image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    stock: 80,
    description: 'Purificador de montaje rápido en grifos de cocina. Elimina cloro residual, óxido, parásitos, metales pesados y malos sabores al instante.'
  },
  {
    id: 'filtro_2',
    name: 'Sistema de Purificación por Ósmosis Inversa Residencial 5 Etapas',
    price: 165.00,
    costPrice: 110.00,
    category: 'osmosis_inversa',
    section: 'filtros_agua',
    brand: 'HydroLife Systems',
    sku: 'FLT-OSM-5ET02',
    specs: {
      'Etapas': '1: Sedimento 5u, 2: Carbón GAC, 3: Carbón CTO, 4: Membrana RO 75GPD, 5: Post-carbón',
      'Producción': 'Hasta 280 litros diarios de agua purificada',
      'Tanque': 'Almacenamiento presurizado de 3.2 Galones',
      'Grifo': 'Acero inoxidable cuello de cisne grado alimenticio'
    },
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    stock: 18,
    description: 'Sistema completo de ósmosis inversa bajo mesada. Remueve hasta el 99% de impurezas disueltas, virus, bacterias, arsénico, fluoruro y sales.'
  },
  {
    id: 'filtro_3',
    name: 'Pack de 3 Cartuchos Carbón Activado en Bloque CTO 10"',
    price: 16.00,
    costPrice: 8.50,
    category: 'cartuchos_repuestos',
    section: 'filtros_agua',
    brand: 'AquaPure Pro',
    sku: 'FLT-CAR-CTO10',
    specs: {
      'Medida': 'Estándar universal 10 pulgadas x 2.5 pulgadas',
      'Retención': '5 Micras de densidad gradual',
      'Material': 'Carbón activado de concha de coco 100% natural',
      'Duración recomendada': '6 a 9 meses por cartucho'
    },
    image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 120,
    description: 'Cartuchos de reemplazo para carcasas universales de 10 pulgadas. Máxima absorción de cloro libre, turbidez y compuestos orgánicos volátiles.'
  },
  {
    id: 'filtro_4',
    name: 'Filtro de Sedimentos Polipropileno Spun 5 Micras 10"',
    price: 4.80,
    costPrice: 2.10,
    category: 'filtros_sedimento',
    section: 'filtros_agua',
    brand: 'FilterTech',
    sku: 'FLT-SED-PP04',
    specs: {
      'Medida': '10" x 2.5" estándar',
      'Filtrado': '5 micras de alta retención',
      'Composición': '100% microfibras de polipropileno termosoldadas',
      'Uso': 'Etapa previa para proteger bombas, calentadores y membranas'
    },
    image: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 200,
    description: 'Filtro de sedimentos de alta eficiencia para retener arena, partículas de óxido de cañerías y suciedad suspendida en la red de agua.'
  },
  {
    id: 'filtro_5',
    name: 'Dispensador Purificador de Agua por Gravedad de 14 Litros',
    price: 49.90,
    costPrice: 31.00,
    category: 'dispensadores',
    section: 'filtros_agua',
    brand: 'MineralWater Home',
    sku: 'FLT-DSP-GRV05',
    specs: {
      'Capacidad Total': '14 Litros (Tanque superior 5L + inferior 9L)',
      'Purificación': 'Domo de cerámica coreana + Cartucho multicapa + Piedras minerales',
      'Material': 'Plástico virgen libre de BPA grado alimenticio',
      'Sin Electricidad': 'Funciona exclusivamente por gravedad'
    },
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80',
    favorite: true,
    stock: 25,
    description: 'Dispensador purificador de agua mineralizada de mesa. No requiere cañería ni electricidad. Proporciona agua pura, cristalina y enriquecida con minerales saludables.'
  },
  {
    id: 'filtro_6',
    name: 'Vela Cerámica Lavable de Microfiltración para Filtros de Mesa',
    price: 9.50,
    costPrice: 4.50,
    category: 'cartuchos_repuestos',
    section: 'filtros_agua',
    brand: 'AquaPure Pro',
    sku: 'FLT-VEL-CER06',
    specs: {
      'Porosidad': '0.2 a 0.5 Micras absolutas',
      'Lavable': 'Se puede limpiar con esponja abrasiva suave',
      'Relleno': 'Carbón activado granulado de alta absorción',
      'Rosca': 'Estándar para purificadores de gravedad'
    },
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
    favorite: false,
    stock: 90,
    description: 'Repuesto de domo o vela de cerámica esterilizante lavable. Retiene quistes, bacterias, sedimentos y polvo prolongando la vida del sistema.'
  }
];
