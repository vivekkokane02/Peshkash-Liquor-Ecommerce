import { apiClient } from './apiClient.js';

// list({ page, limit, search, category, sort }) -> { data, meta }
export async function listProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') acc[key] = value;
      return acc;
    }, {})
  ).toString();
  const res = await apiClient.get(`/products${query ? `?${query}` : ''}`);
  return { data: res.data, meta: res.meta };
}

export async function getProduct(id) {
  const res = await apiClient.get(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload) {
  const res = await apiClient.post('/products', payload);
  return res.data;
}

export async function updateProduct(id, payload) {
  const res = await apiClient.patch(`/products/${id}`, payload);
  return res.data;
}

export async function deleteProduct(id) {
  await apiClient.delete(`/products/${id}`);
}
