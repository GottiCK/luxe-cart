import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Register() {
  usePageTitle('Create Account');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to LUXE CART, ${user.name.split(' ')[0]}`);
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong — try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-5 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">Create an account</h1>
      <p className="text-sm text-stone mb-8">Faster checkout, order history and saved favourites.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-stone mb-1.5">Full name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-stone mb-1.5">Email</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-stone mb-1.5">Phone number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="055 992 0138"
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-stone mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            value={form.password}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
          <p className="text-[11px] text-stone/70 mt-1">At least 6 characters.</p>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-bone py-3.5 text-sm hover:bg-wine transition-colors disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="text-sm text-stone mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-wine hover:text-wine-dark">
          Sign in
        </Link>
      </p>
    </section>
  );
}
