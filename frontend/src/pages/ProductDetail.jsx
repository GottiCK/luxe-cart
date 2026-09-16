import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchProductBySlug } from '../api/products';
import { useCart } from '../context/CartContext';
import ProductImage from '../components/ui/ProductImage';
import { buildWhatsAppLink, buildProductWhatsAppMessage } from '../utils/whatsapp';
import { usePageTitle } from '../hooks/usePageTitle';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  usePageTitle(product?.name);

  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        setActiveImage(0);
        setSize('');
        setColor('');
        setQuantity(1);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }

  if (!product) {
    return (
      <section className="max-w-content mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Product not found</h1>
        <Link to="/shop" className="text-wine hover:text-wine-dark text-sm">
          Back to shop
        </Link>
      </section>
    );
  }

  const sizes = product.sizes || [];
  const colors = product.colors || [];
  const selectedVariant = product.variants.find((v) => v.size === size && v.color === color);
  const stockForSelection = selectedVariant ? selectedVariant.stock : null;
  const price = product.onSale ? product.discountPrice : product.price;
  const canAdd = size && color && stockForSelection > 0;

  const handleAddToCart = () => {
    if (!canAdd) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images?.[0]?.url,
      price,
      size,
      color,
      quantity,
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!canAdd) return;
    handleAddToCart();
    navigate('/cart');
  };

  const favorited = isFavorite(product._id);

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error('Sign in to save favourites');
      navigate('/login');
      return;
    }
    try {
      await toggleFavorite(product._id);
      toast.success(favorited ? 'Removed from favourites' : 'Added to favourites');
    } catch {
      toast.error('Could not update favourites');
    }
  };

  const whatsappMessage = buildProductWhatsAppMessage({
    name: product.name,
    size: size || 'Not selected',
    color: color || 'Not selected',
    quantity,
    price,
  });

  return (
    <section className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        {/* Images */}
        <div>
          <ProductImage src={product.images?.[activeImage]?.url} alt={product.name} />
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 ${i === activeImage ? 'ring-2 ring-wine' : ''}`}
                >
                  <ProductImage src={img.url} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-xs text-stone uppercase tracking-wide mb-2">{product.subcategory}</p>
          <div className="flex items-start justify-between gap-4 mb-3">
            <h1 className="font-display text-3xl md:text-4xl text-ink">{product.name}</h1>
            <button
              onClick={handleToggleFavorite}
              aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
              className="shrink-0 w-10 h-10 rounded-full border border-stone/25 flex items-center justify-center hover:border-wine transition-colors mt-1"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill={favorited ? '#7C2438' : 'none'}
                stroke={favorited ? '#7C2438' : '#1C1815'}
                strokeWidth="1.8"
              >
                <path d="M12 21s-6.7-4.35-9.3-8.28C.86 9.94 1.64 6.2 4.6 4.8c2.1-.99 4.3-.2 5.4 1.4l2 2.9 2-2.9c1.1-1.6 3.3-2.39 5.4-1.4 2.96 1.4 3.74 5.14 1.9 7.92C18.7 16.65 12 21 12 21z" />
              </svg>
            </button>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-lg text-ink">GH₵ {price?.toLocaleString()}</span>
            {product.onSale && (
              <span className="text-sm text-stone line-through">GH₵ {product.price.toLocaleString()}</span>
            )}
          </div>

          <p className="text-sm text-stone leading-relaxed mb-8">{product.description}</p>

          <div className="mb-6">
            <p className="text-xs text-stone mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-sm border ${
                    size === s ? 'border-ink bg-ink text-bone' : 'border-stone/30 text-ink hover:border-ink'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xs text-stone mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`px-4 py-2 text-sm border ${
                    color === c ? 'border-ink bg-ink text-bone' : 'border-stone/30 text-ink hover:border-ink'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {size && color && (
            <p className={`text-xs mb-6 ${stockForSelection > 0 ? 'text-sage' : 'text-wine'}`}>
              {stockForSelection > 0
                ? stockForSelection <= 5
                  ? `Only ${stockForSelection} left in this size and color`
                  : 'In stock'
                : 'Out of stock in this size and color'}
            </p>
          )}

          <div className="mb-8">
            <p className="text-xs text-stone mb-2">Quantity</p>
            <div className="inline-flex items-center border border-stone/25">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-9 h-9 text-ink/70 hover:text-wine">
                −
              </button>
              <span className="w-10 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => (stockForSelection ? Math.min(stockForSelection, q + 1) : q + 1))}
                className="w-9 h-9 text-ink/70 hover:text-wine"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!canAdd}
              className="flex-1 bg-ink text-bone py-3.5 text-sm hover:bg-wine transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Add to cart
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!canAdd}
              className="flex-1 border border-ink text-ink py-3.5 text-sm hover:border-wine hover:text-wine transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy now
            </button>
          </div>

          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 border border-sage text-sage py-3.5 text-sm hover:bg-sage hover:text-bone transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.36 2 11.75c0 2.06.65 3.97 1.76 5.55L2.6 21.4a.5.5 0 00.62.62l4.02-1.16a10.4 10.4 0 004.76 1.14c5.52 0 10-4.36 10-9.75S17.52 2 12 2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.17-2.95.85.87-2.83-.2-.3A7.87 7.87 0 013.8 11.75C3.8 7.34 7.47 3.8 12 3.8s8.2 3.55 8.2 7.95-3.67 7.95-8.2 7.95z" />
            </svg>
            Order on WhatsApp
          </a>

          {(!size || !color) && (
            <p className="text-[11px] text-stone/70 mt-3">Select a size and color to continue.</p>
          )}
        </div>
      </div>
    </section>
  );
}
