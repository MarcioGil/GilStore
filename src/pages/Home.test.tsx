import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Home } from './Home';
import { CartProvider } from '../context/CartContext';
import { HistoryProvider } from '../context/HistoryContext';

// Mock fetchProducts para evitar chamadas reais à API
jest.mock('../services/api', () => ({
  fetchProducts: () => Promise.resolve([
    {
      id: 1,
      title: 'Produto Teste',
      description: 'Descrição',
      price: 10,
      image: '',
      category: 'test',
      stock: 5,
      rating: { rate: 4, count: 10 },
    },
  ]),
}));

describe('Home', () => {
  it('renderiza produtos e permite adicionar ao carrinho', async () => {
    render(
      <CartProvider>
        <HistoryProvider>
          <Home />
        </HistoryProvider>
      </CartProvider>
    );
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/produto teste/i)).toBeInTheDocument());
    const addButton = screen.getByRole('button', { name: /adicionar/i });
    fireEvent.click(addButton);
    // Espera feedback visual de adição ao carrinho
    expect(screen.getByText(/adicionado/i)).toBeInTheDocument();
  });
});
