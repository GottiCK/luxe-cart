import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

// Stock is tracked per size/color combination, not as one number for the
// whole product — this is what lets the shop page correctly show
// "Medium, Black — out of stock" while other size/color combos are fine.
const variantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' }, // Cloudinary id, used to delete the image later
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'], trim: true, maxlength: 2000 },

    category: {
      type: String,
      required: true,
      enum: ['clothes', 'shoes', 'slippers'],
    },
    subcategory: { type: String, required: true, trim: true }, // e.g. "T-shirts", "Sneakers", "Slides"

    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: null },

    images: {
      type: [imageSchema],
      validate: [(arr) => arr.length > 0, 'At least one product image is required'],
    },

    variants: {
      type: [variantSchema],
      validate: [(arr) => arr.length > 0, 'At least one size/color variant is required'],
    },

    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    // Timestamp suffix guarantees uniqueness even for two products with the same name
    this.slug = `${slugify(this.name)}-${Date.now().toString(36)}`;
  }
  next();
});

// Computed convenience fields — not stored, always in sync with variants
productSchema.virtual('sizes').get(function () {
  return [...new Set(this.variants.map((v) => v.size))];
});
productSchema.virtual('colors').get(function () {
  return [...new Set(this.variants.map((v) => v.color))];
});
productSchema.virtual('totalStock').get(function () {
  return this.variants.reduce((sum, v) => sum + v.stock, 0);
});
productSchema.virtual('inStock').get(function () {
  return this.totalStock > 0;
});
productSchema.virtual('onSale').get(function () {
  return this.discountPrice != null && this.discountPrice < this.price;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// Supports the search bar and shop filters (Phase 4)
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
