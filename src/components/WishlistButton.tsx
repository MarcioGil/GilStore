import React from 'react';
import { useWishlist } from '../context/WishlistContext';

export const WishlistButton: React.FC<{ product: { id: number; title: string; price: number; image: string } }> = ({ product }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  return (
    <button
      aria-label={inWishlist ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`rounded-full p-2 transition border-2 ${inWishlist ? 'bg-pink-100 border-pink-400 text-pink-600' : 'bg-gray-100 border-gray-300 text-gray-400 hover:text-pink-500'}`}
      onClick={e => {
        e.stopPropagation();
        inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
      }}
    >
      {inWishlist ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 19.364l-1.415-1.415A8 8 0 0112 4a8 8 0 018.294 13.949l-1.415 1.415M12 21.35V4" /></svg>
      )}
    </button>
  );
};
