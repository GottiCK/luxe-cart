import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { getDeliveryFee } from '../utils/deliveryFees.js';

// @route  POST /api/orders
// Accessible to both guests and logged-in customers (see protectOptional).
// Every price, stock check, and the delivery fee are recalculated here from
// the database — the client only tells us *what* was ordered, never what
// it costs, so a tampered request can't change the total.
export const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }
  if (!shippingAddress || !paymentMethod) {
    res.status(400);
    throw new Error('Shipping address and payment method are required');
  }

  const verifiedItems = [];
  const productsToSave = [];
  let itemsPrice = 0;

  for (const item of orderItems) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(400);
      throw new Error('One of the items in your cart is no longer available');
    }

    const variant = product.variants.find((v) => v.size === item.size && v.color === item.color);
    if (!variant || variant.stock < item.quantity) {
      res.status(400);
      throw new Error(`${product.name} (${item.size}, ${item.color}) doesn't have enough stock`);
    }

    const price = product.onSale ? product.discountPrice : product.price;
    verifiedItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0]?.url || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price,
    });
    itemsPrice += price * item.quantity;

    variant.stock -= item.quantity;
    productsToSave.push(product);
  }

  const deliveryFee = getDeliveryFee(shippingAddress.region);
  const totalPrice = itemsPrice + deliveryFee;

  const order = await Order.create({
    user: req.user?._id || null,
    orderItems: verifiedItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    deliveryFee,
    totalPrice,
  });

  // Only commit the stock decrements once the order itself was created successfully
  await Promise.all(productsToSave.map((p) => p.save()));

  res.status(201).json({ success: true, order });
});

// @route  GET /api/orders/:id
// Intentionally open (no auth) — the order confirmation page needs to work
// for guest checkouts too. The order's own ID (an unguessable Mongo
// ObjectId) is what limits who can look it up.
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json({ success: true, order });
});

// @route  GET /api/orders/myorders  (protected)
// Not used by any page yet — the customer order-history view is built in
// a later phase — but the endpoint is ready for it.
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, orders });
});

// @route  GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().sort('-createdAt');
  res.json({ success: true, orders });
});

// @route  PUT /api/orders/:id/status  (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save(); // triggers the statusHistory logging in the Order model
  res.json({ success: true, order });
});
