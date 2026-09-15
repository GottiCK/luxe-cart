import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

const SORT_OPTIONS = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  popular: { rating: -1, numReviews: -1 },
};

// @route  GET /api/products
// Supports: category, subcategory, size, color, minPrice, maxPrice,
// isNewArrival, isBestSeller, isFeatured, search, sort, page, limit
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subcategory,
    size,
    color,
    minPrice,
    maxPrice,
    isNewArrival,
    isBestSeller,
    isFeatured,
    search,
    sort = 'newest',
    page = 1,
    limit = 12,
  } = req.query;

  const query = {};
  if (category) query.category = category;
  if (subcategory) query.subcategory = subcategory;
  if (size) query['variants.size'] = size;
  if (color) query['variants.color'] = color;
  if (isNewArrival === 'true') query.isNewArrival = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (isFeatured === 'true') query.isFeatured = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (search) query.$text = { $search: search };

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(48, Math.max(1, Number(limit) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(SORT_OPTIONS[sort] || SORT_OPTIONS.newest)
      .skip(skip)
      .limit(limitNum),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    page: pageNum,
    pages: Math.max(1, Math.ceil(total / limitNum)),
    total,
  });
});

// @route  GET /api/products/filters
// Returns the sizes, colors and price range actually present in the
// catalog (optionally scoped to one category) so the shop page's filter
// controls are built from real data instead of a hardcoded list.
export const getProductFilters = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const match = category ? { category } : {};

  const products = await Product.find(match).select('variants price');

  const sizes = new Set();
  const colors = new Set();
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach((p) => {
    p.variants.forEach((v) => {
      sizes.add(v.size);
      colors.add(v.color);
    });
    minPrice = Math.min(minPrice, p.price);
    maxPrice = Math.max(maxPrice, p.price);
  });

  res.json({
    success: true,
    sizes: [...sizes],
    colors: [...colors],
    priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice },
  });
});

// @route  GET /api/products/:slug
// Also accepts a Mongo ObjectId in place of a slug — the admin edit form
// uses this same endpoint to load a product by its _id.
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const isObjectId = /^[0-9a-fA-F]{24}$/.test(slug);
  const product = isObjectId ? await Product.findById(slug) : await Product.findOne({ slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @route  POST /api/products  (admin)
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, product });
});

// @route  PUT /api/products/:id  (admin)
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  Object.assign(product, req.body);
  await product.save();
  res.json({ success: true, product });
});

// @route  DELETE /api/products/:id  (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, message: 'Product deleted' });
});
