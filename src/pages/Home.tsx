import React, { useEffect, useState, useRef } from 'react';
import { Suspense, lazy } from 'react';
import { fetchProducts } from '../services/api';
import { SkeletonProduct } from '../components/SkeletonProduct';
import { WishlistButton } from '../components/WishlistButton';
import { useCart } from '../context/CartContext';
import { useHistory } from '../context/HistoryContext';
const ProductModal = lazy(() => import('../components/ProductModal').then(m => ({ default: m.ProductModal })));
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  rating?: {
    rate: number;
    count: number;
  };
}

// Mapeamento de nomes em português (fora do componente para evitar warning do useEffect)
export const Home: React.FC = () => {
  // HOOKS NO TOPO, NENHUM RETURN ANTES
  const { addHistory } = useHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 8;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  // Estado para avaliações
  const [avaliacoes, setAvaliacoes] = useState<{[id:number]: {nota:number, comentario:string}[]}>({});

  // Constantes auxiliares dentro do componente
  const categoriasPT = React.useMemo(() => ({
    "men's clothing": "Roupas Masculinas",
    "women's clothing": "Roupas Femininas",
    "jewelery": "Joias",
    "electronics": "Eletrônicos"
  }) as Record<string, string>, []);
  const nomeProdutosPT = React.useMemo(() => ({
    "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops": "Mochila Fjallraven - Para Laptop 15\"",
    "Mens Casual Premium Slim Fit T-Shirts ": "Camiseta Masculina Premium Slim Fit",
    "Mens Cotton Jacket": "Jaqueta Masculina de Algodão",
    "Mens Casual Slim Fit": "Calça Masculina Slim Fit",
    "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet": "Pulseira Feminina John Hardy Dragão Ouro & Prata",
    "Solid Gold Petite Micropave ": "Anel Micropave Ouro Maciço",
    "White Gold Plated Princess": "Anel Princesa Banhado a Ouro Branco",
    "Pierced Owl Rose Gold Plated Stainless Steel Double": "Brinco Pierced Owl Aço Inox Banhado a Ouro Rosé",
    "WD 2TB Elements Portable External Hard Drive - USB 3.0 ": "HD Externo WD 2TB USB 3.0",
    "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s": "SSD Interno SanDisk 1TB SATA III",
    "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5": "SSD Silicon Power 256GB SATA III",
    "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive": "HD Externo WD 4TB para Playstation 4",
    "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": "Monitor Acer SB220Q 21.5\" Full HD IPS",
    "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor": "Monitor Samsung 49\" Curvo 144Hz",
    "BIYLACLESEN Women's 3-6 Packs Solid Basic Short Sleeve Boat Neck V ": "Blusa Feminina BIYLACLESEN Gola Canoa",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Jaqueta Feminina Lock and Love Couro Sintético",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Jaqueta Feminina Impermeável Windbreaker",
    "MBJ Women's Solid Short Sleeve Boat Neck V ": "Blusa Feminina MBJ Gola Canoa",
    "Opna Women's Short Sleeve Moisture": "Blusa Feminina Opna Manga Curta",
    "DANVOUY Womens T Shirt Casual Cotton Short": "Camiseta Feminina DANVOUY Algodão Casual"
  }) as Record<string, string>, []);
  const descricaoProdutosPT = React.useMemo(() => ({
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
    "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin": "Monitor Acer 21.5\" Full HD IPS, ultrafino, imagem nítida e cores vibrantes.",
    "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor": "Monitor Samsung 49\" curvo, 144Hz, experiência imersiva para jogos.",
    "BIYLACLESEN Women's 3-6 Packs Solid Basic Short Sleeve Boat Neck V ": "Blusa feminina BIYLACLESEN, gola canoa, manga curta, básica e confortável.",
    "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket": "Jaqueta feminina Lock and Love, couro sintético, capuz removível, estilo motoqueira.",
    "Rain Jacket Women Windbreaker Striped Climbing Raincoats": "Jaqueta feminina impermeável, leve e estilosa, ideal para dias chuvosos.",
    "MBJ Women's Solid Short Sleeve Boat Neck V ": "Blusa feminina MBJ, manga curta, gola canoa, versátil para o dia a dia.",
    "Opna Women's Short Sleeve Moisture": "Blusa feminina Opna, manga curta, tecido que absorve umidade, ideal para esportes.",
    "DANVOUY Womens T Shirt Casual Cotton Short": "Camiseta feminina DANVOUY, algodão casual, confortável e moderna."
  }) as Record<string, string>, []);

  // Carregar avaliações do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('avaliacoes');
    if (stored) setAvaliacoes(JSON.parse(stored));
  }, []);

  // Salvar avaliações no localStorage
  useEffect(() => {
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
  }, [avaliacoes]);

  // Debounce da busca em tempo real
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [search]);

  // Resetar página ao filtrar/buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, minPrice, maxPrice, minRating, sortBy]);

  // Função para adicionar avaliação
  const adicionarAvaliacao = (id:number, nota:number, comentario:string) => {
    setAvaliacoes(prev => ({
      ...prev,
      [id]: [...(prev[id]||[]), {nota, comentario}]
    }));
  };

  // Função para carregar produtos (useCallback para dependência estável)
  const loadProducts = React.useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then(data => {
        const traduzidos = data.map((p: Product) => ({
          ...p,
          title: nomeProdutosPT[p.title] || p.title,
          description: descricaoProdutosPT[p.title] || p.description
        }));
        setProducts(traduzidos);
        setCategories(Array.from(new Set(traduzidos.map((p: Product) => categoriasPT[p.category] || p.category))));
      })
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false));
  }, [categoriasPT, nomeProdutosPT, descricaoProdutosPT]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // --- A PARTIR DAQUI, APENAS LÓGICA/RETORNOS CONDICIONAIS ---
  // Nenhum hook abaixo deste ponto!
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonProduct key={i} />
        ))}
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 gap-4">
        <div className="text-red-500 font-semibold text-lg">{error}</div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          onClick={loadProducts}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  // ...existing code...
  // Aqui deve continuar o restante do componente, como filtragem, paginação, renderização dos produtos, modais, etc.
  // Certifique-se de que tudo está dentro deste corpo de função!
  // Banner de promoções
  const bannerPromocao = (
    <div className="w-full mb-6">
      <div className="bg-gradient-to-r from-pink-500 via-blue-500 to-green-500 text-white text-center py-3 rounded-xl shadow-lg font-bold text-lg animate-pulse">
        🎉 Frete grátis acima de R$200 | 10% OFF no Pix | Novidades toda semana!
      </div>
    </div>
  );
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    // Compara categoria traduzida
    const categoriaTraduzida = categoriasPT[product.category] || product.category;
    const matchesCategory = category ? categoriaTraduzida === category : true;
    const min = minPrice !== '' ? parseFloat(minPrice) : undefined;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : undefined;
    const matchesMin = typeof min === 'number' ? product.price >= min : true;
    const matchesMax = typeof max === 'number' ? product.price <= max : true;
    const minR = minRating !== '' ? parseFloat(minRating) : undefined;
    const matchesMinRating = typeof minR === 'number' ? (product.rating?.rate ?? 0) >= minR : true;
    return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesMinRating;
  });

  if (sortBy) {
    filteredProducts = [...filteredProducts];
    switch (sortBy) {
      case 'price-asc':
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating-desc':
        filteredProducts.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        break;
      case 'rating-asc':
        filteredProducts.sort((a, b) => (a.rating?.rate ?? 0) - (b.rating?.rate ?? 0));
        break;
      default:
        break;
    }
  }

  // Paginação
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  // Já existe um useEffect para resetar página ao filtrar/buscar no topo do componente
  // Removido para evitar hook condicional
  return (
    <div className="p-6">
      {bannerPromocao}
      <form className="bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between" aria-label="Filtros de produtos">
        <div className="flex flex-col w-full md:w-1/3">
          <label htmlFor="search" className="text-sm font-medium text-gray-700 mb-1">Buscar por nome</label>
          <input
            id="search"
            type="text"
            placeholder="Buscar por nome..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Buscar por nome do produto"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/4">
          <label htmlFor="category" className="text-sm font-medium text-gray-700 mb-1">Categoria</label>
          <select
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Filtrar por categoria"
          >
            <option value="">Todas as categorias</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full md:w-1/6">
          <label htmlFor="minPrice" className="text-sm font-medium text-gray-700 mb-1">Preço mínimo</label>
          <input
            id="minPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Preço mínimo"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Preço mínimo"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/6">
          <label htmlFor="maxPrice" className="text-sm font-medium text-gray-700 mb-1">Preço máximo</label>
          <input
            id="maxPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="Preço máximo"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Preço máximo"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/6">
          <label htmlFor="minRating" className="text-sm font-medium text-gray-700 mb-1">Avaliação mínima</label>
          <input
            id="minRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Avaliação mínima"
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Avaliação mínima"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/6">
          <label htmlFor="sortBy" className="text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="border-2 border-blue-300 focus:border-blue-500 rounded px-4 py-2 transition"
            aria-label="Ordenar produtos"
          >
            <option value="">Ordenar por...</option>
            <option value="price-asc">Preço (crescente)</option>
            <option value="price-desc">Preço (decrescente)</option>
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
            <option value="rating-desc">Avaliação (maior primeiro)</option>
            <option value="rating-asc">Avaliação (menor primeiro)</option>
          </select>
        </div>
      </form>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Nenhum produto encontrado.</div>
        ) : (
          paginatedProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition duration-200 border border-gray-100 cursor-pointer"
              onClick={e => {
                if ((e.target as HTMLElement).closest('button')) return;
                setSelectedProduct(product);
                setModalOpen(true);
                addHistory({
                  type: 'view',
                  productId: product.id,
                  title: product.title,
                  image: product.image,
                  date: new Date().toISOString()
                });
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalhes de ${product.title}`}
            >
              <div className="w-full flex justify-between items-start mb-4">
                <img src={product.image} alt={product.title} className="h-32 object-contain" style={{maxWidth:'80%'}} />
                <WishlistButton product={product} />
              </div>
              <h2 className="text-base font-semibold mb-2 text-center text-gray-800 line-clamp-2" title={product.title}>{product.title}</h2>
              <span className="text-blue-700 font-extrabold text-xl mb-2 drop-shadow">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              {typeof product.stock === 'number' && (
                <span className={`mb-2 text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-500'}`}
                  title={product.stock > 0 ? `Disponível: ${product.stock}` : 'Produto esgotado'}>
                  {product.stock > 0 ? `Disponível: ${product.stock}` : 'Esgotado'}
                </span>
              )}
              <button
                className="mt-auto bg-gradient-to-r from-pink-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 hover:from-pink-600 transition font-bold tracking-wide"
                onClick={e => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.stock === 0}
              >
                <span className="inline-block mr-2">+</span> Adicionar ao carrinho
              </button>
              {/* Avaliação */}
              <div className="w-full mt-4">
                <form
                  className="flex flex-col gap-2"
                  onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as typeof e.target & { nota: { value: string }, comentario: { value: string } };
                    const nota = Number(form.nota.value);
                    const comentario = form.comentario.value;
                    if (nota >= 1 && nota <= 5 && comentario.length > 0) {
                      adicionarAvaliacao(product.id, nota, comentario);
                      form.nota.value = '';
                      form.comentario.value = '';
                    }
                  }}
                  aria-label={`Avaliar ${product.title}`}
                  onClick={e => e.stopPropagation()}
                >
                  <label className="text-sm font-medium text-gray-700">Avalie este produto:</label>
                  <div className="flex gap-2 items-center">
                    <input name="nota" type="number" min="1" max="5" required placeholder="Nota (1-5)" className="border rounded px-2 py-1 w-16" aria-label="Nota" />
                    <input name="comentario" type="text" required placeholder="Comentário" className="border rounded px-2 py-1 flex-1" aria-label="Comentário" />
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Enviar</button>
                  </div>
                </form>
                {/* Lista de avaliações */}
                {avaliacoes[product.id] && avaliacoes[product.id].length > 0 && (
                  <div className="mt-2">
                    <span className="font-bold text-sm text-gray-700">Avaliações:</span>
                    <ul className="mt-1">
                      {avaliacoes[product.id].map((a, idx) => (
                        <li key={idx} className="text-sm text-gray-800 mb-1">⭐ {a.nota} - {a.comentario}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded font-bold ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Página ${i + 1}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 font-bold"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            aria-label="Próxima página"
          >
            &gt;
          </button>
        </div>
      )}
    {/* Modal de detalhes do produto */}
    {modalOpen && selectedProduct && (
      <Suspense fallback={<div className="p-8">Carregando produto...</div>}>
        <ProductModal
          product={selectedProduct}
          open={modalOpen}
          onClose={() => { setModalOpen(false); setSelectedProduct(null); }}
          onAddToCart={addToCart}
        />
      </Suspense>
    )}
  </div>
  );
};