import React from 'react';
import { render, screen } from '@testing-library/react';
import { History } from './History';
import { HistoryProvider } from '../context/HistoryContext';

describe('History', () => {
  it('renderiza modal de histórico', () => {
    render(
      <HistoryProvider>
        <History />
      </HistoryProvider>
    );
    expect(screen.getByText(/histórico/i)).toBeInTheDocument();
  });
});
