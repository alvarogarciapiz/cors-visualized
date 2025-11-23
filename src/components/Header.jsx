import React from 'react';
import { Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-6 px-8 flex items-center justify-between border-b border-white/5 bg-opacity-50 backdrop-blur-md sticky top-0 z-50"
      style={{ backgroundColor: 'rgba(12, 15, 25, 0.8)' }}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <Globe size={24} className="text-[#5978F5]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          CORS <span className="text-[#5978F5]">Visualizer</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <a href="#simulation" className="hover:text-[#8CA2FC] transition-colors">Simulación</a>
        <a href="#learn" className="hover:text-[#8CA2FC] transition-colors">Aprender</a>
        <a href="https://github.com/alvarogarciapiz/cors-visualized" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
      </nav>
    </motion.header>
  );
};

export default Header;
