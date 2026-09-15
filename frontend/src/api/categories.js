import api from './axios';

export async function fetchCategories(parentType) {
  const { data } = await api.get('/categories', {
    params: parentType ? { parentType } : {},
  });
  return data.categories;
}
