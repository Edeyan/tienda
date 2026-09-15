import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  Globe, 
  FileSpreadsheet, 
  FileText, 
  Sparkles, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Percent, 
  DollarSign, 
  Upload, 
  RefreshCw, 
  Layers, 
  AlertCircle,
  HelpCircle,
  TrendingUp,
  Download,
  Database
} from 'lucide-react';
import { sectionLabels, sectionOrder, sectionSubcategories } from '../../data/initialData';

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportSourceTab = 'url' | 'paste' | 'file' | 'presets';

export const ImportProductsModal: React.FC<ImportProductsModalProps> = ({ isOpen, onClose }) => {
  const { addProductsBatch } = useApp();

  const [activeTab, setActiveTab] = useState<ImportSourceTab>('url');
  const [step, setStep] = useState<'source' | 'staging'>('source');

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [targetSection, setTargetSection] = useState('all');
  const [defaultBrand, setDefaultBrand] = useState('');
  const [profitMargin, setProfitMargin] = useState<number>(0); // e.g. +20%

  // Staging / Extracted products
  const [stagedProducts, setStagedProducts] = useState<Array<Omit<Product, 'id'> & { selected: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Bulk staging adjustment controls
  const [bulkMarginPercent, setBulkMarginPercent] = useState<number>(15);
  const [currencyMultiplier, setCurrencyMultiplier] = useState<number>(1.0);
  const [bulkSection, setBulkSection] = useState<string>('keep');

  if (!isOpen) return null;

  // Curated demo catalogs
  const demoCatalogs: Record<string, { title: string; desc: string; count: number; items: Omit<Product, 'id'>[] }> = {
    mishozuki: {
      title: '🏍️ Catálogo Oficial Mishozuki Motos',
      desc: 'Motos eléctricas, scooters Shark/Coyote, baterías litio 72V, abanicos recargables y repuestos.',
      count: 14,
      items: [
        {
          name: 'MOTOCICLETA ELÉCTRICA MISHOZUKI COYOTE2 LT PO4 40AH',
          price: 1300.00,
          costPrice: 910.00,
          category: 'moto_electrica',
          section: 'vehiculos',
          brand: 'MISHOZUKI',
          sku: 'MSK-COYOTE2-40',
          image: 'https://mishozukimotos.com/wp-content/uploads/2021/03/color-GRC-1-300x225.jpg',
          description: 'Motocicleta eléctrica potente con batería de fosfato de hierro y litio (LiFePO4) de 40Ah, excelente autonomía y chasis reforzado.',
          specs: { 'MARCA': 'MISHOZUKI', 'BATERÍA': 'LiFePO4 40Ah', 'TIPO': 'Motocicleta Eléctrica', 'ORIGEN': 'Mishozuki Motos' },
          stock: 8
        },
        {
          name: 'MOTOCICLETA ELÉCTRICA MISHOZUKI RACING 45AH',
          price: 1500.00,
          costPrice: 1050.00,
          category: 'moto_electrica',
          section: 'vehiculos',
          brand: 'MISHOZUKI',
          sku: 'MSK-RACING-45',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/04/producto_135_5-300x341.jpg',
          description: 'Modelo Racing de alto rendimiento con aceleración suave, batería 45Ah y frenos de disco hidráulicos.',
          specs: { 'MARCA': 'MISHOZUKI', 'CAPACIDAD': '45Ah', 'DISEÑO': 'Racing Deportivo' },
          stock: 6
        },
        {
          name: 'SCOOTER ELÉCTRICO MISHOZUKI NEW BIG SHARK-2 PRO ION 45AH',
          price: 1450.00,
          costPrice: 1015.00,
          category: 'scooter_electrico',
          section: 'vehiculos',
          brand: 'MISHOZUKI',
          sku: 'MSK-SHARK2-45',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/01/producto_152_2-300x225.jpg',
          description: 'Scooter urbano de alta estabilidad con batería de iones de litio de 45Ah y suspensión neumática trasera.',
          specs: { 'MARCA': 'MISHOZUKI', 'BATERÍA': 'Ion Litio 45Ah', 'MODELO': 'Big Shark-2 Pro' },
          stock: 10
        },
        {
          name: 'SCOOTER ELÉCTRICO MISHOZUKI NEW BUHO-2 LT PO4 40AH',
          price: 1400.00,
          costPrice: 980.00,
          category: 'scooter_electrico',
          section: 'vehiculos',
          brand: 'MISHOZUKI',
          sku: 'MSK-BUHO2-40',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/05/producto_143_1-scaled-300x225.jpg',
          description: 'Scooter eléctrico Buho-2 con gran maniobrabilidad para ciudad, batería LiFePO4 de larga durabilidad.',
          specs: { 'MARCA': 'MISHOZUKI', 'BATERÍA': 'LiFePO4 40Ah', 'ILUMINACIÓN': 'Full LED' },
          stock: 12
        },
        {
          name: 'SCOOTER ELÉCTRICO MISHOZUKI WHITE SHARK LITHIUM 45AH',
          price: 1990.00,
          costPrice: 1390.00,
          category: 'scooter_electrico',
          section: 'vehiculos',
          brand: 'MISHOZUKI',
          sku: 'MSK-WHITE-SHARK-45',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/12/12391617699121_.pic_hd-600x450-1-300x225.jpg',
          description: 'Edición exclusiva White Shark con tablero digital LCD, batería de litio premium 45Ah y alarma antirrobo.',
          specs: { 'MARCA': 'MISHOZUKI', 'EDICIÓN': 'White Shark', 'BATERÍA': 'Lithium 45Ah' },
          stock: 5
        },
        {
          name: 'BATERÍA 72V 35AH LITHIUM + CARGADOR KIT MISHOZUKI',
          price: 490.00,
          costPrice: 340.00,
          category: 'bateria_moto',
          section: 'baterias',
          brand: 'MISHOZUKI',
          sku: 'MSK-BAT-7235',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/04/producto_14_1-300x225.jpg',
          description: 'Kit de batería de litio 72V 35Ah para motos y scooters eléctricos con cargador inteligente incluido.',
          specs: { 'VOLTAJE': '72V', 'CAPACIDAD': '35Ah', 'INCLUYE': 'Cargador Rápido' },
          stock: 20
        },
        {
          name: 'BATERÍA 72V 45AH LITHIUM + CARGADOR KIT MISHOZUKI',
          price: 590.00,
          costPrice: 410.00,
          category: 'bateria_moto',
          section: 'baterias',
          brand: 'MISHOZUKI',
          sku: 'MSK-BAT-7245',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/04/producto_14_1-300x225.jpg',
          description: 'Kit de batería de alto rendimiento 72V 45Ah para mayor autonomía en recorridos largos.',
          specs: { 'VOLTAJE': '72V', 'CAPACIDAD': '45Ah', 'BMS': 'Protección Térmica' },
          stock: 18
        },
        {
          name: 'BATERÍA LITHIUM 72V 100AH VLT MISHOZUKI',
          price: 700.00,
          costPrice: 490.00,
          category: 'bateria_lipo4',
          section: 'baterias',
          brand: 'MISHOZUKI',
          sku: 'MSK-BAT-72100',
          image: 'https://mishozukimotos.com/wp-content/uploads/2026/07/Bateria-100ah-2-300x225.jpg',
          description: 'Pack de ultra alta capacidad 100Ah para triciclos de carga o máxima autonomía en ruta.',
          specs: { 'VOLTAJE': '72V', 'CAPACIDAD': '100Ah', 'USO': 'Motos y Triciclos' },
          stock: 10
        },
        {
          name: 'ABANICO RECARGABLE 16 PULGADAS LITHIUM',
          price: 35.00,
          costPrice: 22.00,
          category: 'recargable',
          section: 'ventiladores',
          brand: 'MISHOZUKI',
          sku: 'MSK-VENT-16L',
          image: 'https://mishozukimotos.com/wp-content/uploads/2022/07/681658997850_.pic_-300x662.jpg',
          description: 'Ventilador recargable de 16 pulgadas con batería de litio incorporada, puerto USB y luz LED de emergencia.',
          specs: { 'TAMAÑO': '16"', 'BATERÍA': 'Litio Recargable', 'VELOCIDADES': '3 Niveles' },
          stock: 45
        },
        {
          name: 'ABANICO PEDESTAL RECARGABLE CON PANEL SOLAR LUXOR',
          price: 35.00,
          costPrice: 22.00,
          category: 'recargable',
          section: 'ventiladores',
          brand: 'LUXOR',
          sku: 'MSK-VENT-SOLAR',
          image: 'https://mishozukimotos.com/wp-content/uploads/2023/02/image_2023_02_24T19_39_49_904Z-1-300x309.png',
          description: 'Abanico de pedestal ecológico con panel solar incluido para carga directa con luz del sol.',
          specs: { 'PANEL': 'Solar 10W Incluido', 'TIPO': 'Pedestal Ajustable' },
          stock: 30
        },
        {
          name: 'ABANICO RECARGABLE 6 PULGADAS PORTÁTIL',
          price: 18.00,
          costPrice: 11.00,
          category: 'recargable',
          section: 'ventiladores',
          brand: 'MISHOZUKI',
          sku: 'MSK-VENT-6IN',
          image: 'https://mishozukimotos.com/wp-content/uploads/2026/07/Abanico-mini-300x320.jpg',
          description: 'Mini abanico silencioso recargable por cable USB, ideal para escritorio, cama o transporte.',
          specs: { 'TAMAÑO': '6 Pulgadas', 'CARGA': 'USB Tipo C' },
          stock: 60
        },
        {
          name: 'AIRE SPLIT 12K 220V R410A LUXOR INVERTER LED',
          price: 195.00,
          costPrice: 135.00,
          category: 'all',
          section: 'ferreteria',
          brand: 'LUXOR',
          sku: 'MSK-AC-12K',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/01/producto_67_1-300x225.jpg',
          description: 'Aire acondicionado split de 12.000 BTU, tecnología de ahorro energético y pantalla LED digital.',
          specs: { 'CAPACIDAD': '12.000 BTU', 'VOLTAJE': '220V', 'REFRIGERANTE': 'R410A' },
          stock: 12
        },
        {
          name: 'AMOLADORA ANGULAR INDUSTRIAL PROLUX',
          price: 26.00,
          costPrice: 16.00,
          category: 'discos_corte',
          section: 'ferreteria',
          brand: 'PROLUX',
          sku: 'MSK-AMO-PRO',
          image: 'https://mishozukimotos.com/wp-content/uploads/2020/04/amoladora-5-300x156.jpg',
          description: 'Amoladora angular con mango ergonómico y guarda de seguridad para corte de metal y albañilería.',
          specs: { 'POTENCIA': '850W', 'DISCO': '115mm' },
          stock: 25
        },
        {
          name: 'ASIENTO ERGONÓMICO BICICLETA / BICIMOTO ELÉCTRICA',
          price: 20.00,
          costPrice: 12.00,
          category: 'piezas_bici',
          section: 'bicicletas',
          brand: 'MISHOZUKI',
          sku: 'MSK-ASI-BICI',
          image: 'https://mishozukimotos.com/wp-content/uploads/2021/04/0126001605前座垫Front-seat-300x277.jpg',
          description: 'Asiento frontal acolchado de alta densidad y resortes dobles para absorber irregularidades del camino.',
          specs: { 'MATERIAL': 'Cuero Sintético Acolchado', 'COMPATIBILIDAD': 'Universal' },
          stock: 35
        }
      ]
    },
    ferreteria: {
      title: '🔨 Herramientas & Ferretería Profesional',
      desc: 'Set de insumos de alta rotación con márgenes comerciales competitivos.',
      count: 4,
      items: [
        {
          name: 'Amoladora Angular 900W 115mm Industrial',
          price: 69.90,
          costPrice: 42.00,
          category: 'discos_corte',
          section: 'ferreteria',
          brand: 'BOSCH INDUSTRIAL',
          sku: 'IMP-AMO-900',
          image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=80',
          description: 'Herramienta de alto rendimiento para corte y desbaste en metal y concreto.',
          specs: { 'POTENCIA': '900W', 'RPM': '11000', 'PESO': '1.9kg' },
          stock: 18
        },
        {
          name: 'Set Llaves Combinadas Cromo Vanadio (12 piezas)',
          price: 38.00,
          costPrice: 21.00,
          category: 'tornillos',
          section: 'ferreteria',
          brand: 'STANLEY PRO',
          sku: 'IMP-KEY-SET12',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
          description: 'Estuche de llaves métricas 6mm a 22mm forjadas en acero de alta resistencia.',
          specs: { 'PIEZAS': '12', 'ACABADO': 'Cromado Mate', 'NORMA': 'DIN 3113' },
          stock: 30
        },
        {
          name: 'Cerradura Yale Seguridad Multipunto',
          price: 54.00,
          costPrice: 32.00,
          category: 'llavin_yale',
          section: 'ferreteria',
          brand: 'YALE',
          sku: 'IMP-YALE-MUL',
          image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&auto=format&fit=crop&q=80',
          description: 'Cilindro antibumping con 5 llaves computarizadas y escudo protector.',
          specs: { 'MECANISMO': 'Multipunto', 'LLAVES': '5 Computarizadas', 'GARANTÍA': '5 Años' },
          stock: 22
        },
        {
          name: 'Rollo Cable Cobre THHN 12 AWG (100m)',
          price: 68.00,
          costPrice: 44.00,
          category: 'cables',
          section: 'ferreteria',
          brand: 'CONDUMEX',
          sku: 'IMP-CAB-12AWG',
          image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&auto=format&fit=crop&q=80',
          description: 'Conductor de cobre 100% puro para instalaciones eléctricas seguras y certificadas.',
          specs: { 'CALIBRE': '12 AWG', 'LONGITUD': '100m', 'AISLANTE': 'PVC 90°C' },
          stock: 15
        }
      ]
    },
    calzado: {
      title: '👟 Calzado Deportivo & Botas de Seguridad',
      desc: 'Modelos de calzado con tallas y fichas técnicas automáticas.',
      count: 3,
      items: [
        {
          name: 'Zapatillas Trail Running Impermeables',
          price: 85.00,
          costPrice: 48.00,
          category: 'deportivo',
          section: 'calzado',
          brand: 'SALOMON TECH',
          sku: 'IMP-RUN-TR42',
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80',
          description: 'Calzado todoterreno con membrana impermeable y suela Contagrip antideslizante.',
          specs: { 'TALLAS': '40-45', 'MEMBRANA': 'GoreTex', 'AMORTIGUACIÓN': 'EnergyCell' },
          stock: 20
        },
        {
          name: 'Botas de Seguridad Puntera Composite',
          price: 62.00,
          costPrice: 36.00,
          category: 'botas',
          section: 'calzado',
          brand: 'CATERPILLAR',
          sku: 'IMP-BOT-COMP',
          image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&auto=format&fit=crop&q=80',
          description: 'Bota dieléctrica liviana con puntera no metálica de alta absorción de impacto.',
          specs: { 'NORMA': 'ASTM F2413', 'SUELA': 'Antiperforación Kevlar', 'PESO': '620g' },
          stock: 16
        },
        {
          name: 'Zapatos Confort Cuero Suave',
          price: 49.00,
          costPrice: 27.00,
          category: 'casual',
          section: 'calzado',
          brand: 'CLARKS STYLE',
          sku: 'IMP-ZAP-CONF',
          image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=400&auto=format&fit=crop&q=80',
          description: 'Calzado ergonómico de piel vacuna con plantilla acolchada de memory foam.',
          specs: { 'MATERIAL': 'Cuero Vacuno', 'PLANTILLA': 'Memory Foam', 'COLOR': 'Café / Negro' },
          stock: 24
        }
      ]
    }
  };

  // Helper to process scraped or parsed items into staging state
  const loadIntoStaging = (items: Omit<Product, 'id'>[]) => {
    if (!items || items.length === 0) {
      setErrorMessage('No se encontraron productos para importar.');
      return;
    }

    const staged = items.map(p => ({
      ...p,
      selected: true
    }));

    setStagedProducts(staged);
    setStep('staging');
    setErrorMessage(null);
  };

  // 1. Scraping via Web URL
  const handleScrapeUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          targetSection: targetSection !== 'all' ? targetSection : undefined,
          profitMargin: profitMargin
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al conectar con la URL.');
      }

      if (data.products && data.products.length > 0) {
        loadIntoStaging(data.products);
      } else {
        // Fallback: heuristic parse of the URL text if no direct products returned
        throw new Error('No se detectaron productos estructurados en la página. Prueba copiando y pegando el texto o tabla en la pestaña "Pegar Texto".');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error al extraer productos desde la web.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Parse from pasted text or HTML
  const handleParsePastedText = async () => {
    if (!pastedText.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // First try sending to Gemini AI parser route
      const res = await fetch('/api/parse-products-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: pastedText,
          targetSection: targetSection !== 'all' ? targetSection : undefined,
          defaultBrand: defaultBrand || undefined,
          profitMargin: profitMargin
        })
      });

      const data = await res.json();

      if (res.ok && data.products && data.products.length > 0) {
        loadIntoStaging(data.products);
      } else {
        // Fallback: Client-side Line-by-Line & CSV Parser
        const parsedLocally = parseTextClientSide(pastedText);
        if (parsedLocally.length > 0) {
          loadIntoStaging(parsedLocally);
        } else {
          throw new Error('No pudimos detectar productos válidos en el texto. Asegúrate de incluir el nombre y el precio.');
        }
      }
    } catch (err: any) {
      console.warn('AI Parsing failed, using local parser:', err);
      const parsedLocally = parseTextClientSide(pastedText);
      if (parsedLocally.length > 0) {
        loadIntoStaging(parsedLocally);
      } else {
        setErrorMessage(err.message || 'Error analizando los productos.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side regex & table parser for offline/quick parsing
  const parseTextClientSide = (text: string): Omit<Product, 'id'>[] => {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const results: Omit<Product, 'id'>[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check for price patterns: $123.45, 123.45€, 123.45 USD, etc.
      const priceMatch = line.match(/(?:\$|€|USD|EUR)?\s*([0-9]+(?:[.,][0-9]{1,2})?)\s*(?:\$|€|USD|EUR)?/i);
      
      // Look for a reasonable product line
      if (line.length > 3) {
        let extractedPrice = 19.99;
        let cleanedName = line;

        if (priceMatch && priceMatch[1]) {
          const numStr = priceMatch[1].replace(',', '.');
          const parsedNum = parseFloat(numStr);
          if (!isNaN(parsedNum) && parsedNum > 0 && parsedNum < 1000000) {
            extractedPrice = parsedNum;
            cleanedName = line.replace(priceMatch[0], '').replace(/[-|:,]/g, ' ').trim();
          }
        }

        if (cleanedName.length < 3) {
          cleanedName = `Producto Importado #${results.length + 1}`;
        }

        let finalPrice = extractedPrice;
        if (profitMargin > 0) {
          finalPrice = Number((finalPrice * (1 + profitMargin / 100)).toFixed(2));
        }

        const sec = targetSection !== 'all' ? targetSection : 'ferreteria';
        const subcats = sectionSubcategories[sec] || [];
        const cat = subcats[1]?.value || subcats[0]?.value || 'all';

        results.push({
          name: cleanedName,
          price: finalPrice,
          costPrice: Number((finalPrice * 0.65).toFixed(2)),
          category: cat,
          section: sec,
          brand: defaultBrand || 'IMPORTADO',
          sku: `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
          description: 'Producto añadido desde importador masivo.',
          specs: { 'ORIGEN': 'Importación', 'MARCA': defaultBrand || 'IMPORTADO' },
          stock: 15
        });
      }
    }

    return results;
  };

  // 3. File upload handler (CSV/JSON)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        if (!content) throw new Error('El archivo está vacío.');

        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          const rawItems = Array.isArray(parsed) ? parsed : parsed.products || parsed.items || [];
          
          const formatted: Omit<Product, 'id'>[] = rawItems.map((p: any, idx: number) => ({
            name: p.name || p.nombre || p.title || `Producto #${idx + 1}`,
            price: Number(p.price || p.precio) || 19.99,
            costPrice: Number(p.costPrice || p.costo) || (Number(p.price || p.precio) || 19.99) * 0.65,
            category: p.category || p.categoria || 'all',
            section: p.section || p.seccion || targetSection !== 'all' ? targetSection : 'ferreteria',
            brand: p.brand || p.marca || defaultBrand || 'IMPORTADO',
            sku: p.sku || p.codigo || `IMP-${Math.floor(1000 + Math.random() * 9000)}`,
            image: p.image || p.imagen || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
            description: p.description || p.descripcion || 'Importado desde archivo JSON.',
            specs: typeof p.specs === 'object' ? p.specs : { 'MARCA': p.brand || defaultBrand || 'IMPORTADO' },
            stock: Number(p.stock || p.existencia) || 10
          }));

          loadIntoStaging(formatted);
        } else {
          // CSV / TSV Parsing
          const rows = content.split(/\r?\n/).map(r => r.trim()).filter(Boolean);
          if (rows.length < 2) throw new Error('El archivo CSV debe tener al menos una cabecera y una fila.');

          const delimiter = content.includes(';') ? ';' : content.includes('\t') ? '\t' : ',';
          const headers = rows[0].split(delimiter).map(h => h.trim().toLowerCase().replace(/["']/g, ''));

          const nameIdx = headers.findIndex(h => h.includes('nom') || h.includes('name') || h.includes('tit') || h.includes('prod'));
          const priceIdx = headers.findIndex(h => h.includes('pre') || h.includes('price') || h.includes('pvp') || h.includes('val'));
          const costIdx = headers.findIndex(h => h.includes('cost') || h.includes('compra'));
          const skuIdx = headers.findIndex(h => h.includes('sku') || h.includes('cod') || h.includes('ref'));
          const brandIdx = headers.findIndex(h => h.includes('mar') || h.includes('brand') || h.includes('fab'));
          const secIdx = headers.findIndex(h => h.includes('sec') || h.includes('secc'));
          const catIdx = headers.findIndex(h => h.includes('cat') || h.includes('tipo'));
          const imgIdx = headers.findIndex(h => h.includes('img') || h.includes('imag') || h.includes('photo') || h.includes('foto') || h.includes('url'));
          const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('det'));
          const stockIdx = headers.findIndex(h => h.includes('stk') || h.includes('stock') || h.includes('cant'));

          const parsedProducts: Omit<Product, 'id'>[] = [];

          for (let i = 1; i < rows.length; i++) {
            const cols = rows[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (cols.length < 2) continue;

            const name = nameIdx !== -1 ? cols[nameIdx] : cols[0];
            const rawPrice = priceIdx !== -1 ? cols[priceIdx] : cols[1];
            const price = parseFloat(rawPrice?.replace(',', '.') || '0') || 19.99;
            const cost = costIdx !== -1 ? parseFloat(cols[costIdx]?.replace(',', '.') || '0') : price * 0.65;
            const sku = skuIdx !== -1 && cols[skuIdx] ? cols[skuIdx] : `CSV-${Math.floor(1000 + Math.random() * 9000)}`;
            const brand = brandIdx !== -1 && cols[brandIdx] ? cols[brandIdx] : defaultBrand || 'IMPORTADO';
            const sec = secIdx !== -1 && cols[secIdx] ? cols[secIdx] : (targetSection !== 'all' ? targetSection : 'ferreteria');
            const cat = catIdx !== -1 && cols[catIdx] ? cols[catIdx] : 'all';
            const img = imgIdx !== -1 && cols[imgIdx] && cols[imgIdx].startsWith('http') 
              ? cols[imgIdx] 
              : 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80';
            const desc = descIdx !== -1 && cols[descIdx] ? cols[descIdx] : 'Importado por CSV';
            const stock = stockIdx !== -1 ? parseInt(cols[stockIdx]) || 15 : 15;

            if (name && name.length > 1) {
              parsedProducts.push({
                name,
                price,
                costPrice: cost,
                category: cat,
                section: sec,
                brand,
                sku,
                image: img,
                description: desc,
                specs: { 'MARCA': brand, 'ORIGEN': 'CSV' },
                stock
              });
            }
          }

          loadIntoStaging(parsedProducts);
        }
      } catch (err: any) {
        console.error(err);
        setErrorMessage(err.message || 'Error leyendo el archivo.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsText(file);
  };

  // Bulk actions on staged products
  const applyBulkMargin = () => {
    if (bulkMarginPercent === 0) return;
    setStagedProducts(prev =>
      prev.map(p => {
        if (!p.selected) return p;
        const newPrice = Number((p.price * (1 + bulkMarginPercent / 100)).toFixed(2));
        return { ...p, price: newPrice };
      })
    );
  };

  const applyCurrencyConversion = () => {
    if (currencyMultiplier === 1.0) return;
    setStagedProducts(prev =>
      prev.map(p => {
        if (!p.selected) return p;
        const newPrice = Number((p.price * currencyMultiplier).toFixed(2));
        const newCost = p.costPrice ? Number((p.costPrice * currencyMultiplier).toFixed(2)) : undefined;
        return { ...p, price: newPrice, costPrice: newCost };
      })
    );
  };

  const applyBulkSection = () => {
    if (bulkSection === 'keep') return;
    setStagedProducts(prev =>
      prev.map(p => {
        if (!p.selected) return p;
        const subcats = sectionSubcategories[bulkSection] || [];
        const cat = subcats[1]?.value || subcats[0]?.value || 'all';
        return { ...p, section: bulkSection, category: cat };
      })
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setStagedProducts(prev => prev.map(p => ({ ...p, selected: select })));
  };

  const updateStagedProduct = (index: number, updates: Partial<Omit<Product, 'id'> & { selected: boolean }>) => {
    setStagedProducts(prev => {
      const next = [...prev];
      next[index] = { ...next[index], ...updates };
      return next;
    });
  };

  const removeStagedProduct = (index: number) => {
    setStagedProducts(prev => prev.filter((_, idx) => idx !== index));
  };

  // Confirm final batch import to store catalog
  const handleFinalImport = () => {
    const selected = stagedProducts.filter(p => p.selected);
    if (selected.length === 0) {
      alert('Debes seleccionar al menos un producto para importar.');
      return;
    }

    const cleanedList: Omit<Product, 'id'>[] = selected.map(p => {
      const { selected: _, ...rest } = p;
      return rest;
    });

    addProductsBatch(cleanedList);
    onClose();
  };

  const selectedCount = stagedProducts.filter(p => p.selected).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-orange-500 to-amber-400 rounded-2xl text-white shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Importador Inteligente de Productos y Precios
                </h3>
                <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 border border-orange-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                  IA & Web Extractor
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {step === 'source' 
                  ? 'Añade productos, existencias y precios desde cualquier web, catálogo o archivo'
                  : `Revisión y personalización de ${stagedProducts.length} productos detectados`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Error Message Toast */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Aviso de importación:</p>
                <p>{errorMessage}</p>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-800 font-bold">
                ✕
              </button>
            </div>
          )}

          {/* STEP 1: SOURCE SELECTION */}
          {step === 'source' && (
            <div className="space-y-6">
              {/* Tab navigation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('url')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'url'
                      ? 'bg-white text-[#002147] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>Por Enlace Web</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('paste')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'paste'
                      ? 'bg-white text-[#002147] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span>Pegar Texto / Tabla</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('file')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'file'
                      ? 'bg-white text-[#002147] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  <span>Archivo CSV / Excel</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('presets')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'presets'
                      ? 'bg-white text-[#002147] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Database className="w-4 h-4 text-amber-500" />
                  <span>Lotes de Ejemplo</span>
                </button>
              </div>

              {/* Common Options: Section & Margin */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sección de Destino</label>
                  <select
                    value={targetSection}
                    onChange={e => setTargetSection(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value="all">Detectar automáticamente con IA</option>
                    {sectionOrder.filter(s => s !== 'favoritos').map(s => (
                      <option key={s} value={s}>{sectionLabels[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca por Defecto (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. BOSCH, YALE, NIKE..."
                    value={defaultBrand}
                    onChange={e => setDefaultBrand(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Margen Comercial Añadido</label>
                  <select
                    value={profitMargin}
                    onChange={e => setProfitMargin(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    <option value={0}>Mantener precio original (0%)</option>
                    <option value={15}>Aumentar +15% de margen</option>
                    <option value={25}>Aumentar +25% de margen</option>
                    <option value={40}>Aumentar +40% de margen</option>
                    <option value={60}>Aumentar +60% de margen</option>
                  </select>
                </div>
              </div>

              {/* TAB 1: WEB URL */}
              {activeTab === 'url' && (
                <form onSubmit={handleScrapeUrl} className="space-y-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <label className="font-black text-[#002147] text-sm block">
                      Enlace de la tienda o catálogo web
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          placeholder="https://ejemplo-tienda.com/productos o URL de producto"
                          value={urlInput}
                          onChange={e => setUrlInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading || !urlInput.trim()}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Extrayendo con IA...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4" />
                            <span>Extraer Productos</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-bold text-slate-500">Sugerencias rápidas:</span>
                      <button
                        type="button"
                        onClick={() => setUrlInput('https://mishozukimotos.com/tienda/')}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold transition-colors flex items-center gap-1"
                      >
                        <span>🏍️</span>
                        <span>mishozukimotos.com/tienda</span>
                      </button>
                    </div>

                    <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">¿Cómo funciona?</p>
                        <p className="text-[11px] text-amber-800">
                          Nuestro servidor descarga la página y utiliza Gemini AI para detectar automáticamente nombres, precios, marcas, códigos, imágenes y atributos de cada artículo.
                        </p>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* TAB 2: PASTE TEXT / HTML */}
              {activeTab === 'paste' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <label className="font-black text-[#002147] text-sm block">
                      Pega el texto, lista de productos o tabla copiada
                    </label>
                    <textarea
                      rows={7}
                      placeholder={`Ejemplo:\nBujía de Iridio NGK - $18.99\nJuego de Pastillas Cerámicas Brembo - $45.00\nBatería de Litio 48V 30Ah - $280.00\n\nO cualquier tabla copiada de Excel o de una página web...`}
                      value={pastedText}
                      onChange={e => setPastedText(e.target.value)}
                      className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleParsePastedText}
                        disabled={isLoading || !pastedText.trim()}
                        className="px-6 py-2.5 bg-[#002147] hover:bg-[#003166] active:scale-95 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Procesando...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-orange-400" />
                            <span>Analizar y Extraer Productos</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FILE UPLOAD */}
              {activeTab === 'file' && (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-300 text-center hover:border-orange-500 transition-colors">
                    <input
                      type="file"
                      id="catalogFileInput"
                      accept=".csv, .tsv, .json, .txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="catalogFileInput" className="cursor-pointer block space-y-3">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-[#002147]">
                          Haz clic para subir o arrastra tu archivo aquí
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Formatos compatibles: CSV, TSV, JSON exportado de Shopify, WooCommerce, Excel, etc.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 4: PRESET LOTS */}
              {activeTab === 'presets' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {Object.entries(demoCatalogs).map(([key, catalog]) => (
                    <div 
                      key={key}
                      className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-orange-500 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <h4 className="font-extrabold text-[#002147] text-sm">{catalog.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{catalog.desc}</p>
                        <div className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-mono font-bold">
                          {catalog.count} productos incluidos
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => loadIntoStaging(catalog.items)}
                        className="mt-4 w-full py-2 bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Cargar este Lote</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: STAGING & BULK ADJUSTMENT TABLE */}
          {step === 'staging' && (
            <div className="space-y-5">
              {/* Back to source & summary header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setStep('source')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Cambiar fuente o volver</span>
                </button>

                <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{stagedProducts.length} productos detectados</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-orange-600">{selectedCount} seleccionados para importar</span>
                </div>
              </div>

              {/* Bulk Modifier Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#002147] uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                    Herramientas de Ajuste Masivo de Precios
                  </span>

                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(true)}
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      Seleccionar Todos
                    </button>
                    <span className="text-slate-300">/</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(false)}
                      className="text-slate-500 font-bold hover:underline"
                    >
                      Deseleccionar
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Margin boost */}
                  <div className="flex gap-1.5 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <Percent className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="number"
                      value={bulkMarginPercent}
                      onChange={e => setBulkMarginPercent(Number(e.target.value))}
                      className="w-14 bg-white border border-slate-200 rounded px-1.5 py-1 text-center font-bold"
                    />
                    <span className="text-slate-600 font-bold">% Margen</span>
                    <button
                      type="button"
                      onClick={applyBulkMargin}
                      className="ml-auto px-2.5 py-1 bg-orange-500 text-white rounded font-bold text-[11px] hover:bg-orange-600"
                    >
                      Aplicar
                    </button>
                  </div>

                  {/* Currency conversion */}
                  <div className="flex gap-1.5 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <DollarSign className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <select
                      value={currencyMultiplier}
                      onChange={e => setCurrencyMultiplier(Number(e.target.value))}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 font-bold text-[11px]"
                    >
                      <option value={1.0}>1.00 (Sin cambio)</option>
                      <option value={1.08}>EUR a USD (x1.08)</option>
                      <option value={0.92}>USD a EUR (x0.92)</option>
                      <option value={1.20}>+20% Impuesto/Arancel</option>
                    </select>
                    <button
                      type="button"
                      onClick={applyCurrencyConversion}
                      className="ml-auto px-2.5 py-1 bg-[#002147] text-white rounded font-bold text-[11px] hover:bg-[#003166]"
                    >
                      Convertir
                    </button>
                  </div>

                  {/* Bulk section assign */}
                  <div className="flex gap-1.5 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <Layers className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <select
                      value={bulkSection}
                      onChange={e => setBulkSection(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-1.5 py-1 font-bold text-[11px] flex-1 min-w-0"
                    >
                      <option value="keep">Conservar sección</option>
                      {sectionOrder.filter(s => s !== 'favoritos').map(s => (
                        <option key={s} value={s}>{sectionLabels[s]}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={applyBulkSection}
                      className="px-2.5 py-1 bg-slate-800 text-white rounded font-bold text-[11px] hover:bg-black"
                    >
                      Asignar
                    </button>
                  </div>
                </div>
              </div>

              {/* Staged Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto max-h-[350px]">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-extrabold sticky top-0 z-10">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedCount === stagedProducts.length && stagedProducts.length > 0}
                            onChange={e => toggleSelectAll(e.target.checked)}
                            className="rounded text-orange-500 focus:ring-orange-500"
                          />
                        </th>
                        <th className="p-3">Producto</th>
                        <th className="p-3">Sección / Cat.</th>
                        <th className="p-3">SKU / Marca</th>
                        <th className="p-3 text-right">Costo ($)</th>
                        <th className="p-3 text-right">Precio Venta ($)</th>
                        <th className="p-3 text-center">Margen</th>
                        <th className="p-3 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stagedProducts.map((p, idx) => {
                        const cost = p.costPrice || 0;
                        const marginPercent = cost > 0 ? Math.round(((p.price - cost) / cost) * 100) : 0;

                        return (
                          <tr 
                            key={idx} 
                            className={`transition-colors ${p.selected ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/50 opacity-60'}`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.selected}
                                onChange={e => updateStagedProduct(idx, { selected: e.target.checked })}
                                className="rounded text-orange-500 focus:ring-orange-500"
                              />
                            </td>

                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                                />
                                <input
                                  type="text"
                                  value={p.name}
                                  onChange={e => updateStagedProduct(idx, { name: e.target.value })}
                                  className="w-48 sm:w-64 font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 focus:bg-white px-1 py-0.5 rounded outline-none text-xs truncate"
                                />
                              </div>
                            </td>

                            <td className="p-3">
                              <select
                                value={p.section}
                                onChange={e => updateStagedProduct(idx, { section: e.target.value })}
                                className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-bold text-[11px]"
                              >
                                {sectionOrder.filter(s => s !== 'favoritos').map(s => (
                                  <option key={s} value={s}>{sectionLabels[s]}</option>
                                ))}
                              </select>
                            </td>

                            <td className="p-3">
                              <div className="flex gap-1 items-center">
                                <input
                                  type="text"
                                  value={p.sku}
                                  onChange={e => updateStagedProduct(idx, { sku: e.target.value })}
                                  className="w-18 font-mono font-bold text-[11px] bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 px-1 py-0.5 rounded outline-none"
                                />
                                <input
                                  type="text"
                                  value={p.brand}
                                  onChange={e => updateStagedProduct(idx, { brand: e.target.value })}
                                  className="w-20 text-[11px] text-slate-500 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-orange-500 px-1 py-0.5 rounded outline-none"
                                />
                              </div>
                            </td>

                            <td className="p-3 text-right font-mono">
                              <input
                                type="number"
                                step="0.01"
                                value={p.costPrice || 0}
                                onChange={e => updateStagedProduct(idx, { costPrice: parseFloat(e.target.value) || 0 })}
                                className="w-16 text-right font-mono text-xs bg-slate-50 border border-slate-200 rounded px-1 py-0.5"
                              />
                            </td>

                            <td className="p-3 text-right font-mono">
                              <input
                                type="number"
                                step="0.01"
                                value={p.price}
                                onChange={e => updateStagedProduct(idx, { price: parseFloat(e.target.value) || 0 })}
                                className="w-18 text-right font-mono font-black text-emerald-600 text-xs bg-emerald-50/60 border border-emerald-200 rounded px-1.5 py-0.5"
                              />
                            </td>

                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-black ${
                                marginPercent >= 25 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                +{marginPercent}%
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              <button
                                type="button"
                                onClick={() => removeStagedProduct(idx)}
                                className="text-slate-300 hover:text-rose-600 font-bold transition-colors"
                                title="Quitar de la lista"
                              >
                                ✕
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-slate-300 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>

          {step === 'staging' && (
            <button
              type="button"
              onClick={handleFinalImport}
              disabled={selectedCount === 0}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-50 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Importar {selectedCount} Productos al Catálogo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
