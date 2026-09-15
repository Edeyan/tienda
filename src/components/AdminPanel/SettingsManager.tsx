import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  Save, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Percent, 
  ShieldCheck, 
  FileText, 
  RotateCcw, 
  Coins, 
  AlertTriangle, 
  Code2, 
  Copy, 
  Download, 
  Check,
  
  Cloud,
  Database
} from 'lucide-react';
import { initialStoreSettings } from '../../data/initialData';

export const SettingsManager: React.FC = () => {
  const { 
    storeSettings, 
    updateStoreSettings, 
    showToast, 
    products, 
    setAdminTab, 
    
    setGmailModalOpen
  } = useApp();

  const [formData, setFormData] = useState({
    storeName: storeSettings.storeName,
    storeSubtitle: storeSettings.storeSubtitle,
    promoBanner: storeSettings.promoBanner,
    phone: storeSettings.phone,
    whatsapp: storeSettings.whatsapp,
    email: storeSettings.email,
    address: storeSettings.address,
    taxRate: storeSettings.taxRate,
    currency: storeSettings.currency,
    currencyRates: {
      USD: storeSettings.currencyRates?.USD ?? 1.0,
      EUR: storeSettings.currencyRates?.EUR ?? 0.92,
      CUP: storeSettings.currencyRates?.CUP ?? 320.0,
      MLC: storeSettings.currencyRates?.MLC ?? 1.15
    },
    minStockAlert: storeSettings.minStockAlert ?? 5,
    policies: { ...storeSettings.policies }
  });

  const [copiedHtml, setCopiedHtml] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings(formData);
  };

  const handleResetDefaults = () => {
    if (confirm('¿Restablecer configuraciones originales?')) {
      setFormData(initialStoreSettings);
      updateStoreSettings(initialStoreSettings);
      showToast('Configuraciones restablecidas a los valores iniciales', 'info');
    }
  };

  // Generate self-contained standalone HTML bundle
  const generateStandaloneHTML = () => {
    const serializedProducts = JSON.stringify(products);
    const serializedSettings = JSON.stringify(formData);

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${formData.storeName} - ${formData.storeSubtitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800;900&family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, .font-heading { font-family: 'Outfit', sans-serif; }
  </style>
</head>
<body class="bg-slate-100 text-slate-900 min-h-screen">
  <!-- Header -->
  <header class="bg-[#002147] text-white p-4 sticky top-0 z-50 shadow-md">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center text-lg font-heading">
          BA
        </div>
        <div>
          <h1 class="text-xl font-black font-heading leading-tight">${formData.storeName}</h1>
          <p class="text-xs text-orange-400 font-bold tracking-widest">${formData.storeSubtitle}</p>
        </div>
      </div>

      <!-- Currency Switcher & Cart Count -->
      <div class="flex items-center gap-2">
        <select id="currencySelect" onchange="changeCurrency(this.value)" class="bg-slate-800 text-white border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl">
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="CUP">CUP ($)</option>
          <option value="MLC">MLC ($)</option>
        </select>
        <button onclick="openCartModal()" class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-xl text-xs font-black shadow flex items-center gap-2">
          <span>Factura</span>
          <span id="cartCountBadge" class="bg-white text-orange-600 px-2 py-0.2 rounded-full font-bold">0</span>
        </button>
      </div>
    </div>
  </header>

  <!-- Two Column Layout: Left Categories, Right Products -->
  <main class="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Sidebar: Categories -->
    <aside class="md:col-span-3 space-y-4">
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <h3 class="text-xs font-black text-[#002147] uppercase tracking-wider mb-3">Categorías</h3>
        <nav id="categoryNav" class="space-y-1 text-xs font-bold">
          <!-- Populated by JS -->
        </nav>
      </div>

      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs space-y-2">
        <div class="font-bold text-[#002147]">Atención Comercial:</div>
        <p class="text-slate-500">${formData.address}</p>
        <p class="text-slate-500">Tel: ${formData.phone}</p>
        <p class="text-slate-500">WhatsApp: ${formData.whatsapp}</p>
      </div>
    </aside>

    <!-- Right Content: Products Grid -->
    <section class="md:col-span-9 space-y-4">
      <div class="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
        <div class="flex items-center gap-2">
          <input 
            type="search" 
            id="searchInput" 
            placeholder="Buscar productos..." 
            oninput="renderProducts()"
            class="px-4 py-2 border border-slate-200 rounded-xl text-xs w-64 bg-slate-50 focus:bg-white focus:outline-none"
          />
        </div>
        <div id="productCount" class="text-xs text-slate-500 font-bold">0 productos</div>
      </div>

      <div id="productsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Rendered by JS -->
      </div>
    </section>
  </main>

  <!-- Cart / Invoice Modal -->
  <div id="cartModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 hidden flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
      <div class="flex items-center justify-between border-b pb-3">
        <h3 class="font-black text-lg text-[#002147]">Factura Oficial y Pedido</h3>
        <button onclick="closeCartModal()" class="text-slate-400 hover:text-slate-700 font-bold text-lg">✕</button>
      </div>
      <div id="cartItemsContainer" class="max-h-60 overflow-y-auto space-y-2 text-xs divide-y divide-slate-100"></div>
      <div class="border-t pt-3 flex justify-between font-black text-base text-[#002147]">
        <span>Total:</span>
        <span id="cartTotalDisplay" class="text-emerald-600 font-mono">$0.00</span>
      </div>
      <button onclick="window.print()" class="w-full py-3 bg-[#002147] text-white rounded-xl font-black text-xs">Imprimir Comprobante</button>
    </div>
  </div>

  <script>
    const products = ${serializedProducts};
    const settings = ${serializedSettings};
    let currentCategory = 'all';
    let currentCurrency = 'USD';
    let cart = {};

    const rates = settings.currencyRates || { USD: 1, EUR: 0.92, CUP: 320, MLC: 1.15 };
    const symbols = { USD: '$', EUR: '€', CUP: 'CUP $', MLC: 'MLC $' };

    function formatPrice(amountUSD) {
      const rate = rates[currentCurrency] || 1;
      const converted = (amountUSD * rate).toFixed(2);
      return (symbols[currentCurrency] || '$') + ' ' + converted;
    }

    function changeCurrency(curr) {
      currentCurrency = curr;
      renderProducts();
      updateCartDisplay();
    }

    function selectCategory(cat) {
      currentCategory = cat;
      renderCategories();
      renderProducts();
    }

    function renderCategories() {
      const sections = ['all', ...new Set(products.map(p => p.section))];
      const nav = document.getElementById('categoryNav');
      nav.innerHTML = sections.map(sec => \`
        <button onclick="selectCategory('\${sec}')" class="w-full text-left px-3 py-2 rounded-xl capitalize \${currentCategory === sec ? 'bg-orange-500 text-white' : 'text-slate-600 hover:bg-slate-100'}">
          \${sec === 'all' ? 'Ver Todos' : sec}
        </button>
      \`).join('');
    }

    function addToCart(id) {
      cart[id] = (cart[id] || 0) + 1;
      updateCartDisplay();
    }

    function updateCartDisplay() {
      const count = Object.values(cart).reduce((a, b) => a + b, 0);
      document.getElementById('cartCountBadge').innerText = count;

      const container = document.getElementById('cartItemsContainer');
      let totalUSD = 0;
      let html = '';

      Object.entries(cart).forEach(([id, qty]) => {
        const prod = products.find(p => p.id === id);
        if (prod) {
          totalUSD += prod.price * qty;
          html += \`
            <div class="flex justify-between items-center py-2">
              <div>
                <div class="font-bold text-[#002147]">\${prod.name}</div>
                <div class="text-slate-400">\${qty} x \${formatPrice(prod.price)}</div>
              </div>
              <div class="font-mono font-bold">\${formatPrice(prod.price * qty)}</div>
            </div>
          \`;
        }
      });

      if (!html) html = '<p class="text-slate-400 py-4 text-center">Factura vacía</p>';
      container.innerHTML = html;
      document.getElementById('cartTotalDisplay').innerText = formatPrice(totalUSD);
    }

    function renderProducts() {
      const query = (document.getElementById('searchInput').value || '').toLowerCase();
      const filtered = products.filter(p => {
        const matchesCat = currentCategory === 'all' || p.section === currentCategory;
        const matchesQuery = p.name.toLowerCase().includes(query) || (p.sku && p.sku.toLowerCase().includes(query));
        return matchesCat && matchesQuery;
      });

      document.getElementById('productCount').innerText = filtered.length + ' productos';

      const grid = document.getElementById('productsGrid');
      grid.innerHTML = filtered.map(p => \`
        <div class="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs flex flex-col justify-between hover:shadow-md transition">
          <div>
            <div class="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 mb-2">
              <img src="\${p.image}" alt="\${p.name}" class="w-full h-full object-cover"/>
            </div>
            <div class="text-[10px] uppercase font-bold text-orange-600">\${p.brand || 'BUSINESS'} • \${p.sku || ''}</div>
            <h4 class="text-xs font-bold text-[#002147] line-clamp-2 mt-1">\${p.name}</h4>
          </div>
          <div class="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
            <span class="text-sm font-mono font-black text-emerald-600">\${formatPrice(p.price)}</span>
            <button onclick="addToCart('\${p.id}')" class="px-3 py-1.5 bg-[#002147] hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition">
              + Factura
            </button>
          </div>
        </div>
      \`).join('');
    }

    function openCartModal() { document.getElementById('cartModal').classList.remove('hidden'); }
    function closeCartModal() { document.getElementById('cartModal').classList.add('hidden'); }

    // Init
    renderCategories();
    renderProducts();
  </script>
</body>
</html>`;
  };

  const handleCopyHTML = () => {
    const htmlCode = generateStandaloneHTML();
    navigator.clipboard.writeText(htmlCode);
    setCopiedHtml(true);
    showToast('¡Código HTML completo copiado al portapapeles!', 'success');
    setTimeout(() => setCopiedHtml(false), 3000);
  };

  const handleDownloadHTML = () => {
    const htmlCode = generateStandaloneHTML();
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'catalogo-comercial-business.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Archivo HTML descargado con éxito', 'success');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg font-black text-[#002147]">Configuración Comercial y Multidivisas</h3>
          <p className="text-xs text-slate-500">Ajusta tasas de cambio (USD/EUR/CUP/MLC), alertas de stock, políticas y exportación HTML</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all"
          >
            Restablecer
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar</span>
          </button>
        </div>
      </div>

      {/* HTML Generator Bar */}
      <div className="bg-gradient-to-r from-[#002147] to-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500 rounded-2xl text-white shadow-inner">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-black tracking-tight">Exportar Aplicación Completa en 1 Solo Archivo HTML</h4>
            <p className="text-xs text-slate-300">
              Genera el archivo .html autónomo con todo el catálogo, buscador, carrito y cálculo de divisas listo para abrir offline o subir a cualquier servidor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleCopyHTML}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            {copiedHtml ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedHtml ? '¡Copiado!' : 'Copiar Código HTML'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadHTML}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Descargar .HTML</span>
          </button>
        </div>
      </div>

      {/* Google Workspace Integration Hub (Drive & Gmail) */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-5 rounded-3xl border border-indigo-800/60 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex -space-x-3">
            <div className="p-2.5 bg-rose-600 rounded-full text-white shadow-inner border-2 border-slate-900 relative z-0">
              <Mail className="w-5 h-5 text-rose-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black tracking-tight">Google Workspace Hub</h4>
              <span className="text-[9.5px] font-bold bg-indigo-400/20 text-indigo-300 border border-indigo-300/30 px-2 py-0.2 rounded-full uppercase">
                OAuth 2.0 API Activo
              </span>
            </div>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl">
              Gestiona facturas electrónicas o soporte al cliente a través de <strong className="text-rose-300">Gmail</strong>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setGmailModalOpen(true)}
            className="flex-1 lg:flex-initial px-3.5 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Redactar</span>
          </button>
          <button
            type="button"
            onClick={() => setAdminTab('workspace')}
            className="flex-1 lg:flex-initial px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
          >
            <Database className="w-4 h-4" />
            <span>Panel Gmail</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General Store Details & Currencies */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 font-black text-sm text-[#002147] pb-2 border-b border-slate-100">
              <Building2 className="w-4 h-4 text-orange-500" />
              Identidad del Negocio
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subtítulo / Eslogan</label>
                <input
                  type="text"
                  value={formData.storeSubtitle}
                  onChange={e => setFormData({ ...formData, storeSubtitle: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Banner Promo */}
            <div>
              <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Texto del Banner Promocional Superior
              </label>
              <input
                type="text"
                required
                value={formData.promoBanner}
                onChange={e => setFormData({ ...formData, promoBanner: e.target.value })}
                placeholder="¡MIRA ESTO! OFERTAS ESPECIALES"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-bold text-orange-600"
              />
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono Principal</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">WhatsApp de Atención</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Correo de Contacto</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Dirección Comercial</label>
              <input
                type="text"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Currency Rates & Stock Threshold Box */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 font-black text-sm text-[#002147] pb-2 border-b border-slate-100">
              <Coins className="w-4 h-4 text-orange-500" />
              Gestión de Tasas de Cambio & Monedas
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasa USD ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currencyRates.USD}
                  onChange={e => setFormData({
                    ...formData,
                    currencyRates: { ...formData.currencyRates, USD: parseFloat(e.target.value) || 1 }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasa EUR (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currencyRates.EUR}
                  onChange={e => setFormData({
                    ...formData,
                    currencyRates: { ...formData.currencyRates, EUR: parseFloat(e.target.value) || 0.92 }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasa CUP (CUP $)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currencyRates.CUP}
                  onChange={e => setFormData({
                    ...formData,
                    currencyRates: { ...formData.currencyRates, CUP: parseFloat(e.target.value) || 320 }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasa MLC (MLC $)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.currencyRates.MLC}
                  onChange={e => setFormData({
                    ...formData,
                    currencyRates: { ...formData.currencyRates, MLC: parseFloat(e.target.value) || 1.15 }
                  })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alerta de Stock Mínimo (Unids)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.minStockAlert}
                  onChange={e => setFormData({ ...formData, minStockAlert: parseInt(e.target.value) || 5 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tasa de Impuesto / IVA (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.taxRate}
                  onChange={e => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Policies and Rules Editor */}
        <div className="lg:col-span-6 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 font-black text-sm text-[#002147] pb-2 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-orange-500" />
            Políticas y Garantías Oficiales
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">1. Política de Devoluciones</label>
            <textarea
              rows={2}
              value={formData.policies.devoluciones}
              onChange={e => setFormData({
                ...formData,
                policies: { ...formData.policies, devoluciones: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">2. Términos de Garantía</label>
            <textarea
              rows={2}
              value={formData.policies.garantia}
              onChange={e => setFormData({
                ...formData,
                policies: { ...formData.policies, garantia: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">3. Condiciones de Envío</label>
            <textarea
              rows={2}
              value={formData.policies.envios}
              onChange={e => setFormData({
                ...formData,
                policies: { ...formData.policies, envios: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">4. Formas de Pago Aceptadas</label>
            <textarea
              rows={2}
              value={formData.policies.pagos}
              onChange={e => setFormData({
                ...formData,
                policies: { ...formData.policies, pagos: e.target.value }
              })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
