import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-4">Page not found</h1>
      <p className="text-stone mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors">
        Back to home
      </Link>
    </section>
  );
}
