import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';
import { CartProvider } from '../context/CartContext';

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<CartProvider>{ui}</CartProvider>);
};

describe('Cart', () => {
  it('exibe mensagem de carrinho vazio', () => {
    renderWithProvider(<Cart />);
    expect(screen.getByText(/carrinho está vazio/i)).toBeInTheDocument();
  });
});
