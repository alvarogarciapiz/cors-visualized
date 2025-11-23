import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 text-center text-gray-600 text-sm border-t border-[#333] mt-12 bg-black">
      <p>© {new Date().getFullYear()} Visualizador de CORS con fines educativos.</p>
      <p className="mt-2">
        Made by <a href="https://lvrpiz.com" target="_blank" rel="noopener noreferrer" className="text-white hover:underline font-medium">@lvrpiz</a>
      </p>
      <p className="mt-4 text-xs text-gray-700">
        Basado en un artículo de <a href="https://www.bulletin.lvrpiz.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors">The lvrpiz Newsletter</a>
      </p>
    </footer>
  );
};

export default Footer;
