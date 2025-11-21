import React from 'react';
import { useWishlist } from '../context/WishlistContext';

export const Wishlist: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  if (wishlist.length === 0) {
    return <div className="p-6 text-center text-gray-500">Nenhum favorito ainda.</div>;
  }
  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-pink-600 text-center tracking-tight">Favoritos</h2>
      <ul>
        {wishlist.map(item => (
          <li key={item.id} className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="h-14 w-14 object-contain rounded bg-gray-50" />
              <span className="font-semibold text-gray-800 max-w-[160px] truncate" title={item.title}>{item.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-600 font-bold ml-4">R$ {item.price.toFixed(2)}</span>
              <button className="ml-2 text-red-500 hover:underline font-bold" onClick={() => removeFromWishlist(item.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
