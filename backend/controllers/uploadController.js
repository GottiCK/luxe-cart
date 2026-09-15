import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';

// @route  POST /api/upload  (admin)
// Expects a single file field named "image" (see middleware/upload.js).
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image file provided');
  }

  const streamUpload = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'luxecart/products' },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(req.file.buffer);
    });

  const result = await streamUpload();

  res.json({
    success: true,
    image: { url: result.secure_url, publicId: result.public_id },
  });
});
