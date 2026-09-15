import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../api/orders';
import { GHANA_REGIONS } from '../data/regions';
import { usePageTitle } from '../hooks/usePageTitle';

const PAYMENT_METHODS = [
  { value: 'MTN MoMo', label: 'MTN Mobile Money' },
  { value: 'Telecel Cash', label: 'Telecel Cash' },
  { value: 'AirtelTigo Money', label: 'AirtelTigo Money' },
  { value: 'Card', label: 'Card' },
];

export default function Checkout() {
  usePageTitle('Checkout');
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    region: '',
    city: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('MTN MoMo');
  const [submitting, setSubmitting] = useState(false);

  const selectedRegion = GHANA_REGIONS.find((r) => r.name === form.region);
  const deliveryFee = selectedRegion ? selectedRegion.fee : 0;
  const total = subtotal + deliveryFee;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.region) {
      toast.error('Please select your region');
      return;
    }
    setSubmitting(true);
    try {
      const order = await createOrder({
        orderItems: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        shippingAddress: form,
        paymentMethod,
      });
      clearCart();
      navigate(`/order/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place your order — try again');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="max-w-content mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Your cart is empty</h1>
        <Link to="/shop" className="text-wine hover:text-wine-dark text-sm">
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h2 className="text-sm text-stone mb-4">Delivery details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                required
                name="fullName"
                placeholder="Full name"
                value={form.fullName}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none sm:col-span-2"
              />
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={form.phone}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
              />
              <input
                required
                name="address"
                placeholder="Delivery address"
                value={form.address}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none sm:col-span-2"
              />
              <select
                required
                name="region"
                value={form.region}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
              >
                <option value="">Region</option>
                {GHANA_REGIONS.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
              <input
                required
                name="city"
                placeholder="City / Town"
                value={form.city}
                onChange={handleChange}
                className="border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
              />
            </div>
          </div>

          <div>
            <h2 className="text-sm text-stone mb-4">Payment method</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => (
                <label
                  key={m.value}
                  className="flex items-center gap-3 border border-stone/25 px-4 py-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)}
                    className="accent-wine"
                  />
                  <span className="text-sm text-ink">{m.label}</span>
                </label>
              ))}
            </div>
            <p className="text-[11px] text-stone/70 mt-3">
              No live payment gateway is connected yet — after placing your order, you'll confirm
              payment with us directly on WhatsApp.
            </p>
          </div>
        </div>

        <div className="bg-cloud/50 p-6 md:p-7 h-fit">
          <h2 className="font-display text-xl text-ink mb-5">Order summary</h2>
          <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.lineId} className="flex justify-between text-sm">
                <span className="text-ink/80">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-stone">GH₵ {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-stone mb-2 border-t border-stone/20 pt-4">
            <span>Subtotal</span>
            <span>GH₵ {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-stone mb-4">
            <span>Delivery{selectedRegion ? ` (${selectedRegion.name})` : ''}</span>
            <span>{selectedRegion ? `GH₵ ${deliveryFee.toLocaleString()}` : 'Select region'}</span>
          </div>
          <div className="flex justify-between text-[15px] text-ink border-t border-stone/20 pt-4 mb-6">
            <span>Total</span>
            <span>GH₵ {total.toLocaleString()}</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-bone py-3.5 text-sm hover:bg-wine transition-colors disabled:opacity-60"
          >
            {submitting ? 'Placing order…' : 'Place order'}
          </button>
        </div>
      </form>
    </div>
  );
}
