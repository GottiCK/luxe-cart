// Central place for building "wa.me" deep links.
// Every "Order on WhatsApp" button (added in the shop phase) will use this.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '233559920138';

export function buildWhatsAppLink(message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

// Used later by product pages: turns a cart/product line into a formatted enquiry
export function buildProductWhatsAppMessage({ name, size, color, quantity, price }) {
  const lines = [
    `Hi LUXE CART, I'd like to order:`,
    `Product: ${name}`,
    size ? `Size: ${size}` : null,
    color ? `Color: ${color}` : null,
    `Quantity: ${quantity}`,
    price ? `Price: GH₵ ${price}` : null,
  ].filter(Boolean);
  return lines.join('\n');
}
