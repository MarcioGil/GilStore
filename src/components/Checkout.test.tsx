import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkout from './Checkout';
import { CartProvider } from '../context/CartContext';
import { HistoryProvider } from '../context/HistoryContext';

describe('Checkout', () => {
  it('exibe título de finalizar compra', () => {
    render(
      <CartProvider>
        <HistoryProvider>
          <Checkout onClose={() => {}} />
        </HistoryProvider>
      </CartProvider>
    );
    expect(screen.getByText(/finalizar compra/i)).toBeInTheDocument();
  });
});
