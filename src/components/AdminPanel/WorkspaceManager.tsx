import React from 'react';
import { Cloud, Mail } from 'lucide-react';
import { GmailManager } from './GmailManager';

export const WorkspaceManager: React.FC = () => {

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800/60 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Cloud className="w-48 h-48 text-indigo-300 transform rotate-[-15deg]" />
        </div>
        
        <div className="flex items-center gap-4 flex-1 relative z-10">
          <div className="flex -space-x-3">
            <div className="p-3 bg-rose-600 rounded-full text-white shadow-inner border-2 border-slate-900 relative z-0">
              <Mail className="w-6 h-6 text-rose-200" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xl font-black tracking-tight font-['Outfit']">Google Workspace Hub</h4>
              <span className="text-[10px] font-bold bg-indigo-400/20 text-indigo-300 border border-indigo-300/30 px-2 py-0.5 rounded-full uppercase">
                OAuth 2.0
              </span>
            </div>
            <p className="text-sm text-indigo-200/80 mt-1 max-w-xl">
              Gestiona el soporte al cliente a través de Gmail directamente desde tu panel.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <GmailManager />
      </div>
    </div>
  );
};
