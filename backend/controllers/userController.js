import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @route  GET /api/users  (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' }).sort('-createdAt');
  res.json({ success: true, users });
});
