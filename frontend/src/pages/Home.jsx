import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductImage from '../components/ui/ProductImage';
import ProductCard from '../components/ui/ProductCard';
import Stars from '../components/ui/Stars';
import { sampleReviews } from '../data/sampleProducts';
import { buildWhatsAppLink } from '../utils/whatsapp';
import { fetchProducts } from '../api/products';
import { fetchSiteSettings } from '../api/settings';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
  { label: 'Clothes', to: '/shop?category=clothes', key: 'clothes' },
  { label: 'Shoes', to: '/shop?category=shoes', key: 'shoes' },
  { label: 'Slippers', to: '/shop?category=slippers', key: 'slippers' },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeInUp}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  usePageTitle();
  const { user } = useAuth();

  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    fetchProducts({ isFeatured: 'true', limit: 4 }).then((d) => setFeatured(d.products)).catch(() => {});
    fetchProducts({ isNewArrival: 'true', limit: 4 }).then((d) => setNewArrivals(d.products)).catch(() => {});
    fetchProducts({ isBestSeller: 'true', limit: 4 }).then((d) => setBestSellers(d.products)).catch(() => {});
    fetchSiteSettings().then(setSiteSettings).catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <Reveal>
        <section className="relative">
          <ProductImage
            src={siteSettings?.heroImage?.url}
            alt="Hero photo — model wearing a hero product"
            dims="Recommended 1920×1080px"
            ratio="aspect-[4/5] md:aspect-[16/8]"
            className="bg-gradient-to-br from-cloud to-stone/10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-content mx-auto px-5 md:px-8 pb-10 md:pb-16">
              <h1 className="font-display text-bone text-[42px] leading-[1.05] md:text-7xl max-w-xl">
                Your style.
                <br />
                Your choice.
              </h1>
              <p className="text-bone/85 mt-4 max-w-sm text-[15px] leading-relaxed">
                Clothes, shoes and slippers picked for everyday Ghana — quality
                you can feel, prices that make sense, delivered to your door.
              </p>
              <div className="flex flex-wrap gap-3 mt-7">
                <Link
                  to="/shop"
                  className="bg-bone text-ink px-7 py-3 text-sm hover:bg-wine hover:text-bone transition-colors"
                >
                  Shop now
                </Link>
                <Link
                  to="/shop?isNewArrival=true"
                  className="border border-bone/60 text-bone px-7 py-3 text-sm hover:border-bone transition-colors"
                >
                  View collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Reveal>

           {/* Create account / sign in CTA — only shown to logged-out visitors */}
      {!user && (
        <Reveal className="max-w-content mx-auto px-5 md:px-8 py-4 md:py-8">
          <div className="bg-cloud/60 p-8 md:p-10 text-center">
            <h2 className="font-display text-2xl md:text-3xl text-ink mb-3">New to LUXE CART?</h2>
            <p className="text-stone text-sm mb-6 max-w-sm mx-auto">
              Create an account for faster checkout, order tracking and saved favourites.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-ink text-bone px-7 py-3 text-sm hover:bg-wine transition-colors"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto border border-ink text-ink px-7 py-3 text-sm hover:border-wine hover:text-wine transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </Reveal>
      )}


  
      {/* Categories */}
      <Reveal className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
        <h2 className="font-display text-3xl md:text-4xl text-ink mb-8">Shop by category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORIES.map((cat) => (
            <Link key={cat.label} to={cat.to} className="group relative block">
              <ProductImage
                src={siteSettings?.categoryImages?.[cat.key]?.url}
                alt={`${cat.label} category photo`}
                dims="Recommended 900×1200px"
                ratio="aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
              <span className="absolute bottom-5 left-5 font-display text-2xl text-bone group-hover:text-bone/80 transition-colors">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      {/* Featured */}
      {featured.length > 0 && (
        <Reveal className="max-w-content mx-auto px-5 md:px-8 py-4 md:py-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-ink">Featured</h2>
            <Link to="/shop" className="text-sm text-wine hover:text-wine-dark transition-colors">
              Shop all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Offer banner */}
      <Reveal className="my-20">
        <div className="bg-wine text-bone">
          <div className="max-w-content mx-auto px-5 md:px-8 py-12 md:py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-3xl md:text-4xl mb-2">Mid-season sale</h3>
              <p className="text-bone/85 text-[15px]">Up to 30% off selected clothing, shoes and slippers.</p>
            </div>
            <Link
              to="/shop"
              className="bg-bone text-wine px-7 py-3 text-sm hover:bg-ink hover:text-bone transition-colors shrink-0"
            >
              Shop the sale
            </Link>
          </div>
        </div>
      </Reveal>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <Reveal className="max-w-content mx-auto px-5 md:px-8 py-4 md:py-8">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-ink">New arrivals</h2>
            <Link to="/shop?isNewArrival=true" className="text-sm text-wine hover:text-wine-dark transition-colors">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {newArrivals.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <Reveal className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl text-ink">Best sellers</h2>
            <Link to="/shop?isBestSeller=true" className="text-sm text-wine hover:text-wine-dark transition-colors">
              Shop all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
            {bestSellers.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Reveal>
      )}

      {/* Reviews */}
      <Reveal className="bg-cloud/60 py-16 md:py-20">
        <div className="max-w-content mx-auto px-5 md:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-10">What customers say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleReviews.map((r) => (
              <div key={r.name}>
                <Stars rating={r.rating} />
                <p className="text-[15px] text-ink/80 leading-relaxed mt-3">"{r.quote}"</p>
                <p className="text-sm text-stone mt-3">{r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Newsletter / WhatsApp */}
      <Reveal className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-3">Stay ahead of new drops</h2>
            <p className="text-stone text-[15px] mb-5 max-w-sm">
              Join the list for early access to new arrivals and members-only offers.
            </p>
            <form className="flex gap-2 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Your email address"
                className="flex-1 border border-stone/30 bg-transparent px-4 py-3 text-sm placeholder:text-stone/60 focus:border-wine outline-none"
              />
              <button className="bg-ink text-bone px-5 text-sm hover:bg-wine transition-colors">Join</button>
            </form>
          </div>
          <div className="bg-ink text-bone p-8 md:p-10">
            <h3 className="font-display text-2xl mb-2">Prefer WhatsApp?</h3>
            <p className="text-bone/70 text-sm mb-6">
              Message us directly for styling advice, sizing help or to place an order.
            </p>
            <a
              href={buildWhatsAppLink("Hi LUXE CART, I'd like to know more about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-bone text-ink px-6 py-3 text-sm hover:bg-wine hover:text-bone transition-colors"
            >
              Chat with us
            </a>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
