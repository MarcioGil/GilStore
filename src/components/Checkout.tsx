import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
export const Checkout: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { cart, total, clearCart } = useCart();
  const [success, setSuccess] = useState(false);
  const handleCheckout = () => {
    setSuccess(true);
    clearCart();
    setTimeout(onClose, 2000);
  };
  if (success) {
    return (
      <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-2xl text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Compra finalizada!</h2>
        <p className="text-gray-700 mb-2">Obrigado por comprar na Quikk Store.</p>
        <span className="text-lg font-bold text-blue-700">Seu pedido está sendo processado.</span>
      </div>
    );
  }
  return (
    <div className="p-8 max-w-md mx-auto bg-white rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">Finalizar Compra</h2>
      <ul className="mb-4">
        {cart.map(item => (
          <li key={item.product.id} className="flex justify-between mb-2">
            <span>{item.product.title} x{item.quantity}</span>
            <span className="font-bold text-blue-700">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="mb-6 text-right text-xl font-bold text-blue-700">Total: R$ {total.toFixed(2)}</div>
      <button className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-600 transition" onClick={handleCheckout}>
        Confirmar Compra
      </button>
    </div>
  );
};