const express = require("express");
const { login } = require("../controllers/authController");

const router = express.Router();

// POST /api/auth/login - Admin login endpoint
router.post("/login", login);

module.exports = router;
