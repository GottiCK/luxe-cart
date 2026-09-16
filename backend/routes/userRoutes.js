import express from 'express';
import {
  getUsers,
  getFavorites,
  addFavorite,
  removeFavorite,
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getUsers);

router.get('/favorites', protect, getFavorites);
router.post('/favorites/:productId', protect, addFavorite);
router.delete('/favorites/:productId', protect, removeFavorite);

router.get('/addresses', protect, getAddresses);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

export default router;
