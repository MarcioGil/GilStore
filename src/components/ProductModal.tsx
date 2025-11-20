import React from "react";

interface ProductModalProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}

const coresRoupas = ["Preto", "Branco", "Azul", "Vermelho", "Verde"];
const tamanhosRoupas = ["P", "M", "G", "GG"];

export const ProductModal: React.FC<ProductModalProps> = ({ product, open, onClose, onAddToCart }) => {
  if (!open || !product) return null;

  const isRoupa = product.category?.toLowerCase().includes("roupa") || product.category?.toLowerCase().includes("clothing");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          aria-label="Fechar"
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <img src={product.image} alt={product.title} className="h-40 object-contain mb-4" />
          <h2 className="text-lg font-bold mb-2 text-center">{product.title}</h2>
          <span className="text-blue-700 font-extrabold text-xl mb-2">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
          <p className="text-gray-700 text-sm mb-2 text-center">{product.description}</p>
          <div className="mb-2 text-xs text-gray-600">Categoria: {product.category}</div>
          <div className="mb-2 text-xs text-gray-600">Avaliação: {product.rating?.rate} ({product.rating?.count} avaliações)</div>
          {isRoupa && (
            <>
              <div className="mb-2">
                <span className="font-semibold text-sm">Cores disponíveis:</span>
                <div className="flex gap-2 mt-1">
                  {coresRoupas.map(cor => (
                    <span key={cor} className="px-2 py-1 bg-gray-200 rounded text-xs">{cor}</span>
                  ))}
                </div>
              </div>
              <div className="mb-2">
                <span className="font-semibold text-sm">Tamanhos disponíveis:</span>
                <div className="flex gap-2 mt-1">
                  {tamanhosRoupas.map(tam => (
                    <span key={tam} className="px-2 py-1 bg-gray-200 rounded text-xs">{tam}</span>
                  ))}
                </div>
              </div>
            </>
          )}
          <button
            className="mt-4 bg-gradient-to-r from-pink-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition font-bold tracking-wide"
            onClick={() => onAddToCart(product)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
};
