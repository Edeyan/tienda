import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Save, Check, Trash2, Copy } from 'lucide-react';

export const NotesModal: React.FC = () => {
  const { notesModalOpen, setNotesModalOpen, notes, saveNotes, showToast } = useApp();
  const [text, setText] = useState(notes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!notesModalOpen) return null;

  const handleSave = () => {
    saveNotes(text);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    showToast('Notas copiadas al portapapeles', 'info');
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setNotesModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#002147] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-500 rounded-xl text-white">
              <FileText className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black">Bloc de Notas del Negocio</h3>
              <p className="text-[10px] text-blue-200">Anotaciones de clientes, pedidos y pendientes</p>
            </div>
          </div>

          <button
            onClick={() => setNotesModalOpen(false)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-3">
          <textarea
            rows={10}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            placeholder="Escribe tus notas, pedidos especiales, presupuestos pendientes o recordatorios aquí..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:outline-none font-sans leading-relaxed resize-none"
          />

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Presiona <kbd className="bg-slate-100 border border-slate-300 px-1 rounded text-slate-700 font-mono">Ctrl + Enter</kbd> para guardar</span>
            <span>{text.length} caracteres</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setText('')}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl text-xs transition-all"
              title="Borrar todo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl text-xs transition-all"
              title="Copiar texto"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotesModalOpen(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-black text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                savedSuccess
                  ? 'bg-emerald-600 shadow-emerald-600/30'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
              }`}
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? '¡Guardado!' : 'Guardar Notas'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
