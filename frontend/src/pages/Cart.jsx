import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import PlaceholderImage from '../components/ui/PlaceholderImage';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Cart() {
  usePageTitle('Your Cart');
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-content mx-auto px-5 md:px-8 py-24 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-3">Your cart is empty</h1>
        <p className="text-stone mb-8">Nothing here yet — add something you like from the shop.</p>
        <Link to="/shop" className="bg-ink text-bone px-7 py-3 text-sm hover:bg-wine transition-colors">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-content mx-auto px-5 md:px-8 py-10 md:py-14">
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Your cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 divide-y divide-stone/15">
          {items.map((item) => (
            <div key={item.lineId} className="flex gap-4 py-5">
              <div className="w-24 shrink-0">
                <PlaceholderImage label="" ratio="aspect-[3/4]" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[15px] text-ink">{item.name}</p>
                  <p className="text-xs text-stone mt-1">
                    {item.size && `Size ${item.size}`}
                    {item.size && item.color && ' · '}
                    {item.color}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-stone/25">
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                      className="w-8 h-8 text-ink/70 hover:text-wine"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                      className="w-8 h-8 text-ink/70 hover:text-wine"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.lineId)}
                    className="text-xs text-stone hover:text-wine transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <p className="text-[15px] text-ink shrink-0">
                GH₵ {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-cloud/50 p-6 md:p-7 h-fit">
          <h2 className="font-display text-xl text-ink mb-5">Order summary</h2>
          <div className="flex justify-between text-sm text-stone mb-2">
            <span>Subtotal</span>
            <span>GH₵ {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-stone mb-4">
            <span>Delivery</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-[15px] text-ink border-t border-stone/20 pt-4 mb-6">
            <span>Total</span>
            <span>GH₵ {subtotal.toLocaleString()}</span>
          </div>
          <Link
            to="/checkout"
            className="block text-center bg-ink text-bone py-3.5 text-sm hover:bg-wine transition-colors"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
