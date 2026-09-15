import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order } from '../../types';
import { 
  Receipt, 
  Search, 
  Eye, 
  Printer, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Trash2, 
  Filter,
  DollarSign,
  Download,
  FileSpreadsheet,
  TrendingUp,
  CreditCard,
  Banknote,
  Send,
  Globe,
  Bell,
  BellRing,
  Smartphone
} from 'lucide-react';
import { OrderPushModal } from './OrderPushModal';

export const OrderManager: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder, setSelectedOrder, storeSettings, notifyOrderPush, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [pushModalOrder, setPushModalOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || o.paymentMethod === paymentFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(o.createdAt);
      const today = new Date();
      if (dateFilter === 'today') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'this_week') {
        // Monday of current week
        const day = today.getDay() || 7; // Get current day number, converting Sun. to 7
        if (day !== 1) today.setHours(-24 * (day - 1)); // Set to Monday
        today.setHours(0, 0, 0, 0);
        matchesDate = orderDate >= today;
      } else if (dateFilter === 'this_month') {
        matchesDate = orderDate.getMonth() === today.getMonth() && orderDate.getFullYear() === today.getFullYear();
      }
    }

    const matchesSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesPayment && matchesDate && matchesSearch;
  });

  // Financial Stats
  const validOrders = orders.filter(o => o.status !== 'cancelada');
  const totalRevenue = validOrders.reduce((s, o) => s + o.total, 0);
  const cashRevenue = validOrders.filter(o => o.paymentMethod === 'efectivo').reduce((s, o) => s + o.total, 0);
  const wuRevenue = validOrders.filter(o => o.paymentMethod === 'western_union').reduce((s, o) => s + o.total, 0);
  const zelleRevenue = validOrders.filter(o => o.paymentMethod === 'zelle').reduce((s, o) => s + o.total, 0);
  const transferRevenue = validOrders.filter(o => o.paymentMethod === 'transferencia').reduce((s, o) => s + o.total, 0);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completada':
        return (
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Pagada
          </span>
        );
      case 'despachada':
        return (
          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
            <Truck className="w-3 h-3" /> Despachada
          </span>
        );
      case 'cancelada':
        return (
          <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelada
          </span>
        );
      default:
        return (
          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-[10px] uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
    }
  };

  // Export to CSV Function
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = ['Numero_Factura', 'Fecha', 'Cliente', 'Email', 'Telefono', 'Metodo_Pago', 'Subtotal', 'Descuento', 'Impuesto', 'Total_USD', 'Estado', 'Items'];
    
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString()}"`,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.customerEmail}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.paymentMethod}"`,
      o.subtotal.toFixed(2),
      (o.discount || 0).toFixed(2),
      o.tax.toFixed(2),
      o.total.toFixed(2),
      `"${o.status}"`,
      `"${o.items.map(i => `${i.productName} (x${i.quantity})`).join('; ').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_Ventas_BusinessAsociados_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <h3 className="text-lg font-black text-[#002147]">Facturas, Cierre de Caja y Pedidos</h3>
          <p className="text-xs text-slate-500">Historial completo de ventas, cobros, comprobantes y exportación contable</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Reporte (CSV / Excel)</span>
          </button>
        </div>
      </div>

      {/* Cierre de Caja / Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 bg-gradient-to-br from-[#002147] to-slate-900 text-white rounded-2xl shadow-sm space-y-1">
          <div className="flex items-center justify-between text-blue-200 text-xs font-semibold">
            <span>Total Facturado (Activo)</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black font-mono text-emerald-400">${totalRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-slate-300">{validOrders.length} transacciones registradas</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Efectivo en Caja</span>
            <Banknote className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-black font-mono text-slate-800">${cashRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Cobro en tienda / mostrador</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Western Union</span>
            <Globe className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-black font-mono text-slate-800">${wuRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Remesas internacionales</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Zelle</span>
            <Send className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-black font-mono text-slate-800">${zelleRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Pagos directos Zelle</span>
        </div>

        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Transferencias</span>
            <Receipt className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-black font-mono text-slate-800">${transferRevenue.toFixed(2)}</p>
          <span className="text-[10px] text-slate-400">Cuentas y bancos</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            placeholder="Buscar por número de factura, cliente o correo..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
          />
        </div>

        <select
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          className="w-full sm:w-36 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs cursor-pointer"
        >
          <option value="all">Todas las Fechas</option>
          <option value="today">Hoy</option>
          <option value="this_week">Esta Semana</option>
          <option value="this_month">Este Mes</option>
        </select>

        <select
          value={paymentFilter}
          onChange={e => setPaymentFilter(e.target.value)}
          className="w-full sm:w-44 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs cursor-pointer"
        >
          <option value="all">Todos los Métodos</option>
          <option value="efectivo">Efectivo</option>
          <option value="western_union">Western Union</option>
          <option value="zelle">Zelle</option>
          <option value="transferencia">Transferencia</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs cursor-pointer"
        >
          <option value="all">Todos los Estados</option>
          <option value="pendiente">Pendientes</option>
          <option value="completada">Completadas / Pagadas</option>
          <option value="despachada">Despachadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Factura #</th>
                <th className="p-3.5">Cliente</th>
                <th className="p-3.5">Ítems</th>
                <th className="p-3.5 text-right">Total</th>
                <th className="p-3.5">Método / Fecha</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No se encontraron órdenes registradas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-mono font-black text-[#002147]">
                      <div className="flex items-center gap-1.5">
                        <span>{order.orderNumber}</span>
                        {order.couponCode && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded font-sans" title={`Cupón ${order.couponCode}`}>
                            {order.couponCode}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{order.customerName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{order.customerEmail}</div>
                    </td>

                    <td className="p-3.5 text-slate-600">
                      <span className="font-bold">{order.items.length} productos</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[150px]">
                        {order.items.map(i => i.productName).join(', ')}
                      </span>
                    </td>

                    <td className="p-3.5 text-right font-mono font-black text-emerald-600 text-sm">
                      ${order.total.toFixed(2)}
                    </td>

                    <td className="p-3.5 text-slate-500">
                      <span className="capitalize font-bold text-slate-700 block">
                        {order.paymentMethod === 'western_union' ? 'Western Union' : order.paymentMethod}
                      </span>
                      <span className="text-[10px] font-mono">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>

                    <td className="p-3.5 text-center">
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                        className="text-[10px] font-bold px-2 py-1 rounded-xl uppercase border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="completada">Completada</option>
                        <option value="despachada">Despachada</option>
                        <option value="cancelada">Cancelada</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPushModalOrder(order)}
                          className="px-2 py-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-lg transition-all flex items-center gap-1 text-[11px] font-bold cursor-pointer border border-orange-200"
                          title="Enviar Alerta Push FCM directa al móvil del cliente"
                        >
                          <Smartphone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Alerta Móvil</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            notifyOrderPush(order, order.status);
                            showToast(`🔔 Alerta Push de la orden ${order.orderNumber} reenviada al cliente`, 'success');
                          }}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Reenviar Notificación Push FCM rápida"
                        >
                          <BellRing className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Ver Factura e Imprimir"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la orden ${order.orderNumber}?`)) {
                              deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar orden"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Mobile Order Push Alert Modal */}
      <OrderPushModal
        isOpen={Boolean(pushModalOrder)}
        order={pushModalOrder}
        onClose={() => setPushModalOrder(null)}
      />
    </div>
  );
};
