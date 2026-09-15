import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Loaded independently here (not just relying on server.js's dotenv.config())
// because ES module imports execute before the importing file's own
// top-level code — without this, cloudinary.config() below would run
// before server.js's dotenv.config() call, reading empty values.
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;