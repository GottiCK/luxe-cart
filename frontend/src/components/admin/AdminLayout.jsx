import { NavLink, Outlet } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/categories', label: 'Categories' },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bone">
      <aside className="w-full md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-stone/15 bg-ink text-bone p-5 md:p-6 md:min-h-screen">
        <p className="font-display text-xl mb-5 md:mb-8">
          LUXE CART <span className="text-bone/50 text-xs align-top">Admin</span>
        </p>
        <nav className="flex md:block gap-1 overflow-x-auto md:space-y-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `shrink-0 md:block px-3 py-2 text-sm whitespace-nowrap ${
                  isActive ? 'bg-bone/10 text-bone' : 'text-bone/70 hover:text-bone'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/" className="hidden md:block mt-8 text-xs text-bone/50 hover:text-bone">
          ← Back to store
        </NavLink>
      </aside>
      <main className="flex-1 p-5 md:p-8 max-w-6xl w-full">
        <Outlet />
      </main>
    </div>
  );
}
