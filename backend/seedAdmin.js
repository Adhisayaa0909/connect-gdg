// Seeder script to create admin user in database
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");

dotenv.config();

// Admin credentials - ONLY ONE ADMIN
const adminData = {
  name: "Admin",
  email: "admin@gmail.com",
  password: "admin123",
};

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });

    if (existingAdmin) {
      console.log("✓ Admin already exists in database");
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Name: ${existingAdmin.name}`);
      console.log("  Password: (hashed - cannot be displayed)");
    } else {
      // Create new admin
      const newAdmin = new Admin(adminData);
      await newAdmin.save();
      console.log("✓ Admin created successfully!");
      console.log(`  Email: ${newAdmin.email}`);
      console.log(`  Name: ${newAdmin.name}`);
      console.log("  Password: (hashed - cannot be displayed)");
    }

    await mongoose.connection.close();
    console.log("✓ Database connection closed");
  } catch (error) {
    console.error("✗ Error seeding admin:", error.message);
    process.exit(1);
  }
};

// Run the seeder
seedAdmin();
