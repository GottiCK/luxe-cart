import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api/orders';
import { usePageTitle } from '../hooks/usePageTitle';

export default function OrderHistory() {
  usePageTitle('Your Orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }

  if (orders.length === 0) {
    return (
      <section className="max-w-content mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">No orders yet</h1>
        <p className="text-stone text-sm mb-8">When you place an order, it will show up here.</p>
        <Link to="/shop" className="bg-ink text-bone px-6 py-3 text-sm hover:bg-wine transition-colors">
          Start shopping
        </Link>
      </section>
    );
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <Link to="/account" className="text-sm text-stone hover:text-wine mb-6 inline-block">
        ← Back to account
      </Link>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Your orders</h1>

      <div className="divide-y divide-stone/15 border-t border-b border-stone/15">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/order/${order._id}`}
            className="flex items-center justify-between py-5 px-2 -mx-2 hover:bg-cloud/40 transition-colors"
          >
            <div>
              <p className="text-sm text-ink">{order.orderNumber}</p>
              <p className="text-xs text-stone mt-1">
                {new Date(order.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
                {' · '}
                {order.orderItems.length} item{order.orderItems.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-ink">GH₵ {order.totalPrice.toLocaleString()}</p>
              <p className="text-xs text-stone mt-1">{order.orderStatus}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
