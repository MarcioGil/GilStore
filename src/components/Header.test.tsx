import React from 'react';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { WishlistProvider } from '../context/WishlistContext';

describe('Header', () => {
  it('exibe nome da loja', () => {
    render(
      <WishlistProvider>
        <Header cartCount={0} />
      </WishlistProvider>
    );
    expect(screen.getByLabelText(/nome da loja/i)).toBeInTheDocument();
  });
});
