import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../../api/admin';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats).catch(() => {});
  }, []);

  if (!stats) {
    return <p className="text-sm text-stone">Loading…</p>;
  }

  const maxRevenue = Math.max(...stats.revenueByDay.map((d) => d.total), 1);

  const cards = [
    { label: 'Total revenue', value: `GH₵ ${stats.totalRevenue.toLocaleString()}` },
    { label: 'Total orders', value: stats.totalOrders },
    { label: 'Pending orders', value: stats.pendingOrders },
    { label: 'Products', value: stats.totalProducts },
    { label: 'Customers', value: stats.totalCustomers },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-stone/20 p-5">
            <p className="text-xs text-stone mb-1">{c.label}</p>
            <p className="text-xl text-ink">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-stone/20 p-6">
        <p className="text-sm text-ink mb-6">Revenue, last 7 days</p>
        <div className="flex items-end gap-3 h-40">
          {stats.revenueByDay.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-2 h-full">
              <div
                className="w-full bg-wine/80"
                style={{ height: `${Math.max(4, (d.total / maxRevenue) * 120)}px` }}
                title={`GH₵ ${d.total}`}
              />
              <span className="text-[10px] text-stone shrink-0">
                {new Date(d.date).toLocaleDateString('en-GB', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
