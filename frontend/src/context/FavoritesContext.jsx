import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavorites, addFavorite, removeFavorite } from '../api/favorites';

const FavoritesContext = createContext(null);

// Tracks which product IDs the logged-in customer has favourited, so any
// product card anywhere in the app can show/toggle its heart without each
// page having to fetch and pass that down separately.
export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (user) {
      fetchFavorites()
        .then((favs) => setFavoriteIds(favs.map((p) => p._id)))
        .catch(() => setFavoriteIds([]));
    } else {
      setFavoriteIds([]);
    }
  }, [user]);

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const toggleFavorite = async (productId) => {
    if (isFavorite(productId)) {
      const favs = await removeFavorite(productId);
      setFavoriteIds(favs.map(String));
    } else {
      const favs = await addFavorite(productId);
      setFavoriteIds(favs.map(String));
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
