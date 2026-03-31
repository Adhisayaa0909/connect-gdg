const jwt = require("jsonwebtoken");

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  // Get token from Authorization header (format: "Bearer <token>")
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract token after "Bearer "

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  try {
    // Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach admin data to request object for use in route handlers
    req.admin = decoded;
    next();
  } catch (error) {
    // Token is invalid or expired
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  // Check if admin is authenticated and has "admin" role
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

module.exports = { authenticateToken, isAdmin };
