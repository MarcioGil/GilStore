import React, { useEffect, useRef } from "react";

interface ProductModalProps {
  product: any;
  open: boolean;
  onClose: () => void;
  onAddToCart: (product: any) => void;
}


const coresRoupas = ["Preto", "Branco", "Azul", "Vermelho", "Verde"];
const tamanhosRoupas = ["P", "M", "G", "GG"];

export const ProductModal: React.FC<ProductModalProps> = ({ product, open, onClose, onAddToCart }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Fechar ao pressionar Esc
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Fechar ao clicar fora do modal
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, onClose]);

  if (!open || !product) return null;

  // Mapeamento de descrições em português (igual ao Home.tsx)
  const descricaoProdutosPT: Record<string, string> = {
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Mochila resistente, ideal para o dia a dia e viagens, comporta notebook de até 15 polegadas.",
    "Mens Casual Premium Slim Fit T-Shirts ": "Camiseta masculina premium, ajuste slim, confortável para todas as ocasiões.",
    "Mens Cotton Jacket": "Jaqueta masculina de algodão, perfeita para dias frios e looks casuais.",
    "Mens Casual Slim Fit": "Calça masculina slim fit, tecido leve e moderno, ideal para o cotidiano.",
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Pulseira feminina John Hardy, design de dragão em ouro e prata, sofisticada e elegante.",
    "Solid Gold Petite Micropave ": "Anel micropave em ouro maciço, delicado e brilhante para ocasiões especiais.",
    "White Gold Plated Princess": "Anel princesa banhado a ouro branco, acabamento refinado e luxuoso.",
    "Pierced Owl Rose Gold Plated Stainless Steel Double": "Brinco Pierced Owl em aço inox banhado a ouro rosé, moderno e resistente.",
    "WD 2TB Elements Portable External Hard Drive - USB 3.0 ": "HD externo WD 2TB, conexão USB 3.0, alta velocidade para backup e armazenamento.",
    "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": "SSD interno SanDisk 1TB, tecnologia SATA III, desempenho superior para seu PC.",
    "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5": "SSD Silicon Power 256GB, rápido e confiável, ideal para upgrades.",
    "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": "HD externo WD 4TB, compatível com Playstation 4, perfeito para gamers.",
      "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": "Monitor Acer SB220Q 21.5\" Full HD IPS, ultrafino, imagem nítida e cores vibrantes.",
      "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor": "Monitor Samsung 49\" curvo, 144Hz, experiência imersiva para jogos.",
    "BIYLACLESEN Women's 3-6 Packs Solid Basic Short Sleeve Boat Neck V ": "Blusa feminina BIYLACLESEN, gola canoa, manga curta, básica e confortável.",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Jaqueta feminina Lock and Love, couro sintético, capuz removível, estilo motoqueira.",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Jaqueta feminina impermeável, leve e estilosa, ideal para dias chuvosos.",
    "MBJ Women's Solid Short Sleeve Boat Neck V ": "Blusa feminina MBJ, manga curta, gola canoa, versátil para o dia a dia.",
    "Opna Women's Short Sleeve Moisture": "Blusa feminina Opna, manga curta, tecido que absorve umidade, ideal para esportes.",
    "DANVOUY Womens T Shirt Casual Cotton Short": "Camiseta feminina DANVOUY, algodão casual, confortável e moderna."
  };

  // Tenta exibir a descrição traduzida usando o nome original
  // Se não encontrar, exibe a descrição do produto
  const descricaoPT = descricaoProdutosPT[product.originalTitle || product.title] || product.description;

  const isRoupa = product.category?.toLowerCase().includes("roupa") || product.category?.toLowerCase().includes("clothing");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" aria-modal="true" role="dialog">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative" tabIndex={-1}>
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
          <p className="text-gray-700 text-sm mb-2 text-center">{descricaoPT}</p>
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
