import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { fetchFavorites } from '../api/favorites';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Favorites() {
  usePageTitle('Your Favourites');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites()
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }

  if (favorites.length === 0) {
    return (
      <section className="max-w-content mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">No favourites yet</h1>
        <p className="text-stone text-sm mb-8">Tap the heart on any product to save it here.</p>
        <Link to="/shop" className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors">
          Start browsing
        </Link>
      </section>
    );
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <Link to="/account" className="text-sm text-stone hover:text-wine mb-6 inline-block">
        ← Back to account
      </Link>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Your favourites</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
        {favorites.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}
