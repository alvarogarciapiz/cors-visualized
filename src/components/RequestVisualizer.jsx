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
    <div className="w-full py-16 mb-8 select-none">
      {/* Status Text - Minimalist */}
      <div className="h-8 flex justify-center items-center mb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 5, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -5, filter: 'blur(4px)' }}
            className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
          >
            {step !== 'idle' && !message.includes('Bloqueo') && (
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            )}
            {message.includes('Bloqueo') && (
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
            <span className="text-xs font-medium text-gray-300 font-mono tracking-wide">
              {message}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-between px-8 md:px-32 max-w-6xl mx-auto">
        
        {/* Connecting Line */}
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent -z-10 mx-12" />

        {/* CLIENT NODE */}
        <div className="relative z-10 flex flex-col items-center gap-6 group">
          <div className="w-20 h-20 rounded-2xl bg-[#050505] border border-[#222] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-[#444] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Globe size={28} className="text-gray-400 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
            
            {/* Active Indicator */}
            {(step.includes('start') || step === 'response_return') && (
              <motion.div 
                layoutId="active-glow"
                className="absolute inset-0 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase group-hover:text-gray-400 transition-colors">Client</span>
        </div>

        {/* ANIMATION STAGE */}
        <div className="flex-1 relative h-20 mx-12">
          
          {/* The Packet - Minimalist Capsule */}
          <AnimatePresence mode="wait">
            {(step === 'preflight_travel' || step === 'preflight_return' || step === 'request_travel' || step === 'response_return') && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 z-20"
                initial={{ left: step.includes('return') ? '100%' : '0%', opacity: 0, scale: 0.8 }}
                animate={{ left: step.includes('return') ? '0%' : '100%', opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Apple-like ease
              >
                <div className={`
                  relative flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border
                  ${step.includes('preflight') 
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]'}
                `}>
                  {step.includes('preflight') ? <Shield size={16} strokeWidth={2} /> : <FileJson size={16} strokeWidth={2} />}
                  
                  {/* Trail Effect */}
                  <div className={`absolute inset-0 rounded-full opacity-50 blur-sm ${step.includes('preflight') ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Server Check - Minimalist Pulse */}
          <AnimatePresence>
            {step === 'preflight_check' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border border-yellow-500/30 bg-black flex items-center justify-center">
                    <Search size={20} className="text-yellow-500" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 rounded-full border border-yellow-500 opacity-20 animate-ping" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Server Processing - Minimalist Spinner */}
          <AnimatePresence>
            {step === 'server_processing' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border border-blue-500/30 bg-black flex items-center justify-center">
                    <Server size={20} className="text-blue-500" strokeWidth={2} />
                  </div>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-t border-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blocked - Minimalist X */}
          <AnimatePresence>
            {(step === 'preflight_blocked' || step === 'request_blocked') && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30"
              >
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <X size={24} className="text-red-500" strokeWidth={2} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* SERVER NODE */}
        <div className="relative z-10 flex flex-col items-center gap-6 group">
          <div className="w-20 h-20 rounded-2xl bg-[#050505] border border-[#222] flex items-center justify-center shadow-2xl transition-all duration-500 group-hover:border-[#444] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <Server size={28} className="text-gray-400 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
            
            {/* Active Indicator */}
            {(step === 'server_processing' || step === 'preflight_check') && (
              <motion.div 
                layoutId="active-glow"
                className="absolute inset-0 rounded-2xl border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <span className="text-[10px] font-bold text-gray-600 tracking-[0.2em] uppercase group-hover:text-gray-400 transition-colors">Server</span>
        </div>

      </div>
    </div>
  );
};

export default RequestVisualizer;
