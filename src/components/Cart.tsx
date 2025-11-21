import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const [confirmRemoveId, setConfirmRemoveId] = useState<number|null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  if (cart.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">Seu carrinho está vazio.</div>
    );
  }
  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-blue-700 text-center tracking-tight">Seu Carrinho</h2>
      <ul>
        {cart.map(item => (
          <li key={item.product.id} className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.product.image} alt={item.product.title} className="h-14 w-14 object-contain rounded bg-gray-50" />
              <span className="font-semibold text-gray-800 max-w-[160px] truncate" title={item.product.title}>{item.product.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-lg" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
              <span className="px-2 font-bold text-lg">{item.quantity}</span>
              <button className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-lg" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
              <span className="text-blue-700 font-bold ml-4">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
              <button className="ml-2 text-red-500 hover:underline font-bold" onClick={() => setConfirmRemoveId(item.product.id)}>Remover</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-2xl font-extrabold text-blue-700">Total: R$ {total.toFixed(2)}</span>
        <button className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-red-600 transition" onClick={() => setConfirmClear(true)}>Limpar Carrinho</button>
      </div>
      {/* Modal de confirmação para remover item */}
      {confirmRemoveId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs text-center">
            <h3 className="text-lg font-bold mb-4">Remover item do carrinho?</h3>
            <div className="flex gap-4 justify-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded font-bold" onClick={() => { removeFromCart(confirmRemoveId); setConfirmRemoveId(null); }}>Remover</button>
              <button className="bg-gray-200 px-4 py-2 rounded font-bold" onClick={() => setConfirmRemoveId(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {/* Modal de confirmação para limpar carrinho */}
      {confirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs text-center">
            <h3 className="text-lg font-bold mb-4">Limpar todo o carrinho?</h3>
            <div className="flex gap-4 justify-center">
              <button className="bg-red-500 text-white px-4 py-2 rounded font-bold" onClick={() => { clearCart(); setConfirmClear(false); }}>Limpar</button>
              <button className="bg-gray-200 px-4 py-2 rounded font-bold" onClick={() => setConfirmClear(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;