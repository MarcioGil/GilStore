import React from 'react';
import { render, screen } from '@testing-library/react';
import { ProductModal } from './ProductModal';

describe('ProductModal', () => {
  it('não renderiza se open for false', () => {
    const { container } = render(
      <ProductModal product={null} open={false} onClose={() => {}} onAddToCart={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });
});
