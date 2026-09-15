import express from 'express';
import {
  getProducts,
  getProductFilters,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// /filters must come before /:slug, or "filters" would be parsed as a slug
router.get('/filters', getProductFilters);
router.get('/', getProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.get('/:slug', getProductBySlug);

export default router;
