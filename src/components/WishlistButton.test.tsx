import React from 'react';
import { render, screen } from '@testing-library/react';
import { WishlistButton } from './WishlistButton';
import { WishlistProvider } from '../context/WishlistContext';

const product = {
  id: 1,
  title: 'Produto Teste',
  price: 10,
  image: '',
  category: 'test',
};

describe('WishlistButton', () => {
  it('renderiza botão de favoritos', () => {
    render(
      <WishlistProvider>
        <WishlistButton product={product} />
      </WishlistProvider>
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
