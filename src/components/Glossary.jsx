import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen } from 'lucide-react';

const TERMS = [
  {
    term: "CORS (Cross-Origin Resource Sharing)",
    def: "Mecanismo de seguridad del navegador que permite a un servidor indicar cualquier otro origen (dominio, esquema o puerto) desde el que un navegador debería permitir la carga de recursos."
  },
  {
    term: "Origin (Origen)",
    def: "Combinación de Protocolo (http/https), Dominio (ej: google.com) y Puerto (ej: :3000). Dos URLs tienen el mismo origen solo si los tres coinciden exactamente."
  },
  {
    term: "Preflight Request (Petición Previa)",
    def: "Una petición de tipo OPTIONS que el navegador envía automáticamente antes de la petición real (GET, POST, etc.) para verificar si es seguro enviarla. Ocurre cuando se usan métodos no simples o headers personalizados."
  },
  {
    term: "Simple Request (Petición Simple)",
    def: "Peticiones que NO disparan un Preflight. Deben usar métodos GET, HEAD o POST y solo ciertos headers (Accept, Accept-Language, Content-Language, Content-Type: application/x-www-form-urlencoded, multipart/form-data, text/plain)."
  },
  {
    term: "Wildcard (*)",
    def: "Carácter comodín que significa 'cualquiera'. En Access-Control-Allow-Origin: *, permite acceso a todos los dominios. No se puede usar si allowCredentials es true."
  },
  {
    term: "Credentials (Credenciales)",
    def: "Cookies, cabeceras de autorización HTTP o certificados TLS del cliente. Para enviarlas en una petición cross-origin, el cliente debe poner 'credentials: include' y el servidor 'Access-Control-Allow-Credentials: true'."
  }
];

const Glossary = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-2xl h-fit max-h-[80vh] bg-[#0a0a0a] border border-[#333] rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#222]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <BookOpen size={20} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-bold text-white">Glosario CORS</h2>
              </div>
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {TERMS.map((item, idx) => (
                <div key={idx} className="group">
                  <h3 className="text-sm font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                    {item.term}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-[#222] pl-4 group-hover:border-blue-500/30 transition-colors">
                    {item.def}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-[#111] border-t border-[#222] text-center">
              <a 
                href="https://developer.mozilla.org/es/docs/Web/HTTP/CORS" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-gray-500 hover:text-blue-400 transition-colors underline"
              >
                Leer documentación oficial en MDN Web Docs
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Glossary;
