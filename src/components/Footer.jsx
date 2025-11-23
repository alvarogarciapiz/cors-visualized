import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 text-center text-gray-500 text-sm border-t border-white/5 mt-12">
      <p>© {new Date().getFullYear()} Visualizador de CORS con fines educativos.</p>
      <p className="mt-2">
        Made by <a href="https://lvrpiz.com" target="_blank" rel="noopener noreferrer" className="text-[#5978F5] hover:underline">@lvrpiz</a>
      </p>
    </footer>
  );
};

export default Footer;
