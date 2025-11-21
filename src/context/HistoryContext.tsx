import React, { createContext, useContext, useEffect, useState } from 'react';

export interface HistoryItem {
  type: 'view' | 'purchase';
  productId: number;
  title: string;
  image: string;
  date: string;
  quantity?: number;
  price?: number;
}

interface HistoryContextType {
  history: HistoryItem[];
  addHistory: (item: HistoryItem) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = () => {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory deve ser usado dentro do HistoryProvider');
  return ctx;
};

const HISTORY_KEY = 'gilstore-history';

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev].slice(0, 50)); // Limita a 50 eventos
  };
  const clearHistory = () => setHistory([]);

  return (
    <HistoryContext.Provider value={{ history, addHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
