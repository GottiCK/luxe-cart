import { Link } from 'react-router-dom';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function ComingSoon({ title, message }) {
  return (
    <section className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-4">{title}</h1>
      <p className="text-stone max-w-md mx-auto mb-8">{message}</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors">
          Back to home
        </Link>
        <a
          href={buildWhatsAppLink('Hi LUXE CART, I have a question.')}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-ink text-ink px-6 py-3 text-sm hover:border-wine hover:text-wine transition-colors"
        >
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
