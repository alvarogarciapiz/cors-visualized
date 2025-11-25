import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Terminal, Layout, Monitor, Settings } from 'lucide-react';

const ResponseViewer = ({ result }) => {
  const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'console'

  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full"
    >
      <div className="flex p-1 bg-white/5 backdrop-blur-md rounded-full border border-white/10 w-fit mb-6 mx-auto">
        {['visual', 'console'].map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`relative px-6 py-2 rounded-full text-sm font-medium transition-colors z-10 ${
              viewMode === mode ? 'text-black' : 'text-gray-400 hover:text-white'
            }`}
          >
            {viewMode === mode && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white rounded-full -z-10 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="flex items-center gap-2">
              {mode === 'visual' ? <Layout size={14} /> : <Monitor size={14} />}
              {mode === 'visual' ? 'Resumen Visual' : 'Consola'}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode}
          initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
          transition={{ duration: 0.3 }}
        >
          {viewMode === 'visual' ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className={`glass-panel p-6 md:p-8 border-l-4 text-left ${result.status === 0 ? 'border-l-red-500' : 'border-l-green-500'}`}
        >
          <div className="flex items-start md:items-center gap-5 mb-8">
            {result.status === 0 ? (
              <div className="p-3 bg-red-500/10 rounded-full shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <XCircle className="text-red-500" size={32} />
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 rounded-full shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                <CheckCircle className="text-green-500" size={32} />
              </div>
            )}
            <div className="w-full">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                {result.status === 0 ? 'Error de CORS' : 'Petición Exitosa'}
              </h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {result.status === 0 ? 'El navegador bloqueó la petición por seguridad.' : `El servidor aceptó la petición con estado: ${result.status} ${result.statusText}`}
              </p>
              
              {result.error && (
                <div className="mt-4 p-4 bg-red-950/30 border border-red-500/20 rounded-lg text-red-300 text-sm font-mono shadow-inner">
                  <div className="flex gap-3">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-400" />
                    <span className="break-words">{result.error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col h-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal size={14} /> Cabeceras de Respuesta
              </h4>
              <div className="bg-[#0a0a0a] rounded-xl p-5 font-mono text-xs md:text-sm text-gray-300 overflow-x-auto border border-[#222] flex-grow shadow-sm custom-scrollbar">
                {Object.entries(result.headers).length > 0 ? (
                  Object.entries(result.headers).map(([key, value]) => (
                    <div key={key} className="mb-2 last:mb-0 flex flex-col md:flex-row md:gap-2">
                      <span className="text-blue-400 font-semibold shrink-0">{key}:</span> 
                      <span className="text-gray-400 break-all">{value}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-600 italic flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-700"></span>
                    No se recibieron cabeceras CORS
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col h-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Registro de Depuración</h4>
              <div className="bg-[#0a0a0a] rounded-xl p-5 font-mono text-xs md:text-sm border border-[#222] flex-grow overflow-y-auto custom-scrollbar max-h-[300px] shadow-sm">
                {result.logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 mb-3 last:mb-0 border-b border-[#1a1a1a] pb-2 last:border-0 last:pb-0">
                    <span className="shrink-0 mt-0.5">
                      {log.type === 'success' && <span className="text-green-500 font-bold">✓</span>}
                      {log.type === 'error' && <span className="text-red-500 font-bold">✕</span>}
                      {log.type === 'warning' && <span className="text-yellow-500 font-bold">⚠</span>}
                      {log.type === 'info' && <span className="text-blue-500 font-bold">ℹ</span>}
                    </span>
                    <span className={`${
                      log.type === 'error' ? 'text-red-400' : 
                      log.type === 'warning' ? 'text-yellow-400' : 
                      log.type === 'info' ? 'text-blue-400' :
                      'text-gray-400'
                    } leading-relaxed break-words`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="bg-[#242424] rounded-lg overflow-hidden border border-[#333] font-mono text-xs md:text-sm shadow-2xl text-left">
          {/* Chrome DevTools Header */}
          <div className="bg-[#333] px-2 py-1 flex items-center justify-between border-b border-[#444] select-none">
            <div className="flex items-center gap-4">
               <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
              </div>
              <div className="flex gap-4 text-gray-400 text-xs">
                <span className="hover:bg-[#444] px-2 py-0.5 rounded cursor-pointer">Elements</span>
                <span className="bg-[#444] text-gray-200 px-2 py-0.5 rounded cursor-pointer">Console</span>
                <span className="hover:bg-[#444] px-2 py-0.5 rounded cursor-pointer">Sources</span>
                <span className="hover:bg-[#444] px-2 py-0.5 rounded cursor-pointer">Network</span>
              </div>
            </div>
            <div className="text-gray-500 text-xs px-2">
              <Settings size={12} />
            </div>
          </div>
          
          {/* Console Toolbar */}
          <div className="bg-[#242424] border-b border-[#444] px-2 py-1 flex items-center gap-2 text-gray-500 text-xs">
             <span className="hover:text-gray-300 cursor-pointer"><AlertTriangle size={12} className="inline mr-1"/>Errors</span>
             <span className="hover:text-gray-300 cursor-pointer border-l border-[#444] pl-2">Warnings</span>
             <span className="hover:text-gray-300 cursor-pointer border-l border-[#444] pl-2">Info</span>
             <div className="flex-grow"></div>
             <input type="text" placeholder="Filter" className="bg-[#111] border border-[#444] rounded px-2 py-0.5 text-gray-300 w-32 focus:outline-none focus:border-blue-500" />
          </div>

          <div className="p-2 min-h-[300px] bg-[#242424] text-[#ff8080] font-menlo overflow-y-auto">
            {result.status === 0 ? (
              <>
                <div className="mb-1 border-b border-red-900/30 pb-1 hover:bg-red-900/10 px-2 py-1">
                  <span className="bg-red-900/50 text-red-200 px-1 rounded mr-2 text-[10px]">x</span>
                  Access to fetch at 'https://api.ejemplo.com/v1' from origin '{window.location.origin}' has been blocked by CORS policy: {result.error.replace('Error de CORS: ', '')}
                </div>
                <div className="text-gray-400 px-2 py-1 hover:bg-[#333]">
                  GET https://api.ejemplo.com/v1 <span className="text-red-400">net::ERR_FAILED</span>
                </div>
              </>
            ) : (
              <div className="text-gray-400 px-2 py-1 hover:bg-[#333]">
                <span className="text-blue-400 mr-2">ℹ</span> Fetch finished loading: GET "https://api.ejemplo.com/v1".
              </div>
            )}
            
            {result.logs.filter(l => l.type === 'warning').map((log, i) => (
               <div key={i} className="mt-1 text-yellow-300 bg-yellow-900/10 px-2 py-1 border-l-2 border-yellow-600">
                 <span className="text-yellow-500 mr-2">⚠</span>
                 {log.message}
               </div>
            ))}
            
            <div className="mt-2 px-2 text-blue-400 opacity-50 text-xs flex items-center gap-1">
                <span>&gt;</span> <span className="animate-pulse">_</span>
            </div>
          </div>
        </div>
      )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default ResponseViewer;
