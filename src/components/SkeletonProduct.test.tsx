import React from 'react';
import { render, screen } from '@testing-library/react';
import { SkeletonProduct } from './SkeletonProduct';

describe('SkeletonProduct', () => {
  it('renderiza skeleton', () => {
    render(<SkeletonProduct />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
