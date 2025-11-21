import React from 'react';
import { useHistory } from '../context/HistoryContext';

export const History: React.FC = () => {
  const { history, clearHistory } = useHistory();
  if (history.length === 0) {
    return <div className="p-6 text-center text-gray-500">Nenhuma navegação ou compra registrada.</div>;
  }
  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-green-700 text-center tracking-tight">Histórico</h2>
        <button className="text-red-500 hover:underline font-bold" onClick={clearHistory}>Limpar</button>
      </div>
      <ul>
        {history.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="h-12 w-12 object-contain rounded bg-gray-50" />
              <div>
                <span className="font-semibold text-gray-800 block max-w-[160px] truncate" title={item.title}>{item.title}</span>
                <span className="block text-xs text-gray-500">{new Date(item.date).toLocaleString('pt-BR')}</span>
                <span className={`block text-xs font-bold ${item.type === 'purchase' ? 'text-blue-700' : 'text-gray-400'}`}>{item.type === 'purchase' ? 'Compra' : 'Visualização'}</span>
                {item.type === 'purchase' && item.quantity && item.price && (
                  <span className="block text-xs text-green-700">Qtd: {item.quantity} | Valor: R$ {item.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
