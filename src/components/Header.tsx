import React, { useState, Suspense, lazy } from 'react';
import { useWishlist } from '../context/WishlistContext';

export const Header: React.FC<{ cartCount: number }> = ({ cartCount }) => {
  const { wishlist } = useWishlist();
  const [showWishlist, setShowWishlist] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const Wishlist = lazy(() => import('./Wishlist').then(m => ({ default: m.Wishlist })));
  const History = lazy(() => import('./History').then(m => ({ default: m.History })));
  return (
    <header className="w-full bg-white shadow-lg flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-20">
      <div className="flex items-center gap-3">
        <img src="https://cdn-icons-png.flaticon.com/512/263/263142.png" alt="Logo" className="h-8 w-8" />
        <span className="text-2xl font-extrabold text-blue-700 tracking-tight" aria-label="Nome da loja">GilStore</span>
      </div>
      <div className="flex items-center gap-4 relative">
        <button
          className="p-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 shadow-lg transition duration-200 focus:outline-green-700 relative"
          aria-label="Abrir histórico"
          tabIndex={0}
          onClick={() => setShowHistory(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        <button
          className="p-2 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 shadow-lg transition duration-200 focus:outline-pink-700 relative"
          aria-label="Abrir favoritos"
          tabIndex={0}
          onClick={() => setShowWishlist(v => !v)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.5C3 5.42 5.42 3 8.5 3c1.74 0 3.41 0.81 4.5 2.09C14.09 3.81 15.76 3 17.5 3 20.58 3 23 5.42 23 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35l-2.45-2.31C6.4 15.36 3 12.28 3 8.5z" />
          </svg>
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold animate-bounce shadow">{wishlist.length}</span>
          )}
        </button>
        <button className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 shadow-lg transition duration-200 focus:outline-blue-700" aria-label="Abrir carrinho" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 13M7 13V6h13" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold animate-bounce shadow">{cartCount}</span>
          )}
        </button>
        {showWishlist && (
          <div className="absolute right-0 top-12 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-80 max-h-[70vh] overflow-y-auto">
              <Suspense fallback={<div className="p-4">Carregando favoritos...</div>}>
                <Wishlist />
              </Suspense>
            </div>
          </div>
        )}
        {showHistory && (
          <div className="absolute right-0 top-12 z-50">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 w-96 max-h-[70vh] overflow-y-auto">
              <Suspense fallback={<div className="p-4">Carregando histórico...</div>}>
                <History />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};