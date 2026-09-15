import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'luxecart_cart';

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable (e.g. private browsing) — cart just won't persist across reloads
    }
  }, [items]);

  // product: { productId, name, image, price, size, color, quantity }
  const addItem = (product) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.productId === product.productId &&
          i.size === product.size &&
          i.color === product.color
      );
      if (existing) {
        return prev.map((i) =>
          i.lineId === existing.lineId
            ? { ...i, quantity: i.quantity + product.quantity }
            : i
        );
      }
      return [...prev, { ...product, lineId: crypto.randomUUID() }];
    });
  };

  const removeItem = (lineId) =>
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const updateQuantity = (lineId, quantity) =>
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, quantity: Math.max(1, quantity) } : i))
    );

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
