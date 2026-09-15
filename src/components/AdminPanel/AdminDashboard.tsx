import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Eye
} from 'lucide-react';
import { sectionLabels } from '../../data/initialData';

export const AdminDashboard: React.FC = () => {
  const { products, orders, users, setAdminTab, setSelectedOrder, setSelectedProduct } = useApp();

  // Metrics
  const totalRevenue = orders
    .filter(o => o.status !== 'cancelada')
    .reduce((sum, o) => sum + o.total, 0);

  const completedOrders = orders.filter(o => o.status === 'completada').length;
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length;
  const lowStockProducts = products.filter(p => (p.stock ?? 0) <= 5);

  // Sales by Category
  const categorySalesMap: Record<string, number> = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const prod = products.find(p => p.id === item.productId);
      const section = prod?.section || 'otros';
      categorySalesMap[section] = (categorySalesMap[section] || 0) + item.subtotal;
    });
  });

  const categorySalesList = Object.entries(categorySalesMap).map(([section, total]) => ({
    section,
    label: sectionLabels[section] || section,
    total
  })).sort((a, b) => b.total - a.total);

  const maxCatTotal = Math.max(...categorySalesList.map(c => c.total), 100);

  return (
    <div className="space-y-6">
      {/* Top Welcome / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#002147] to-slate-900 text-white p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight font-['Outfit']">
            Panel de Control y Métricas
          </h2>
          <p className="text-xs text-blue-200 mt-1">
            Supervisión integral de ventas, inventario de catálogo y usuarios registrados.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdminTab('products')}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Package className="w-4 h-4" />
            Gestionar Productos
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ingresos Totales</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#002147] font-mono">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{orders.length} pedidos registrados</span>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Facturación & Pedidos</span>
            <div className="p-2.5 bg-orange-50 text-orange-600 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#002147] font-mono">
              {orders.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2 mt-1">
              <span className="text-amber-600 font-bold">{pendingOrders} pendientes</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">{completedOrders} pagadas</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Productos en Catálogo</span>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-2xl">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#002147] font-mono">
              {products.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-1">
              {lowStockProducts.length > 0 ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {lowStockProducts.length} con stock bajo
                </span>
              ) : (
                <span className="text-emerald-600 font-semibold">Stock óptimo</span>
              )}
            </div>
          </div>
        </div>

        {/* Registered Users */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Usuarios Registrados</span>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-2xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black text-[#002147] font-mono">
              {users.length}
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <span className="text-purple-700 font-bold">{users.filter(u => u.role === 'admin').length} Admins</span>
              <span>•</span>
              <span>{users.filter(u => u.role === 'customer').length} Clientes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Orders & Sales Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-7 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-[#002147]">Últimas Facturas y Pedidos</h3>
              <p className="text-[11px] text-slate-500">Transacciones generadas recientemente</p>
            </div>
            <button
              onClick={() => setAdminTab('orders')}
              className="text-xs text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {orders.slice(0, 5).map(order => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-3 bg-slate-50 hover:bg-orange-50/50 rounded-2xl border border-slate-200/70 flex items-center justify-between cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-xs text-slate-700 shadow-2xs">
                    {order.orderNumber.split('-').pop()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-[#002147] truncate group-hover:text-orange-600">
                      {order.customerName}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {order.items.length} productos • {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'completada' ? 'bg-emerald-100 text-emerald-800' :
                    order.status === 'despachada' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'cancelada' ? 'bg-rose-100 text-rose-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {order.status}
                  </span>
                  <div className="text-right font-mono font-black text-xs text-slate-900">
                    ${order.total.toFixed(2)}
                  </div>
                  <Eye className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown & Low Stock Warnings */}
        <div className="lg:col-span-5 space-y-6">
          {/* Sales breakdown */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#002147]">Rendimiento por Categoría</h3>
              <p className="text-[11px] text-slate-500">Distribución de ingresos generados</p>
            </div>

            <div className="space-y-3">
              {categorySalesList.length > 0 ? (
                categorySalesList.slice(0, 5).map(cat => {
                  const percent = Math.min(100, Math.round((cat.total / maxCatTotal) * 100));
                  return (
                    <div key={cat.section} className="space-y-1 text-xs">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{cat.label}</span>
                        <span className="font-mono text-emerald-600">${cat.total.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">No hay ventas registradas aún.</p>
              )}
            </div>
          </div>

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-4 sm:p-5 rounded-3xl space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Alerta de Inventario (Bajo Stock &lt; 5)</span>
                </div>
                <button
                  onClick={() => setAdminTab('products')}
                  className="text-[11px] font-bold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1"
                >
                  Gestionar <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 4).map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-rose-100 text-xs cursor-pointer hover:border-rose-300 transition-all group"
                  >
                    <span className="font-bold text-slate-800 truncate max-w-[180px] group-hover:text-rose-700">{p.name}</span>
                    <span className="font-mono font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full text-[10px]">
                      {p.stock ?? 0} unid.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
