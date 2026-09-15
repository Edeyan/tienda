import { Product, CartItem, Order, StoreSettings, CurrencyType } from '../types';

export interface WhatsAppOrderDetails {
  customerName?: string;
  customerPhone?: string;
  paymentMethod?: string;
  notes?: string;
  currency: CurrencyType;
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount?: number;
  tax?: number;
  total: number;
  formattedTotal: string;
}

/**
 * Clean phone numbers to international standard format for WhatsApp wa.me links
 */
export function cleanWhatsAppNumber(phone: string): string {
  const clean = (phone || '').replace(/[^0-9]/g, '');
  // Default to standard prefix if not formatted
  if (clean.length === 8 && !clean.startsWith('53')) {
    return '53' + clean;
  }
  return clean || '5352684812';
}

/**
 * Generate full formatted WhatsApp message and wa.me link for an entire cart purchase or quote
 */
export function generateCartWhatsAppUrl(
  whatsappPhone: string,
  storeName: string,
  details: WhatsAppOrderDetails
): string {
  const phone = cleanWhatsAppNumber(whatsappPhone);

  let message = `🛒 *¡NUEVO PEDIDO / SOLICITUD DE COMPRA!* 🛒\n`;
  message += `🏢 *Tienda:* ${storeName}\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━\n`;

  if (details.customerName) {
    message += `👤 *Cliente:* ${details.customerName}\n`;
  }
  if (details.customerPhone) {
    message += `📱 *Teléfono:* ${details.customerPhone}\n`;
  }
  if (details.paymentMethod) {
    message += `💳 *Método de Pago:* ${details.paymentMethod.toUpperCase()}\n`;
  }

  const regularSubtotal = details.subtotal / 0.9;
  const catalogDiscount = regularSubtotal - details.subtotal;

  message += `\n📦 *DETALLE DE PRODUCTOS:*\n`;
  details.items.forEach((item, index) => {
    const skuText = item.sku ? ` [Cód: ${item.sku}]` : '';
    message += `${index + 1}. *${item.name}*${skuText}\n`;
    message += `   ▸ Cantidad: ${item.quantity} un.\n`;
    message += `   ▸ P. Regular: ~$${(item.price / 0.9).toFixed(2)}~ (-10% DCTO) ➔ *P. Oferta:* $${item.price.toFixed(2)} USD\n`;
    message += `   ▸ Subtotal: $${item.subtotal.toFixed(2)} USD\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `📋 *Subtotal Regular:* ~$${regularSubtotal.toFixed(2)} USD~\n`;
  message += `🎁 *Descuento Catálogo (10% DCTO):* -$${catalogDiscount.toFixed(2)} USD\n`;
  message += `💵 *Subtotal con Descuento:* $${details.subtotal.toFixed(2)} USD\n`;
  if (details.discount && details.discount > 0) {
    message += `🏷️ *Cupón Extra:* -$${details.discount.toFixed(2)} USD\n`;
  }
  if (details.tax && details.tax > 0) {
    message += `🏛️ *Impuesto:* +$${details.tax.toFixed(2)} USD\n`;
  }

  message += `💰 *TOTAL A PAGAR:* *${details.formattedTotal}* (${details.currency})\n`;
  message += `🎉 *¡Ahorro en esta compra:* $${(catalogDiscount + (details.discount || 0)).toFixed(2)} USD! (10% Aplicado)\n`;
  
  if (details.notes && details.notes.trim()) {
    message += `\n📝 *Notas:* ${details.notes.trim()}\n`;
  }

  message += `\n🕒 *Fecha:* ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n`;
  message += `\n_Hola, deseo confirmar la disponibilidad y coordinar la entrega de este pedido. ¡Muchas gracias!_`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate quick WhatsApp link for asking about a single product
 */
export function generateSingleProductWhatsAppUrl(
  whatsappPhone: string,
  product: Product,
  quantity: number = 1,
  formattedPrice: string,
  currency: CurrencyType
): string {
  const phone = cleanWhatsAppNumber(whatsappPhone);
  const skuText = product.sku ? ` (Código SKU: ${product.sku})` : '';

  let msg = `👋 *¡Hola! Me interesa este producto:*\n\n`;
  msg += `🏍️ *Producto:* ${product.name}${skuText}\n`;
  msg += `📂 *Categoría:* ${product.section.toUpperCase()} / ${product.category}\n`;
  msg += `🔢 *Cantidad deseada:* ${quantity} un.\n`;
  msg += `💵 *Precio de lista:* ${formattedPrice} (${currency})\n`;

  if (product.specs && Object.keys(product.specs).length > 0) {
    msg += `⚙️ *Especificaciones:*\n`;
    Object.entries(product.specs).slice(0, 3).forEach(([k, v]) => {
      msg += `  • ${k}: ${v}\n`;
    });
  }

  msg += `\n¿Tienen disponibilidad para entrega o envío inmediato?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
}
