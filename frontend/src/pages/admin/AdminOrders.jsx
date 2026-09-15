import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { adminFetchAllOrders, adminUpdateOrderStatus } from '../../api/admin';

const STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminFetchAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatusChange = async (id, orderStatus) => {
    try {
      await adminUpdateOrderStatus(id, { orderStatus });
      toast.success('Order updated');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus } : o)));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update order');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-8">Orders</h1>
      {loading ? (
        <p className="text-sm text-stone">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-stone">No orders yet.</p>
      ) : (
        <div className="border border-stone/20 divide-y divide-stone/15">
          {orders.map((o) => (
            <div key={o._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm text-ink">{o.orderNumber}</p>
                <p className="text-xs text-stone mt-1">
                  {o.shippingAddress?.fullName} · {new Date(o.createdAt).toLocaleDateString('en-GB')} · GH₵{' '}
                  {o.totalPrice.toLocaleString()}
                </p>
              </div>
              <select
                value={o.orderStatus}
                onChange={(e) => handleStatusChange(o._id, e.target.value)}
                className="border border-stone/30 bg-transparent px-3 py-2 text-sm focus:border-wine outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
