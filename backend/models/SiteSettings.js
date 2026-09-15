import mongoose from 'mongoose';

// A single, ongoing document — there's only ever one SiteSettings record,
// created automatically the first time it's requested. Holds site-wide
// content the admin can change without touching code, starting with the
// homepage hero banner and the three category tile images.
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, default: '' },
    publicId: { type: String, default: '' },
  },
  { _id: false }
);

const siteSettingsSchema = new mongoose.Schema(
  {
    heroImage: { type: imageSchema, default: () => ({}) },
    categoryImages: {
      clothes: { type: imageSchema, default: () => ({}) },
      shoes: { type: imageSchema, default: () => ({}) },
      slippers: { type: imageSchema, default: () => ({}) },
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
