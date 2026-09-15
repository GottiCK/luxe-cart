import multer from 'multer';

// Files are held in memory, not written to disk, then streamed straight to
// Cloudinary in the upload controller. This avoids the outdated
// multer-storage-cloudinary package, which only supports the old v1
// Cloudinary SDK and conflicts with the v2 SDK used here.
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export default upload;
