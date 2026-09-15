import { useEffect, useState } from 'react';
import { adminFetchCustomers } from '../../api/admin';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetchCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Customers</h1>
      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : customers.length === 0 ? (
        <p className="text-sm text-stone">No customer accounts yet.</p>
      ) : (
        <div className="border border-stone/20 divide-y divide-stone/15">
          {customers.map((c) => (
            <div key={c._id} className="px-5 py-4">
              <p className="text-sm text-ink">{c.name}</p>
              <p className="text-xs text-stone mt-1">
                {c.email}
                {c.phone ? ` · ${c.phone}` : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
