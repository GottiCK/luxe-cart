import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../api/orders';
import { buildWhatsAppLink } from '../utils/whatsapp';
import OrderStatusStepper from '../components/ui/OrderStatusStepper';
import { usePageTitle } from '../hooks/usePageTitle';

export default function OrderConfirmation() {
  usePageTitle('Order Confirmed');
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-content mx-auto px-5 py-24 text-center text-sm text-stone">Loading…</div>;
  }

  if (!order) {
    return (
      <section className="max-w-content mx-auto px-5 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-3">Order not found</h1>
        <Link to="/shop" className="text-wine hover:text-wine-dark text-sm">
          Back to shop
        </Link>
      </section>
    );
  }

  const whatsappMessage = [
    `Hi LUXE CART, I've just placed order ${order.orderNumber}.`,
    `Payment method: ${order.paymentMethod}`,
    `Total: GH₵ ${order.totalPrice.toLocaleString()}`,
    `I'm sending my payment confirmation now.`,
  ].join('\n');

  return (
    <section className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-20">
      <div className="max-w-xl">
        <p className="text-sage text-sm mb-2">Order confirmed</p>
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">
          Thank you{order.shippingAddress?.fullName ? `, ${order.shippingAddress.fullName.split(' ')[0]}` : ''}
        </h1>
        <p className="text-stone text-sm mb-6">
          Order <span className="text-ink">{order.orderNumber}</span>
        </p>
        <div className="mb-8">
          <OrderStatusStepper status={order.orderStatus} />
        </div>

        <div className="border border-stone/20 divide-y divide-stone/15 mb-8">
          {order.orderItems.map((item, i) => (
            <div key={i} className="flex justify-between px-5 py-4 text-sm">
              <div>
                <p className="text-ink">{item.name}</p>
                <p className="text-stone text-xs mt-0.5">
                  {item.size} · {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="text-ink">GH₵ {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
          <div className="px-5 py-4 text-sm flex justify-between text-stone">
            <span>Subtotal</span>
            <span>GH₵ {order.itemsPrice.toLocaleString()}</span>
          </div>
          <div className="px-5 py-4 text-sm flex justify-between text-stone">
            <span>Delivery</span>
            <span>GH₵ {order.deliveryFee.toLocaleString()}</span>
          </div>
          <div className="px-5 py-4 text-[15px] flex justify-between text-ink">
            <span>Total</span>
            <span>GH₵ {order.totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-ink mb-1">Delivering to</p>
          <p className="text-sm text-stone">
            {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.region}
          </p>
        </div>

        <div className="bg-cloud/60 p-6 mb-8">
          <p className="text-sm text-ink mb-2">Next step: confirm your payment</p>
          <p className="text-sm text-stone mb-4">
            There's no live payment gateway connected yet — send your {order.paymentMethod} payment
            confirmation on WhatsApp and we'll mark your order as confirmed right away.
          </p>
          <a
            href={buildWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sage text-bone px-6 py-3 text-sm hover:bg-ink transition-colors"
          >
            Send payment confirmation on WhatsApp
          </a>
        </div>

        <Link to="/shop" className="text-sm text-wine hover:text-wine-dark">
          Continue shopping
        </Link>
      </div>
    </section>
  );
}
