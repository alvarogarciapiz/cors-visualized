import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Globe, Key, FileJson, Server } from 'lucide-react';

const EducationalSection = () => {
  const cards = [
    {
      icon: <Globe size={32} />,
      title: "Política del Mismo Origen (SOP)",
      description: "La Same-Origin Policy es una medida de seguridad crítica. Impide que un script malicioso en una página web obtenga acceso a datos sensibles en otra página web a través del DOM, a menos que ambas compartan el mismo origen (protocolo, dominio y puerto)."
    },
    {
      icon: <Shield size={32} />,
      title: "¿Qué es CORS?",
      description: "Cross-Origin Resource Sharing (CORS) es un estándar W3C que permite a un servidor relajar la política SOP. Utiliza cabeceras HTTP para indicar a los navegadores que permitan a una aplicación web ejecutándose en un origen (dominio) acceder a recursos seleccionados de un servidor en un origen distinto."
    },
    {
      icon: <Lock size={32} />,
      title: "Preflight Requests (OPTIONS)",
      description: "Para solicitudes 'no simples' (como aquellas con Content-Type: application/json o cabeceras personalizadas), el navegador envía automáticamente una solicitud OPTIONS antes de la solicitud real. Esto verifica si el servidor entiende el protocolo CORS y permite la operación."
    },
    {
      icon: <Key size={32} />,
      title: "Credenciales y Cookies",
      description: "Las solicitudes CORS no envían cookies ni cabeceras de autenticación por defecto. Para habilitarlas, el cliente debe establecer 'withCredentials' a true, y el servidor debe responder con 'Access-Control-Allow-Credentials: true' y un origen explícito (no '*')."
    }
  ];

  return (
    <section id="learn" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Guía Definitiva de <span className="text-blue-500">CORS</span>
        </h2>
        <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">
          Domina el Intercambio de Recursos de Origen Cruzado. Entiende por qué fallan tus peticiones y cómo configurar tus servidores correctamente para permitir comunicaciones seguras entre dominios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel p-8 hover:border-gray-500 transition-colors group"
          >
            <div className="mb-6 p-4 bg-white/5 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 text-white">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">{card.title}</h3>
            <p className="text-gray-400 leading-relaxed">
              {card.description}
            </p>
          </motion.div>
        ))}
      </div>


      <div className="mt-16 text-center">
        <a 
          href="https://developer.mozilla.org/es/docs/Web/HTTP/CORS" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-secondary inline-flex items-center gap-2 px-8 py-4 text-lg hover:bg-[#222] transition-all"
        >
          <Globe size={20} />
          Documentación Oficial MDN
        </a>
      </div>
    </section>
  );
};

export default EducationalSection;
