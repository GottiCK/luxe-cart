import { Link } from 'react-router-dom';
import { buildWhatsAppLink } from '../../utils/whatsapp';

const SHOP_LINKS = [
  { label: 'Clothes', to: '/shop?category=clothes' },
  { label: 'Shoes', to: '/shop?category=shoes' },
  { label: 'Slippers', to: '/shop?category=slippers' },
  { label: 'New Arrivals', to: '/new-arrivals' },
];

const CARE_LINKS = [
  { label: 'Contact us', to: '/contact' },
  { label: 'Delivery information', to: '/contact' },
  { label: 'Returns & exchanges', to: '/contact' },
  { label: 'Track my order', to: '/account' },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-bone mt-24">
      <div className="max-w-content mx-auto px-5 md:px-8 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-2xl mb-3">LUXE CART</p>
          <p className="text-sm text-bone/65 leading-relaxed max-w-[220px]">
            Considered fashion, shoes and slippers for everyday Ghana — delivered to your door.
          </p>
        </div>

        <div>
          <p className="text-sm text-bone/90 mb-4">Shop</p>
          <ul className="space-y-2.5">
            {SHOP_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-bone/60 hover:text-bone transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-bone/90 mb-4">Customer care</p>
          <ul className="space-y-2.5">
            {CARE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-bone/60 hover:text-bone transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm text-bone/90 mb-4">Stay in touch</p>
          <p className="text-sm text-bone/60 mb-3">
            Chat with us directly for sizing help or order questions.
          </p>
          <a
            href={buildWhatsAppLink("Hi LUXE CART, I'd like to know more about your products.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm border border-bone/30 px-4 py-2.5 hover:border-bone/70 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.36 2 11.75c0 2.06.65 3.97 1.76 5.55L2.6 21.4a.5.5 0 00.62.62l4.02-1.16a10.4 10.4 0 004.76 1.14c5.52 0 10-4.36 10-9.75S17.52 2 12 2zm0 17.7c-1.5 0-2.9-.4-4.1-1.1l-.3-.17-2.95.85.87-2.83-.2-.3A7.87 7.87 0 013.8 11.75C3.8 7.34 7.47 3.8 12 3.8s8.2 3.55 8.2 7.95-3.67 7.95-8.2 7.95z" />
            </svg>
            Message on WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-bone/15">
        <div className="max-w-content mx-auto px-5 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-bone/50">© {new Date().getFullYear()} LUXE CART. All rights reserved.</p>
          <p className="text-xs text-bone/50">MTN MoMo · Telecel Cash · AirtelTigo Money · Card</p>
        </div>
      </div>
    </footer>
  );
}
