const express = require("express");
const multer = require("multer");
const path = require("path");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension).replace(/\s+/g, "-").toLowerCase();
    cb(null, `${Date.now()}-${baseName}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image uploads are allowed"));
    }
  },
});

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes - Admin only
router.post("/", authenticateToken, isAdmin, upload.single("image"), createEvent);
router.delete("/:id", authenticateToken, isAdmin, deleteEvent);

module.exports = router;
