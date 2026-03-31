const express = require("express");
const { authenticateToken, isAdmin } = require("../middleware/auth");
const { uploadSingle } = require("../middleware/upload");
const {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Protected routes - Admin only
router.post("/", authenticateToken, isAdmin, uploadSingle("image"), createEvent);
router.delete("/:id", authenticateToken, isAdmin, deleteEvent);

module.exports = router;
