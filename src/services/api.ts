
export const API_URL = 'http://localhost:3001/products';

export async function fetchProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }
  return response.json();
}

// Atualiza o estoque de um produto (decrementa ao comprar)
export async function updateProductStock(productId: number, newStock: number) {
  const response = await fetch(`${API_URL}/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stock: newStock })
  });
  if (!response.ok) {
    throw new Error('Erro ao atualizar estoque');
  }
  return response.json();
}
