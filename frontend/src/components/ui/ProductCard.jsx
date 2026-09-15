import { Link } from 'react-router-dom';
import ProductImage from './ProductImage';
import { buildWhatsAppLink, buildProductWhatsAppMessage } from '../../utils/whatsapp';

export default function ProductCard({ product }) {
  const { name, price, discountPrice, slug, images, isNewArrival, isBestSeller, onSale, inStock } = product;

  const badge = isNewArrival ? 'New' : isBestSeller ? 'Bestseller' : onSale ? 'Sale' : null;
  const displayPrice = onSale ? discountPrice : price;

  const handleWhatsApp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const message = buildProductWhatsAppMessage({
      name,
      size: 'Not selected yet',
      color: 'Not selected yet',
      quantity: 1,
      price: displayPrice,
    });
    window.open(buildWhatsAppLink(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <Link to={`/product/${slug}`} className="group block">
      <div className="relative">
        <ProductImage src={images?.[0]?.url} alt={name} imgClassName="transition-transform duration-300 group-hover:scale-105" />
        {badge && (
          <span className="absolute top-3 left-3 bg-ink text-bone text-[11px] px-2.5 py-1 tracking-wide">
            {badge}
          </span>
        )}
        {!inStock && (
          <span className="absolute inset-0 bg-bone/75 flex items-center justify-center text-xs text-stone tracking-wide">
            Sold out
          </span>
        )}
        <button
          onClick={handleWhatsApp}
          aria-label={`Ask about ${name} on WhatsApp`}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-sage/90 text-bone flex items-center justify-center hover:bg-ink transition-colors"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.36 2 11.75c0 2.06.65 3.97 1.76 5.55L2.6 21.4a.5.5 0 00.62.62l4.02-1.16a10.4 10.4 0 004.76 1.14c5.52 0 10-4.36 10-9.75S17.52 2 12 2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.17-2.95.85.87-2.83-.2-.3A7.87 7.87 0 013.8 11.75C3.8 7.34 7.47 3.8 12 3.8s8.2 3.55 8.2 7.95-3.67 7.95-8.2 7.95z" />
          </svg>
        </button>
      </div>
      <div className="mt-3">
        <h3 className="text-sm text-ink leading-snug group-hover:text-wine transition-colors">{name}</h3>
        <p className="text-sm text-stone mt-0.5">
          GH₵ {displayPrice?.toLocaleString()}
          {onSale && (
            <span className="ml-2 text-xs line-through text-stone/55">GH₵ {price?.toLocaleString()}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
