import React, { createContext, useContext, useState, useEffect } from 'react';
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  description?: string;
  rating?: {
    rate: number;
    count: number;
  };
}
export interface CartItem {
  product: Product;
  quantity: number;
}
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
}
const CartContext = createContext<CartContextType | undefined>(undefined);
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart deve ser usado dentro do CartProvider');
  return context;
};
const CART_STORAGE_KEY = 'mini-ecommerce-cart';
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);
  const addToCart = (product: Product) => {
    setCart((prev: CartItem[]) => {
      const item = prev.find((i: CartItem) => i.product.id === product.id);
      if (item) {
        return prev.map((i: CartItem) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };
  const removeFromCart = (productId: number) => {
    setCart((prev: CartItem[]) => prev.filter((i: CartItem) => i.product.id !== productId));
  };
  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prev: CartItem[]) =>
      prev.map((i: CartItem) =>
        i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };
  const clearCart = () => setCart([]);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};