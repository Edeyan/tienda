import React from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, RotateCcw, Truck, CreditCard, FileCheck2, HelpCircle } from 'lucide-react';

export const PoliciesModal: React.FC = () => {
  const { policiesModalOpen, setPoliciesModalOpen, storeSettings } = useApp();

  if (!policiesModalOpen) return null;

  const policyItems = [
    {
      id: 'devoluciones',
      title: '1. Devoluciones & Cambios',
      icon: RotateCcw,
      content: storeSettings.policies.devoluciones
    },
    {
      id: 'garantia',
      title: '2. Garantía Comercial',
      icon: ShieldCheck,
      content: storeSettings.policies.garantia
    },
    {
      id: 'envios',
      title: '3. Envíos & Entregas',
      icon: Truck,
      content: storeSettings.policies.envios
    },
    {
      id: 'pagos',
      title: '4. Formas de Pago',
      icon: CreditCard,
      content: storeSettings.policies.pagos
    },
    {
      id: 'facturacion',
      title: '5. Facturación & Comprobantes',
      icon: FileCheck2,
      content: storeSettings.policies.facturacion
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setPoliciesModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-xl max-h-[85vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black">Políticas, Garantías y Reglas</h3>
              <p className="text-xs text-blue-200">Normativa oficial y condiciones comerciales</p>
            </div>
          </div>

          <button
            onClick={() => setPoliciesModalOpen(false)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Policies */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          {policyItems.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                <div className="flex items-center gap-2 font-black text-xs text-[#002147]">
                  <span className="p-1 rounded-lg bg-orange-100 text-orange-600">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed font-sans">
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            ¿Dudas adicionales? Contáctanos a <strong className="text-slate-800">{storeSettings.email}</strong>
          </div>
          <button
            onClick={() => setPoliciesModalOpen(false)}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
