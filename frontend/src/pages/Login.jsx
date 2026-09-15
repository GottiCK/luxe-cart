import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Login() {
  usePageTitle('Sign In');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
            const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`);
      navigate(location.state?.from?.pathname || '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong — try again');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-5 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">Sign in</h1>
      <p className="text-sm text-stone mb-8">Welcome back to LUXE CART.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-xs text-stone mb-1.5">Password</label>
          <input
            type="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
            className="w-full border border-stone/30 bg-transparent px-4 py-3 text-sm focus:border-wine outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-bone py-3.5 text-sm hover:bg-wine transition-colors disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="text-sm text-stone mt-6">
        New here?{' '}
        <Link to="/register" className="text-wine hover:text-wine-dark">
          Create an account
        </Link>
      </p>
    </section>
  );
}
