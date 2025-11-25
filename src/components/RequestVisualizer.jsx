import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Server, Shield, Lock, Check, X, FileJson, Search, ArrowRight } from 'lucide-react';

const RequestVisualizer = ({ result, isSimulating }) => {
  const [step, setStep] = useState('idle');
  const [message, setMessage] = useState('Listo para simular');

  useEffect(() => {
    if (isSimulating && result) {
      runSimulation();
    } else if (!isSimulating) {
      setStep('idle');
      setMessage('Listo para simular');
    }
  }, [isSimulating, result]);

  const runSimulation = async () => {
    setStep('idle');
    
    const hasPreflight = result.logs.some(l => l.message.includes('Preflight') || l.message.includes('OPTIONS'));
    const isBlocked = result.status === 0;
    const errorType = result.error ? (result.error.includes('Origin') ? 'origin' : result.error.includes('Method') ? 'method' : 'headers') : null;

    // --- Phase 1: Preflight (Optional) ---
    if (hasPreflight) {
      setStep('preflight_start');
      setMessage('Iniciando Preflight (OPTIONS)...');
      await wait(1000);

      setStep('preflight_travel');
      setMessage('Verificando permisos...');
      await wait(1000);

      setStep('preflight_check');
      await wait(1500);

      if (isBlocked && (errorType === 'method' || errorType === 'headers')) {
        setStep('preflight_blocked');
        setMessage('Bloqueo CORS (Preflight)');
        return;
      }

      setStep('preflight_return');
      setMessage('Preflight Aprobado');
      await wait(1000);
    }

    // --- Phase 2: Main Request ---
    setStep('request_start');
    setMessage(`Enviando ${result.method}...`);
    await wait(800);

    setStep('request_travel');
    await wait(1000);

    if (isBlocked && !hasPreflight) {
       setStep('request_blocked');
       setMessage('Bloqueo CORS (Origen)');
       return;
    }

    setStep('server_processing');
    setMessage('Procesando...');
    await wait(1200);

    setStep('response_return');
    setMessage('Respuesta Recibida');
  };

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  return (
    <div className="w-full py-10 md:py-20 mb-8 md:mb-12 select-none overflow-hidden">
      {/* Status Text - Minimalist & Refined */}
      <div className="h-12 flex justify-center items-center mb-12 md:mb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(8px)' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-[#0a0a0a]/80 border border-white/10 backdrop-blur-xl shadow-2xl max-w-[90vw] truncate"
          >
            {step !== 'idle' && !message.includes('Bloqueo') && (
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </div>
            )}
            {message.includes('Bloqueo') && (
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </div>
            )}
            <span className="text-[10px] md:text-xs font-medium text-gray-200 font-sans tracking-wide truncate">
              {message}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-between px-4 md:px-32 max-w-5xl mx-auto">
        
        {/* Connecting Line - Animated SVG */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 -z-10 mx-12 md:mx-28 h-[2px]">
            {/* Base Line (Dashed) */}
            <div className="absolute inset-0 border-b border-dashed border-white/10" />
            
            {/* Active Beam */}
            {(step !== 'idle' && !step.includes('blocked')) && (
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[1px] w-1/3 blur-[2px]"
                    animate={{ left: ['-30%', '130%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            )}
        </div>

        {/* CLIENT NODE */}
        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 group">
          <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-[#050505] border border-[#222] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-[#444] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] z-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Globe className="text-gray-500 group-hover:text-white transition-colors duration-500 w-6 h-6 md:w-8 md:h-8 relative z-10" strokeWidth={1} />
            
            {/* Active Indicator */}
            {(step.includes('start') || step === 'response_return') && (
              <motion.div 
                layoutId="active-glow-client"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
              </motion.div>
            )}
          </div>
          <span className="text-[9px] md:text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase group-hover:text-gray-300 transition-colors">Client</span>
        </div>

        {/* ANIMATION STAGE */}
        <div className="flex-1 relative h-16 md:h-24 mx-2 md:mx-12">
          
          {/* The Packet - Sleek Orb */}
          <AnimatePresence mode="wait">
            {(step === 'preflight_travel' || step === 'preflight_return' || step === 'request_travel' || step === 'response_return') && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-30"
                initial={{ left: step.includes('return') ? '100%' : '0%', x: '-50%', opacity: 0, scale: 0.5 }}
                animate={{ left: step.includes('return') ? '0%' : '100%', x: '-50%', opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Custom Bezier for premium feel
              >
                <div className="relative">
                    <div className={`
                    relative flex items-center justify-center w-8 h-8 md:w-12 md:h-12 rounded-full backdrop-blur-xl border border-white/10 shadow-2xl
                    ${step.includes('preflight') 
                        ? 'bg-yellow-500/10 text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.25)]' 
                        : 'bg-blue-500/10 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.25)]'}
                    `}>
                    {step.includes('preflight') ? <Shield className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} /> : <FileJson className="w-4 h-4 md:w-[18px] md:h-[18px]" strokeWidth={2} />}
                    </div>
                    {/* Trail/Glow */}
                    <div className={`absolute inset-0 rounded-full opacity-40 blur-md ${step.includes('preflight') ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Server Check - Radar Scan */}
          <AnimatePresence>
            {step === 'preflight_check' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-yellow-500/20" />
                  <div className="absolute inset-0 rounded-full border border-yellow-500/40 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0a0a0a] border border-yellow-500/50 flex items-center justify-center z-10">
                    <Search className="w-4 h-4 md:w-[18px] md:h-[18px] text-yellow-500" strokeWidth={2} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Server Processing - Sleek Spinner */}
          <AnimatePresence>
            {step === 'server_processing' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
              >
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                    {/* Outer Ring */}
                    <svg className="absolute inset-0 w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" />
                        <circle cx="50" cy="50" r="48" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="60 180" strokeLinecap="round" />
                    </svg>
                    {/* Inner Icon */}
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#0a0a0a] border border-blue-500/30 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        <Server className="w-4 h-4 md:w-[18px] md:h-[18px] text-blue-500" strokeWidth={2} />
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blocked - Shake & Glow */}
          <AnimatePresence>
            {(step === 'preflight_blocked' || step === 'request_blocked') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, x: '50%' }}
                animate={{ opacity: 1, scale: 1, x: '50%', rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-30"
              >
                <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-[#0a0a0a] border border-red-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)]">
                  <X className="w-5 h-5 md:w-6 md:h-6 text-red-500" strokeWidth={2.5} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* SERVER NODE */}
        <div className="relative z-10 flex flex-col items-center gap-4 md:gap-6 group">
          <div className="relative w-16 h-16 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-[#050505] border border-[#222] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-[#444] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] z-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Server className="text-gray-500 group-hover:text-white transition-colors duration-500 w-6 h-6 md:w-8 md:h-8 relative z-10" strokeWidth={1} />
            
            {/* Active Indicator */}
            {(step === 'server_processing' || step === 'preflight_check') && (
              <motion.div 
                layoutId="active-glow-server"
                className="absolute inset-0 rounded-2xl md:rounded-3xl border border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
              </motion.div>
            )}
          </div>
          <span className="text-[9px] md:text-[11px] font-semibold text-gray-500 tracking-[0.2em] uppercase group-hover:text-gray-300 transition-colors">Server</span>
        </div>

      </div>
    </div>
  );
};

export default RequestVisualizer;
