import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getHighQualityImageUrl } from '../utils/imageUtils';
import { generateCartWhatsAppUrl } from '../utils/whatsappHelper';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Receipt, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  Printer, 
  CheckCircle2, 
  RotateCcw,
  UserCheck,
  Tag,
  MessageCircle,
  Percent,
  Send,
  Globe,
  Copy,
  Check,
  Info,
  Building2,
  Sparkles,
  Smartphone,
  Bell
} from 'lucide-react';
import { Order } from '../types';
import { CartAISuggestions } from './CartAISuggestions';

export const CartModal: React.FC = () => {
  const {
    cartModalOpen,
    setCartModalOpen,
    cartItemsList,
    updateCartQty,
    removeFromCart,
    clearCart,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    storeSettings,
    currentUser,
    createOrder,
    setSelectedOrder,
    formatCurrency,
    activeCurrency,
    showToast,
    requestPushPermission,
    pushPermissionStatus
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('efectivo');
  const [notes, setNotes] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!cartModalOpen) return null;

  const discountedSubtotal = Math.max(0, cartTotal - discountAmount);
  const taxAmount = (discountedSubtotal * (storeSettings.taxRate || 0)) / 100;
  const finalTotal = discountedSubtotal + taxAmount;

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    showToast(`¡${label} copiado con éxito!`, 'success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsList.length === 0) return;

    const order = createOrder({
      name: customerName || currentUser?.name || 'Cliente Mostrador',
      email: customerEmail || currentUser?.email || 'cliente@business.com',
      phone: customerPhone,
      paymentMethod,
      notes
    });

    setCompletedOrder(order);
    setCheckoutStep('success');
  };

  const handleClose = () => {
    setCartModalOpen(false);
    setTimeout(() => {
      setCheckoutStep('cart');
      setCompletedOrder(null);
    }, 300);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setCartModalOpen(false)}
    >
      <div 
        className="bg-white w-full max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-orange-500 text-white rounded-lg shadow-xs">
              <Receipt className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-black text-[#002147] flex items-center gap-2">
                Resumen de Compra
                {cartItemsList.length > 0 && (
                  <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-mono">
                    {cartItemsList.length} ítems
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-slate-500">Resumen y emisión de comprobante de compra</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItemsList.length > 0 && checkoutStep === 'cart' && (
              <button
                onClick={clearCart}
                title="Vaciar compra"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-2 sm:p-3 pb-1 sm:pb-1 overflow-y-auto flex-1 space-y-2">
          {checkoutStep === 'cart' && (
            <>
              {cartItemsList.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Receipt className="w-7 h-7 opacity-40" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-700">Tu compra está vacía</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Navega por las categorías del catálogo y agrega productos para generar la orden de compra.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 sm:space-y-2">
                  {cartItemsList.map(({ product, quantity }) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between gap-2 p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white border border-slate-200/80 flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={getHighQualityImageUrl(product.image)} 
                          alt={product.name} 
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover" 
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-[11px] sm:text-xs font-bold text-[#002147] truncate leading-tight">
                          {product.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1 mt-0.5 text-[10px] sm:text-[10.5px] leading-tight">
                          <span className="text-slate-400 line-through font-mono">
                            {formatCurrency(product.price / 0.9)}
                          </span>
                          <span className="text-[6.5px] sm:text-[7px] font-black bg-rose-500 text-white px-0.5 py-0.1 rounded-xs uppercase leading-none">
                            -10%
                          </span>
                          <span className="font-mono text-emerald-600 font-bold">{formatCurrency(product.price)}</span>
                          <span className="text-slate-400 text-[9px] hidden xs:inline">• {product.sku}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <div className="flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateCartQty(product.id, quantity - 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Disminuir"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 sm:w-6 text-center text-[11px] font-mono font-bold text-slate-800">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQty(product.id, quantity + 1)}
                            className="p-1 text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Aumentar"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Subtotal Column */}
                        <div className="text-right min-w-[55px] sm:min-w-[65px]">
                          <span className="text-[8.5px] sm:text-[9px] text-slate-400 line-through font-mono block leading-none">
                            {formatCurrency((product.price / 0.9) * quantity)}
                          </span>
                          <span className="text-[11px] sm:text-xs font-black font-mono text-emerald-600 block mt-0.5 leading-none">
                            {formatCurrency(product.price * quantity)}
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Eliminar del carrito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* AI Smart Product Recommendations */}
                  <CartAISuggestions />

                  {/* Coupon Code Section */}
                  <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Tag className="w-3.5 h-3.5 text-amber-600" />
                        <span>¿Tienes un cupón de descuento?</span>
                      </div>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between bg-emerald-100/80 border border-emerald-300 p-2.5 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <span className="p-1 bg-emerald-600 text-white rounded-lg font-mono font-bold text-[10px]">
                            {appliedCoupon.code}
                          </span>
                          <span className="font-bold text-emerald-900">
                            {appliedCoupon.discountPercent}% de Descuento aplicado
                          </span>
                        </div>
                        <button
                          onClick={removeCoupon}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-bold underline cursor-pointer"
                        >
                          Quitar
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Ingresa código (ej. DESCUENTO10)"
                          className="flex-1 px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                        >
                          Aplicar
                        </button>
                      </form>
                    )}

                    {couponError && (
                      <p className="text-[10px] text-rose-600 font-bold mt-1.5">{couponError}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {checkoutStep === 'checkout' && (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-2.5">
              <div className="bg-orange-50/80 border border-orange-200 p-2 rounded-lg text-[11px] text-orange-900 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>Completa los datos del cliente para registrar la orden de compra.</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div>
                  <label className="font-bold text-slate-700 block mb-0.5">Nombre Completo / Razón Social *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Ej. Juan Pérez / Taller Mecánico San José"
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Correo Electrónico *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="cliente@correo.com"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-0.5">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      placeholder="+34 600 000 000"
                      className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 text-[11px]">Método de Pago</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                    {[
                      { id: 'efectivo', label: 'Efectivo', icon: Banknote },
                      { id: 'western_union', label: 'Western Union', icon: Globe },
                      { id: 'zelle', label: 'Zelle', icon: Send },
                      { id: 'transferencia', label: 'Transferencia', icon: Receipt }
                    ].map(m => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id as Order['paymentMethod'])}
                          className={`py-1 px-1.5 rounded-md border text-center font-bold text-[10px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                            paymentMethod === m.id
                              ? 'bg-[#002147] text-white border-[#002147] shadow-xs ring-1 ring-orange-500'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <Icon className={`w-3 h-3 flex-shrink-0 ${paymentMethod === m.id ? 'text-orange-400' : 'text-slate-500'}`} />
                          <span className="truncate leading-none">{m.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Instrucciones Automáticas por Método de Pago */}
                  <div className="mt-1 p-1.5 rounded-lg border bg-slate-50 border-slate-200/90 text-[10px] space-y-1">
                    {paymentMethod === 'zelle' && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black uppercase text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Send className="w-2.5 h-2.5" /> Datos para pago por Zelle
                          </span>
                          <span className="text-[9px] text-slate-400">Verificación Inmediata</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 space-y-0.5">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-[10px] text-slate-500">Correo Zelle:</span>
                            <div className="flex items-center gap-1">
                              <strong className="font-mono text-slate-900 font-bold">pagos@businessasociados.com</strong>
                              <button
                                type="button"
                                onClick={() => handleCopyText('pagos@businessasociados.com', 'Correo Zelle')}
                                className="p-0.5 hover:bg-slate-100 rounded text-orange-600 transition-colors cursor-pointer"
                                title="Copiar correo"
                              >
                                {copiedKey === 'Correo Zelle' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-slate-700 text-[10px]">
                            <span className="text-slate-500">Titular:</span>
                            <span className="font-bold">Business Asociados LLC</span>
                          </div>
                          <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-100">
                            💡 En la nota de Zelle coloque su nombre o número de pedido para validar su pago rápido.
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'western_union' && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black uppercase text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5" /> Datos para Western Union
                          </span>
                          <span className="text-[9px] text-slate-400">Remesas Internacionales</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 space-y-0.5">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-[10px] text-slate-500">Destinatario:</span>
                            <div className="flex items-center gap-1">
                              <strong className="font-bold text-slate-900">Alejandro Valdés Rodríguez</strong>
                              <button
                                type="button"
                                onClick={() => handleCopyText('Alejandro Valdés Rodríguez', 'Nombre Destinatario')}
                                className="p-0.5 hover:bg-slate-100 rounded text-orange-600 transition-colors cursor-pointer"
                                title="Copiar nombre"
                              >
                                {copiedKey === 'Nombre Destinatario' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-700">
                            <span className="text-slate-500">Ubicación / País:</span>
                            <span className="font-bold">La Habana, Cuba / Miami FL, USA</span>
                          </div>
                          <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-100">
                            💡 Al realizar el giro, envíenos el código MTCN de 10 dígitos por WhatsApp.
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'transferencia' && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black uppercase text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Receipt className="w-2.5 h-2.5" /> Cuenta Bancaria Oficial
                          </span>
                          <span className="text-[9px] text-slate-400">Transferencia / Banca Móvil</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 space-y-0.5">
                          <div className="flex items-center justify-between text-slate-700">
                            <span className="text-[10px] text-slate-500">Nº de Cuenta:</span>
                            <div className="flex items-center gap-1">
                              <strong className="font-mono text-slate-900 font-bold">9224 8812 0041 5590</strong>
                              <button
                                type="button"
                                onClick={() => handleCopyText('9224881200415590', 'Número de Cuenta')}
                                className="p-0.5 hover:bg-slate-100 rounded text-orange-600 transition-colors cursor-pointer"
                                title="Copiar cuenta"
                              >
                                {copiedKey === 'Número de Cuenta' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-700">
                            <span className="text-slate-500">Beneficiario:</span>
                            <span className="font-bold">Business Asociados S.R.L.</span>
                          </div>
                          <div className="text-[9px] text-slate-400 pt-0.5 border-t border-slate-100">
                            💡 Envíe captura del comprobante bancario a nuestro WhatsApp oficial.
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'efectivo' && (
                      <div className="space-y-1 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                          <span className="font-black uppercase text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Banknote className="w-2.5 h-2.5" /> Pago en Efectivo
                          </span>
                          <span className="text-[9px] text-slate-400">Contra Entrega / Tienda</span>
                        </div>
                        <div className="bg-white p-1.5 rounded-md border border-slate-200 text-[10px] text-slate-600 space-y-0.5">
                          <p>• <strong>Contra Entrega:</strong> Pague en efectivo al recibir en su domicilio.</p>
                          <p>• <strong>Monedas Aceptadas:</strong> USD, EUR, CUP (Tasa del día) y MLC.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-0.5 text-[11px]">Notas u Observaciones del Pedido</label>
                  <textarea
                    rows={1}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Instrucciones de entrega..."
                    className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:ring-1 focus:ring-orange-500 focus:outline-none text-[11px]"
                  />
                </div>
              </div>
            </form>
          )}

          {checkoutStep === 'success' && completedOrder && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-in zoom-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                  Comprobante Generado
                </span>
                <h3 className="text-xl font-black text-[#002147] mt-1">
                  ¡Compra #{completedOrder.orderNumber}!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  La transacción ha sido registrada exitosamente en el sistema con 10% de descuento aplicado.
                </p>
              </div>

              {/* Mini Invoice preview card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-1.5 font-bold text-slate-700">
                  <span>Cliente: {completedOrder.customerName}</span>
                  <span className="text-emerald-600 font-black text-sm">{formatCurrency(completedOrder.total)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Precio de Lista: <span className="line-through">{formatCurrency(completedOrder.subtotal / 0.9)}</span></span>
                  <span className="text-rose-600 font-bold bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
                    -10% DCTO (-{formatCurrency((completedOrder.subtotal / 0.9) - completedOrder.subtotal)})
                  </span>
                </div>
                <div className="text-slate-500 text-[11px] pt-0.5 border-t border-slate-100">
                  Ítems: {completedOrder.items.length} productos • Pago: {completedOrder.paymentMethod}
                </div>
              </div>

              {/* FCM Mobile Alert Enrollment Card */}
              <div className="p-3 bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-blue-500/10 rounded-2xl border border-orange-200 text-left flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-orange-500 text-white rounded-xl shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#002147]">Alertas de Pedido en tu Móvil</h4>
                    <p className="text-[10px] text-slate-500">Recibe avisos automáticos cuando tu pedido cambie de estado.</p>
                  </div>
                </div>
                {pushPermissionStatus !== 'granted' ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const token = await requestPushPermission();
                      if (token) {
                        showToast('¡Dispositivo registrado para recibir alertas de tu pedido!', 'success');
                      }
                    }}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-[11px] font-bold shadow-xs flex items-center gap-1 cursor-pointer shrink-0 transition-all"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>Activar</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Registrado
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <a
                  href={generateCartWhatsAppUrl(storeSettings.whatsapp, storeSettings.storeName, {
                    customerName: completedOrder.customerName,
                    customerPhone: completedOrder.customerPhone,
                    paymentMethod: completedOrder.paymentMethod,
                    notes: completedOrder.notes,
                    currency: activeCurrency,
                    items: completedOrder.items.map(it => ({
                      name: it.productName,
                      sku: it.sku,
                      quantity: it.quantity,
                      price: it.price,
                      subtotal: it.subtotal
                    })),
                    subtotal: completedOrder.subtotal,
                    discount: completedOrder.discount,
                    tax: completedOrder.tax,
                    total: completedOrder.total,
                    formattedTotal: formatCurrency(completedOrder.total)
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </a>

                <button
                  onClick={() => {
                    handleClose();
                    setSelectedOrder(completedOrder);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Ver Factura</span>
                </button>

                <button
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions / Fixed Summary */}
        {cartItemsList.length > 0 && checkoutStep !== 'success' && (
          <div className="px-2 pt-2 pb-3 sm:px-3 sm:pt-2 sm:pb-4 border-t border-slate-100 bg-slate-50 rounded-b-3xl">
            {/* Unified Summary Box */}
            <div className="p-2 sm:p-3 bg-slate-900 text-white rounded-2xl space-y-1.5 text-xs shadow-lg mb-3">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Regular:</span>
                <span className="font-mono line-through">{formatCurrency(cartTotal / 0.9)}</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold">
                <span className="flex items-center gap-1">
                  <span className="text-[8px] bg-rose-500 text-white px-1 py-0.5 rounded-sm font-black leading-none">-10%</span>
                  Descuento Promocional:
                </span>
                <span className="font-mono">-{formatCurrency((cartTotal / 0.9) - cartTotal)}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Cupón ({appliedCoupon.code}):
                  </span>
                  <span className="font-mono">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              {storeSettings.taxRate > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Impuesto / IVA ({storeSettings.taxRate}%):</span>
                  <span className="font-mono font-bold">{formatCurrency(taxAmount)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 mt-1.5 border-t border-slate-800 text-slate-200">
                <div className="flex flex-col">
                  <span className="font-black text-[13px] sm:text-sm text-white">Total a Facturar:</span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-400 font-normal truncate">
                    (Ahorras {formatCurrency(((cartTotal / 0.9) - cartTotal) + discountAmount)})
                  </span>
                </div>
                <span className="text-base sm:text-lg font-mono font-black text-emerald-400 flex-shrink-0">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            {/* Navigation / Submit Buttons */}
            {checkoutStep === 'cart' ? (
              <button
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-5 py-3 rounded-xl text-sm font-black flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
              >
                <span>Siguiente: Facturar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setCheckoutStep('cart')}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer text-center"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Compra</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
