import api from './axios';

export async function createOrder(payload) {
  const { data } = await api.post('/orders', payload);
  return data.order;
}

export async function fetchOrderById(id) {
  const { data } = await api.get(`/orders/${id}`);
  return data.order;
}

export async function fetchMyOrders() {
  const { data } = await api.get('/orders/myorders');
  return data.orders;
}