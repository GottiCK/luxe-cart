import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @route  GET /api/stats  (admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalOrders, totalProducts, totalCustomers, orders] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.find().select('totalPrice orderStatus createdAt'),
  ]);

  const totalRevenue = orders
    .filter((o) => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'Pending').length;

  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const revenueByDay = last7Days.map((day) => {
    const next = new Date(day);
    next.setDate(next.getDate() + 1);
    const dayTotal = orders
      .filter((o) => {
        const created = new Date(o.createdAt);
        return created >= day && created < next && o.orderStatus !== 'Cancelled';
      })
      .reduce((sum, o) => sum + o.totalPrice, 0);
    return { date: day.toISOString().slice(0, 10), total: dayTotal };
  });

  res.json({
    success: true,
    stats: { totalOrders, totalProducts, totalCustomers, totalRevenue, pendingOrders, revenueByDay },
  });
});
