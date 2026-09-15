import api from './axios';

export async function fetchProducts(params = {}) {
  const { data } = await api.get('/products', { params });
  return data; // { products, page, pages, total }
}

export async function fetchProductFilters(category) {
  const { data } = await api.get('/products/filters', {
    params: category ? { category } : {},
  });
  return data; // { sizes, colors, priceRange }
}

export async function fetchProductBySlug(slug) {
  const { data } = await api.get(`/products/${slug}`);
  return data.product;
}
