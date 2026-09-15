import asyncHandler from 'express-async-handler';
import SiteSettings from '../models/SiteSettings.js';

// @route  GET /api/settings  (public — the homepage needs this without login)
// Creates the single settings document on first request if it doesn't
// exist yet, so the frontend always has something to read.
export const getSiteSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = await SiteSettings.create({});
  }
  res.json({ success: true, settings });
});

// @route  PUT /api/settings  (admin)
export const updateSiteSettings = asyncHandler(async (req, res) => {
  const { heroImage, categoryImages } = req.body;
  let settings = await SiteSettings.findOne();
  if (!settings) {
    settings = new SiteSettings();
  }
  if (heroImage) settings.heroImage = heroImage;
  if (categoryImages) settings.categoryImages = categoryImages;
  await settings.save();
  res.json({ success: true, settings });
});
