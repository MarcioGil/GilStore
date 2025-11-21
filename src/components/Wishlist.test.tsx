import React from 'react';
import { render, screen } from '@testing-library/react';
import { Wishlist } from './Wishlist';
import { WishlistProvider } from '../context/WishlistContext';

describe('Wishlist', () => {
  it('renderiza modal de favoritos', () => {
    render(
      <WishlistProvider>
        <Wishlist />
      </WishlistProvider>
    );
    expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
  });
});
