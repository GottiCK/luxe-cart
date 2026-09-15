import api from './axios';

export async function fetchSiteSettings() {
  const { data } = await api.get('/settings');
  return data.settings;
}
