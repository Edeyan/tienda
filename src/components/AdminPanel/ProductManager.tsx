import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Star, 
  Package, 
  X, 
  Save, 
  Check, 
  SlidersHorizontal,
  Image as ImageIcon,
  Tag,
  Sparkles,
  Download,
  AlertTriangle,
  AlertCircle,
  Upload
} from 'lucide-react';
import { sectionLabels, sectionOrder, sectionSubcategories } from '../../data/initialData';
import { ImportProductsModal } from './ImportProductsModal';
import { getHighQualityImageUrl } from '../../utils/imageUtils';

export const ProductManager: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, toggleFavorite, updateStock } = useApp();

  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const lowStockProducts = products.filter(p => (p.stock ?? 0) < 5);
  const lowStockCount = lowStockProducts.length;

  // Form states for creation/editing
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    costPrice: number;
    category: string;
    section: string;
    brand: string;
    sku: string;
    stock: number;
    image: string;
    description: string;
    specs: Record<string, string>;
  }>({
    name: '',
    price: 0,
    costPrice: 0,
    category: 'moto_electrica',
    section: 'vehiculos',
    brand: '',
    sku: '',
    stock: 10,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    description: '',
    specs: { 'MARCA': '', 'MODELO': '', 'GARANTÍA': '1 Año' }
  });

  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSection = selectedSection === 'all' || p.section === selectedSection;
    const matchesSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = !showLowStockOnly || (p.stock ?? 0) < 5;
    return matchesSection && matchesSearch && matchesLowStock;
  });

  const openCreateModal = () => {
    setFormData({
      name: '',
      price: 19.99,
      costPrice: 12.00,
      category: 'moto_electrica',
      section: 'vehiculos',
      brand: 'BUSINESS PRO',
      sku: 'SKU-' + Math.floor(100 + Math.random() * 900),
      stock: 25,
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
      description: 'Producto de alta calidad garantizado.',
      specs: { 'MARCA': 'BUSINESS PRO', 'GARANTÍA': '1 Año' }
    });
    setIsCreating(true);
    setEditingProduct(null);
  };

  const openEditModal = (p: Product) => {
    setFormData({
      name: p.name,
      price: p.price,
      costPrice: p.costPrice || p.price * 0.6,
      category: p.category,
      section: p.section,
      brand: p.brand,
      sku: p.sku,
      stock: p.stock ?? 10,
      image: p.image,
      description: p.description || '',
      specs: { ...p.specs }
    });
    setEditingProduct(p);
    setIsCreating(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) {
      addProduct({
        name: formData.name,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        category: formData.category,
        section: formData.section,
        brand: formData.brand,
        sku: formData.sku,
        stock: Number(formData.stock),
        image: formData.image,
        description: formData.description,
        specs: formData.specs
      });
      setIsCreating(false);
    } else if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        price: Number(formData.price),
        costPrice: Number(formData.costPrice),
        category: formData.category,
        section: formData.section,
        brand: formData.brand,
        sku: formData.sku,
        stock: Number(formData.stock),
        image: formData.image,
        description: formData.description,
        specs: formData.specs
      });
      setEditingProduct(null);
    }
  };

  const addSpecPair = () => {
    if (!newSpecKey.trim()) return;
    setFormData(prev => ({
      ...prev,
      specs: { ...prev.specs, [newSpecKey.trim().toUpperCase()]: newSpecVal.trim() }
    }));
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const removeSpecKey = (k: string) => {
    setFormData(prev => {
      const next = { ...prev.specs };
      delete next[k];
      return { ...prev, specs: next };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg font-black text-[#002147]">Gestión de Productos e Inventario</h3>
          <p className="text-xs text-slate-500">Crea, edita, supervisa stock crítico, ajusta existencias y precios</p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-[#002147] to-[#0a3a70] hover:from-[#001733] hover:to-[#002852] active:scale-95 text-white rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 border border-slate-700/30"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>Importar de Otra Web / Archivo</span>
          </button>

          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Low Stock Warning Banner if items need restocking */}
      {lowStockCount > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-rose-50 via-amber-50 to-orange-50 border border-amber-300/80 rounded-2xl shadow-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 text-white rounded-xl shadow-xs flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#002147] flex items-center gap-1.5 flex-wrap">
                <span>Alerta de Inventario:</span>
                <span className="text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200">
                  {lowStockCount} {lowStockCount === 1 ? 'producto con' : 'productos con'} stock bajo (&lt; 5 unidades)
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Los productos resaltados requieren reabastecimiento para garantizar disponibilidad en tienda.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLowStockOnly(!showLowStockOnly)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 flex-shrink-0 cursor-pointer shadow-xs ${
              showLowStockOnly
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-white hover:bg-amber-100/80 text-amber-900 border border-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{showLowStockOnly ? 'Ver Todo el Catálogo' : `Ver Solo Stock Bajo (${lowStockCount})`}</span>
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            placeholder="Buscar por nombre, SKU o marca..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        {/* Section Select */}
        <select
          value={selectedSection}
          onChange={e => setSelectedSection(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
        >
          <option value="all">Todas las Secciones</option>
          {sectionOrder.filter(s => s !== 'favoritos').map(s => (
            <option key={s} value={s}>{sectionLabels[s]}</option>
          ))}
        </select>

        {/* Low Stock Quick Filter Toggle */}
        <button
          onClick={() => setShowLowStockOnly(!showLowStockOnly)}
          className={`w-full sm:w-auto px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shadow-2xs ${
            showLowStockOnly
              ? 'bg-rose-600 text-white border-rose-700 shadow-md'
              : lowStockCount > 0
                ? 'bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
          title="Filtrar productos con menos de 5 unidades"
        >
          <AlertTriangle className={`w-4 h-4 ${showLowStockOnly ? 'text-white' : 'text-amber-600'}`} />
          <span>Stock Bajo (&lt; 5)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            showLowStockOnly ? 'bg-white text-rose-700' : 'bg-amber-200/80 text-amber-950'
          }`}>
            {lowStockCount}
          </span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Producto</th>
                <th className="p-3.5">Categoría</th>
                <th className="p-3.5">SKU / Marca</th>
                <th className="p-3.5 text-right">Precio</th>
                <th className="p-3.5 text-center">Stock & Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No se encontraron productos coincidentes.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const stockValue = product.stock ?? 0;
                  const isOutOfStock = stockValue <= 0;
                  const isLowStock = stockValue > 0 && stockValue < 5;

                  return (
                    <tr 
                      key={product.id} 
                      className={`transition-colors ${
                        isOutOfStock 
                          ? 'bg-rose-50/70 hover:bg-rose-100/60' 
                          : isLowStock 
                            ? 'bg-amber-50/50 hover:bg-amber-100/60' 
                            : 'hover:bg-slate-50/60'
                      }`}
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative flex-shrink-0">
                            <img
                              src={getHighQualityImageUrl(product.image)}
                              alt={product.name}
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className={`w-10 h-10 rounded-xl object-cover border ${
                                isOutOfStock 
                                  ? 'border-rose-300 ring-2 ring-rose-400' 
                                  : isLowStock 
                                    ? 'border-amber-300 ring-1 ring-amber-400' 
                                    : 'border-slate-200'
                              }`}
                            />
                            {isOutOfStock && (
                              <span 
                                className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 shadow-xs" 
                                title="Agotado"
                              >
                                <AlertCircle className="w-3 h-3" />
                              </span>
                            )}
                            {isLowStock && (
                              <span 
                                className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 shadow-xs" 
                                title="Stock bajo (< 5)"
                              >
                                <AlertTriangle className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-[#002147] truncate max-w-[220px]">
                                {product.name}
                              </span>
                              {isOutOfStock && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider">
                                  <AlertCircle className="w-2.5 h-2.5" />
                                  Agotado
                                </span>
                              )}
                              {isLowStock && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-md text-[9px] font-black bg-amber-500 text-white uppercase tracking-wider">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Bajo Stock ({stockValue})
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">
                              {product.description?.slice(0, 40) || 'Sin descripción'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md text-[10px] uppercase">
                          {product.section}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="font-mono font-bold text-slate-800">{product.sku}</div>
                        <div className="text-[10px] text-slate-500">{product.brand}</div>
                      </td>

                      <td className="p-3.5 text-right font-mono font-black text-emerald-600 text-sm">
                        ${product.price.toFixed(2)}
                      </td>

                      <td className="p-3.5 text-center">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <input
                            type="number"
                            value={product.stock ?? 10}
                            onChange={e => updateStock(product.id, parseInt(e.target.value) || 0)}
                            className={`w-16 text-center font-mono font-bold py-1 px-1.5 rounded-lg border text-xs focus:ring-2 focus:outline-none transition-all ${
                              isOutOfStock 
                                ? 'bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-400 focus:ring-rose-500' 
                                : isLowStock 
                                  ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400 focus:ring-amber-500' 
                                  : 'bg-white border-slate-200 text-slate-800 focus:ring-orange-500'
                            }`}
                            title="Editar existencia directa"
                          />
                          {isOutOfStock ? (
                            <span className="text-[10px] font-black text-rose-600 flex items-center gap-0.5">
                              <AlertCircle className="w-2.5 h-2.5" /> 0 unid.
                            </span>
                          ) : isLowStock ? (
                            <span className="text-[10px] font-bold text-amber-700 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> {stockValue} restantes
                            </span>
                          ) : (
                            <span className="text-[10px] font-semibold text-emerald-600">
                              ✓ Normal
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => toggleFavorite(product.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              product.favorite ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 hover:text-amber-500'
                            }`}
                            title="Favorito"
                          >
                            <Star className={`w-4 h-4 ${product.favorite ? 'fill-amber-400' : ''}`} />
                          </button>
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar "${product.name}" del catálogo?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating or Editing Product */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-orange-500 rounded-xl text-white">
                  <Package className="w-4 h-4" />
                </span>
                <h3 className="text-base font-black">
                  {isCreating ? 'Agregar Nuevo Producto' : `Editar: ${editingProduct?.name}`}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 text-slate-300 hover:text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
              {/* Product Name */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej. Bujía de Iridio Pro"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Price, Cost & Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Precio Venta ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Costo ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {isCreating ? 'Stock Inicial *' : 'Stock en Inventario *'}
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className={`w-full px-3 py-2 border rounded-xl font-mono focus:outline-none focus:ring-2 ${
                      formData.stock <= 0
                        ? 'bg-rose-50 border-rose-300 text-rose-800 focus:ring-rose-500'
                        : formData.stock < 5
                          ? 'bg-amber-50 border-amber-300 text-amber-900 focus:ring-amber-500'
                          : 'bg-slate-50 border-slate-200 focus:bg-white focus:ring-orange-500'
                    }`}
                  />
                  {formData.stock < 5 && (
                    <div className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${
                      formData.stock <= 0 ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      <AlertTriangle className="w-3 h-3" />
                      <span>{formData.stock <= 0 ? 'Producto agotado' : 'Nivel de stock bajo (< 5 unid.)'}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Sección *</label>
                  <select
                    value={formData.section}
                    onChange={e => {
                      const newSec = e.target.value;
                      const subcats = sectionSubcategories[newSec] || [];
                      setFormData({ 
                        ...formData, 
                        section: newSec,
                        category: subcats[1]?.value || subcats[0]?.value || 'all'
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {sectionOrder.filter(s => s !== 'favoritos').map(s => (
                      <option key={s} value={s}>{sectionLabels[s]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Subcategoría *</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  >
                    {(sectionSubcategories[formData.section] || []).map(sc => (
                      <option key={sc.value} value={sc.value}>{sc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SKU & Brand */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código SKU *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-101"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Marca / Fabricante *</label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="BOSCH, YALE, NIKE..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Image URL or Direct File Upload */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">Imagen del Producto</label>
                  <label 
                    id="admin-upload-image-label"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-lg cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Subir foto desde tu dispositivo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setFormData({ ...formData, image: event.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image.startsWith('data:') ? 'Foto subida localmente (Base64)' : formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://... o sube una imagen desde tu dispositivo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm"
                  />
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                    {formData.image ? (
                      <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles del producto..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              {/* Technical Specs Key-Values */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="font-bold text-[#002147] block">Ficha Técnica y Atributos</label>
                <div className="space-y-1.5">
                  {Object.entries(formData.specs).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between bg-white p-1.5 px-3 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-600">{k}:</span>
                      <span className="text-slate-800">{v}</span>
                      <button
                        type="button"
                        onClick={() => removeSpecKey(k)}
                        className="text-rose-500 hover:text-rose-700 font-bold ml-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Atributo (ej. VOLTAJE)"
                    value={newSpecKey}
                    onChange={e => setNewSpecKey(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej. 48V)"
                    value={newSpecVal}
                    onChange={e => setNewSpecVal(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={addSpecPair}
                    className="px-3 py-1.5 bg-[#002147] text-white rounded-lg font-bold"
                  >
                    + Agregar
                  </button>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  {isCreating ? 'Crear Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Import Products & Prices Modal */}
      <ImportProductsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </div>
  );
};
