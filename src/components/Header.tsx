import React from 'react';
export const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => (
  <header className="w-full bg-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-20">
    <div className="flex items-center gap-3">
      <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Logo" className="h-8 w-8" />
      <span className="text-2xl font-extrabold text-blue-700 tracking-tight" aria-label="Nome da loja">GilStore</span>
    </div>
    <div className="relative">
      <button className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 shadow-lg transition duration-200 focus:outline-blue-700" aria-label="Abrir carrinho" tabIndex={0}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 13M7 13V6h13" />
        </svg>
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold animate-bounce shadow">{cartCount}</span>
        )}
      </button>
    </div>
  </header>
);