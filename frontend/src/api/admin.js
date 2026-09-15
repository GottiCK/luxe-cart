import api from './axios';

// Products
export async function adminCreateProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data.product;
}
export async function adminUpdateProduct(id, payload) {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.product;
}
export async function adminDeleteProduct(id) {
  await api.delete(`/products/${id}`);
}

// Image upload
export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.image; // { url, publicId }
}

// Orders
export async function adminFetchAllOrders() {
  const { data } = await api.get('/orders');
  return data.orders;
}
export async function adminUpdateOrderStatus(id, payload) {
  const { data } = await api.put(`/orders/${id}/status`, payload);
  return data.order;
}

// Customers
export async function adminFetchCustomers() {
  const { data } = await api.get('/users');
  return data.users;
}

// Categories
export async function adminCreateCategory(payload) {
  const { data } = await api.post('/categories', payload);
  return data.category;
}
export async function adminUpdateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.category;
}
export async function adminDeleteCategory(id) {
  await api.delete(`/categories/${id}`);
}

// Stats
export async function fetchDashboardStats() {
  const { data } = await api.get('/stats');
  return data.stats;
}

// Site content (hero + category images)
export async function adminUpdateSiteSettings(payload) {
  const { data } = await api.put('/settings', payload);
  return data.settings;
}
