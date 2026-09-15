import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, lowercase: true },
    parentType: {
      type: String,
      required: true,
      enum: ['clothes', 'shoes', 'slippers'],
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});

categorySchema.index({ parentType: 1, slug: 1 }, { unique: true });

const Category = mongoose.model('Category', categorySchema);
export default Category;