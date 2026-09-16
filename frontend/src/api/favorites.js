import api from './axios';

export async function fetchFavorites() {
  const { data } = await api.get('/users/favorites');
  return data.favorites;
}

export async function addFavorite(productId) {
  const { data } = await api.post(`/users/favorites/${productId}`);
  return data.favorites;
}

export async function removeFavorite(productId) {
  const { data } = await api.delete(`/users/favorites/${productId}`);
  return data.favorites;
}
