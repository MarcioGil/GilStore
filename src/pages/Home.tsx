import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// Mapeamento de nomes em português (fora do componente para evitar warning do useEffect)
const categoriasPT: Record<string, string> = {
  "men's clothing": "Roupas Masculinas",
  "women's clothing": "Roupas Femininas",
  "jewelery": "Joias",
  "electronics": "Eletrônicos"
};
const nomeProdutosPT: Record<string, string> = {
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
};
export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
    const [minRating, setMinRating] = useState('');
    const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();
  useEffect(() => {
    fetchProducts()
      .then(data => {
        // Traduz nomes para português
        const traduzidos = data.map((p: Product) => ({
          ...p,
          title: nomeProdutosPT[p.title] || p.title
        }));
        setProducts(traduzidos);
        // Salva categorias traduzidas
        setCategories(Array.from(new Set(traduzidos.map((p: Product) => categoriasPT[p.category] || p.category))));
      })
      .catch(() => setError('Erro ao carregar produtos.'))
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="text-center mt-10">Carregando...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
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
  return (
    <div className="p-6">
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
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">Nenhum produto encontrado.</div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center hover:shadow-2xl hover:-translate-y-1 transition duration-200 border border-gray-100">
              <div className="w-full flex justify-center items-center mb-4">
                <img src={product.image} alt={product.title} className="h-32 object-contain" style={{maxWidth:'80%'}} />
              </div>
              <h2 className="text-base font-semibold mb-2 text-center text-gray-800 line-clamp-2" title={product.title}>{product.title}</h2>
              <span className="text-blue-700 font-extrabold text-xl mb-2 drop-shadow">{product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
              <button
                className="mt-auto bg-gradient-to-r from-pink-500 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:scale-105 hover:from-pink-600 transition font-bold tracking-wide"
                onClick={() => addToCart(product)}
              >
                <span className="inline-block mr-2">+</span> Adicionar ao carrinho
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};