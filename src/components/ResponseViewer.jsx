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
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={() => setViewMode('visual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === 'visual' 
              ? 'bg-white text-black shadow-lg' 
              : 'bg-[#111] text-gray-500 hover:text-gray-300'
          }`}
        >
          <Layout size={14} />
          Resumen Visual
        </button>
        <button 
          onClick={() => setViewMode('console')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            viewMode === 'console' 
              ? 'bg-white text-black shadow-lg' 
              : 'bg-[#111] text-gray-500 hover:text-gray-300'
          }`}
        >
          <Monitor size={14} />
          Consola del Navegador
        </button>
      </div>

      {viewMode === 'visual' ? (
        <div className={`glass-panel p-6 border-l-4 ${result.status === 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
          <div className="flex items-center gap-4 mb-6">
            {result.status === 0 ? (
              <div className="p-3 bg-red-500/10 rounded-full">
                <XCircle className="text-red-500" size={32} />
              </div>
            ) : (
              <div className="p-3 bg-green-500/10 rounded-full">
                <CheckCircle className="text-green-500" size={32} />
              </div>
            )}
            <div>
              <h3 className="text-xl font-bold text-white">
                {result.status === 0 ? 'Error de CORS' : 'Petición Exitosa'}
              </h3>
              <p className="text-gray-400 text-sm">
                {result.status === 0 ? 'El navegador bloqueó la petición.' : `Estado: ${result.status} ${result.statusText}`}
              </p>
            </div>
          </div>

          {result.error && (
            <div className="mb-6 p-4 bg-red-900/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-mono">
              {result.error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col h-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Terminal size={14} /> Cabeceras de Respuesta
              </h4>
              <div className="bg-[#111] rounded-lg p-6 font-mono text-sm text-gray-300 overflow-x-auto border border-[#333] flex-grow">
                {Object.entries(result.headers).length > 0 ? (
                  Object.entries(result.headers).map(([key, value]) => (
                    <div key={key} className="mb-2 last:mb-0">
                      <span className="text-blue-400 font-semibold">{key}:</span> <span className="text-gray-300 break-all">{value}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-600 italic">// No se recibieron cabeceras CORS</span>
                )}
              </div>
            </div>

            <div className="flex flex-col h-full">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Registro de Depuración</h4>
              <div className="bg-[#111] rounded-lg p-6 font-mono text-xs md:text-sm border border-[#333] flex-grow overflow-y-auto custom-scrollbar max-h-[300px]">
                {result.logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3 mb-3 last:mb-0 border-b border-[#222] pb-2 last:border-0 last:pb-0">
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
                    } leading-relaxed`}>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#242424] rounded-lg overflow-hidden border border-[#333] font-mono text-xs md:text-sm shadow-2xl">
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
  );
};

export default ResponseViewer;
