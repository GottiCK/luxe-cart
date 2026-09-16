import api from './axios';

export async function fetchAddresses() {
  const { data } = await api.get('/users/addresses');
  return data.addresses;
}

export async function createAddress(payload) {
  const { data } = await api.post('/users/addresses', payload);
  return data.addresses;
}

export async function deleteAddress(addressId) {
  const { data } = await api.delete(`/users/addresses/${addressId}`);
  return data.addresses;
}

export async function setDefaultAddress(addressId) {
  const { data } = await api.put(`/users/addresses/${addressId}/default`);
  return data.addresses;
}
