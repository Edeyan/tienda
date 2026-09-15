import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calculator, Delete, RotateCcw } from 'lucide-react';

export const CalculatorModal: React.FC = () => {
  const { calcModalOpen, setCalcModalOpen } = useApp();
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [hasCalculated, setHasCalculated] = useState(false);

  // Safe expression evaluator without eval / new Function security issues
  const safeEvaluate = (expr: string): string => {
    if (!expr || !expr.trim()) return '0';
    try {
      // Replace display operators with JS operators
      let clean = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '.')
        .replace(/\s+/g, '');

      // Remove trailing operators if user didn't finish expression
      while (clean.length > 0 && ['+', '-', '*', '/'].includes(clean[clean.length - 1])) {
        clean = clean.slice(0, -1);
      }

      if (!clean) return '0';

      // Validate allowed characters strictly: numbers, decimal points, + - * / ( )
      if (!/^[0-9+\-*/.()]+$/.test(clean)) {
        return 'Error';
      }

      // Check for division by zero before or during evaluation
      if (/\/0(?![0-9.])/.test(clean)) {
        return 'Indefinido';
      }

      // Evaluate safely via math tokens or Function with sanitized input
      const computed = Function(`"use strict"; return (${clean});`)();
      
      if (typeof computed === 'number' && Number.isFinite(computed)) {
        // Round cleanly to max 6 decimal places avoiding float anomalies like 0.1+0.2 = 0.30000000000000004
        const rounded = Number(Math.round(Number(computed + 'e+6')) + 'e-6');
        return String(rounded);
      }
      return 'Error';
    } catch {
      return 'Error';
    }
  };

  const handleInput = useCallback((val: string) => {
    if (val === 'C') {
      setExpression('');
      setResult('0');
      setHasCalculated(false);
      return;
    }

    if (val === '⌫') {
      if (hasCalculated) {
        setExpression('');
        setResult('0');
        setHasCalculated(false);
        return;
      }
      const next = expression.slice(0, -1);
      setExpression(next);
      if (!next) {
        setResult('0');
      } else {
        const preview = safeEvaluate(next);
        if (preview !== 'Error' && preview !== 'Indefinido') {
          setResult(preview);
        }
      }
      return;
    }

    if (val === '=') {
      if (!expression) return;
      const evaluated = safeEvaluate(expression);
      setResult(evaluated);
      if (evaluated !== 'Error' && evaluated !== 'Indefinido') {
        setExpression(expression + ' =');
        setHasCalculated(true);
      }
      return;
    }

    const ops = ['+', '-', '×', '÷'];
    const isValOp = ops.includes(val);

    // If we just calculated and user presses an operator, continue with result
    if (hasCalculated) {
      setHasCalculated(false);
      if (isValOp) {
        const startExpr = (result === 'Error' || result === 'Indefinido' ? '0' : result) + val;
        setExpression(startExpr);
        return;
      } else {
        // User typed a number or decimal: start fresh
        setExpression(val === '.' ? '0.' : val);
        setResult(val === '.' ? '0' : val);
        return;
      }
    }

    const lastChar = expression.slice(-1);

    // Prevent consecutive operators, replace last operator with new one
    if (isValOp && ops.includes(lastChar)) {
      const nextExpr = expression.slice(0, -1) + val;
      setExpression(nextExpr);
      return;
    }

    // Prevent starting with an operator except minus
    if (expression === '' && isValOp && val !== '-') {
      return;
    }

    // Prevent duplicate decimals in same number chunk
    if (val === '.') {
      const segments = expression.split(/[+\-×÷]/);
      const currentSegment = segments[segments.length - 1] || '';
      if (currentSegment.includes('.')) {
        return;
      }
      const nextExpr = expression === '' || ops.includes(lastChar) ? expression + '0.' : expression + '.';
      setExpression(nextExpr);
      return;
    }

    if (val === '00') {
      if (!expression || ops.includes(lastChar)) {
        setExpression(expression + '0');
        return;
      }
    }

    const nextExpr = expression + val;
    setExpression(nextExpr);
    
    // Live preview update
    const preview = safeEvaluate(nextExpr);
    if (preview !== 'Error' && preview !== 'Indefinido') {
      setResult(preview);
    }
  }, [expression, result, hasCalculated]);

  // Support physical keyboard typing
  useEffect(() => {
    if (!calcModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCalcModalOpen(false);
        return;
      }
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === '.' || e.key === ',') {
        handleInput('.');
      } else if (e.key === '+') {
        handleInput('+');
      } else if (e.key === '-') {
        handleInput('-');
      } else if (e.key === '*' || e.key === 'x' || e.key === 'X') {
        handleInput('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleInput('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleInput('=');
      } else if (e.key === 'Backspace') {
        handleInput('⌫');
      } else if (e.key.toLowerCase() === 'c') {
        handleInput('C');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [calcModalOpen, handleInput, setCalcModalOpen]);

  if (!calcModalOpen) return null;

  const buttonRows = [
    [
      { label: 'C', type: 'clear' },
      { label: '⌫', type: 'backspace' },
      { label: '÷', type: 'op' },
      { label: '×', type: 'op' },
    ],
    [
      { label: '7', type: 'num' },
      { label: '8', type: 'num' },
      { label: '9', type: 'num' },
      { label: '-', type: 'op' },
    ],
    [
      { label: '4', type: 'num' },
      { label: '5', type: 'num' },
      { label: '6', type: 'num' },
      { label: '+', type: 'op' },
    ],
    [
      { label: '1', type: 'num' },
      { label: '2', type: 'num' },
      { label: '3', type: 'num' },
      { label: '00', type: 'num' },
    ],
    [
      { label: '0', type: 'num' },
      { label: '.', type: 'num' },
      { label: '=', type: 'equal', span: 2 },
    ],
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200 cursor-pointer"
      onClick={() => setCalcModalOpen(false)}
    >
      <div 
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-200 flex flex-col animate-in zoom-in-95 duration-200 cursor-default"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#002147] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-orange-500 rounded-xl text-white shadow-sm shadow-orange-500/30">
              <Calculator className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black tracking-wide">Calculadora Comercial</h3>
              <p className="text-[10px] text-blue-200">Presupuestos y cálculos de pedidos</p>
            </div>
          </div>
          <button
            onClick={() => setCalcModalOpen(false)}
            className="p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 bg-slate-950 text-white text-right space-y-1.5 font-mono shadow-inner border-b border-slate-800">
          <div className="text-xs text-slate-400 min-h-[18px] break-all tracking-wider select-text">
            {expression || ' '}
          </div>
          <div className="text-3xl font-black text-amber-400 break-all tracking-wide select-text">
            {result}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="p-4 bg-slate-50 flex flex-col gap-2.5">
          {buttonRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-2.5">
              {row.map((btn, colIndex) => {
                const isEq = btn.type === 'equal';
                const isOp = btn.type === 'op';
                const isClear = btn.type === 'clear' || btn.type === 'backspace';

                return (
                  <button
                    key={colIndex}
                    onClick={() => handleInput(btn.label)}
                    className={`py-3.5 rounded-2xl font-bold font-mono text-base transition-all active:scale-95 select-none shadow-xs flex items-center justify-center ${
                      btn.span === 2 ? 'col-span-2' : ''
                    } ${
                      isEq
                        ? 'bg-amber-500 hover:bg-amber-600 text-white font-black text-lg shadow-amber-500/25'
                        : isOp
                        ? 'bg-[#002147] text-white hover:bg-slate-800'
                        : isClear
                        ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 font-bold'
                        : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer info & shortcut note */}
        <div className="px-4 py-3 bg-slate-100/80 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Teclado físico habilitado (0-9, +, -, *, /, =)</span>
          <button
            onClick={() => setCalcModalOpen(false)}
            className="font-bold text-slate-700 hover:text-slate-950 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
