import React, { useState } from 'react';
import { Header } from './components/Header';
import { CartProvider, useCart } from './context/CartContext';
import { Home } from './pages/Home';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';

const AppContent: React.FC = () => {
  const { cart } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <main className="pt-20 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <button
            className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 z-20"
            onClick={() => setShowCart(v => !v)}
          >
            {showCart ? 'Fechar Carrinho' : 'Abrir Carrinho'}
          </button>
          {showCart && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-30">
              <div className="relative">
                <button className="absolute top-2 right-2 text-gray-500 text-xl" onClick={() => setShowCart(false)}>&times;</button>
                <Cart />
                <div className="mt-6 flex justify-center">
                  <button
                    className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-green-600 transition"
                    onClick={() => setShowCheckout(true)}
                  >
                    Finalizar Compra
                  </button>
                </div>
                {showCheckout && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
                    <Checkout onClose={() => { setShowCheckout(false); setShowCart(false); }} />
                  </div>
                )}
              </div>
            </div>
          )}
          <Home />
        </div>
      </main>
    </>
  );
};

const App: React.FC = () => (
  <CartProvider>
    <AppContent />
  </CartProvider>
);

export default App;
