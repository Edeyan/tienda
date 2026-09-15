import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle, 
  Receipt, 
  FileText, 
  FileDown, 
  Loader2, 
  Phone, 
  Mail,
  Cloud
} from 'lucide-react';
import { gmailService } from '../services/gmailService';

export const InvoiceDetailModal: React.FC = () => {
  const { selectedOrder, setSelectedOrder, storeSettings, updateOrderStatus, formatCurrency, showToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isSendingGmail, setIsSendingGmail] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!selectedOrder) return null;

  const handleSendGmailInvoice = async () => {
    const customerEmail = selectedOrder.customerEmail || prompt('Ingresa el correo del cliente para enviar la factura:');
    if (!customerEmail || !customerEmail.includes('@')) {
      showToast('Correo no válido o cancelado', 'error');
      return;
    }

    if (!gmailService.isConnected()) {
      showToast('Conectando con Gmail...', 'info');
      const conn = await gmailService.connectGmail();
      if (!conn.success) {
        showToast(conn.error || 'No se pudo conectar con Gmail', 'error');
        return;
      }
    }

    try {
      setIsSendingGmail(true);
      await gmailService.sendInvoiceEmail(selectedOrder, customerEmail);
      setDownloadSuccess(`Factura enviada a ${customerEmail}`);
      showToast(`Factura #${selectedOrder.orderNumber} enviada a ${customerEmail} vía Gmail`, 'success');
      setTimeout(() => setDownloadSuccess(null), 3500);
    } catch (err: any) {
      console.error('Error sending invoice via Gmail:', err);
      showToast(err.message || 'Error al enviar factura por Gmail', 'error');
    } finally {
      setIsSendingGmail(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const generateTextInvoice = (order: Order): string => {
    const divider = '============================================================';
    const subDivider = '------------------------------------------------------------';
    const dateFormatted = new Date(order.createdAt).toLocaleString();

    let text = `${divider}\n`;
    text += `             ${storeSettings.storeName.toUpperCase()}\n`;
    text += `       ${storeSettings.storeSubtitle}\n`;
    text += `${divider}\n`;
    text += `Dirección : ${storeSettings.address}\n`;
    text += `Teléfono  : ${storeSettings.phone}\n`;
    text += `Email     : ${storeSettings.email}\n`;
    text += `${subDivider}\n`;
    text += `COMPROBANTE OFICIAL DE VENTA & FACTURA\n`;
    text += `No. Factura : ${order.orderNumber}\n`;
    text += `Fecha / Hora: ${dateFormatted}\n`;
    text += `Estado      : ${order.status.toUpperCase()}\n`;
    text += `${subDivider}\n`;
    text += `DATOS DEL CLIENTE:\n`;
    text += `Nombre   : ${order.customerName}\n`;
    text += `Email    : ${order.customerEmail}\n`;
    if (order.customerPhone) text += `Teléfono : ${order.customerPhone}\n`;
    text += `Método de Pago : ${order.paymentMethod.toUpperCase()}\n`;
    if (order.notes) text += `Observaciones  : ${order.notes}\n`;
    text += `${subDivider}\n`;
    text += `DETALLE DE ARTÍCULOS:\n`;

    const regularSubtotal = order.subtotal / 0.9;
    const catalogDiscount = regularSubtotal - order.subtotal;

    order.items.forEach((item, index) => {
      text += `\n[${index + 1}] ${item.productName}\n`;
      text += `    Marca: ${item.brand} | SKU: ${item.sku}\n`;
      text += `    P. Regular: $${(item.price / 0.9).toFixed(2)} USD (-10% DCTO) ➔ P. Oferta: $${item.price.toFixed(2)} USD\n`;
      text += `    Cantidad: ${item.quantity}  x  $${item.price.toFixed(2)} USD  =  $${item.subtotal.toFixed(2)} USD\n`;
    });

    text += `\n${subDivider}\n`;
    text += `Subtotal Regular (Lista)  : $${regularSubtotal.toFixed(2)} USD\n`;
    text += `Descuento Catálogo (-10%) : -$${catalogDiscount.toFixed(2)} USD\n`;
    text += `Subtotal con Descuento    : $${order.subtotal.toFixed(2)} USD\n`;
    if (order.discount && order.discount > 0) {
      text += `Descuento Cupón Extra     : -$${order.discount.toFixed(2)} USD\n`;
    }
    if (order.tax > 0) {
      text += `Impuesto / IVA            : $${order.tax.toFixed(2)} USD\n`;
    }
    text += `TOTAL A PAGAR             : $${order.total.toFixed(2)} USD\n`;
    text += `AHORRO TOTAL EN COMPRA    : $${(catalogDiscount + (order.discount || 0)).toFixed(2)} USD (¡10% APLICADO!)\n`;
    text += `${divider}\n`;
    text += `EQUIVALENCIAS REFERENCIALES DE PAGO:\n`;
    text += `USD: $${order.total.toFixed(2)} | EUR: €${(order.total * 0.92).toFixed(2)} | CUP: ${(order.total * 320).toLocaleString()} | MLC: ${(order.total * 1.15).toFixed(2)}\n`;
    text += `${subDivider}\n`;
    text += `GARANTÍA DEL PRODUCTO:\n`;
    text += `Conserve este comprobante para hacer válida la garantía de 1 año\nen todos los centros autorizados de BUSINESS ASOCIADOS.\n`;
    text += `${divider}\n`;

    return text;
  };

  const handleDownloadTxt = () => {
    try {
      const textContent = generateTextInvoice(selectedOrder);
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Factura-${selectedOrder.orderNumber}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess('Archivo .TXT descargado con éxito');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Error downloading text file:', err);
    }
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('invoice-printable-area');
    if (!element || !selectedOrder) return;

    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`Factura-${selectedOrder.orderNumber}.pdf`);
      setDownloadSuccess('Factura PDF generada y descargada');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (error) {
      console.error('Error generating canvas PDF, falling back to direct PDF:', error);
      const pdf = new jsPDF();
      pdf.setFontSize(16);
      pdf.text(`${storeSettings.storeName} - Factura #${selectedOrder.orderNumber}`, 14, 20);
      pdf.setFontSize(10);
      pdf.text(`Cliente: ${selectedOrder.customerName}`, 14, 30);
      pdf.text(`Fecha: ${new Date(selectedOrder.createdAt).toLocaleString()}`, 14, 36);
      pdf.text(`Total: $${selectedOrder.total.toFixed(2)} USD`, 14, 42);
      let y = 54;
      pdf.text('Detalle de Artículos:', 14, y);
      y += 6;
      selectedOrder.items.forEach((item, idx) => {
        pdf.text(`${idx + 1}. ${item.productName} (x${item.quantity}) - $${item.subtotal.toFixed(2)} USD`, 14, y);
        y += 6;
      });
      pdf.save(`Factura-${selectedOrder.orderNumber}.pdf`);
      setDownloadSuccess('Factura PDF descargada');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setSelectedOrder(null)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 print:max-w-none print:shadow-none print:border-0 print:p-0 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Top bar (Hidden on Print) */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2.5 print:hidden sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 rounded-xl text-white">
              <Receipt className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-black">Factura Oficial #{selectedOrder.orderNumber}</h3>
              <p className="text-[9px] sm:text-[10px] text-slate-300">Documento de Venta y Garantía</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Download PDF button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              title="Descargar en formato PDF"
              className="px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isGeneratingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingPdf ? 'Generando...' : 'PDF'}</span>
            </button>

            {/* Send WhatsApp button */}
            <button
              onClick={() => {
                const message = `*BUSINESS ASOCIADOS*\n\n¡Hola ${selectedOrder.customerName}! 👋\nAquí está el comprobante de tu orden *${selectedOrder.orderNumber}* por un total de *${formatCurrency(selectedOrder.total)}*.\n\n_Tu pedido se encuentra actualmente en estado:_ *${selectedOrder.status.toUpperCase()}*\n\nSi tienes alguna duda o quieres consultarnos algo sobre este pedido, puedes responder a este chat y te ayudaremos con mucho gusto.\n\n¡Gracias por preferirnos!`;
                // Intenta limpiar el teléfono y asegurar código de país si es necesario. (Por simplicidad lo mandamos directo al wa.me, asumiendo formato internacional)
                const phone = (selectedOrder.customerPhone || '').replace(/\D/g, ''); 
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
              }}
              title="Enviar mensaje vía WhatsApp"
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <span className="hidden xs:inline">WhatsApp</span>
            </button>
            {/* Send Gmail button */}
            <button
              onClick={handleSendGmailInvoice}
              disabled={isSendingGmail}
              title="Enviar por Gmail"
              className="px-2.5 sm:px-3 py-1.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isSendingGmail ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                  <Mail className="w-3.5 h-3.5" />
              )}
              <span className="hidden xs:inline">{isSendingGmail ? 'Enviando...' : 'Gmail'}</span>
            </button>

            {/* Print button */}
            <button
              onClick={handlePrint}
              title="Imprimir documento"
              className="px-2.5 sm:px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Imprimir</span>
            </button>

            <button
              onClick={() => setSelectedOrder(null)}
              className="p-1.5 text-slate-400 hover:text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in duration-200 print:hidden">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{downloadSuccess}</span>
            </div>
            <button 
              onClick={() => setDownloadSuccess(null)}
              className="text-emerald-600 hover:text-emerald-800 text-[11px] font-bold underline cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Printable Invoice Sheet */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white" id="invoice-printable-area">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-slate-900 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#002147] text-white flex items-center justify-center font-black text-sm">
                  BA
                </div>
                <h1 className="text-2xl font-black tracking-tight text-[#002147] font-['Outfit']">
                  {storeSettings.storeName}
                </h1>
              </div>
              <p className="text-xs text-orange-600 font-bold tracking-widest mt-0.5">
                {storeSettings.storeSubtitle}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {storeSettings.address} • Tel: {storeSettings.phone}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {storeSettings.email}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
                COMPROBANTE DE VENTA
              </span>
              <span className="text-xl font-mono font-black text-[#002147] block mt-0.5">
                {selectedOrder.orderNumber}
              </span>
              <div className="text-xs text-slate-500 mt-1 font-mono">
                Fecha: {new Date(selectedOrder.createdAt).toLocaleDateString()} {new Date(selectedOrder.createdAt).toLocaleTimeString()}
              </div>
              <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                selectedOrder.status === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                selectedOrder.status === 'despachada' ? 'bg-blue-100 text-blue-800' :
                selectedOrder.status === 'cancelada' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                Estado: {selectedOrder.status}
              </span>
            </div>
          </div>

          {/* Client Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                Facturado a:
              </span>
              <div className="font-bold text-sm text-[#002147]">{selectedOrder.customerName}</div>
              <div className="text-slate-600 flex items-center gap-1 font-mono">
                <Mail className="w-3 h-3 text-slate-400" />
                {selectedOrder.customerEmail}
              </div>
              {selectedOrder.customerPhone && (
                <div className="text-slate-600 flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {selectedOrder.customerPhone}
                </div>
              )}
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider block">
                Detalles del Pago:
              </span>
              <div className="font-bold text-slate-800">
                Método: <strong className="text-orange-600 capitalize">{selectedOrder.paymentMethod === 'western_union' ? 'Western Union' : selectedOrder.paymentMethod}</strong>
              </div>
              <div className="text-slate-500">
                Moneda: USD ($)
              </div>
              {selectedOrder.notes && (
                <div className="text-slate-500 text-[11px] italic mt-1">
                  Obs: {selectedOrder.notes}
                </div>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Descripción del Producto</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-center">Cant.</th>
                  <th className="p-3 text-right">P. Unitario</th>
                  <th className="p-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {selectedOrder.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-sans font-bold text-[#002147]">
                      {item.productName}
                      <span className="text-[10px] font-normal text-slate-500 block font-sans">
                        Marca: {item.brand}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{item.sku}</td>
                    <td className="p-3 text-center font-bold">{item.quantity}</td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(item.price / 0.9)}
                        </span>
                        <span className="text-slate-700 font-bold">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency((item.price / 0.9) * item.quantity)}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & Equivalences */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            <div className="sm:col-span-7 space-y-3 text-xs text-slate-500">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600" />
                  Garantía del Producto
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Conserve esta factura para hacer válida la garantía de 1 año. Válido en todos los centros autorizados BUSINESS ASOCIADOS.
                </p>
              </div>

              {/* Currency Conversions Reference */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-[11px] font-mono">
                <div className="font-bold text-slate-700 font-sans">Equivalencias de Pago:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-slate-600 pt-0.5">
                  <div>USD: <strong className="text-slate-900 font-bold">{formatCurrency(selectedOrder.total, 'USD')}</strong></div>
                  <div>EUR: <strong className="text-slate-900 font-bold">{formatCurrency(selectedOrder.total, 'EUR')}</strong></div>
                  <div>CUP: <strong className="text-slate-900 font-bold">{formatCurrency(selectedOrder.total, 'CUP')}</strong></div>
                  <div>MLC: <strong className="text-slate-900 font-bold">{formatCurrency(selectedOrder.total, 'MLC')}</strong></div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-5 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Regular (Lista):</span>
                <span className="font-mono line-through font-bold">{formatCurrency(selectedOrder.subtotal / 0.9)}</span>
              </div>

              <div className="flex justify-between text-rose-600 font-bold bg-rose-50/80 px-2 py-1 rounded-lg border border-rose-100">
                <span className="flex items-center gap-1">
                  <span className="text-[9px] bg-rose-600 text-white px-1 py-0.2 rounded font-black">-10%</span>
                  Descuento Catálogo:
                </span>
                <span className="font-mono">-{formatCurrency((selectedOrder.subtotal / 0.9) - selectedOrder.subtotal)}</span>
              </div>

              <div className="flex justify-between text-slate-700 font-bold">
                <span>Subtotal con Descuento:</span>
                <span className="font-mono">{formatCurrency(selectedOrder.subtotal)}</span>
              </div>

              {selectedOrder.discount && selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Cupón Adicional {selectedOrder.couponCode ? `(${selectedOrder.couponCode})` : ''}:</span>
                  <span className="font-mono">-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}

              {selectedOrder.tax > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Impuesto / IVA:</span>
                  <span className="font-mono font-bold">{formatCurrency(selectedOrder.tax)}</span>
                </div>
              )}
              <div className="border-t-2 border-slate-900 pt-2 flex justify-between text-base font-black text-[#002147]">
                <div>
                  <span>Total Facturado:</span>
                </div>
                <span className="font-mono text-emerald-600 text-lg">{formatCurrency(selectedOrder.total)}</span>
              </div>
            </div>
          </div>

          {/* Quick Download & Actions Panel (Hidden on Print) */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-[#002147] to-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-orange-400">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Guardar o Descargar Factura</h4>
                <p className="text-[11px] text-slate-300">Disponible en formato PDF oficial o archivo de texto (.txt)</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex-1 sm:flex-initial px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                <span>{isGeneratingPdf ? 'Generando...' : 'Descargar PDF'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-white/20"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Texto (.TXT)</span>
              </button>

              <button
                onClick={handleSendGmailInvoice}
                disabled={isSendingGmail}
                className="flex-1 sm:flex-initial px-3.5 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                title="Enviar factura al correo del cliente vía Gmail"
              >
                {isSendingGmail ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Mail className="w-4 h-4" />
                )}
                <span>{isSendingGmail ? 'Enviando...' : 'Enviar Gmail'}</span>
              </button>
            </div>
          </div>

          {/* Status changer for Admin (Hidden on Print) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden text-center sm:text-left">
            <span className="text-xs font-bold text-slate-700">Cambiar estado del pedido:</span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {(['pendiente', 'completada', 'despachada', 'cancelada'] as Order['status'][]).map(st => (
                <button
                  key={st}
                  onClick={() => updateOrderStatus(selectedOrder.id, st)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all ${
                    selectedOrder.status === st
                      ? 'bg-[#002147] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
