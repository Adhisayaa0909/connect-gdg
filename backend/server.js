const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

dotenv.config();

// Ensure uploads directory exists for multer local storage.
const UPLOADS_DIR = process.env.UPLOADS_PATH
  ? path.resolve(process.env.UPLOADS_PATH)
  : path.join(__dirname, "uploads");

try {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  console.log(`Uploads directory ready at: ${UPLOADS_DIR}`);
} catch (error) {
  console.error("Failed to create uploads folder", error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow server-to-server tools (no Origin header) and localhost development.
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(UPLOADS_DIR));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Auth routes - Public endpoint for admin login
app.use("/api/auth", authRoutes);

// Event and registration routes
app.use("/api/events", eventRoutes);
app.use("/api/register", registrationRoutes);

app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({ message: error.message || "Unexpected error" });
  }
  return next();
});

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.warn("MongoDB connection warning:", error.message);
    console.warn("Continuing without database connection...");
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
