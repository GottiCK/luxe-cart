import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';

// @route  GET /api/categories
// @query  parentType — optional, e.g. "clothes" to get just that group's subcategories
export const getCategories = asyncHandler(async (req, res) => {
  const { parentType } = req.query;
  const query = { isActive: true };
  if (parentType) query.parentType = parentType;

  const categories = await Category.find(query).sort('name');
  res.json({ success: true, categories });
});

// @route  POST /api/categories  (admin)
export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, category });
});

// @route  PUT /api/categories/:id  (admin)
export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  Object.assign(category, req.body);
  await category.save();
  res.json({ success: true, category });
});

// @route  DELETE /api/categories/:id  (admin)
export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  await category.deleteOne();
  res.json({ success: true, message: 'Category deleted' });
});
