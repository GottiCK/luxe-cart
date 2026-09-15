import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role !== 'admin') {
        toast.error('This account does not have admin access');
        return;
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl text-bone text-center mb-1">LUXE CART</p>
        <p className="text-bone/50 text-xs text-center tracking-wide mb-8">ADMIN</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-bone/60 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-bone/20 bg-transparent text-bone px-4 py-3 text-sm focus:border-bone outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-bone/60 mb-1.5">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border border-bone/20 bg-transparent text-bone px-4 py-3 text-sm focus:border-bone outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-bone text-ink py-3.5 text-sm hover:bg-wine hover:text-bone transition-colors disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-bone/40 hover:text-bone/70 mt-8">
          ← Back to store
        </Link>
      </div>
    </div>
  );
}
