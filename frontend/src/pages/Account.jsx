import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Account() {
  usePageTitle('My Account');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <section className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-24">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
        Welcome, {user.name.split(' ')[0]}
      </h1>
      <p className="text-sm text-stone mb-10">{user.email}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
        <Link to="/account/orders" className="border border-stone/20 p-6 block hover:border-wine transition-colors">
          <p className="text-sm text-ink mb-1">Orders</p>
          <p className="text-xs text-stone">View your order history</p>
        </Link>
        {['Favourites', 'Delivery details'].map((label) => (
          <div key={label} className="border border-stone/20 p-6">
            <p className="text-sm text-ink mb-1">{label}</p>
            <p className="text-xs text-stone">Coming in a later phase.</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 border border-ink text-ink px-6 py-3 text-sm hover:border-wine hover:text-wine transition-colors"
      >
        Log out
      </button>
    </section>
  );
}
