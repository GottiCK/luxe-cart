import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @route  GET /api/users  (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'customer' }).sort('-createdAt');
  res.json({ success: true, users });
});

// --- Favourites ---

// @route  GET /api/users/favorites  (protected)
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('favorites');
  res.json({ success: true, favorites: user.favorites });
});

// @route  POST /api/users/favorites/:productId  (protected)
export const addFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.params;
  if (!user.favorites.some((id) => id.toString() === productId)) {
    user.favorites.push(productId);
    await user.save();
  }
  res.json({ success: true, favorites: user.favorites });
});

// @route  DELETE /api/users/favorites/:productId  (protected)
export const removeFavorite = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.favorites = user.favorites.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.json({ success: true, favorites: user.favorites });
});

// --- Delivery addresses ---

// @route  GET /api/users/addresses  (protected)
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, addresses: user.addresses });
});

// @route  POST /api/users/addresses  (protected)
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { fullName, phone, address, region, city, isDefault } = req.body;

  if (isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  user.addresses.push({
    fullName,
    phone,
    address,
    region,
    city,
    isDefault: isDefault || user.addresses.length === 0, // first address is default automatically
  });

  await user.save();
  res.status(201).json({ success: true, addresses: user.addresses });
});

// @route  DELETE /api/users/addresses/:addressId  (protected)
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});

// @route  PUT /api/users/addresses/:addressId/default  (protected)
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.forEach((a) => {
    a.isDefault = a._id.toString() === req.params.addressId;
  });
  await user.save();
  res.json({ success: true, addresses: user.addresses });
});
