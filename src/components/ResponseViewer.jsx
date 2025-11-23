import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, Terminal } from 'lucide-react';

const ResponseViewer = ({ result }) => {
  if (!result) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 w-full"
    >
      <div className={`glass-panel p-6 border-l-4 ${result.status === 0 ? 'border-l-red-500' : 'border-l-green-500'}`}>
        <div className="flex items-center gap-4 mb-6">
          {result.status === 0 ? (
            <div className="p-3 bg-red-500/20 rounded-full">
              <XCircle className="text-red-500" size={32} />
            </div>
          ) : (
            <div className="p-3 bg-green-500/20 rounded-full">
              <CheckCircle className="text-green-500" size={32} />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold">
              {result.status === 0 ? 'Error de CORS' : 'Petición Exitosa'}
            </h3>
            <p className="text-gray-400 text-sm">
              {result.status === 0 ? 'El navegador bloqueó la petición.' : `Estado: ${result.status} ${result.statusText}`}
            </p>
          </div>
        </div>

        {result.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 text-sm font-mono">
            {result.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col h-full">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Terminal size={14} /> Cabeceras de Respuesta
            </h4>
            <div className="bg-[#0C0F19] rounded-xl p-6 font-mono text-sm text-gray-300 overflow-x-auto border border-[#2C4399]/30 flex-grow shadow-inner">
              {Object.entries(result.headers).length > 0 ? (
                Object.entries(result.headers).map(([key, value]) => (
                  <div key={key} className="mb-2 last:mb-0">
                    <span className="text-[#8CA2FC] font-semibold">{key}:</span> <span className="text-[#5978F5] break-all">{value}</span>
                  </div>
                ))
              ) : (
                <span className="text-gray-600 italic">// No se recibieron cabeceras CORS</span>
              )}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Registro de Depuración</h4>
            <div className="bg-[#0C0F19] rounded-xl p-6 font-mono text-xs md:text-sm border border-[#2C4399]/30 flex-grow shadow-inner overflow-y-auto custom-scrollbar max-h-[300px]">
              {result.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 mb-3 last:mb-0 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <span className="shrink-0 mt-0.5">
                    {log.type === 'success' && <span className="text-emerald-500 font-bold">✓</span>}
                    {log.type === 'error' && <span className="text-red-500 font-bold">✕</span>}
                    {log.type === 'warning' && <span className="text-amber-500 font-bold">⚠</span>}
                  </span>
                  <span className={`${
                    log.type === 'error' ? 'text-red-200' : 
                    log.type === 'warning' ? 'text-amber-200' : 
                    'text-gray-300'
                  } leading-relaxed`}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResponseViewer;
