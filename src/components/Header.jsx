import React from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full py-4 px-6 md:px-8 flex items-center justify-between border-b border-[#333] bg-black/80 backdrop-blur-md sticky top-0 z-50"
    >
      <div className="flex items-center gap-3">
        <img 
          src="/apple-touch-icon.png" 
          alt="CORS Visualizer Logo" 
          className="w-10 h-10 rounded-xl shadow-lg shadow-white/5 hover:scale-105 transition-transform duration-300" 
        />
        <h1 className="text-xl font-bold tracking-tight text-white">
          CORS <span className="text-gray-500">Visualizer</span>
        </h1>
      </div>
      
      <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
        <a href="#simulation" className="hover:text-white transition-colors">Simulación</a>
        <a href="#learn" className="hover:text-white transition-colors">Aprender</a>
        <a href="https://github.com/alvarogarciapiz/cors-visualized" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
      </nav>
    </motion.header>
  );
};

export default Header;
