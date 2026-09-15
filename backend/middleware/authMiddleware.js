import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// Verifies the JWT cookie and attaches the logged-in user to req.user.
// Any route that needs to know "who is this?" goes through this first.
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;

  if (!token) {
    res.status(401);
    throw new Error('Not authorized — please log in');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized — invalid or expired session');
  }
});

// Layer on top of protect — only lets admins through. Used from Phase 7
// onward to lock down the admin dashboard routes.
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access required');
  }
};

// Like protect, but never blocks the request — just attaches req.user if a
// valid session exists, or leaves it undefined otherwise. Used for routes
// like checkout that support both guest and logged-in customers.
export const protectOptional = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch {
      req.user = null;
    }
  }
  next();
});