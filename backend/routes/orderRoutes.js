import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, protectOptional, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// /myorders must be declared before /:id, or it would be parsed as an id
router.get('/myorders', protect, getMyOrders);
router.get('/', protect, admin, getAllOrders);
router.post('/', protectOptional, createOrder);
router.put('/:id/status', protect, admin, updateOrderStatus);
router.get('/:id', getOrderById);

export default router;
