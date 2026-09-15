import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Camera, 
  Upload, 
  Search, 
  QrCode, 
  Flashlight, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  PackageCheck,
  FileText
} from 'lucide-react';
import jsQR from 'jsqr';
import { useApp } from '../context/AppContext';

export const QRScannerModal: React.FC = () => {
  const { 
    qrScannerOpen, 
    setQrScannerOpen, 
    products, 
    setSelectedProduct, 
    orders, 
    setSelectedOrder, 
    setTrackingModalOpen,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [torchOn, setTorchOn] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop camera stream safely
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Start camera stream
  const startCamera = async () => {
    stopCamera();
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: cameraFacing,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setHasCameraPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(tick);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setHasCameraPermission(false);
      setIsScanning(false);
    }
  };

  // Toggle flashlight / torch if supported
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track && 'applyConstraints' in track) {
      try {
        const newTorchState = !torchOn;
        await (track as any).applyConstraints({
          advanced: [{ torch: newTorchState }]
        });
        setTorchOn(newTorchState);
      } catch (e) {
        showToast('Linterna no soportada en este dispositivo', 'info');
      }
    }
  };

  // Process video frames for QR detection
  const tick = () => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });

          if (code && code.data && code.data.trim().length > 0) {
            handleScanSuccess(code.data.trim());
            return; // stop scanning after successful detection
          }
        }
      }
    }

    if (qrScannerOpen && activeTab === 'camera') {
      animationFrameRef.current = requestAnimationFrame(tick);
    }
  };

  // Handle scanned payload
  const handleScanSuccess = (rawData: string) => {
    stopCamera();
    setScannedResult(rawData);

    // Audio / Vibrate feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([80, 50, 80]);
    }

    // Identify if it matches a product
    const cleanQuery = rawData.toLowerCase().trim();
    const matchedProduct = products.find(p => 
      p.id.toLowerCase() === cleanQuery ||
      p.sku.toLowerCase() === cleanQuery ||
      (p.specs && Object.values(p.specs).some(v => String(v).toLowerCase() === cleanQuery)) ||
      p.name.toLowerCase().includes(cleanQuery)
    );

    // Identify if it matches an order
    const matchedOrder = orders.find(o => 
      o.id.toLowerCase() === cleanQuery || 
      o.trackingNumber?.toLowerCase() === cleanQuery
    );

    if (matchedProduct) {
      showToast(`✨ Producto detectado: ${matchedProduct.name}`, 'success');
    } else if (matchedOrder) {
      showToast(`📦 Pedido detectado: ${matchedOrder.id}`, 'info');
    } else {
      showToast('Código QR leído correctamente', 'success');
    }
  };

  // Process static file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          });
          if (code && code.data) {
            handleScanSuccess(code.data.trim());
          } else {
            showToast('No se detectó ningún código QR en la imagen', 'warning');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Action on product match
  const handleOpenProduct = (product: any) => {
    setSelectedProduct(product);
    setQrScannerOpen(false);
  };

  // Action on order match
  const handleOpenOrder = (order: any) => {
    setSelectedOrder(order);
    setTrackingModalOpen(true);
    setQrScannerOpen(false);
  };

  // Restart scanner
  const handleRescan = () => {
    setScannedResult(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  // Effect to manage camera lifecycle
  useEffect(() => {
    if (qrScannerOpen && activeTab === 'camera' && !scannedResult) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [qrScannerOpen, activeTab, cameraFacing, scannedResult]);

  if (!qrScannerOpen) return null;

  // Resolve matching entity
  const matchedProduct = scannedResult
    ? products.find(p => 
        p.id.toLowerCase() === scannedResult.toLowerCase().trim() ||
        p.sku.toLowerCase() === scannedResult.toLowerCase().trim() ||
        (p.specs && Object.values(p.specs).some(v => String(v).toLowerCase() === scannedResult.toLowerCase().trim())) ||
        p.name.toLowerCase().includes(scannedResult.toLowerCase().trim())
      )
    : null;

  const matchedOrder = scannedResult
    ? orders.find(o => 
        o.id.toLowerCase() === scannedResult.toLowerCase().trim() ||
        o.trackingNumber?.toLowerCase() === scannedResult.toLowerCase().trim()
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#002147] to-[#0a3a70] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black leading-tight flex items-center gap-2">
                Escáner QR & Código
              </h2>
              <p className="text-xs text-blue-200 font-mono">Lectura en tiempo real de artículos y pedidos</p>
            </div>
          </div>

          <button
            onClick={() => setQrScannerOpen(false)}
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('camera'); setScannedResult(null); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'camera' 
                ? 'bg-white text-[#002147] shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4 text-orange-500" />
            Cámara en Vivo
          </button>

          <button
            onClick={() => { setActiveTab('upload'); setScannedResult(null); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload' 
                ? 'bg-white text-[#002147] shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-500" />
            Cargar Imagen
          </button>

          <button
            onClick={() => { setActiveTab('manual'); setScannedResult(null); }}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'manual' 
                ? 'bg-white text-[#002147] shadow-xs' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-500" />
            Código Manual
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 flex-1 overflow-y-auto">
          {scannedResult ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Código Detectado</span>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 text-xs font-mono font-semibold text-slate-800 break-all select-all">
                    {scannedResult}
                  </div>
                </div>
              </div>

              {/* Matched Product Card */}
              {matchedProduct && (
                <div className="p-4 bg-gradient-to-br from-slate-900 to-[#002147] text-white rounded-2xl border border-slate-800 space-y-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={matchedProduct.image} 
                      alt={matchedProduct.name} 
                      className="w-16 h-16 rounded-xl object-contain bg-white p-1 border border-slate-700 shrink-0" 
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase">{matchedProduct.sku}</span>
                      <h4 className="text-sm font-black truncate">{matchedProduct.name}</h4>
                      <p className="text-xs text-blue-200">${matchedProduct.price.toFixed(2)} USD • Stock: {matchedProduct.stock}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenProduct(matchedProduct)}
                    className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-orange-500/20"
                  >
                    <PackageCheck className="w-4 h-4" />
                    Ver Ficha de Producto y Comprar
                  </button>
                </div>
              )}

              {/* Matched Order Card */}
              {matchedOrder && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Factura #{matchedOrder.id}
                  </div>
                  <p className="text-xs text-slate-600">
                    Cliente: <b>{matchedOrder.customerName}</b> • Total: <b>${matchedOrder.total.toFixed(2)} USD</b>
                  </p>
                  <button
                    onClick={() => handleOpenOrder(matchedOrder)}
                    className="w-full py-2 bg-[#002147] hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Rastrear Factura
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleRescan}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Escanear Otro
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(scannedResult);
                    showToast('Copiado al portapapeles', 'info');
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Copiar
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'camera' && (
                <div className="space-y-4">
                  <div className="relative aspect-square max-h-[300px] mx-auto bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-slate-300">
                    <video 
                      ref={videoRef} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      muted 
                      playsInline 
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Scanning overlay frame & laser animation */}
                    {isScanning && (
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                        <div className="w-48 h-48 border-2 border-orange-500 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                          {/* Corner markers */}
                          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-orange-400 rounded-tl" />
                          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-orange-400 rounded-tr" />
                          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-orange-400 rounded-bl" />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-orange-400 rounded-br" />

                          {/* Animated laser line */}
                          <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_#f97316] animate-bounce mt-24" />
                        </div>
                        <span className="text-[11px] font-bold text-white/90 bg-slate-900/80 px-3 py-1 rounded-full mt-3 backdrop-blur-xs font-mono">
                          Apunta al código QR o código de barra
                        </span>
                      </div>
                    )}

                    {hasCameraPermission === false && (
                      <div className="absolute inset-0 bg-slate-900/90 text-white p-6 flex flex-col items-center justify-center text-center space-y-3">
                        <AlertCircle className="w-10 h-10 text-amber-400" />
                        <div>
                          <p className="text-xs font-bold">Permiso de cámara no concedido</p>
                          <p className="text-[11px] text-slate-300 mt-1">Por favor permite el acceso a la cámara o usa la pestaña "Cargar Imagen".</p>
                        </div>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all cursor-pointer"
                        >
                          Reintentar Acceso
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Camera control buttons */}
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Girar Cámara
                    </button>

                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`px-3.5 py-1.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                        torchOn 
                          ? 'bg-amber-500 text-white shadow-md' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <Flashlight className="w-3.5 h-3.5" />
                      Linterna
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div className="space-y-4 text-center py-4">
                  <label className="border-2 border-dashed border-slate-300 hover:border-orange-500 bg-slate-50 hover:bg-orange-50/30 transition-all rounded-3xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-orange-500 group-hover:scale-105 transition-all">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Haz clic o arrastra una imagen con código QR</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Formatos soportados: PNG, JPG, WEBP</p>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {activeTab === 'manual' && (
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Introduce SKU, ID de Producto o Código:</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ej. GP-C181, 11812, MP-CS3BD, ORD-1234..."
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && manualCode.trim()) {
                            handleScanSuccess(manualCode.trim());
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500 pr-10"
                      />
                      <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    disabled={!manualCode.trim()}
                    onClick={() => manualCode.trim() && handleScanSuccess(manualCode.trim())}
                    className="w-full py-2.5 bg-[#002147] hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Consultar Código
                  </button>

                  {/* Quick sample chips */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Códigos de prueba rápidos
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['11812', '11803', 'MP-CS3BD', '10012', 'mzk_1'].map(code => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => handleScanSuccess(code)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-600 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer"
                        >
                          {code}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
