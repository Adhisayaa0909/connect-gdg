const fs = require("fs");
const path = require("path");
const multer = require("multer");

// In production, you can override this with a writable path using env var like UPLOADS_PATH
const UPLOADS_DIR = process.env.UPLOADS_PATH
  ? path.resolve(process.env.UPLOADS_PATH)
  : path.join(process.cwd(), "uploads");

try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Upload storage folder is ready: ${UPLOADS_DIR}`);
} catch (error) {
  console.error("Could not create uploads folder", error);
  throw error;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const baseName = path
      .basename(file.originalname, extension)
      .replace(/\s+/g, "-")
      .toLowerCase();
    cb(null, `${Date.now()}-${baseName}${extension}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image file types are allowed"));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

const uploadSingle = (fieldName = "image") => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) {
      console.error("File upload failed", {
        message: err.message,
        stack: err.stack,
        file: req.file && req.file.originalname,
      });

      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
      }

      return res.status(400).json({ message: err.message || "Upload error" });
    }
    next();
  });
};

module.exports = {
  upload,
  uploadSingle,
  UPLOADS_DIR,
};
